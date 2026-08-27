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
    @com.fasterxml.jackson.annotation.JsonAlias({"transportOption", "transports", "tickets"})
    private List<TransportOption> transportOptions;
    
    @com.fasterxml.jackson.annotation.JsonAlias({"dailyPlan", "days", "plans", "itinerary"})
    private List<DailyPlan> dailyPlans;

    @Data
    public static class TransportOption {
        @com.fasterxml.jackson.annotation.JsonAlias({"transportType", "vehicle"})
        private String type; // e.g., "Plane", "Train", "Bus", "Subway"
        
        @com.fasterxml.jackson.annotation.JsonAlias({"company", "brand"})
        private String provider; // e.g., "Turkish Airlines", "Trenitalia"
        
        @com.fasterxml.jackson.annotation.JsonAlias({"departureTime", "from"})
        private String departure; // e.g., "Istanbul (IST) - 08:30"
        
        @com.fasterxml.jackson.annotation.JsonAlias({"arrivalTime", "to"})
        private String arrival; // e.g., "Rome (FCO) - 10:15"
        
        @com.fasterxml.jackson.annotation.JsonAlias({"cost", "amount"})
        private String price; // e.g., "$150"
        
        @com.fasterxml.jackson.annotation.JsonAlias({"time", "length"})
        private String duration; // e.g., "2h 45m"
        
        @com.fasterxml.jackson.annotation.JsonAlias({"desc", "details"})
        private String description; // e.g., "En hızlı ve direkt uçuş"
        
        @com.fasterxml.jackson.annotation.JsonAlias({"day", "dayNumber"})
        private int targetDayNumber; // Specifies which day this ticket is for (e.g. 1)
        
        @com.fasterxml.jackson.annotation.JsonAlias({"returnTicket", "isReturn"})
        private boolean isReturnTicket; // true if this is the final return ticket home
        
        @com.fasterxml.jackson.annotation.JsonAlias({"layover", "transit"})
        private String layoverCity; // e.g., "Münih (MUC)"
        
        @com.fasterxml.jackson.annotation.JsonAlias({"layoverTime", "waitTime"})
        private String layoverDuration; // e.g., "2h 15m"
    }

    @Data
    public static class DailyPlan {
        @com.fasterxml.jackson.annotation.JsonAlias({"day", "id"})
        private int dayNumber;
        
        @com.fasterxml.jackson.annotation.JsonAlias({"title", "name"})
        private String dayTitle;
        
        @com.fasterxml.jackson.annotation.JsonAlias({"activity", "events", "plan"})
        private List<Activity> activities;
    }

    @Data
    public static class Activity {
        @com.fasterxml.jackson.annotation.JsonAlias({"hour", "clock"})
        private String time;
        
        @com.fasterxml.jackson.annotation.JsonAlias({"name", "header"})
        private String title;
        
        @com.fasterxml.jackson.annotation.JsonAlias({"desc", "details"})
        private String description;
        
        @com.fasterxml.jackson.annotation.JsonAlias({"aiSuggestion", "isAi", "suggestion"})
        private boolean isAiSuggestion;
    }
}
