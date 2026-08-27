package com.holidaytrip.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDto {
    private String token; // For now we can just return a simple fake token or email
    private String fullName;
    private String email;
    private Integer remainingQuota;
}
