package com.holidaytrip.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Bilet İşlemleri (Tickets)", description = "Dış sistemlerden bilet araması yapmak için kullanılan API uç noktaları.")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    @GetMapping("/search")
    @Operation(
        summary = "Bilet Fiyatlarını Sorgula", 
        description = "Kalkış, varış ve tarih parametrelerini kullanarak (şimdilik) mock edilmiş bilet listesi döndürür."
    )
    public ResponseEntity<List<Map<String, Object>>> searchTickets(
            @Parameter(description = "Kalkış noktası (Şehir veya Havalimanı)", example = "İstanbul") @RequestParam String departure,
            @Parameter(description = "Varış noktası (Şehir veya Havalimanı)", example = "Roma") @RequestParam String arrival,
            @Parameter(description = "Yolculuk tarihi", example = "2024-11-20") @RequestParam String date) {

        // İleride dış API'ye atılacak isteğin yerini tutan sahte (mock) veriler
        Map<String, Object> ticket1 = new HashMap<>();
        ticket1.put("provider", "Turkish Airlines");
        ticket1.put("type", "Plane");
        ticket1.put("departure", departure + " - 08:30");
        ticket1.put("arrival", arrival + " - 10:15");
        ticket1.put("price", "150 USD");
        ticket1.put("duration", "2h 45m");

        Map<String, Object> ticket2 = new HashMap<>();
        ticket2.put("provider", "Pegasus Airlines");
        ticket2.put("type", "Plane");
        ticket2.put("departure", departure + " - 14:00");
        ticket2.put("arrival", arrival + " - 15:50");
        ticket2.put("price", "110 USD");
        ticket2.put("duration", "2h 50m");

        return ResponseEntity.ok(Arrays.asList(ticket1, ticket2));
    }
}
