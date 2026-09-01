import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ArrowLeft, Ticket, Map as MapIcon, Utensils, CalendarDays, Compass, Camera, Sparkles, Coffee } from 'lucide-react';

const TIP_ARTICLES = {
  'ucuza-bilet-bulma': {
    title: 'Ucuza Bilet Bulma Yolları',
    subtitle: 'Seyahat bütçenizin en büyük kalemini minimuma indirmenin kanıtlanmış yöntemleri.',
    headerImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    icon: <Ticket className="w-10 h-10 text-blue-500" />,
    color: 'blue',
    content: (
      <div className="space-y-8 text-slate-700 leading-relaxed text-lg">
        <p>
          Uçak biletleri genellikle seyahat masraflarının en büyük kısmını oluşturur. Ancak doğru stratejileri uygulayarak biletlerinizi çok daha ucuza alabilirsiniz. İşte size rehberlik edecek profesyonel taktikler:
        </p>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" /> 1. Gizli Sekme Efsanesi ve Çerezler
          </h3>
          <p>
            Uçak bileti siteleri, aynı rotayı defalarca arattığınızda fiyatı artırma eğilimindedir. Aramalarınızı her zaman tarayıcınızın "Gizli (Incognito)" sekmesinden yapın. Bu sayede çerezler kaydedilmez ve fiyatlar suni olarak şişirilmez.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-slate-600" /> 2. Esnek Tarihlerle Arama Yapın
          </h3>
          <p>
            Eğer tatil günlerinizi esnetme şansınız varsa, bilet ararken kesin bir tarih seçmek yerine "Tüm Ay" veya "+/- 3 Gün" seçeneklerini kullanın. Bazen seyahatinizi bir gün öne veya arkaya kaydırmak bileti yarı fiyatına almanızı sağlayabilir. Özellikle Salı ve Çarşamba günleri uçmak hafta sonlarına göre çok daha uygundur.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-600" /> 3. Aktarmalı Uçuşları Kendi Başınıza Birleştirin
          </h3>
          <p>
            Havayolu şirketlerinin sunduğu hazır aktarmalı uçuşlar her zaman en ucuzu olmayabilir. Örneğin, İstanbul'dan Paris'e uçmak istiyorsanız, doğrudan Paris bileti bakmak yerine İstanbul'dan Milano'ya ucuz bir bilet alıp, oradan düşük maliyetli (Low-Cost) bir havayoluyla Paris'e geçmeyi deneyin. Buna "Hacker Fares" denir.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-slate-600" /> 4. Mil ve Puan Biriktirme Sistemleri
          </h3>
          <p>
            Sık seyahat etmiyor olsanız bile, günlük kredi kartı harcamalarınızla mil kazandıran kartlar kullanın. Doğru bir kampanya ile yıl boyunca yaptığınız market ve benzin alışverişleri, size Avrupa gidiş-dönüş uçak bileti olarak geri dönebilir.
          </p>
        </div>

        <p className="font-semibold text-slate-900 pt-4">
          Unutmayın; en ucuz bileti bulmak sadece şans değil, sabır ve doğru araçları kullanma meselesidir. Seyahat Asistanı'mızın bütçe planlayıcısı ile rotanızı çizerken bilet masraflarınızı optimize edebilirsiniz.
        </p>
      </div>
    )
  },
  'gizli-kalmis-rotalar': {
    title: 'Gizli Kalmış Rotalar',
    subtitle: 'Turist kalabalığından uzak, keşfedilmeyi bekleyen saklı cennetler.',
    headerImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    icon: <MapIcon className="w-10 h-10 text-indigo-500" />,
    color: 'indigo',
    content: (
      <div className="space-y-8 text-slate-700 leading-relaxed text-lg">
        <p>
          Herkesin gittiği o meşhur meydanlar, saatlerce sıra beklenen müzeler... Artık ana akım turizmin dışına çıkma vakti geldi. İşte ana rotaların biraz dışında kalan ama güzelliğiyle sizi büyüleyecek alternatif ve gizli rotalar:
        </p>

        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h3 className="text-xl font-bold text-indigo-900 mb-3 flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" /> 1. İtalya'nın Saklı Yüzü: Puglia (Floransa ve Roma Yerine)
          </h3>
          <p>
            İtalya denilince akla Venedik veya Roma gelse de, "Çizme'nin topuğu" olarak bilinen Puglia bölgesi; konik çatılı Trulli evleri (Alberobello), kristal berraklığındaki Adriyatik kıyıları ve muazzam zeytinyağlarıyla turist akınından uzakta gerçek bir İtalyan deneyimi sunar.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-600" /> 2. Kuzeyin Masalı: Faroe Adaları (İzlanda Yerine)
          </h3>
          <p>
            İzlanda son yıllarda inanılmaz bir popülariteye ulaşmışken, İskoçya ile İzlanda arasında yer alan Faroe Adaları hala el değmemiş doğasıyla duruyor. Yemyeşil tepeler, dik fiyortlar, denize dökülen şelaleler ve puffin kuşlarıyla doğa fotoğrafçılarının ve huzur arayanların en büyük sırrı.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-slate-600" /> 3. Balkanlar'ın İncisi: Kotor, Karadağ (Dubrovnik Yerine)
          </h3>
          <p>
            Hırvatistan'daki Dubrovnik aşırı kalabalık ve pahalı bir destinasyona dönüşürken, sadece birkaç saat güneyindeki Karadağ'ın Kotor şehri aynı Orta Çağ dokusunu çok daha sakin ve uygun fiyatlı bir şekilde sunuyor. Üstelik vizesiz seyahat imkanıyla!
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-600" /> 4. Türkiye'nin Gizli Köşesi: Karagöl, Artvin
          </h3>
          <p>
            Uzaklara gitmeden ülkemizdeki gizli rotaları keşfetmek isterseniz, Artvin Şavşat'taki Karagöl tam bir İsviçre Alp'leri hissiyatı veriyor. Ormanın tam ortasında, sessizlik ve doğayla baş başa kalabileceğiniz eşsiz bir milli park.
          </p>
        </div>
        
        <p className="font-semibold text-slate-900 pt-4">
          Seyahat planlarken ana hedeflerin yanındaki küçük kasabaları haritada incelemeyi unutmayın. En güzel anılar, genellikle planda olmayan yollarda birikir.
        </p>
      </div>
    )
  },
  'yerel-lezzet-duraklari': {
    title: 'Yerel Lezzet Durakları',
    subtitle: 'Gittiğiniz yerin kültürünü en iyi şekilde yansıtan yerel tatlar ve sokak lezzetleri.',
    headerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    icon: <Utensils className="w-10 h-10 text-rose-500" />,
    color: 'rose',
    content: (
      <div className="space-y-8 text-slate-700 leading-relaxed text-lg">
        <p>
          Bir şehrin ruhunu anlamanın en iyi yolu, kesinlikle mutfağından geçer. Lüks restoranların standartlaştırılmış menülerinden ziyade, yerel halkın yemek yediği o salaş mekanları bulmak gerçek bir gastronomi deneyimidir.
        </p>

        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
          <h3 className="text-xl font-bold text-rose-900 mb-3 flex items-center gap-2">
            <Coffee className="w-5 h-5 text-rose-600" /> 1. Doğru Mekanı Bulma Sanatı
          </h3>
          <p>
            Eğer bir mekanın önünde menü İngilizce yazılmışsa ve kapıda sizi içeri davet eden görevliler varsa, o mekan büyük ihtimalle "turist tuzağıdır". Ana caddelerden sadece bir iki arka sokağa girerek, içeride sadece yerel dilde konuşan insanların olduğu esnaf lokantalarını bulun. Fiyatlar yarı yarıya düşecek, lezzet ise katlanacaktır.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-slate-600" /> 2. Asya'nın Sokak Lezzetleri Cenneti: Bangkok, Tayland
          </h3>
          <p>
            Sokak yemekleri kültürünün başkenti Bangkok'ta lüks bir restoranda yiyeceğiniz Pad Thai yerine, Khao San Road'un arka sokaklarındaki tezgahlardan yemek yemelisiniz. Taze deniz ürünleri, acı soslu noodle'lar ve ızgara etler doğrudan gözünüzün önünde hazırlanır.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-600" /> 3. İspanya'da Tapas Kültürü: San Sebastian
          </h3>
          <p>
            İspanya'nın Bask bölgesindeki San Sebastian, kilometrekare başına düşen Michelin yıldızlı restoran sayısıyla ünlüdür. Ancak asıl deneyim, "Pintxos" (Kuzey İspanya tarzı tapas) barlarında bardan bara gezerek her birinin spesiyalitesini tek tek tatmaktır.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-slate-600" /> 4. Pazar Yerlerini Es Geçmeyin
          </h3>
          <p>
            Gittiğiniz şehirdeki haftalık kurulan çiftçi pazarları veya kapalı çarşılar (Örn: Barselona'daki La Boqueria, Floransa'daki Mercato Centrale) o bölgenin en taze peynirlerini, meyvelerini ve atıştırmalıklarını bulabileceğiniz en iyi yerlerdir.
          </p>
        </div>

        <p className="font-semibold text-slate-900 pt-4">
          Seyahate çıkmadan önce Seyahat Asistanı'na <b>"Bana Paris'teki en iyi ve ucuz sokak lezzetlerini plana ekle"</b> dediğinizde, sizin için o gizli lezzet duraklarını rotanıza dahil edecektir!
        </p>
      </div>
    )
  }
};

const TipPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = TIP_ARTICLES[slug];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Makale Bulunamadı</h1>
          <p className="text-slate-500 mb-8">Aradığınız seyahat ipucu sayfası mevcut değil.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  // Get color styles dynamically
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-900', gradient: 'from-blue-600 to-cyan-500', iconBg: 'bg-blue-100' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-900', gradient: 'from-indigo-600 to-purple-500', iconBg: 'bg-indigo-100' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-900', gradient: 'from-rose-500 to-orange-400', iconBg: 'bg-rose-100' }
  };
  const theme = colorMap[article.color] || colorMap.blue;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      <main className="flex-1 w-full pb-24">
        {/* Hero Section */}
        <div className="relative w-full h-[50vh] min-h-[400px] bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
          
          <img 
            src={article.headerImage} 
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          
          <div className="absolute inset-0 z-20 flex flex-col justify-end pb-16">
            <div className="max-w-5xl mx-auto px-6 w-full">
              <Link to="/" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors backdrop-blur-md bg-black/20 px-4 py-2 rounded-full text-sm font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> Ana Sayfaya Dön
              </Link>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl`}>
                  {article.icon}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-white bg-gradient-to-r ${theme.gradient}`}>
                  Seyahat Rehberi
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                {article.title}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl font-light">
                {article.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-30">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
            {article.content}
            
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-8 text-white text-center`}>
                <h4 className="text-2xl font-bold mb-3">Bu Tüyolarla Kendi Planınızı Oluşturun</h4>
                <p className="text-white/90 mb-6 max-w-lg mx-auto">Seyahat Asistanı yapay zekası, bütçenize ve tarzınıza en uygun planı saniyeler içinde sizin için çizer.</p>
                <Link to="/itinerary" className="inline-flex items-center justify-center bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg">
                  <Sparkles className="w-5 h-5 mr-2 text-indigo-600" /> Planlamaya Başla
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TipPage;
