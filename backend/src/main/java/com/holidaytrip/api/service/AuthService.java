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

        userRepository.save(user);

        // Generate fake simple token for MVP
        String fakeToken = UUID.randomUUID().toString();

        return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail());
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

        // Generate fake simple token for MVP
        String fakeToken = UUID.randomUUID().toString();

        return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail());
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
                    // Google ile giriş yapanların şifresi olmaz
                    return userRepository.save(newUser);
                });

                String fakeToken = UUID.randomUUID().toString();
                return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail());
            } else {
                throw new RuntimeException("Geçersiz Google Token'ı.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google doğrulaması başarısız: " + e.getMessage());
        }
    }
}
