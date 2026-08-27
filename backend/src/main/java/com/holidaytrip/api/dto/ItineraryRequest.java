package com.holidaytrip.api.dto;

import lombok.Data;

@Data
public class ItineraryRequest {
    private String prompt;
    private String email;
}
