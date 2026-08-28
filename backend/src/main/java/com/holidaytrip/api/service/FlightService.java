package com.holidaytrip.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.holidaytrip.api.dto.FlightResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlightService {

    @Value("${airlabs.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public FlightService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public List<FlightResponseDTO> getFlights(String depIata, String arrIata, String date) {
        String url = "https://airlabs.co/api/v9/schedules?dep_iata=" + depIata 
                   + "&arr_iata=" + arrIata 
                   + "&api_key=" + apiKey;
                   
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        
        List<FlightResponseDTO> flights = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode responseArray = root.path("response");
            
            if (responseArray.isArray()) {
                for (JsonNode node : responseArray) {
                    FlightResponseDTO dto = new FlightResponseDTO();
                    dto.setAirlineIata(node.path("airline_iata").asText(null));
                    dto.setFlightNumber(node.path("flight_number").asText(null));
                    
                    String depTimeUtc = node.path("dep_time").asText(null);
                    String arrTimeUtc = node.path("arr_time").asText(null);
                    
                    dto.setDepTime(convertToTurkeyTime(depTimeUtc));
                    dto.setArrTime(convertToTurkeyTime(arrTimeUtc));
                    
                    flights.add(dto);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return flights;
    }

    private String convertToTurkeyTime(String utcTimeStr) {
        if (utcTimeStr == null || utcTimeStr.isEmpty()) return null;
        try {
            // Usually formats are "2024-10-15 08:30"
            String cleanStr = utcTimeStr.replace("T", " ").replace("Z", "");
            if (cleanStr.length() > 16) {
                cleanStr = cleanStr.substring(0, 16);
            }
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            LocalDateTime localDateTime = LocalDateTime.parse(cleanStr, formatter);
            
            ZonedDateTime utcZoned = localDateTime.atZone(ZoneId.of("UTC"));
            ZonedDateTime turkeyZoned = utcZoned.withZoneSameInstant(ZoneId.of("Europe/Istanbul"));
            
            return turkeyZoned.format(formatter);
        } catch (Exception e) {
            return utcTimeStr;
        }
    }
}
