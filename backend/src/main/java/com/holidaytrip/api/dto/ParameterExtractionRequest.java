package com.holidaytrip.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParameterExtractionRequest {
    private String prompt;
    private ParameterExtractionResponse currentParameters;
}
