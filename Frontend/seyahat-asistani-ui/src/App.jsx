import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // ---------------------------------------------------------
  // 1. STATE TANIMLAMALARI
  // ---------------------------------------------------------
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

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
      const response = await axios.post('http://localhost:8080/api/get-vacation-plan', {
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
          <h2>HolidayTrip</h2>
        </div>
        <div className="header-right">
          <div className="header-buttons">
            <button>₺</button>
            <button>🇹🇷</button>
            <button onClick={handleClick}>{tempValue}</button>
          </div>
          <button>👤</button>
        </div>
      </div>

      {/* DURUM 1: HENÜZ SONUÇ DÖNMEDİYSE (ANKET EKRANI) */}
      {!result && (
        <div className="survey-container">
          {loading ? (
            /* Yüklenme Alanı */
            <div className="loading-container">
              <h3>🤖 Yapay Zeka Harika Bir Rota Hazırlıyor...</h3>
              <p>Lütfen bekleyin, yanıtlarınız analiz ediliyor.</p>
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

              <button
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

          <h3>Önerilen Oteller</h3>
          <div className="hotels-grid">
            {result.oteller?.map((otel, index) => (
              <div key={index} className="hotel-card">
                <img src={otel.resim} alt={otel.isim} />
                <div className="hotel-info">
                  <h4>{otel.isim}</h4>
                  <p><strong>Fiyat:</strong> {otel.fiyat}</p>
                  <a href={otel.link} target="_blank" rel="noreferrer" className="hotel-link">
                    Oteli İncele
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={handleReset}>
            Yeniden Anket Yap
          </button>
        </div>
      )}

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
            <a href="#">TikTok</a>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">YouTube</a>
            <a href="#">Pinterest</a>
            <a href="#">Reddit</a>
          </div>
          
        </div>
      </div>

    </div>
  )
}

export default App