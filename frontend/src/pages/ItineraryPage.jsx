import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ChatSidebar from '../components/itinerary/ChatSidebar';
import ItineraryDetails from '../components/itinerary/ItineraryDetails';
import { Loader2, Map, Check, MapPin, Clock, Wallet, User, Calendar, Plane, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RequirementsChecklist = ({ params }) => {
  const reqs = [
    { key: 'departureLocation', label: 'Nereden Gidilecek?', icon: <MapPin className="w-5 h-5" /> },
    { key: 'destination', label: 'Nereye Gidilecek?', icon: <Plane className="w-5 h-5" /> },
    { key: 'travelDate', label: 'Ne Zaman & Kaç Gün?', icon: <Calendar className="w-5 h-5" /> },
    { key: 'budget', label: 'Bütçe Ne Kadar?', icon: <Wallet className="w-5 h-5" /> },
    { key: 'numberOfPeople', label: 'Kaç Kişi Gidilecek?', icon: <User className="w-5 h-5" /> },
  ];
  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
       <h2 className="text-3xl font-bold text-slate-800 mb-2">Planlama İçin Birkaç Detay Eksik</h2>
       <p className="text-slate-500 mb-8 max-w-md mx-auto">Harika bir rota çıkarabilmemiz için aşağıdaki bilgilerin tamamlanması gerekiyor. Lütfen eksik olanları sol taraftaki asistana yazın.</p>
       
       <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 text-left">
         {reqs.map(r => {
           const isFilled = params && params[r.key];
           return (
             <div key={r.key} className={`flex items-center gap-4 p-4 rounded-xl border ${isFilled ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-200'}`}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isFilled ? 'bg-green-500 text-white shadow-sm shadow-green-200' : 'bg-slate-200 text-slate-400'}`}>
                  {isFilled ? <Check className="w-5 h-5" /> : r.icon}
               </div>
               <div className="flex-1">
                 <p className={`font-semibold ${isFilled ? 'text-green-800' : 'text-slate-700'}`}>{r.label}</p>
                 {isFilled ? (
                   <p className="text-sm text-green-600 font-medium">{params[r.key]}</p>
                 ) : (
                   <p className="text-sm text-slate-400">Bekleniyor...</p>
                 )}
               </div>
             </div>
           );
         })}
       </div>
    </div>
  );
};

const ItineraryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, decrementQuota } = useAuth();
  
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileView, setMobileView] = useState('chat'); // 'chat' or 'plan'
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  
  // Extraction State
  const [parameters, setParameters] = useState(null);
  const [messages, setMessages] = useState([]);
  const [initialInput, setInitialInput] = useState('');
  
  const fetchInitiated = useRef(false);

  const extractParams = async (text, currentParams = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8081/api/itinerary/extract-parameters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, currentParameters: currentParams })
      });
      
      if (!response.ok) {
        throw new Error('Parametre çıkarımı başarısız oldu.');
      }
      
      const data = await response.json();
      setParameters(data);
      
      // AI message logic
      const isComplete = data.numberOfPeople && data.departureLocation && data.budget && data.travelDate && data.destination;
      
      if (isComplete) {
         if (!user) {
           setTimeout(() => {
             setShowAuthPopup(true);
             setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: 'Tüm detayları aldım! Planlamaya başlayabilmemiz için giriş yapmanız gerekiyor.' }]);
           }, 1500);
           // Burada generatePlan çağırmıyoruz, kullanıcı giriş yapmalı
         } else if (user.remainingQuota <= 0) {
           setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: 'Haftalık plan kotanız dolmuştur. Yeni rotalar oluşturabilmek için kotanızın sıfırlanmasını bekleyiniz.' }]);
           setLoading(false);
         } else {
           setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: 'Harika! Tüm detayları aldım. Şimdi sizin için en uygun rotayı hazırlıyorum, lütfen bekleyin...' }]);
           const fullPrompt = `Nereden: ${data.departureLocation}, Nereye: ${data.destination}, Tarih: ${data.travelDate}, Bütçe: ${data.budget}, Kişi: ${data.numberOfPeople}. Ek Detaylar: ${text}`;
           
           // 1.5 saniyelik gecikme ile checklistin onaylı halini ekranda tutuyoruz
           setTimeout(() => {
             setIsGenerating(true);
             generatePlan(fullPrompt);
           }, 1500);
         }
      } else {
         setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: 'Teşekkürler. Lütfen sağ taraftaki listede eksik kalan (bekleniyor) bilgileri de bana söyler misiniz?' }]);
         setLoading(false);
      }
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const generatePlan = async (fullPrompt) => {
    try {
      const response = await fetch('http://localhost:8081/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, email: user?.email })
      });
      
      if (!response.ok) {
        let errorMessage = 'API yanıt vermedi veya hata oluştu.';
        try {
          const errorData = await response.text();
          if (errorData) errorMessage = errorData;
        } catch (e) {}
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setItineraryData(data);
      decrementQuota();
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: 'Rotanız hazır! Sağ taraftan tüm detayları inceleyebilirsiniz.' }]);
      setMobileView('plan');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const handleSendMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    
    if (!itineraryData) {
      extractParams(text, parameters);
    } else {
      // Future: refinement logic
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'ai', text: 'Rotayı güncelleme özelliği yakında eklenecek!' }]);
    }
  };

  useEffect(() => {
    const prompt = location.state?.prompt;
    if (prompt && !itineraryData && !loading && !fetchInitiated.current) {
      fetchInitiated.current = true;
      if (messages.length === 0) {
        setMessages([{ id: Date.now(), sender: 'user', text: prompt }]);
      }
      extractParams(prompt, null);
    }
    
    // Eğer sayfaya giriş yaptıktan sonra dönüldüyse ve liste tamamsa otomatik başlat
    if (user && isComplete && !isGenerating && !itineraryData && !loading) {
       if (user.remainingQuota <= 0) {
           setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: 'Haftalık plan kotanız dolmuştur. Yeni rotalar oluşturabilmek için kotanızın sıfırlanmasını bekleyiniz.' }]);
           return;
       }
       const fullPrompt = `Nereden: ${parameters.departureLocation}, Nereye: ${parameters.destination}, Tarih: ${parameters.travelDate}, Bütçe: ${parameters.budget}, Kişi: ${parameters.numberOfPeople}. Ek Detaylar: ${prompt || ''}`;
       setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: 'Harika! Tüm detayları aldım. Şimdi sizin için en uygun rotayı hazırlıyorum, lütfen bekleyin...' }]);
       setTimeout(() => {
         setIsGenerating(true);
         generatePlan(fullPrompt);
       }, 1500);
    }
  }, [location.state, user]);

  const isComplete = parameters?.numberOfPeople && parameters?.departureLocation && parameters?.budget && parameters?.travelDate && parameters?.destination;

  if (messages.length === 0) {
    return (
      <div className="h-screen flex flex-col bg-slate-50">
        <div className="h-20 flex-shrink-0">
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Top Right History Button */}
          {user && (
            <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
               <Link to="/history" className="flex items-center gap-2 bg-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:shadow-md transition-all text-sm md:text-base">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#1E3A8A]" />
                  Geçmiş Planlarım
               </Link>
            </div>
          )}

          {/* Input UI */}
          <div className="relative z-10 w-full max-w-3xl">
             <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 text-center mb-6 drop-shadow-sm">
               Nereyi Keşfetmek İstersiniz?
             </h1>
             <p className="text-slate-500 text-center mb-10 text-lg max-w-xl mx-auto">
               Aklınızdaki rotayı veya tatil fikrini yazın, saniyeler içinde sizin için en ideal seyahat planını çıkaralım.
             </p>
             
             <div className="bg-white p-2 rounded-[25px] border border-slate-200 shadow-xl flex flex-col md:flex-row items-center gap-2 transition-all focus-within:shadow-[#1E3A8A]/10 focus-within:border-blue-300">
               <div className="flex-1 flex items-center gap-3 px-4 w-full h-14">
                 <Sparkles className="w-6 h-6 text-[#F59E0B] hidden md:block" />
                 <input
                   type="text"
                   placeholder="Örn: Ekim'de İtalya gezisi..."
                   className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-lg h-full"
                   value={initialInput}
                   onChange={(e) => setInitialInput(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && initialInput.trim()) {
                       handleSendMessage(initialInput);
                     }
                   }}
                   autoFocus
                 />
               </div>
               <button
                 onClick={() => {
                   if (initialInput.trim()) handleSendMessage(initialInput);
                 }}
                 className="w-full md:w-auto bg-[#F59E0B] hover:bg-[#d97706] text-black px-8 py-4 md:py-0 md:h-14 rounded-[15px] cursor-pointer font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-md"
               >
                 Planla
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="h-20 flex-shrink-0">
        <Navbar />
      </div>
      
      <div className="flex-1 flex overflow-hidden relative">
        <div className={`w-full md:w-1/3 lg:w-[400px] flex-shrink-0 h-full ${mobileView === 'chat' ? 'block' : 'hidden'} md:block`}>
          <ChatSidebar 
            hasPlan={!!itineraryData} 
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
          />
        </div>
        
        <div className={`flex-1 h-full relative overflow-y-auto ${mobileView === 'plan' ? 'block' : 'hidden'} md:block`}>
          
          {/* Popup Overlay for Unauthenticated Users */}
          {showAuthPopup && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl flex flex-col items-center text-center transform scale-100 transition-all">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <LogIn className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">Giriş Yapmanız Gerekiyor</h2>
                <p className="text-slate-500 mb-8">
                  Yapay zeka asistanını kullanabilmek ve harika rotalar oluşturabilmek için hesabınıza giriş yapmalısınız.
                </p>
                <button
                  onClick={() => navigate('/auth', { state: { returnTo: '/itinerary', prompt: location.state?.prompt } })}
                  className="w-full bg-[#F59E0B] hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-amber-600/20 flex justify-center items-center gap-2"
                >
                  Giriş Yap / Kayıt Ol
                </button>
              </div>
            </div>
          )}

          {isGenerating && !itineraryData ? (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin"></div>
                <div className="w-24 h-24 border-4 border-[#1E3A8A] rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
                <Loader2 className="w-8 h-8 text-[#1E3A8A] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <h2 className="mt-8 text-2xl font-bold text-slate-800 animate-pulse">Yapay Zeka Rotanızı Planlıyor...</h2>
              <p className="text-slate-500 mt-2">Bu işlem birkaç saniye sürebilir, arkanıza yaslanın.</p>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-red-500 p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Bir Hata Oluştu!</h2>
              <p className="mb-4 text-slate-600">Geliştirici Detayları:</p>
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg w-full max-w-2xl max-h-64 overflow-auto text-left text-xs sm:text-sm mt-2 mb-4 font-mono whitespace-pre-wrap shadow-inner">
                {error}
              </div>
            </div>
          ) : itineraryData ? (
            <ItineraryDetails data={itineraryData} />
          ) : (
            <RequirementsChecklist params={parameters} />
          )}
        </div>

        {/* Mobile Floating Toggle */}
        <div className="md:hidden fixed bottom-6 right-6 z-50 bg-white p-1.5 rounded-full shadow-2xl border border-slate-200 flex gap-1">
          <button 
            onClick={() => setMobileView('chat')}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${mobileView === 'chat' ? 'bg-[#1E3A8A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Sohbet
          </button>
          <button 
            onClick={() => setMobileView('plan')}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${mobileView === 'plan' ? 'bg-[#F59E0B] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;
