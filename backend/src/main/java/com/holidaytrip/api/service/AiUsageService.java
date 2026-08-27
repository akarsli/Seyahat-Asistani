package com.holidaytrip.api.service;

import com.holidaytrip.api.model.AiUsage;
import com.holidaytrip.api.repository.AiUsageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiUsageService {
    private final AiUsageRepository repository;

    // Gemini 1.5 Flash Lite prices (approximately):
    // $0.075 / 1M prompt tokens
    // $0.30 / 1M completion tokens
    private static final double PROMPT_TOKEN_PRICE = 0.075 / 1_000_000.0;
    private static final double COMPLETION_TOKEN_PRICE = 0.30 / 1_000_000.0;

    public AiUsageService(AiUsageRepository repository) {
        this.repository = repository;
    }

    public synchronized void addUsage(long promptTokens, long completionTokens) {
        AiUsage stats = getStats();
        stats.setTotalPromptTokens(stats.getTotalPromptTokens() + promptTokens);
        stats.setTotalCompletionTokens(stats.getTotalCompletionTokens() + completionTokens);
        
        double addedCost = (promptTokens * PROMPT_TOKEN_PRICE) + (completionTokens * COMPLETION_TOKEN_PRICE);
        stats.setTotalCostUsd(stats.getTotalCostUsd() + addedCost);
        
        repository.save(stats);
    }

    public AiUsage getStats() {
        List<AiUsage> all = repository.findAll();
        if (all.isEmpty()) {
            return repository.save(new AiUsage());
        }
        return all.get(0);
    }
}
