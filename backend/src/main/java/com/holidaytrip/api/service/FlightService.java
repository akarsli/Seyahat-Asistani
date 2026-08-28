package com.holidaytrip.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.holidaytrip.api.dto.FlightDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class FlightService {

    @Value("${serpapi.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public FlightService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public List<FlightDTO> getFlights(String depIata, String arrIata, String date) {
        String url = "https://serpapi.com/search?engine=google_flights"
                   + "&type=2"
                   + "&currency=USD"
                   + "&departure_id=" + depIata 
                   + "&arrival_id=" + arrIata
                   + "&outbound_date=" + date
                   + "&api_key=" + apiKey;
                   
        List<FlightDTO> flights = new ArrayList<>();
        
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            
            // Check best_flights
            JsonNode bestFlights = root.path("best_flights");
            if (bestFlights.isArray()) {
                for (JsonNode node : bestFlights) {
                    JsonNode flightsArray = node.path("flights");
                    if (flightsArray.isArray() && flightsArray.size() > 0) {
                        JsonNode firstFlight = flightsArray.get(0);
                        JsonNode lastFlight = flightsArray.get(flightsArray.size() - 1);
                        
                        FlightDTO dto = new FlightDTO();
                        dto.setAirline(firstFlight.path("airline").asText(null));
                        dto.setFlightNumber(firstFlight.path("flight_number").asText(null));
                        
                        JsonNode depAirport = firstFlight.path("departure_airport");
                        dto.setDepartureTime(depAirport.path("time").asText(null));
                        
                        JsonNode arrAirport = lastFlight.path("arrival_airport");
                        dto.setArrivalTime(arrAirport.path("time").asText(null));
                        
                        dto.setPrice(node.path("price").asInt(0));
                        
                        JsonNode layovers = node.path("layovers");
                        if (layovers.isArray() && layovers.size() > 0) {
                            dto.setHasLayovers(true);
                            dto.setLayoverCount(layovers.size());
                            List<String> layoverNames = new ArrayList<>();
                            for (JsonNode layover : layovers) {
                                layoverNames.add(layover.path("id").asText(""));
                            }
                            dto.setLayoverAirports(String.join(", ", layoverNames));
                        } else {
                            dto.setHasLayovers(false);
                            dto.setLayoverCount(0);
                        }
                        
                        flights.add(dto);
                    }
                }
            }
            
            // Optionally check other_flights if we want more
            JsonNode otherFlights = root.path("other_flights");
            if (otherFlights.isArray()) {
                for (JsonNode node : otherFlights) {
                    JsonNode flightsArray = node.path("flights");
                    if (flightsArray.isArray() && flightsArray.size() > 0) {
                        JsonNode firstFlight = flightsArray.get(0);
                        JsonNode lastFlight = flightsArray.get(flightsArray.size() - 1);
                        
                        FlightDTO dto = new FlightDTO();
                        dto.setAirline(firstFlight.path("airline").asText(null));
                        dto.setFlightNumber(firstFlight.path("flight_number").asText(null));
                        
                        JsonNode depAirport = firstFlight.path("departure_airport");
                        dto.setDepartureTime(depAirport.path("time").asText(null));
                        
                        JsonNode arrAirport = lastFlight.path("arrival_airport");
                        dto.setArrivalTime(arrAirport.path("time").asText(null));
                        
                        dto.setPrice(node.path("price").asInt(0));
                        
                        JsonNode layovers = node.path("layovers");
                        if (layovers.isArray() && layovers.size() > 0) {
                            dto.setHasLayovers(true);
                            dto.setLayoverCount(layovers.size());
                            List<String> layoverNames = new ArrayList<>();
                            for (JsonNode layover : layovers) {
                                layoverNames.add(layover.path("id").asText(""));
                            }
                            dto.setLayoverAirports(String.join(", ", layoverNames));
                        } else {
                            dto.setHasLayovers(false);
                            dto.setLayoverCount(0);
                        }
                        
                        flights.add(dto);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return flights;
    }
}
