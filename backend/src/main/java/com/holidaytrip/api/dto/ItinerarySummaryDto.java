package com.holidaytrip.api.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ItinerarySummaryDto {
    private Long id;
    private String title;
    private String destination;
    private LocalDateTime createdAt;
}
