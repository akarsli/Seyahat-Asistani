import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ChatSidebar from '../components/itinerary/ChatSidebar';
import ItineraryDetails from '../components/itinerary/ItineraryDetails';
import { Loader2, Map } from 'lucide-react';

const ItineraryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchInitiated = useRef(false);

  const generatePlan = async (promptText) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8081/api/itinerary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: promptText })
      });
      
      if (!response.ok) {
        let errorMessage = 'API yanıt vermedi veya hata oluştu.';
        try {
          const errorData = await response.text();
          if (errorData) errorMessage = errorData;
        } catch (e) {
          // Ignore parsing error
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setItineraryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      fetchInitiated.current = false;
    }
  };

  useEffect(() => {
    const prompt = location.state?.prompt;
    if (prompt && !itineraryData && !loading && !fetchInitiated.current) {
      fetchInitiated.current = true;
      generatePlan(prompt);
    }
  }, [location.state]);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="h-20 flex-shrink-0">
        <Navbar />
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-[400px] flex-shrink-0 h-full hidden md:block">
          <ChatSidebar hasPlan={!!itineraryData} onSendPrompt={generatePlan} />
        </div>
        
        <div className="flex-1 h-full relative overflow-y-auto">
          {loading ? (
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
              <p className="mt-4 text-slate-600">Lütfen API anahtarınızın application.properties dosyasına doğru girildiğinden, limitlere takılmadığınızdan ve Spring Boot Backend'in (8081 portunda) çalıştığından emin olun.</p>
            </div>
          ) : itineraryData ? (
            <ItineraryDetails data={itineraryData} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
              <div className="w-24 h-24 bg-blue-50 text-[#1E3A8A] rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <Map className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Planınızı Söylemeniz Bekleniyor</h2>
              <p className="text-slate-500 max-w-md mx-auto text-lg">Sol taraftaki asistanımızı kullanarak hayalinizdeki tatili anlatın, sizin için hemen bir rota oluşturalım!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;
