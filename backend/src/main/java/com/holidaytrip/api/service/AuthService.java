package com.holidaytrip.api.service;

import com.holidaytrip.api.dto.AuthRequestDto;
import com.holidaytrip.api.dto.AuthResponseDto;
import com.holidaytrip.api.dto.RegisterRequestDto;
import com.holidaytrip.api.model.User;
import com.holidaytrip.api.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private static final String GOOGLE_CLIENT_ID = "194841576713-6d6kc3irf2h2jnr8sl3ip539o99m6v6n.apps.googleusercontent.com";

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User checkAndResetQuota(User user) {
        if (user.getLastQuotaReset() == null || ChronoUnit.DAYS.between(user.getLastQuotaReset(), LocalDateTime.now()) >= 7) {
            user.setRemainingQuota(3);
            user.setLastQuotaReset(LocalDateTime.now());
            return userRepository.save(user);
        }
        return user;
    }

    public void validateQuota(String email) {
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Giriş yapmanız gerekmektedir.");
        }
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));
        user = checkAndResetQuota(user);
        if (user.getRemainingQuota() <= 0) {
            throw new RuntimeException("Haftalık plan kotanız dolmuştur.");
        }
    }

    public void decrementQuota(String email) {
        if (email == null || email.isEmpty()) return;
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            user = checkAndResetQuota(user);
            if (user.getRemainingQuota() > 0) {
                user.setRemainingQuota(user.getRemainingQuota() - 1);
                userRepository.save(user);
            }
        }
    }

    public AuthResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-posta adresi zaten kullanımda.");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // Hash password
        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
        user.setPassword(hashedPassword);
        user.setRemainingQuota(3);
        user.setLastQuotaReset(LocalDateTime.now());

        userRepository.save(user);

        // Generate fake simple token for MVP
        String fakeToken = UUID.randomUUID().toString();

        return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail(), user.getRemainingQuota(), user.getRole());
    }

    public AuthResponseDto login(AuthRequestDto request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("E-posta veya şifre hatalı.");
        }

        User user = userOpt.get();

        // Check password
        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("E-posta veya şifre hatalı.");
        }

        user = checkAndResetQuota(user);

        // Generate fake simple token for MVP
        String fakeToken = UUID.randomUUID().toString();

        return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail(), user.getRemainingQuota(), user.getRole());
    }

    public AuthResponseDto googleLogin(String tokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(tokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                User user = userRepository.findByEmail(email).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(name);
                    newUser.setRemainingQuota(3);
                    newUser.setLastQuotaReset(LocalDateTime.now());
                    // Google ile giriş yapanların şifresi olmaz
                    return userRepository.save(newUser);
                });

                user = checkAndResetQuota(user);

                String fakeToken = UUID.randomUUID().toString();
                return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail(), user.getRemainingQuota(), user.getRole());
            } else {
                throw new RuntimeException("Geçersiz Google Token'ı.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google doğrulaması başarısız: " + e.getMessage());
        }
    }
}
