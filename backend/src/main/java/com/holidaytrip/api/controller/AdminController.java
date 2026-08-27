package com.holidaytrip.api.controller;

import com.holidaytrip.api.model.AiUsage;
import com.holidaytrip.api.model.Itinerary;
import com.holidaytrip.api.model.User;
import com.holidaytrip.api.repository.ItineraryRepository;
import com.holidaytrip.api.repository.UserRepository;
import com.holidaytrip.api.service.AiUsageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final ItineraryRepository itineraryRepository;
    private final AiUsageService aiUsageService;

    public AdminController(UserRepository userRepository, ItineraryRepository itineraryRepository, AiUsageService aiUsageService) {
        this.userRepository = userRepository;
        this.itineraryRepository = itineraryRepository;
        this.aiUsageService = aiUsageService;
    }

    private boolean isAdmin(String email) {
        return userRepository.findByEmail(email)
            .map(u -> "ADMIN".equals(u.getRole()))
            .orElse(false);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@RequestParam String email) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Yetkisiz erişim");

        List<User> users = userRepository.findAll();
        List<Itinerary> itineraries = itineraryRepository.findAll();

        long usersToday = users.stream().filter(u -> u.getCreatedAt() != null && u.getCreatedAt().toLocalDate().isEqual(LocalDate.now())).count();
        long plansToday = itineraries.stream().filter(i -> i.getCreatedAt() != null && i.getCreatedAt().toLocalDate().isEqual(LocalDate.now())).count();

        long usersOutOfQuota = users.stream().filter(u -> !"ADMIN".equals(u.getRole()) && (u.getRemainingQuota() == null || u.getRemainingQuota() <= 0)).count();

        AiUsage aiStats = aiUsageService.getStats();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("totalPlans", itineraries.size());
        stats.put("usersToday", usersToday);
        stats.put("plansToday", plansToday);
        stats.put("usersOutOfQuota", usersOutOfQuota);
        
        stats.put("totalPromptTokens", aiStats.getTotalPromptTokens());
        stats.put("totalCompletionTokens", aiStats.getTotalCompletionTokens());
        stats.put("totalTokens", aiStats.getTotalPromptTokens() + aiStats.getTotalCompletionTokens());
        stats.put("totalCostUsd", aiStats.getTotalCostUsd());
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(@RequestParam String email) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Yetkisiz erişim");
        // Sensasive verileri göndermemek iyi olabilir ama admin görebilir, şifreleri maskeleyelim
        List<Map<String, Object>> userList = userRepository.findAll().stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("fullName", u.getFullName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("remainingQuota", u.getRemainingQuota());
            map.put("createdAt", u.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(userList);
    }

    @GetMapping("/plans")
    public ResponseEntity<?> getPlans(@RequestParam String email) {
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Yetkisiz erişim");
        
        List<Map<String, Object>> planList = itineraryRepository.findAll().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())) // Descending
            .map(it -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", it.getId());
                map.put("title", it.getTitle());
                map.put("destination", it.getDestination());
                map.put("createdAt", it.getCreatedAt());
                map.put("userEmail", it.getUser().getEmail());
                map.put("userName", it.getUser().getFullName());
                return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(planList);
    }

    @PutMapping("/users/{userId}/quota")
    public ResponseEntity<?> updateUserQuota(
            @PathVariable Long userId,
            @RequestParam String email,
            @RequestParam Integer newQuota) {
        
        if (!isAdmin(email)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Yetkisiz erişim");

        User targetUser = userRepository.findById(userId).orElse(null);
        if (targetUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kullanıcı bulunamadı");
        }

        targetUser.setRemainingQuota(newQuota);
        userRepository.save(targetUser);

        return ResponseEntity.ok("Kota güncellendi");
    }
}
