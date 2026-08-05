import { useState, useEffect } from 'react'
import { FaFacebook, FaLinkedin, FaYoutube, FaPinterest, FaReddit, FaUser} from 'react-icons/fa';
import { RiInstagramFill } from "react-icons/ri";
import { IoIosArrowRoundForward } from "react-icons/io";
import { SiTiktok } from 'react-icons/si';
import axios from 'axios'
import './App.css'

function App() {
  // ---------------------------------------------------------
  // 1. STATE TANIMLAMALARI
  // ---------------------------------------------------------
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

  const loadingMessages = [
    "🤖 Yapay Zeka rotanızı haritalandırıyor...",
    "✨ Bütçenize en uygun oteller taranıyor...",
    "🌍 Tatil tarzınıza özel gizli cennetler keşfediliyor...",
    "🎒 Valizinizi hazırlayın, harika bir plan yolda..."
  ]

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Anket State'leri
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [customNumber, setCustomNumber] = useState('')

  // Anket Soruları
  const questions = [
    {
      id: 1,
      questionText: "1. Tatil tarzınızı seçiniz:",
      options: [
        { label: "A) Tarih & Sakinlik", value: "A" },
        { label: "B) Doğa & Macera", value: "B" },
        { label: "C) Eğlence & Plaj", value: "C" }
      ]
    },
    {
      id: 2,
      questionText: "2. Tatil bütçenizi seçiniz:",
      options: [
        { label: "A) Öğrenci Dostu (Ekonomik)", value: "A" },
        { label: "B) Orta (Konforlu)", value: "B" },
        { label: "C) Lüks (Premium)", value: "C" }
      ]
    },
    {
      id: 3,
      questionText: "3. Tatile kaç kişi gideceksiniz?",
      options: [
        { label: "A) 1", value: "A" },
        { label: "B) 2", value: "B" },
        { label: "C) 3 veya daha fazla", value: "C" }
      ]
    }
  ]

  const currentQuestion = questions[currentQuestionIndex]

  // ---------------------------------------------------------
  // 2. EVENT HANDLERS & BACKEND İSTEĞİ
  // ---------------------------------------------------------
  const handleOptionSelect = (optionValue) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionValue
    }))
  }

  // Sorular arası geçiş ve Anketi Tamamlama Mantığı
  const handleNextQuestion = async () => {
    // Eğer henüz son soruda değilsek sonraki soruya geç
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      return
    }

    // SON SORUDA "Anketi Tamamla" Butonuna Basıldığında Çalışacak Backend İstek Bloğu:
    setLoading(true)

    // 1. Kişi sayısını belirleme
    let kisiSayisiDegeri = 1
    if (answers[3] === 'C') {
      kisiSayisiDegeri = parseInt(customNumber) || 3
    } else if (answers[3] === 'B') {
      kisiSayisiDegeri = 2
    } else if (answers[3] === 'A') {
      kisiSayisiDegeri = 1
    }

    // 2. Bütçe harf eşleştirmesi
    const butceHarfMap = {
      'A': 'Ekonomik',
      'B': 'Orta',
      'C': 'Lüks'
    }

    // 3. Tatil tarzı harf eşleştirmesi
    const tatilTarziHarfMap = {
      'A': 'Tarihi yerler, şarap tadımı ve sakinlik',
      'B': 'Doğa yürüyüşleri, kamp ve macera',
      'C': 'Deniz, kum, güneş ve hareketli gece hayatı'
    }

    try {
      // Spring Boot Backend'e İstek Gönderimi
      const response = await axios.post('http://localhost:8081/api/get-vacation-plan', {
        kisiSayisi: kisiSayisiDegeri,
        butce: butceHarfMap[answers[2]],
        tatilTarzi: tatilTarziHarfMap[answers[1]]
      })

      // Backend'den gelen cevabı result state'ine aktarma
      setResult(response.data)
    } catch (error) {
      alert("Backend'e ulaşılamadı. Spring Boot servisinin açık olduğundan emin ol.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickPlan = async (kisiSayisi, butce, tatilTarzi) => {
    window.scrollTo({top:0, behavior: "smooth" })
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8081/api/get-vacation-plan', {
        kisiSayisi: kisiSayisi,
        butce: butce,
        tatilTarzi: tatilTarzi
      });

      setResult(response.data);

    } catch (error) {
      alert("Backend'e ulaşılamadı. Spring Boot servisinin açık olduğundan emin olun.")
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Yeniden Anket Yapmak/Arama Yapmak İstendiğinde State'leri Sıfırlama
  const handleReset = () => {
    setResult(null)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setCustomNumber('')
  }

  const [tempValue, setTempValue] = useState('°C');

  const handleClick = () => {
    setTempValue((prevTempValue) => (prevTempValue === '°C' ? '°F' : '°C'));
  };

  const currentYear = new Date().getFullYear();

  // ---------------------------------------------------------
  // 3. ARAYÜZ (JSX)
  // ---------------------------------------------------------
  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <h2 onClick={() => window.location.reload(1)} style={{cursor:'pointer'}}>HolidayTrip</h2>
        </div>
        <div className="header-right">
          <div className="header-buttons">
            <button>₺</button>
            <button>🇹🇷</button>
            <button onClick={handleClick}>{tempValue}</button>
          </div>
          <a><FaUser /></a>
        </div>
      </div>

      {/* DURUM 1: HENÜZ SONUÇ DÖNMEDİYSE (ANKET EKRANI) */}
      {!result && (
        <div className="survey-container">
          {loading ? (
            /* Yüklenme Alanı */
            <div className="loading-container">
              <h3>{loadingMessages[loadingMessageIndex]}</h3>
            </div>
          ) : (
            /* Anket Soruları */
            <>
              <div className="survey-progress">
                Soru {currentQuestionIndex + 1} / {questions.length}
              </div>

              <h3 className="question-title">{currentQuestion.questionText}</h3>

              <div className="options-container">
                {currentQuestion.options.map((option, index) => (
                  <label 
                    key={index} 
                    className={`option-label ${answers[currentQuestion.id] === option.value ? 'selected' : ''}`}
                  >
                    <input 
                      type='radio' 
                      name={`question-${currentQuestion.id}`} 
                      value={option.value} 
                      checked={answers[currentQuestion.id] === option.value} 
                      onChange={() => handleOptionSelect(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>

              {/* 3. Soruda C seçildiyse gösterilecek Kişi Sayısı Input'u */}
              {currentQuestion.id === 3 && answers[3] === 'C' && (
                <div className="custom-input-container">
                  <label htmlFor='custom-number'>Lütfen kişi sayısını giriniz:</label>
                  <input 
                    id="custom-number"
                    type="number"
                    min="3"
                    placeholder="Örn: 5"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    className="custom-number-input"
                  />
                </div>
              )}

              <button className="result-container-btn"
                onClick={handleNextQuestion}
                disabled={
                  !answers[currentQuestion.id] || 
                  (currentQuestion.id === 3 && answers[3] === 'C' && !customNumber)
                }
                className="next-btn"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Anketi Tamamla & Rota Oluştur' : 'Sonraki Soru'}
              </button>
            </>
          )}
        </div>
      )}

      {/* DURUM 2: BACKEND'DEN YANIT GELDİYSE (SONUÇ EKRANI) */}
      {result && (
        <div className="result-container">
          <h2>Gideceğin Yer: {result.yapayZekaCevabi.sehir}</h2>
          
          <div className="ai-text">
            <p>{result.yapayZekaCevabi.ikna_metni}</p>
          </div>

          <div className="map-container" onClick={() => setIsMapModalOpen(true)}>
            <iframe title="Şehir Haritası" 
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent("Oteller, " + result.yapayZekaCevabi.sehir)}&t=&z=13&ie=UTF8&iwloc=near&output=embed`}></iframe>
          </div>

          {isMapModalOpen && (
            <div className="map-modal-overlay">
              <div className="map-modal-content">
                <button className="close-modal-btn" onClick={() => setIsMapModalOpen(false)}> X Kapat</button>
                <iframe title='Büyük Şehir Haritası'               
                src={`https://maps.google.com/maps?q=${encodeURIComponent("Oteller, " + result.yapayZekaCevabi.sehir)}&t=&z=13&ie=UTF8&iwloc=near&output=embed`}></iframe>
              </div>
            </div>
          )}

          <h3>🏆 En Yüksek Puanlı Oteller</h3>
          <div className="hotels-grid">
            {result.oteller?.map((otel, index) => (
              <div key={index} className="hotel-card">
                <img src={otel.resim} alt={otel.isim} />
                <div className="hotel-info">
                  <h4>{otel.isim}</h4>
                  
                  {/* JSON'dan gelen puanı yıldızla gösteriyoruz */}
                  <p style={{ color: '#f39c12', fontWeight: 'bold' }}>
                    ⭐ {otel.puan} / 10
                  </p>
                  
                  <p><strong>Fiyat:</strong> {otel.fiyat}</p>
                  <div className="link-container">
                    <a href={otel.link}>Planlamaya Başla </a>
                    <IoIosArrowRoundForward />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={handleReset} className="result-container-btn">
            Yeniden Anket Yap
          </button>
        </div>
      )}

      <div className="destinations">
        <h3>Seyahat Tavsiyeleri</h3>
        <div className="destinations-content" 
              onClick={() => handleQuickPlan(4, 'Orta', 'Tarihi yerler ve sakinlik')}>
          <div className="destinations-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFhyQXqA5UEASmiw-PYUjz4AjFvnf0gZyeQu3BxkMVdQ&s=10" alt="" />
            <p>Aile ile Avrupa Turu</p>
            <div className="link-container">
              <a href="">Planlamaya Başla  </a>
              <IoIosArrowRoundForward />
            </div>
          </div>
          <div className="destinations-card"
              onClick={() => handleQuickPlan(3, 'Ekonomik', 'Tarihi yerler, şarap tadımı ve sakinlik')}>
            <img src="https://www.hunkarturizm.com/image/blog/balkanlar-gezilecek-yerler_66b5da3e8c265.jpeg" alt="" />
            <p>Arkadaşlarla Balkan Turu</p>
            <div className="link-container">
              <a href="">Planlamaya Başla  </a>
              <IoIosArrowRoundForward />
            </div>
          </div>
          <div className="destinations-card"
              onClick={() => handleQuickPlan(1, 'Orta', 'Doğa yürüyüşleri, kamp ve macera')}>
            <img src="https://www.lumidea.co/tr/images/blog/turkiye-hakkinda.jpg" alt="" />
            <p>Yalnız Türkiye Turu</p>
            <div className="link-container">
              <a href="">Planlamaya Başla </a>
              <IoIosArrowRoundForward />
            </div>
          </div>
        </div>
        
      </div>

      <div className="footer">
        <div className="content">
          <div className="altcontent">
            <h4>Company</h4>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
            <a href="#">FAQ</a>
            <a href="#">Press</a>
          </div>
          <div className="altcontent">
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Imprint</a>
            <a href="#">Cookie settings</a>
          </div>
          <div className="altcontent">
            <h4>Top Countries</h4>
            <a href="#">Spain</a>
            <a href="#">Italy</a>
            <a href="#">Portugal</a>
            <a href="#">Germany</a>
            <a href="#">Turkiye</a>
            <a href="#">All Countries</a>
          </div>
        </div>
        <div className="endcontent">
          <div className="end">
            <p>Made with 💜 in Istanbul</p>
            <p>© {currentYear} Tüm hakları saklıdır. </p>
          </div>
          <div className="social-links">
            <a href="#"><SiTiktok /></a>
            <a href="#"><RiInstagramFill /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaPinterest /></a>
            <a href="#"><FaReddit /></a>
          </div>
          
        </div>
      </div>

    </div>
  )
}

export default App