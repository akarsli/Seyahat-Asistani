package com.holidaytrip.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class AiUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long totalPromptTokens = 0L;
    private Long totalCompletionTokens = 0L;
    private Double totalCostUsd = 0.0;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getTotalPromptTokens() { return totalPromptTokens; }
    public void setTotalPromptTokens(Long totalPromptTokens) { this.totalPromptTokens = totalPromptTokens; }
    
    public Long getTotalCompletionTokens() { return totalCompletionTokens; }
    public void setTotalCompletionTokens(Long totalCompletionTokens) { this.totalCompletionTokens = totalCompletionTokens; }
    
    public Double getTotalCostUsd() { return totalCostUsd; }
    public void setTotalCostUsd(Double totalCostUsd) { this.totalCostUsd = totalCostUsd; }
}
