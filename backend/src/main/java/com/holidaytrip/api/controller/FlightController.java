package com.holidaytrip.api.controller;

import com.holidaytrip.api.dto.FlightResponseDTO;
import com.holidaytrip.api.service.FlightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@Tag(name = "Uçuş İşlemleri (AirLabs API)", description = "AirLabs API üzerinden gerçek zamanlı uçuş bilgilerini çekmek için kullanılan uç noktalar.")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping
    @Operation(
        summary = "Havalimanından Kalkan Uçuşları Listele", 
        description = "Kalkış, varış ve tarih bilgilerine göre AirLabs API'sinden güncel uçuş seferlerini getirir."
    )
    public ResponseEntity<List<FlightResponseDTO>> getFlights(
            @Parameter(description = "Kalkış havalimanı IATA kodu (Örn: IST)", example = "IST") 
            @RequestParam("dep_iata") String depIata,
            
            @Parameter(description = "Varış havalimanı IATA kodu (Örn: FCO)", example = "FCO") 
            @RequestParam("arr_iata") String arrIata,
            
            @Parameter(description = "Uçuş Tarihi (YYYY-MM-DD)", example = "2024-11-20") 
            @RequestParam("date") String date) {
            
        List<FlightResponseDTO> flights = flightService.getFlights(depIata, arrIata, date);
        return ResponseEntity.ok(flights);
    }
}
