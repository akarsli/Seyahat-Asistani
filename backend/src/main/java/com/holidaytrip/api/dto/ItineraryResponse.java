package com.holidaytrip.api.dto;

import lombok.Data;
import java.util.List;

@Data
public class ItineraryResponse {
    private String destination;
    private String title;
    private String description;
    private int durationDays;
    private String estimatedBudget;
    private String weather;
    private List<TransportOption> transportOptions;
    private List<DailyPlan> dailyPlans;

    @Data
    public static class TransportOption {
        private String type; // e.g., "Plane", "Train", "Bus", "Subway"
        private String provider; // e.g., "Turkish Airlines", "Trenitalia"
        private String departure; // e.g., "Istanbul (IST) - 08:30"
        private String arrival; // e.g., "Rome (FCO) - 10:15"
        private String price; // e.g., "$150"
        private String duration; // e.g., "2h 45m"
        private String description; // e.g., "En hızlı ve direkt uçuş"
        private int targetDayNumber; // Specifies which day this ticket is for (e.g. 1)
        private boolean isReturnTicket; // true if this is the final return ticket home
    }

    @Data
    public static class DailyPlan {
        private int dayNumber;
        private String dayTitle;
        private List<Activity> activities;
    }

    @Data
    public static class Activity {
        private String time;
        private String title;
        private String description;
        private boolean isAiSuggestion;
    }
}
