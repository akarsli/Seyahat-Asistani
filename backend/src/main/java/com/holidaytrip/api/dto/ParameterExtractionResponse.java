package com.holidaytrip.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParameterExtractionResponse {
    private Integer numberOfPeople;
    private String departureLocation;
    private String duration;
    private String budget;
    private String travelDate;
    private String destination;
    
    // Check if all required parameters are provided
    public boolean isComplete() {
        return numberOfPeople != null && 
               departureLocation != null && !departureLocation.trim().isEmpty() &&
               budget != null && !budget.trim().isEmpty() &&
               travelDate != null && !travelDate.trim().isEmpty() &&
               destination != null && !destination.trim().isEmpty();
    }
}
