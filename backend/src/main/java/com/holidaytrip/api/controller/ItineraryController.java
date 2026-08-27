package com.holidaytrip.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.holidaytrip.api.dto.*;
import com.holidaytrip.api.model.Itinerary;
import com.holidaytrip.api.model.User;
import com.holidaytrip.api.repository.ItineraryRepository;
import com.holidaytrip.api.repository.UserRepository;
import com.holidaytrip.api.service.AiIntegrationService;
import com.holidaytrip.api.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/itinerary")
@CrossOrigin(origins = "http://localhost:5173") // Allow Vite frontend
public class ItineraryController {

    private final AiIntegrationService aiIntegrationService;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final ItineraryRepository itineraryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ItineraryController(AiIntegrationService aiIntegrationService, AuthService authService, UserRepository userRepository, ItineraryRepository itineraryRepository) {
        this.aiIntegrationService = aiIntegrationService;
        this.authService = authService;
        this.userRepository = userRepository;
        this.itineraryRepository = itineraryRepository;
    }

    @PostMapping("/extract-parameters")
    public ResponseEntity<ParameterExtractionResponse> extractParameters(@RequestBody ParameterExtractionRequest request) {
        ParameterExtractionResponse response = aiIntegrationService.extractParameters(
            request.getPrompt(), 
            request.getCurrentParameters()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateItinerary(@RequestBody ItineraryRequest request) {
        System.out.println("Received prompt: " + request.getPrompt());

        try {
            authService.validateQuota(request.getEmail());
            
            // Çağrıyı gerçek AI servisine yönlendir
            ItineraryResponse response = aiIntegrationService.generateItinerary(request.getPrompt());

            // Save to DB
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı (Oturumunuzun süresi dolmuş olabilir, lütfen tekrar giriş yapın)."));
            
            Itinerary itinerary = new Itinerary();
            itinerary.setUser(user);
                itinerary.setTitle(response.getTitle());
                itinerary.setDestination(response.getDestination());
                itinerary.setCreatedAt(LocalDateTime.now());
                try {
                    String jsonResponse = objectMapper.writeValueAsString(response);
                    itinerary.setResponseData(jsonResponse);
                    itineraryRepository.save(itinerary);
                } catch (Exception e) {
                    System.out.println("Could not save itinerary to DB: " + e.getMessage());
                }

            authService.decrementQuota(request.getEmail());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<ItinerarySummaryDto>> getHistory(@RequestParam String email) {
        List<Itinerary> list = itineraryRepository.findByUserEmailOrderByCreatedAtDesc(email);
        List<ItinerarySummaryDto> response = list.stream()
            .map(it -> new ItinerarySummaryDto(it.getId(), it.getTitle(), it.getDestination(), it.getCreatedAt()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> getItinerary(@PathVariable Long id) {
        Itinerary itinerary = itineraryRepository.findById(id).orElseThrow(() -> new RuntimeException("Plan bulunamadı."));
        return ResponseEntity.ok().header("Content-Type", "application/json").body(itinerary.getResponseData());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItinerary(@PathVariable Long id, @RequestParam String email) {
        Itinerary itinerary = itineraryRepository.findById(id).orElseThrow(() -> new RuntimeException("Plan bulunamadı."));
        
        // Basit yetki kontrolü
        if (!itinerary.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body("Bu planı silme yetkiniz yok.");
        }

        itineraryRepository.delete(itinerary);
        return ResponseEntity.ok("Plan başarıyla silindi.");
    }
}
