package com.holidaytrip.api.service;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public void sendPasswordResetEmail(String toEmail, String temporaryCode) {
        log.info("=================================================");
        log.info("[HolidayTrip] ŞİFRE SIFIRLAMA TALEBİ");
        log.info("Alıcı E-Posta: {}", toEmail);
        log.info("Geçici Şifre / Sıfırlama Kodu: {}", temporaryCode);
        log.info("=================================================");

        // HTML e-posta tasarımı
        String subject = "HolidayTrip - Geçici Şifreniz";
        String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;\">"
                + "<div style=\"text-align: center; margin-bottom: 24px;\">"
                + "<h1 style=\"color: #1E3A8A; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;\">HolidayTrip</h1>"
                + "<p style=\"color: #64748b; font-size: 14px; margin-top: 4px;\">Akıllı Seyahat Asistanı</p>"
                + "</div>"
                + "<h3 style=\"color: #1e293b; font-size: 18px; margin-bottom: 12px;\">Merhaba,</h3>"
                + "<p style=\"color: #475569; font-size: 15px; line-height: 1.6;\">HolidayTrip hesabınız için bir şifre sıfırlama talebinde bulunuldu. Hesabınıza giriş yapabilmeniz için tek kullanımlık geçici bir şifre oluşturduk:</p>"
                + "<div style=\"background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;\">"
                + "<p style=\"margin: 0 0 6px 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;\">Geçici Giriş Şifreniz</p>"
                + "<span style=\"font-family: monospace; font-size: 28px; font-weight: 800; letter-spacing: 4px; color: #1E3A8A; display: inline-block;\">" + temporaryCode + "</span>"
                + "</div>"
                + "<p style=\"color: #475569; font-size: 14px; line-height: 1.5;\">Bu şifre ile giriş yaptıktan sonra sistem sizden kendi kalıcı şifrenizi belirlemenizi isteyecektir.</p>"
                + "<p style=\"color: #94a3b8; font-size: 13px; line-height: 1.4; margin-top: 20px;\">Bu işlemi siz başlatmadıysanız lütfen endişelenmeyin, bu e-postayı dikkate almayabilirsiniz.</p>"
                + "<hr style=\"border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;\" />"
                + "<p style=\"color: #94a3b8; font-size: 12px; text-align: center; margin: 0;\">© 2026 HolidayTrip. Tüm hakları saklıdır.</p>"
                + "</div>";

        // Eğer e-posta şifresi / kimlik bilgisi girilmemişse konsola yazıp testi engellemiyoruz
        if (mailSender == null || mailPassword == null || mailPassword.trim().isEmpty()) {
            log.warn("SMTP şifresi yapılandırılmadığı için e-posta gönderimi simüle edildi. Konsoldaki geçici şifre ile giriş yapabilirsiniz: {}", temporaryCode);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "HolidayTrip");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Geçici şifre e-postası başarıyla gönderildi: {}", toEmail);
        } catch (Exception e) {
            log.error("E-posta gönderilirken hata oluştu: {}", e.getMessage(), e);
            // Akışın kesilmemesi için konsola yine de uyarı basıyoruz
        }
    }
}
