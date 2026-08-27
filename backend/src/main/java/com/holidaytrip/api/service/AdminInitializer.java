package com.holidaytrip.api.service;

import com.holidaytrip.api.model.User;
import com.holidaytrip.api.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public AdminInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@holidaytrip.com").isEmpty()) {
            User admin = new User();
            admin.setFullName("Sistem Yöneticisi");
            admin.setEmail("admin@holidaytrip.com");
            admin.setPassword(BCrypt.hashpw("holidaytrip", BCrypt.gensalt()));
            admin.setRole("ADMIN");
            admin.setRemainingQuota(9999);
            admin.setLastQuotaReset(LocalDateTime.now());
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("Admin hesabı oluşturuldu: admin@holidaytrip.com");
        }
    }
}
