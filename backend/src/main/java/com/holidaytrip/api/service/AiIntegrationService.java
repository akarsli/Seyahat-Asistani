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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiIntegrationService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiIntegrationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public ItineraryResponse generateItinerary(String userPrompt) {
        if (apiKey == null || apiKey.contains("BURAYA_ALDIGINIZ_API_KEY_GELECEK")) {
            throw new RuntimeException("Lütfen application.properties dosyasına Gemini API anahtarınızı girin.");
        }

        String url = apiUrl + "?key=" + apiKey;

        String systemInstruction = "Sen uzman bir seyahat asistanısın. Aşağıdaki kullanıcı isteğine uygun bir seyahat planı hazırla. " +
                "Kullanıcıya açıklama yapma. Sadece ve sadece aşağıdaki JSON formatında bir veri döndür, markdown formatı (```json vs) KULLANMA. " +
                "Örnek JSON yapısı: " +
                "{ \"destination\": \"Şehir, Ülke\", \"title\": \"Plan Başlığı\", \"description\": \"Kısa açıklama\", " +
                "\"durationDays\": 3, \"estimatedBudget\": \"Tahmini bütçe (örn: $500)\", \"pace\": \"Orta/Hızlı/Yavaş\", " +
                "\"dailyPlans\": [ { \"dayNumber\": 1, \"dayTitle\": \"Gün başlığı\", " +
                "\"activities\": [ { \"time\": \"09:00 AM\", \"title\": \"Aktivite\", \"description\": \"Detay\", \"isAiSuggestion\": true } ] } ] }";

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        
        parts.put("text", systemInstruction + "\n\nKullanıcı İsteği: " + userPrompt);
        contents.put("parts", List.of(parts));
        
        requestBody.put("contents", List.of(contents));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            return parseGeminiResponse(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Yapay Zeka servisi ile iletişim kurulamadı veya API limitine ulaşıldı: " + e.getMessage());
        }
    }

    private ItineraryResponse parseGeminiResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && candidates.size() > 0) {
            JsonNode content = candidates.get(0).path("content");
            JsonNode parts = content.path("parts");
            if (parts.isArray() && parts.size() > 0) {
                String aiText = parts.get(0).path("text").asText();
                
                // Markdown formatında geldiyse temizle
                if (aiText.startsWith("```json")) {
                    aiText = aiText.substring(7);
                }
                if (aiText.startsWith("```")) {
                    aiText = aiText.substring(3);
                }
                if (aiText.endsWith("```")) {
                    aiText = aiText.substring(0, aiText.length() - 3);
                }
                
                return objectMapper.readValue(aiText, ItineraryResponse.class);
            }
        }
        throw new RuntimeException("API'den beklenen formatta veri gelmedi.");
    }
}
