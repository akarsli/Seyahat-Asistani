package com.holidaytrip.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.holidaytrip.api.dto.ItineraryResponse;
import com.holidaytrip.api.dto.ParameterExtractionResponse;
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

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.model}")
    private String apiModel;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AiUsageService aiUsageService;

    public AiIntegrationService(RestTemplate restTemplate, AiUsageService aiUsageService) {
        this.restTemplate = restTemplate;
        this.aiUsageService = aiUsageService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
                false);
    }

    @Retryable(value = { RuntimeException.class }, maxAttempts = 3, backoff = @Backoff(delay = 2000, multiplier = 2))
    public ParameterExtractionResponse extractParameters(String userPrompt, ParameterExtractionResponse currentParams) {
        if (apiKey == null || apiKey.contains("BURAYA_YAZIN")) {
            throw new RuntimeException("Lütfen application.properties dosyasına Gemini API anahtarınızı girin.");
        }

        String systemInstruction = "Sen bir seyahat asistanısın. Görevin kullanıcının metninden aşağıdaki 5 parametreyi çıkarmaktır:\n"
                +
                "1. numberOfPeople (Integer: Kaç kişi gidilecek, sadece rakam veya null)\n" +
                "2. departureLocation (String: Nereden yola çıkılacak, şehir ismi veya null)\n" +
                "3. destination (String: Nereye gidilecek, ülke veya şehir ismi veya null)\n" +
                "4. travelDate (String: Ne zaman ve kaç gün gidilecek, örn: 'Bu cuma, 5 gün', 'haftaya', '3 günlük' veya null)\n"
                +
                "5. budget (String: Bütçe ne kadar, örn: '1000$' veya null)\n\n" +
                "Eğer önceki parametreler sana sağlanmışsa (currentParams), kullanıcının yeni metniyle bunları HARMANLA. "
                +
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
            return parseGeminiExtractionResponse(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Parametre çıkarımı sırasında hata oluştu: " + e.getMessage());
        }
    }

    private ParameterExtractionResponse parseGeminiExtractionResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);

        // Track Token Usage
        JsonNode usage = root.path("usage");
        if (!usage.isMissingNode()) {
            long promptTokens = usage.path("prompt_tokens").asLong(0);
            long completionTokens = usage.path("completion_tokens").asLong(0);
            aiUsageService.addUsage(promptTokens, completionTokens);
        }

        JsonNode choices = root.path("choices");
        if (choices.isArray() && choices.size() > 0) {
            String aiText = choices.get(0).path("message").path("content").asText().trim();
            if (aiText.startsWith("```json"))
                aiText = aiText.substring(7);
            if (aiText.startsWith("```"))
                aiText = aiText.substring(3);
            if (aiText.endsWith("```"))
                aiText = aiText.substring(0, aiText.length() - 3);

            return objectMapper.readValue(aiText.trim(), ParameterExtractionResponse.class);
        }
        throw new RuntimeException("API'den beklenen formatta veri gelmedi.");
    }

    @Retryable(value = { RuntimeException.class }, maxAttempts = 3, backoff = @Backoff(delay = 2000, multiplier = 2))
    public ItineraryResponse generateItinerary(String userPrompt) {
        if (apiKey == null || apiKey.contains("BURAYA_YAZIN")) {
            throw new RuntimeException("Lütfen application.properties dosyasına Gemini API anahtarınızı girin.");
        }

        String systemInstruction = "Sen uzman bir seyahat asistanısın. Aşağıdaki kullanıcı isteğine uygun bir seyahat planı hazırla. "
                +
                "Kullanıcıya açıklama yapma. Sadece ve sadece aşağıdaki tam JSON formatında bir veri döndür, markdown formatı (```json vs) KULLANMA. JSON diziliminin hatasız olmasına KESİNLİKLE dikkat et.\n\n"
                +
                "LÜTFEN DİKKAT:\n" +
                "1. Kullanıcının sana verdiği parametrelerde (Nereye: ..., Nereden: ...) yazan Rota/Hedef ülke-şehre KESİNLİKLE uy. Başka bir ülke için plan oluşturma.\n"
                +
                "2. ÇOK ÖNEMLİ: Kullanıcı kaç gün kalacağını belirtmişse (Örn: 7 günlük, 1 hafta, 5 gün), 'dailyPlans' dizisine TAM OLARAK VE KESİNLİKLE O KADAR GÜN EKLE (1. Gün, 2. Gün ... 7. Gün gibi). KISA KESMEK VEYA GÜNLERİ ATLAMAK YASAKTIR. Örneğin 5 gün denmişse dizide tam 5 tane gün objesi olmak ZORUNDADIR. Örnek JSON'da sadece formatı anlaman için 2 gün verilmiştir, sen istenen gün sayısı kadar obje üreteceksin!\n"
                +
                "3. 'estimatedBudget' kısmında seyahat edilecek ülkeye, gün sayısına ve kişi sayısına göre GERÇEKÇİ bir tahmini uçuş + konaklama + harcama bütçesi hesapla. Uçuk veya aşırı düşük rakamlar yazma.\n"
                +
                "4. 'weather' alanı için kullanıcının belirttiği tarihe (Ne zaman gidilecek?) ve o bölgeye ait ORTALAMA hava durumunu (Örn: '24°C, Güneşli') yaz.\n"
                +
                "5. 'transportOptions' dizisine kullanıcının çıkış noktasından hedef ülkeye/şehre gitmesi için MANTIKLI, GERÇEKÇİ ve UCUZ BİLET ÖNERİLERİ (Uçak, Tren veya Otobüs) ekle. Örneğin İstanbul'dan İtalya'ya gidiliyorsa bir Uçak bileti koy.\n"
                +
                "6. Havalimanından şehir merkezine nasıl gidileceğini (Tren/Otobüs/Metro/HAVAŞ vb.) gösteren bir bilet/transfer önerisini de 'transportOptions' dizisine ekle. AYRICA EĞER SEYAHAT BİRDEN FAZLA ŞEHRİ İÇERİYORSA (Örn: Roma'dan Floransa'ya geçilecekse) bu şehirler arası geçiş için gereken Tren veya Otobüs biletlerini de KESİNLİKLE 'transportOptions' içerisine ekle ve 'targetDayNumber' olarak geçişin yapılacağı günü yaz.\n"
                +
                "7. Tatilin son günü için dönüş uçuşunu (veya eve dönüş biletini) MUTLAKA 'transportOptions' dizisine ekle. 'type' alanı sadece 'Plane', 'Train', 'Bus' veya 'Subway' olabilir. 'targetDayNumber' alanına bu biletin hangi gün kullanılacağını yaz (Örn: Dönüş uçuşu için seyahatin son gününün numarası). EĞER bilet tatilin sonunda eve dönüş biletini temsil ediyorsa 'isReturnTicket': true ekle, diğer tüm biletler için false yap. SEYAHATTE KULLANILACAK TÜM BİLETLERİ (Gidiş, Şehirler Arası, Dönüş) EKSİKSİZ LİSTELE.\n"
                +
                "8. ALTERNATİF ULAŞIM: Özellikle Avrupa içi veya birbirine yakın şehirlerarası seyahatlerde uçak biletine ek olarak DAHA UCUZ veya DAHA PRATİK bir Tren veya Otobüs bileti de ekle. ANCAK UZUN YOLCULUKLARDA uçak veya tren gibi mantıklı alternatifler varsa OTOBÜS BİLETİ GÖSTERME.\n"
                +
                "9. AKTARMALI UÇUŞLAR (Layover): Eğer önerdiğin uçuş aktarmalı ise (örneğin İstanbul'dan New York'a Paris aktarmalı), mutlaka 'layoverCity' (örneğin: 'Paris (CDG)') ve 'layoverDuration' (örneğin: '2h 15m') alanlarını doldur. Eğer uçuş direkt veya tren/otobüs ise bu alanları null bırak.\n"
                +
                "10. CANLI UÇUŞ ENTEGRASYONU İÇİN IATA KODU: Eğer önerdiğin bilet bir Uçak ('Plane') biletiyse, KESİNLİKLE kalkış ve varış noktalarının 3 harfli uluslararası IATA havalimanı kodlarını 'departureIata' ve 'arrivalIata' alanlarına YAZ (Örn: 'IST', 'FCO', 'JFK'). Eğer bilet Tren veya Otobüs ise bu alanları null bırak.\n"
                +
                "11. UÇUŞ NUMARASI: Eğer önerdiğin bilet bir Uçak ('Plane') biletiyse, tahmini veya gerçek bir uçuş numarasını (Örn: 'TK1993', 'LH452') 'flightNumber' alanına yaz, uçak değilse null bırak.\n\n"
                +
                "Örnek JSON yapısı (transportOptions ve dailyPlans BİRER DİZİ(Array) OLMALI):\n" +
                "{\n" +
                "  \"destination\": \"Şehir, Ülke\",\n" +
                "  \"title\": \"Plan Başlığı\",\n" +
                "  \"description\": \"Kısa açıklama\",\n" +
                "  \"durationDays\": 3,\n" +
                "  \"estimatedBudget\": \"Tahmini bütçe (örn: $1200 - $1500)\",\n" +
                "  \"weather\": \"24°C, Güneşli\",\n" +
                "  \"transportOptions\": [\n" +
                "    {\n" +
                "      \"type\": \"Plane\",\n" +
                "      \"provider\": \"Turkish Airlines\",\n" +
                "      \"flightNumber\": \"TK1861\",\n" +
                "      \"departure\": \"İstanbul (IST) - 08:30\",\n" +
                "      \"arrival\": \"Roma (FCO) - 10:15\",\n" +
                "      \"price\": \"$150\",\n" +
                "      \"duration\": \"2h 45m\",\n" +
                "      \"description\": \"En hızlı ve direkt uçuş\",\n" +
                "      \"targetDayNumber\": 1,\n" +
                "      \"isReturnTicket\": false,\n" +
                "      \"layoverCity\": null,\n" +
                "      \"layoverDuration\": null,\n" +
                "      \"departureIata\": \"IST\",\n" +
                "      \"arrivalIata\": \"FCO\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"type\": \"Plane\",\n" +
                "      \"provider\": \"Lufthansa\",\n" +
                "      \"flightNumber\": \"LH1305\",\n" +
                "      \"departure\": \"İstanbul (IST) - 08:30\",\n" +
                "      \"arrival\": \"New York (JFK) - 16:15\",\n" +
                "      \"price\": \"$650\",\n" +
                "      \"duration\": \"14h 45m\",\n" +
                "      \"description\": \"Aktarmalı uçuş\",\n" +
                "      \"targetDayNumber\": 1,\n" +
                "      \"isReturnTicket\": false,\n" +
                "      \"layoverCity\": \"Münih (MUC)\",\n" +
                "      \"layoverDuration\": \"3h 20m\",\n" +
                "      \"departureIata\": \"IST\",\n" +
                "      \"arrivalIata\": \"JFK\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"type\": \"Train\",\n" +
                "      \"provider\": \"Trenitalia\",\n" +
                "      \"flightNumber\": null,\n" +
                "      \"departure\": \"Roma Termini - 09:00\",\n" +
                "      \"arrival\": \"Floransa S.M.N. - 10:30\",\n" +
                "      \"price\": \"$45\",\n" +
                "      \"duration\": \"1h 30m\",\n" +
                "      \"description\": \"Şehirler arası hızlı tren\",\n" +
                "      \"targetDayNumber\": 2,\n" +
                "      \"isReturnTicket\": false,\n" +
                "      \"layoverCity\": null,\n" +
                "      \"layoverDuration\": null,\n" +
                "      \"departureIata\": null,\n" +
                "      \"arrivalIata\": null\n" +
                "    },\n" +
                "    {\n" +
                "      \"type\": \"Plane\",\n" +
                "      \"provider\": \"Turkish Airlines\",\n" +
                "      \"flightNumber\": \"TK1864\",\n" +
                "      \"departure\": \"Floransa (FLR) - 18:00\",\n" +
                "      \"arrival\": \"İstanbul (IST) - 21:30\",\n" +
                "      \"price\": \"$160\",\n" +
                "      \"duration\": \"2h 30m\",\n" +
                "      \"description\": \"Eve dönüş uçuşu\",\n" +
                "      \"targetDayNumber\": 3,\n" +
                "      \"isReturnTicket\": true,\n" +
                "      \"layoverCity\": null,\n" +
                "      \"layoverDuration\": null,\n" +
                "      \"departureIata\": \"FLR\",\n" +
                "      \"arrivalIata\": \"IST\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"dailyPlans\": [\n" +
                "    {\n" +
                "      \"dayNumber\": 1,\n" +
                "      \"dayTitle\": \"1. Gün başlığı\",\n" +
                "      \"activities\": [\n" +
                "        {\n" +
                "          \"time\": \"09:00 AM\",\n" +
                "          \"title\": \"Aktivite\",\n" +
                "          \"description\": \"Detay\",\n" +
                "          \"isAiSuggestion\": true\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"dayNumber\": 2,\n" +
                "      \"dayTitle\": \"2. Gün başlığı\",\n" +
                "      \"activities\": [\n" +
                "        {\n" +
                "          \"time\": \"10:00 AM\",\n" +
                "          \"title\": \"Aktivite 2\",\n" +
                "          \"description\": \"Detay 2\",\n" +
                "          \"isAiSuggestion\": true\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", apiModel);

        // Gemini/OpenAI JSON mode
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
            return parseGeminiResponse(response.getBody());
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            e.printStackTrace();
            throw new RuntimeException("API Hatası (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(
                    "Yapay Zeka servisi ile iletişim kurulamadı veya API limitine ulaşıldı: " + e.getMessage());
        }
    }

    private ItineraryResponse parseGeminiResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);

        // Track Token Usage
        JsonNode usage = root.path("usage");
        if (!usage.isMissingNode()) {
            long promptTokens = usage.path("prompt_tokens").asLong(0);
            long completionTokens = usage.path("completion_tokens").asLong(0);
            aiUsageService.addUsage(promptTokens, completionTokens);
        }

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
