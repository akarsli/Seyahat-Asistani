import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const [prompt, setPrompt] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const navigate = useNavigate();

  const placeholders = [
    "Ekim'de İtalya turu, romantik ve bol makarnalı...",
    "Hafta sonu Kapadokya kaçamağı, sıcak hava balonu...",
    "Bütçe dostu Balkan turu, tarihi ve yöresel...",
    "Kışın Uludağ'da kayak tatili...",
    "Arkadaşlarla yazın Bodrum, deniz kum güneş..."
  ];

  useEffect(() => {
    let timer;
    const currentString = placeholders[loopNum % placeholders.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(currentString.substring(0, currentText.length - 1));
        setTypingSpeed(30); // Faster deletion
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(currentString.substring(0, currentText.length + 1));
        setTypingSpeed(70); // Normal typing speed
      }, typingSpeed);
    }

    if (!isDeleting && currentText === currentString) {
      // Pause at the end before deleting
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2500); // Wait 2.5 seconds before deleting
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setTypingSpeed(70); // Reset speed
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, typingSpeed, placeholders]);

  const handlePlan = () => {
    if (prompt.trim()) {
      // Pass the prompt to the itinerary page via state
      navigate('/itinerary', { state: { prompt } });
    } else {
      alert('Lütfen planınızı girin');
    }
  };

  const suggestions = [
    { label: 'Vizesiz Rotalar' },
    { label: 'Hafta Sonu Kaçamağı' },
    { label: 'Bütçe Dostu Tatil' },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Beautiful nature destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/40 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
        {/* Soft transition to page background */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20 pb-24">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
          Hayalindeki Seyahati <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-400">Planlamak Artık Çok Kolay</span>
        </h1>

        <p className="text-base md:text-lg text-slate-200 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
          Nereye gitmek istediğini, ne zaman gideceğini veya sadece aklındaki tatil fikrini yaz. Yapay zeka senin için mükemmel rotayı saniyeler içinde hazırlasın.
        </p>

        {/* Input Area */}
        <div className="bg-white/90 p-2 rounded-[25px] border border-white/50 shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto transition-all focus-within:bg-white focus-within:shadow-[#1E3A8A]/20">
          <div className="flex-1 flex items-center gap-3 px-4 w-full h-14">
            <Sparkles className="w-6 h-6 text-[#F59E0B] hidden md:block" />
            <input
              type="text"
              placeholder={currentText}
              className="w-full bg-transparent text-slate-800 placeholder-slate-500 focus:outline-none text-lg h-full transition-all duration-300"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePlan()}
            />
          </div>
          <button
            onClick={handlePlan}
            className="w-full md:w-auto bg-[#F59E0B] hover:bg-[#d97706] text-black px-8 py-4 md:py-0 md:h-14 rounded-[15px] cursor-pointer font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#F59E0B]/50"
          >
            <span>Planla</span>
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              className="px-5 py-2.5 rounded-full bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/40 text-slate-900 text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
              onClick={() => setPrompt(suggestion.label)}
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
