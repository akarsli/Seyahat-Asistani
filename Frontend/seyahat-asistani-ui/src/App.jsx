import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    kisiSayisi: 2,
    butce: 'Orta',
    tatilTarzi: 'Tarihi yerler, şarap tadımı ve sakinlik'
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  // Formdaki değişiklikleri yakalayan fonksiyon
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Butona basıldığında Backend'e (Spring Boot) istek atan fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Senin yazdığın o kusursuz backend'e gidiyoruz
      const response = await axios.post('http://localhost:8080/api/get-vacation-plan', {
        kisiSayisi: parseInt(formData.kisiSayisi),
        butce: formData.butce,
        tatilTarzi: formData.tatilTarzi
      })
      
      setResult(response.data)
    } catch (error) {
      alert("Backend'e ulaşılamadı. Spring Boot'un çalıştığından emin ol.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>🌍 Seyahat Asistanı</h1>
      
      {/* Eğer henüz sonuç dönmediyse formu göster */}
      {!result && (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Kişi Sayısı</label>
            <input 
              type="number" 
              name="kisiSayisi" 
              value={formData.kisiSayisi} 
              onChange={handleChange} 
              min="1" 
            />
          </div>
          
          <div className="form-group">
            <label>Bütçe</label>
            <select name="butce" value={formData.butce} onChange={handleChange}>
              <option value="Ekonomik">Ekonomik (Sırt Çantalı)</option>
              <option value="Orta">Orta (Konforlu)</option>
              <option value="Lüks">Lüks (Premium)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Tatil Tarzı</label>
            <select name="tatilTarzi" value={formData.tatilTarzi} onChange={handleChange}>
              <option value="Tarihi yerler, şarap tadımı ve sakinlik">Tarih & Sakinlik</option>
              <option value="Deniz, kum, güneş ve hareketli gece hayatı">Eğlence & Plaj</option>
              <option value="Doğa yürüyüşleri, kamp ve macera">Doğa & Macera</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Yapay Zeka Planlıyor...' : 'Tatil Planımı Çıkar'}
          </button>
        </form>
      )}

      {/* Eğer backend'den sonuç geldiyse ekrana bas */}
      {result && (
        <div className="result-container">
          <h2>Gideceğin Yer: {result.yapayZekaCevabi.sehir}</h2>
          
          <div className="ai-text">
            <p>{result.yapayZekaCevabi.ikna_metni}</p>
          </div>

          <h3>Önerilen Oteller</h3>
          <div className="hotels-grid">
            {result.oteller.map((otel, index) => (
              <div key={index} className="hotel-card">
                <img src={otel.resim} alt={otel.isim} />
                <div className="hotel-info">
                  <h4>{otel.isim}</h4>
                  <p><strong>Fiyat:</strong> {otel.fiyat}</p>
                  <a href={otel.link} target="_blank" rel="noreferrer" className="hotel-link">
                    Oteli İncele (Affiliate)
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <button style={{marginTop: '2rem', backgroundColor: '#95a5a6'}} onClick={() => setResult(null)}>
            Yeni Bir Arama Yap
          </button>
        </div>
      )}
    </div>
  )
}

export default App