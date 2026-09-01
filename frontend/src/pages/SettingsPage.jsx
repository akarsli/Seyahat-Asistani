import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Settings, User, Bell, Globe, Shield, Moon, Monitor, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('system'); // Placeholder state
  const [notifications, setNotifications] = useState(true); // Placeholder state

  if (!user) {
    // If not logged in, redirect or show message. 
    // Navbar will handle redirect/login, but let's just show a simple prompt.
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Ayarları Görmek İçin Giriş Yapın</h2>
            <button onClick={() => navigate('/auth')} className="mt-4 bg-[#F59E0B] text-white px-6 py-2 rounded-xl font-bold">Giriş Yap</button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Hesap Bilgileri</h3>
              <p className="text-sm text-slate-500 mb-4">Kişisel bilgilerinizi buradan görüntüleyebilirsiniz.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Ad Soyad</label>
                <input 
                  type="text" 
                  value={user.fullName} 
                  disabled 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">E-Posta Adresi</label>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Rol / Yetki</label>
                <input 
                  type="text" 
                  value={user.role === 'ADMIN' ? 'Yönetici (Sınırsız Kullanım)' : 'Standart Kullanıcı'} 
                  disabled 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Kalan Planlama Hakkı</label>
                <input 
                  type="text" 
                  value={user.role === 'ADMIN' ? 'Sınırsız' : `${user.remainingQuota ?? 3} / 3`} 
                  disabled 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        );
      
      case 'preferences':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Uygulama Tercihleri</h3>
              <p className="text-sm text-slate-500 mb-4">Para birimi, tema ve dil ayarlarınızı yönetin.</p>
            </div>

            {/* Currency Setting */}
            <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Para Birimi</h4>
                <p className="text-sm text-slate-500">Planlamalarda gösterilecek varsayılan para birimi.</p>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full md:w-48 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-[#F59E0B] focus:border-[#F59E0B] p-3 cursor-pointer outline-none font-medium"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="TRY">TRY (₺)</option>
              </select>
            </div>

            {/* Theme Setting (Placeholder) */}
            <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Görünüm Teması</h4>
                <p className="text-sm text-slate-500">Uygulamanın arayüz temasını seçin.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'light' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Sun className="w-4 h-4" /> Açık
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-slate-800 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Moon className="w-4 h-4" /> Koyu
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Bildirim Ayarları</h3>
              <p className="text-sm text-slate-500 mb-4">Hangi konularda bildirim almak istediğinizi seçin.</p>
            </div>

            <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Uçuş Fiyatı Alarmları</h4>
                <p className="text-sm text-slate-500">Kayıtlı rotalarınızda fiyat düşüşü olduğunda haber ver.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-between opacity-60">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">E-Posta Bülteni</h4>
                <p className="text-sm text-slate-500">Yeni seyahat ipuçları ve gizli rotalardan haberdar olun.</p>
              </div>
              <label className="relative inline-flex items-center cursor-not-allowed">
                <input type="checkbox" disabled className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Güvenlik</h3>
              <p className="text-sm text-slate-500 mb-4">Şifre ve hesap güvenliği ayarları.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h4 className="font-bold text-amber-900 mb-2">Şifre Değiştirme</h4>
              <p className="text-sm text-amber-700 mb-4">
                Hesap güvenliğiniz için şifrenizi düzenli aralıklarla değiştirmenizi öneririz.
              </p>
              <button className="px-4 py-2 bg-white text-amber-600 font-bold rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
                Şifre Sıfırlama Bağlantısı Gönder
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Ayarlar</h1>
              <p className="text-slate-500 text-sm">Hesap bilgilerinizi ve uygulama tercihlerinizi yönetin.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'account' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
                >
                  <User className="w-5 h-5" /> Hesap Bilgileri
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'preferences' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
                >
                  <Globe className="w-5 h-5" /> Tercihler
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
                >
                  <Bell className="w-5 h-5" /> Bildirimler
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
                >
                  <Shield className="w-5 h-5" /> Güvenlik
                </button>
              </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
