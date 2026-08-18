package com.holidaytrip.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.holidaytrip.api.dto.ItineraryResponse;
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
    public ItineraryResponse generateItinerary(String userPrompt) {
        if (apiKey == null || apiKey.contains("BURAYA_YAZIN")) {
            throw new RuntimeException("Lütfen application.properties dosyasına Groq API anahtarınızı girin.");
        }

        String systemInstruction = "Sen uzman bir seyahat asistanısın. Aşağıdaki kullanıcı isteğine uygun bir seyahat planı hazırla. " +
                "Kullanıcıya açıklama yapma. Sadece ve sadece aşağıdaki JSON formatında bir veri döndür, markdown formatı (```json vs) KULLANMA. " +
                "LÜTFEN DİKKAT: 'estimatedBudget' kısmında seyahat edilecek ülkeye, gün sayısına ve kişi sayısına göre GERÇEKÇİ bir tahmini uçuş + konaklama + harcama bütçesi hesapla. Uçuk veya aşırı düşük rakamlar yazma. Ayrıca 'weather' alanı için o bölgenin genel veya belirtilen tarihteki tahmini hava durumunu (Örn: '24°C, Güneşli') yaz.\n\n" +
                "Örnek JSON yapısı: " +
                "{ \"destination\": \"Şehir, Ülke\", \"title\": \"Plan Başlığı\", \"description\": \"Kısa açıklama\", " +
                "\"durationDays\": 3, \"estimatedBudget\": \"Tahmini gerçekçi bütçe (örn: $1200 - $1500)\", \"weather\": \"24°C, Güneşli\", \"pace\": \"Orta/Hızlı/Yavaş\", " +
                "\"dailyPlans\": [ { \"dayNumber\": 1, \"dayTitle\": \"Gün başlığı\", " +
                "\"activities\": [ { \"time\": \"09:00 AM\", \"title\": \"Aktivite\", \"description\": \"Detay\", \"isAiSuggestion\": true } ] } ] }";

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
