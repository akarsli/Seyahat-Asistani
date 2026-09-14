# ✈️ Seyahat Asistanı (AI-Powered Travel Assistant)

**Seyahat Asistanı**, yapay zeka (Google Gemini) ve Google Flights (SerpApi) entegrasyonu ile kişiselleştirilmiş seyahat rotaları, uçuş bilgileri ve bütçe planlaması sunan tam kapsamlı bir web uygulamasıdır.

Bu proje, seyahat etmek isteyen kullanıcıların gidecekleri yer hakkında detaylı günlük planlar oluşturmasını, anlık uçuş biletlerini listelemesini ve tüm bunları tek bir platformda güvenli bir şekilde saklamasını sağlar.

---

## 🌟 Özellikler

- **🤖 Yapay Zeka Destekli Rota Oluşturma:** Gemini API kullanarak saniyeler içinde kişiye özel günlük seyahat planları (gezilecek yerler, yemek önerileri vb.) oluşturun.
- **✈️ Anlık Uçuş Arama:** SerpApi ile Google Flights üzerinden canlı uçuş verilerini çekerek rotanıza en uygun biletleri bulun.
- **🔐 Güvenli Kimlik Doğrulama:** JWT tabanlı güvenli giriş, Google OAuth (Tek tıkla giriş) ve e-posta ile şifre sıfırlama (SMTP entegrasyonu).
- **🌍 Çoklu Dil Desteği (i18n):** İngilizce ve Türkçe dil seçenekleriyle uluslararası kullanım.
- **📊 Seyahat İstatistikleri:** Recharts kullanılarak hazırlanan grafiklerle geçmiş seyahatlerinizin istatistiklerini görüntüleyin.
- **💻 Modern ve Dinamik Arayüz:** Tailwind CSS ve Lucide-React ikonları ile tasarlanmış tam duyarlı (responsive) modern web tasarımı.

---

## 🛠️ Teknoloji Yığını

### Frontend
- **Framework:** React 19 + Vite
- **Stil & UI:** Tailwind CSS v4, Lucide React
- **Durum Yönetimi & Routing:** React Router DOM
- **Diğer:** i18next (Çoklu Dil), Recharts (Grafikler), Google OAuth

### Backend
- **Framework:** Java Spring Boot 3
- **Veritabanı:** H2 Database (Geliştirme için) / JPA Hibernate (Kolaylıkla MySQL veya PostgreSQL'e geçirilebilir)
- **AI & Harici API'ler:** Google Gemini API, SerpApi (Google Flights)
- **Güvenlik & Mail:** Spring Security, Spring Mail (SMTP)

---

## 🚀 Kurulum (Local Development)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/KULLANICI_ADINIZ/Seyahat-Asistani.git
cd Seyahat-Asistani
```

### 2. Backend Kurulumu

Backend klasörüne gidin:
```bash
cd backend
```

Gerekli API anahtarlarını ayarlayın. Bu projenin tam kapasiteyle çalışabilmesi için Gemini, SerpApi ve Gmail yapılandırmalarına ihtiyacı vardır.  
`src/main/resources/application.properties` dosyasına gidin veya ortam değişkenleri (`Environment Variables`) ile aşağıdaki değerleri doldurun:

```properties
# Gemini API Key (Google AI Studio'dan alın)
gemini.api.key=YOUR_GEMINI_API_KEY

# SerpApi Key (Uçuş verileri için)
serpapi.api.key=YOUR_SERPAPI_API_KEY

# Gmail SMTP Bilgileri (Şifre sıfırlama mailleri için Gmail 16 haneli uygulama şifresi gereklidir)
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_16_CHAR_APP_PASSWORD
```

Projeyi çalıştırın:
```bash
./mvnw spring-boot:run
```
*(Windows için: `mvnw.cmd spring-boot:run`)*  
Backend `http://localhost:8081` portunda çalışacaktır.

### 3. Frontend Kurulumu

Yeni bir terminal açın ve frontend klasörüne gidin:
```bash
cd frontend
```

Bağımlılıkları yükleyin:
```bash
npm install
```

Çevre değişkenlerini ayarlayın. `frontend` klasöründe `.env` adında bir dosya oluşturun ve `.env.example` dosyasındakileri kopyalayarak Google Client ID'nizi ekleyin:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

Projeyi başlatın:
```bash
npm run dev
```
Frontend genellikle `http://localhost:5173` portunda çalışacaktır.

---

## 🔒 Güvenlik Notu
**ÖNEMLİ:** `application.properties` ve `.env` dosyalarınızdaki API anahtarlarını, şifreleri ve gizli bilgileri **asla** public olarak GitHub'a yüklemeyin. Projedeki `.gitignore` dosyaları bu hassas verilerin ve yerel veritabanı (H2) kayıtlarının yanlışlıkla yüklenmesini engellemek için yapılandırılmıştır.

---

## 🤝 Katkıda Bulunma
Katkıda bulunmak isterseniz, lütfen bir Pull Request (PR) açmadan önce bir Issue oluşturarak yapmak istediğiniz değişikliği tartışın.

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. Dilediğiniz gibi kullanabilir ve geliştirebilirsiniz.
