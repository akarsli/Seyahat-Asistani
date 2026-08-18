package com.holidaytrip.api.controller;

import com.holidaytrip.api.dto.ItineraryRequest;
import com.holidaytrip.api.dto.ItineraryResponse;
import com.holidaytrip.api.service.AiIntegrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/itinerary")
@CrossOrigin(origins = "http://localhost:5173") // Allow Vite frontend
public class ItineraryController {

    private final AiIntegrationService aiIntegrationService;

    public ItineraryController(AiIntegrationService aiIntegrationService) {
        this.aiIntegrationService = aiIntegrationService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ItineraryResponse> generateItinerary(@RequestBody ItineraryRequest request) {
        System.out.println("Received prompt: " + request.getPrompt());

        // Çağrıyı gerçek AI servisine yönlendir
        ItineraryResponse response = aiIntegrationService.generateItinerary(request.getPrompt());

        return ResponseEntity.ok(response);
    }
}
