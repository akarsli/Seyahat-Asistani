package com.staj.seyahatasistani.service;

import org.springframework.stereotype.Service;

@Service
public class HotelService {

    public String getHotelsByCity(String cityName) {
        // Şehir ismini temizliyoruz (Örn: "Urla, İzmir" -> "Urla")
        String cleanCityName = cityName.split(",")[0].trim();

        // Travelpayouts API'si şu an kapalı/arızalı olduğu için
        // Frontend geliştirmesini engellememek adına "Mock (Sahte)" veri dönüyoruz.
        // Yöneticinin brief'inde istediği "Resim, İsim, Fiyat ve Affiliate Linki" formatı:

        return "[\n" +
                "  {\n" +
                "    \"isim\": \"" + cleanCityName + " Butik Taş Ev\",\n" +
                "    \"fiyat\": \"4.250 TL / Gece\",\n" +
                "    \"resim\": \"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80\",\n" +
                "    \"link\": \"https://search.hotellook.com/?location=" + cleanCityName + "\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"isim\": \"" + cleanCityName + " Bağ Evi & Spa\",\n" +
                "    \"fiyat\": \"6.800 TL / Gece\",\n" +
                "    \"resim\": \"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80\",\n" +
                "    \"link\": \"https://search.hotellook.com/?location=" + cleanCityName + "\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"isim\": \"Luxury Ege " + cleanCityName + " Resort\",\n" +
                "    \"fiyat\": \"9.500 TL / Gece\",\n" +
                "    \"resim\": \"https://images.unsplash.com/photo-1551882547-ff40eb0d880d?w=600&q=80\",\n" +
                "    \"link\": \"https://search.hotellook.com/?location=" + cleanCityName + "\"\n" +
                "  }\n" +
                "]";
    }
}