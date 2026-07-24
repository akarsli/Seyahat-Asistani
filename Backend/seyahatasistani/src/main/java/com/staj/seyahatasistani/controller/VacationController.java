package com.staj.seyahatasistani.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.staj.seyahatasistani.dto.QuizRequest;
import com.staj.seyahatasistani.service.HotelService;
import com.staj.seyahatasistani.service.VacationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VacationController {

    private final VacationService vacationService;
    private final HotelService hotelService;

    // Her iki servisi de Controller'a dahil (inject) ediyoruz
    public VacationController(VacationService vacationService, HotelService hotelService) {
        this.vacationService = vacationService;
        this.hotelService = hotelService;
    }

    @PostMapping("/get-vacation-plan")
    public String getPlan(@RequestBody QuizRequest request) {
        try {
            // 1. Adım: Yapay Zekadan tatil planını al
            String aiRecommendation = vacationService.getAiRecommendation(request);

            // 2. Adım: Dönen JSON metninin içinden sadece "sehir" değerini cımbızla çek
            ObjectMapper mapper = new ObjectMapper();
            JsonNode aiNode = mapper.readTree(aiRecommendation);
            String sehir = aiNode.get("sehir").asText();

            // 3. Adım: Şehir ismini kullanarak otelleri çek
            String hotels = hotelService.getHotelsByCity(sehir);

            // 4. Adım: Frontend'e hem ikna metnini hem de otelleri birleştirip gönder (Şimdilik yan yana görelim)
            return "{\"yapayZekaCevabi\": " + aiRecommendation + ", \"oteller\": " + hotels + "}";

        } catch (Exception e) {
            return "{\"hata\": \"Sistemde bir sorun oluştu: " + e.getMessage() + "\"}";
        }
    }
}