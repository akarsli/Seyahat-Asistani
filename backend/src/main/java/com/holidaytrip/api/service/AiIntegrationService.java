package com.holidaytrip.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.holidaytrip.api.dto.ItineraryResponse;
import com.holidaytrip.api.dto.ParameterExtractionResponse;
import com.holidaytrip.api.dto.ParameterExtractionRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiIntegrationService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.api.model}")
    private String apiModel;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiIntegrationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Retryable(
        value = { RuntimeException.class }, 
        maxAttempts = 3, 
        backoff = @Backoff(delay = 2000, multiplier = 2)
    )
    public ParameterExtractionResponse extractParameters(String userPrompt, ParameterExtractionResponse currentParams) {
        if (apiKey == null || apiKey.contains("BURAYA_YAZIN")) {
            throw new RuntimeException("Lütfen application.properties dosyasına Groq API anahtarınızı girin.");
        }

        String systemInstruction = "Sen bir seyahat asistanısın. Görevin kullanıcının metninden aşağıdaki 5 parametreyi çıkarmaktır:\n" +
                "1. numberOfPeople (Integer: Kaç kişi gidilecek, sadece rakam veya null)\n" +
                "2. departureLocation (String: Nereden yola çıkılacak, şehir ismi veya null)\n" +
                "3. destination (String: Nereye gidilecek, ülke veya şehir ismi veya null)\n" +
                "4. travelDate (String: Ne zaman ve kaç gün gidilecek, örn: 'Bu cuma, 5 gün', 'haftaya', '3 günlük' veya null)\n" +
                "5. budget (String: Bütçe ne kadar, örn: '1000$' veya null)\n\n" +
                "Eğer önceki parametreler sana sağlanmışsa (currentParams), kullanıcının yeni metniyle bunları HARMANLA. " +
                "Sadece ve sadece JSON döndür, hiçbir açıklama veya markdown (```json) yapma.\n" +
                "Örnek format: { \"numberOfPeople\": 2, \"departureLocation\": \"İstanbul\", \"destination\": \"İtalya\", \"travelDate\": \"Bu cuma, 5 gün\", \"budget\": \"2000 USD\" }";

        if (currentParams != null) {
            systemInstruction += "\n\nŞu anki bilinen parametreler: " + 
                "numberOfPeople=" + currentParams.getNumberOfPeople() + ", " +
                "departureLocation=" + currentParams.getDepartureLocation() + ", " +
                "destination=" + currentParams.getDestination() + ", " +
                "travelDate=" + currentParams.getTravelDate() + ", " +
                "budget=" + currentParams.getBudget();
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", apiModel);
        
        Map<String, String> responseFormat = new HashMap<>();
        responseFormat.put("type", "json_object");
        requestBody.put("response_format", responseFormat);

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemInstruction);

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", userPrompt);

        requestBody.put("messages", List.of(systemMessage, userMessage));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            return parseGroqExtractionResponse(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Parametre çıkarımı sırasında hata oluştu: " + e.getMessage());
        }
    }

    private ParameterExtractionResponse parseGroqExtractionResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode choices = root.path("choices");
        if (choices.isArray() && choices.size() > 0) {
            String aiText = choices.get(0).path("message").path("content").asText().trim();
            if (aiText.startsWith("```json")) aiText = aiText.substring(7);
            if (aiText.startsWith("```")) aiText = aiText.substring(3);
            if (aiText.endsWith("```")) aiText = aiText.substring(0, aiText.length() - 3);
            
            return objectMapper.readValue(aiText.trim(), ParameterExtractionResponse.class);
        }
        throw new RuntimeException("API'den beklenen formatta veri gelmedi.");
    }

    @Retryable(
        value = { RuntimeException.class }, 
        maxAttempts = 3, 
        backoff = @Backoff(delay = 2000, multiplier = 2)
    )
    public ItineraryResponse generateItinerary(String userPrompt) {
        if (apiKey == null || apiKey.contains("BURAYA_YAZIN")) {
            throw new RuntimeException("Lütfen application.properties dosyasına Groq API anahtarınızı girin.");
        }

        String systemInstruction = "Sen uzman bir seyahat asistanısın. Aşağıdaki kullanıcı isteğine uygun bir seyahat planı hazırla. " +
                "Kullanıcıya açıklama yapma. Sadece ve sadece aşağıdaki tam JSON formatında bir veri döndür, markdown formatı (```json vs) KULLANMA. JSON diziliminin hatasız olmasına KESİNLİKLE dikkat et.\n\n" +
                "LÜTFEN DİKKAT:\n" +
                "1. Kullanıcının sana verdiği parametrelerde (Nereye: ..., Nereden: ...) yazan Rota/Hedef ülke-şehre KESİNLİKLE uy. Başka bir ülke için plan oluşturma.\n" +
                "2. Kullanıcı kaç gün kalacağını belirtmişse (Örn: 5 günlük, 1 hafta), 'dailyPlans' dizisine TAM OLARAK O KADAR GÜN EKLE (1. Gün, 2. Gün ... 5. Gün gibi). Örnek JSON sadece 1 gün gösteriyor diye tek gün yapma, istenen süre kadar obje oluştur!\n" +
                "3. 'estimatedBudget' kısmında seyahat edilecek ülkeye, gün sayısına ve kişi sayısına göre GERÇEKÇİ bir tahmini uçuş + konaklama + harcama bütçesi hesapla. Uçuk veya aşırı düşük rakamlar yazma.\n" +
                "4. 'weather' alanı için kullanıcının belirttiği tarihe (Ne zaman gidilecek?) ve o bölgeye ait ORTALAMA hava durumunu (Örn: '24°C, Güneşli') yaz.\n\n" +
                "Örnek JSON yapısı (dailyPlans BİR DİZİ(Array) OLMALI, İÇİNDE OBJELER OLMALIDIR):\n" +
                "{\n" +
                "  \"destination\": \"Şehir, Ülke\",\n" +
                "  \"title\": \"Plan Başlığı\",\n" +
                "  \"description\": \"Kısa açıklama\",\n" +
                "  \"durationDays\": 3,\n" +
                "  \"estimatedBudget\": \"Tahmini bütçe (örn: $1200 - $1500)\",\n" +
                "  \"weather\": \"24°C, Güneşli\",\n" +
                "  \"dailyPlans\": [\n" +
                "    {\n" +
                "      \"dayNumber\": 1,\n" +
                "      \"dayTitle\": \"Gün başlığı\",\n" +
                "      \"activities\": [\n" +
                "        {\n" +
                "          \"time\": \"09:00 AM\",\n" +
                "          \"title\": \"Aktivite\",\n" +
                "          \"description\": \"Detay\",\n" +
                "          \"isAiSuggestion\": true\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", apiModel);
        
        // Groq/OpenAI JSON mode
        Map<String, String> responseFormat = new HashMap<>();
        responseFormat.put("type", "json_object");
        requestBody.put("response_format", responseFormat);

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemInstruction);

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", userPrompt);

        requestBody.put("messages", List.of(systemMessage, userMessage));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            return parseGroqResponse(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Yapay Zeka servisi ile iletişim kurulamadı veya API limitine ulaşıldı: " + e.getMessage());
        }
    }

    private ItineraryResponse parseGroqResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode choices = root.path("choices");
        if (choices.isArray() && choices.size() > 0) {
            JsonNode message = choices.get(0).path("message");
            String aiText = message.path("content").asText();
            
            // Markdown formatında geldiyse temizle
            aiText = aiText.trim();
            if (aiText.startsWith("```json")) {
                aiText = aiText.substring(7);
            }
            if (aiText.startsWith("```")) {
                aiText = aiText.substring(3);
            }
            if (aiText.endsWith("```")) {
                aiText = aiText.substring(0, aiText.length() - 3);
            }
            
            return objectMapper.readValue(aiText.trim(), ItineraryResponse.class);
        }
        throw new RuntimeException("API'den beklenen formatta veri gelmedi.");
    }
}
