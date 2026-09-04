package com.holidaytrip.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordResponse {
    private String message;
    private String newPassword;

    public ResetPasswordResponse(String message) {
        this.message = message;
        this.newPassword = null;
    }
}

