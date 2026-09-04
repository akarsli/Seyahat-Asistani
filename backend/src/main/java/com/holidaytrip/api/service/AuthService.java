package com.holidaytrip.api.service;

import com.holidaytrip.api.dto.AuthRequestDto;
import com.holidaytrip.api.dto.AuthResponseDto;
import com.holidaytrip.api.dto.DeleteAccountRequest;
import com.holidaytrip.api.dto.UpdateProfileRequest;
import com.holidaytrip.api.dto.RegisterRequestDto;
import com.holidaytrip.api.model.User;
import com.holidaytrip.api.repository.UserRepository;
import com.holidaytrip.api.repository.ItineraryRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.holidaytrip.api.dto.ChangePasswordRequest;
import com.holidaytrip.api.dto.ResetPasswordRequest;
import com.holidaytrip.api.dto.ResetPasswordResponse;
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
    private final ItineraryRepository itineraryRepository;
    private final EmailService emailService;

    @Autowired
    public AuthService(UserRepository userRepository, ItineraryRepository itineraryRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.itineraryRepository = itineraryRepository;
        this.emailService = emailService;
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

        return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail(), user.getRemainingQuota(), user.getRole(), user.getRequiresPasswordChange());
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

        return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail(), user.getRemainingQuota(), user.getRole(), user.getRequiresPasswordChange());
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
                return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail(), user.getRemainingQuota(), user.getRole(), user.getRequiresPasswordChange());
            } else {
                throw new RuntimeException("Geçersiz Google Token'ı.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google doğrulaması başarısız: " + e.getMessage());
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteAccount(DeleteAccountRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new RuntimeException("E-posta adresi gerekli.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        // Eğer kullanıcının şifresi yoksa (Google Login ile kaydolmuşsa), şifre doğrulamayı atla.
        // Eğer şifresi varsa, request'teki şifreyle eşleşmeli.
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                throw new RuntimeException("Lütfen şifrenizi girin.");
            }
            if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Şifreniz hatalı.");
            }
        }

        // Önce kullanıcının ilişkili olduğu seyahat planlarını sil
        itineraryRepository.deleteByUser(user);

        // Sonra kullanıcıyı sil
        userRepository.delete(user);
    }

    public AuthResponseDto updateProfile(UpdateProfileRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new RuntimeException("E-posta adresi gerekli.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }

        user = userRepository.save(user);

        String fakeToken = UUID.randomUUID().toString();
        return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail(), user.getRemainingQuota(), user.getRole(), user.getRequiresPasswordChange());
    }

    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("E-posta adresi gerekli.");
        }

        String email = request.getEmail().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı."));

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new RuntimeException("Google ile kayıt olunmuş, şifreniz bulunmamaktadır.");
        }

        // 8 karakterli rastgele harf ve rakamlardan oluşan geçici şifre
        String newPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        String hashedPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());
        
        user.setPassword(hashedPassword);
        user.setRequiresPasswordChange(true);
        userRepository.save(user);

        // Kullanıcının e-posta adresine geçici şifreyi gönder
        emailService.sendPasswordResetEmail(user.getEmail(), newPassword);

        return new ResetPasswordResponse("Geçici şifreniz e-posta adresinize gönderildi.");
    }

    public AuthResponseDto changePassword(ChangePasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new RuntimeException("E-posta adresi gerekli.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        if (!BCrypt.checkpw(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Mevcut şifreniz hatalı.");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("Yeni şifre en az 6 karakter olmalıdır.");
        }

        String hashedPassword = BCrypt.hashpw(request.getNewPassword(), BCrypt.gensalt());
        user.setPassword(hashedPassword);
        user.setRequiresPasswordChange(false);
        userRepository.save(user);

        String fakeToken = UUID.randomUUID().toString();
        return new AuthResponseDto(fakeToken, user.getFullName(), user.getEmail(), user.getRemainingQuota(), user.getRole(), user.getRequiresPasswordChange());
    }
}
