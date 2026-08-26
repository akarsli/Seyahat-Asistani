package com.holidaytrip.api.service;

import com.holidaytrip.api.dto.AuthRequestDto;
import com.holidaytrip.api.dto.AuthResponseDto;
import com.holidaytrip.api.dto.RegisterRequestDto;
import com.holidaytrip.api.model.User;
import com.holidaytrip.api.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

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
}
