import React, { useState, useEffect } from 'react';
import { Send, Map, SlidersHorizontal, User, Bot, Sparkles } from 'lucide-react';

const ChatSidebar = ({ hasPlan, onSendPrompt }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: hasPlan 
        ? 'Merhaba! Ben HolidayTrip asistanınız. Sizin için hazırladığım rotayı yan tarafta görebilirsiniz. Rotada herhangi bir değişiklik yapmak ister misiniz? Örneğin hızı ayarlayabilir veya spesifik bir yer ekleyebiliriz.'
        : 'Merhaba! Ben HolidayTrip asistanınız. Nereye seyahat etmek istersiniz? Bana hayalinizdeki tatili anlatın, sizin için planlayayım!',
    }
  ]);
  const [input, setInput] = useState('');

  // Update initial message if the plan state changes from outside
  useEffect(() => {
    if (hasPlan && messages.length === 1 && messages[0].sender === 'ai') {
      setMessages([{
        id: Date.now(),
        sender: 'ai',
        text: 'Harika! Rotanızı yan tarafta görebilirsiniz. Rotada herhangi bir değişiklik yapmak ister misiniz?'
      }]);
    }
  }, [hasPlan]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userText = input;
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    
    if (!hasPlan && onSendPrompt) {
      // Generate the initial plan
      onSendPrompt(userText);
    } else {
      // Mock AI response for refinement
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Harika bir fikir! Rotanızı buna göre güncelliyorum. Başka bir isteğiniz var mı?'
        }]);
      }, 1500);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-800">Travel Concierge</span>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <button className="p-2 text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-colors" title="View Map">
            <Map className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-colors" title="Adjust Pace">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-[#1E3A8A]'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-[#1E3A8A] text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.sender === 'ai' && msg.id === 1 && hasPlan && (
                  <div className="mt-3 flex gap-2">
                    <button className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                      Haritayı Göster
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                      Hızı Düşür
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={hasPlan ? "Rotayı nasıl değiştirelim?" : "Hayalinizdeki tatili anlatın..."}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 transition-all text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 p-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e3a8acd] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
