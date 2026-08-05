package com.staj.seyahatasistani.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.staj.seyahatasistani.dto.QuizRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class VacationService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String getAiRecommendation(QuizRequest request) {

        // ---------------------------------------------------------
        // GELİŞTİRME (DEV) ORTAMI KODU: SABİT (MOCK) VERİ DÖNER
        // ---------------------------------------------------------
        return "{" +
                "\"sehir\": \"Urla, İzmir\", " +
                "\"ikna_metni\": \"Ege’nin zamana meydan okuyan dinginliğini, antik Klazomenai’nin bin yıllık zeytin kokulu mirasıyla harmanlayan Urla; kalabalıklardan uzak, rafine bir sığınak arayanlar için yeryüzündeki en büyüleyici duraklardan biri. Şık ve masalsı taş otellerin avlularında sabah kahvenizi yudumlarken, eski duvarlara düşen altın sarısı ışıklar eşliğinde huzurun en yalın ve lüks halini keşfedeceksiniz.\"" +
                "}";


        // ---------------------------------------------------------
        // CANLI (PROD) ORTAM KODU: GERÇEK API ÇAĞRISI YAPAR
        // Projeyi teslim ederken aşağıdaki yorum satırlarını kaldırıp,
        // üstteki sabit 'return' satırını sileceğiz.
        // ---------------------------------------------------------
        /*
        String prompt = String.format(
                "Kullanıcı %s tarzında, %d kişiyle, %s bütçeli bir tatile çıkmak istiyor. " +
                "Ona Türkiye'den nokta atışı bir tatil beldesi öner. Bu beldeyi çok çekici, heveslendirici ve edebi bir dille " +
                "(sanki bir tatil dergisinde yazıyormuş gibi) 2 paragraf anlat. " +
                "Çıktıyı mutlaka sadece şu JSON formatında ver, fazladan markdown veya metin kullanma: " +
                "{\"sehir\": \"Önerilen Şehir Adı\", \"ikna_metni\": \"Yazdığın ballandırılmış metin\"}",
                request.getTatilTarzi(), request.getKisiSayisi(), request.getButce()
        );

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + geminiApiKey;

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();

        parts.put("text", prompt);
        contents.put("parts", Collections.singletonList(parts));
        requestBody.put("contents", Collections.singletonList(contents));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            String cleanJson = root.path("candidates").get(0)
                                   .path("content")
                                   .path("parts").get(0)
                                   .path("text").asText();

            return cleanJson;

        } catch (Exception e) {
            return "{\"hata\": \"Yapay zeka servisine ulaşılamadı: " + e.getMessage() + "\"}";
        }
        */
    }
}


