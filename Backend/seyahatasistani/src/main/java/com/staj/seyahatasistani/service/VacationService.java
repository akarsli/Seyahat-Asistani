package com.staj.seyahatasistani.service;

import com.staj.seyahatasistani.dto.QuizRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class VacationService {

    // application.properties dosyasındaki anahtarımızı buraya çekiyoruz
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String getAiRecommendation(QuizRequest request) {
        // Yöneticinin verdiği prompt'u kullanıcının cevaplarıyla dinamik olarak dolduruyoruz
        String prompt = String.format(
                "Kullanıcı %s tarzında, %d kişiyle, %s bütçeli bir tatile çıkmak istiyor. " +
                        "Ona Türkiye'den nokta atışı bir tatil beldesi öner. Bu beldeyi çok çekici, heveslendirici ve edebi bir dille " +
                        "(sanki bir tatil dergisinde yazıyormuş gibi) 2 paragraf anlat. " +
                        "Çıktıyı mutlaka sadece şu JSON formatında ver, fazladan markdown veya metin kullanma: " +
                        "{\"sehir\": \"Önerilen Şehir Adı\", \"ikna_metni\": \"Yazdığın ballandırılmış metin\"}",
                request.getTatilTarzi(), request.getKisiSayisi(), request.getButce()
        );

        // Gemini API'sinin uç noktası (Gemini 1.5 Flash modelini kullanıyoruz)
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + geminiApiKey;

        // Gemini'nin bizden beklediği özel JSON formatını (Body) Map'ler yardımıyla oluşturuyoruz
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();

        parts.put("text", prompt);
        contents.put("parts", Collections.singletonList(parts));
        requestBody.put("contents", Collections.singletonList(contents));

        // İsteğin bir JSON olduğunu belirten Header'ı ekliyoruz
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            // İsteği gönderip cevabı alıyoruz
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            // Jackson kütüphanesi ile Gemini'den gelen devasa JSON'u okuyoruz
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            // candidates -> content -> parts -> text hiyerarşisine inip sadece yapay zekanın yazdığı metni alıyoruz
            String cleanJson = root.path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();

            return cleanJson;

        } catch (Exception e) {
            return "{\"hata\": \"Yapay zeka servisine ulaşılamadı: " + e.getMessage() + "\"}";
        }
    }
}