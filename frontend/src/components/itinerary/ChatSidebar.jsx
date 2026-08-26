import React, { useState } from 'react';
import { Send, Map, SlidersHorizontal, User, Bot, Sparkles } from 'lucide-react';

const ChatSidebar = ({ hasPlan, messages, onSendMessage, loading }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#F59E0B] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-800">Seyahat Asistanı</span>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button className="p-2 text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-colors" title="Haritayı Görüntüle">
            <Map className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-colors" title="Tempoyu Ayarla">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-[#1E3A8A]'
                }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl ${msg.sender === 'user'
                  ? 'bg-[#F59E0B] text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%] flex-row">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-100 text-[#1E3A8A]">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 text-slate-800 rounded-tl-none flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={hasPlan ? "Rotayı nasıl değiştirelim?" : "Hayalinizdeki tatili anlatın..."}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 transition-all text-sm disabled:opacity-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 p-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
