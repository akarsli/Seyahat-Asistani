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
    private List<DailyPlan> dailyPlans;

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
