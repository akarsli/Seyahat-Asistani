import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Settings, User, Bell, Globe, Shield, Moon, Monitor, Sun, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, updateUser } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState(true); // Placeholder state

  const [editedName, setEditedName] = useState(user?.fullName || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  React.useEffect(() => {
    if (user?.fullName) setEditedName(user.fullName);
  }, [user]);

  const handleSaveProfile = async () => {
    setProfileError('');
    setIsSavingProfile(true);
    try {
      const response = await fetch('http://localhost:8081/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          fullName: editedName,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Profil güncellenirken bir hata oluştu.');
      }

      updateUser({ fullName: editedName });
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Modal ve hesap silme stateleri
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleteError('');
    setIsDeleting(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          password: deletePassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Hesap silinirken bir hata oluştu.');
      }

      logout();
      navigate('/');
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('settings.login_prompt_title')}</h2>
            <button onClick={() => navigate('/auth')} className="mt-4 bg-[#F59E0B] text-white px-6 py-2 rounded-xl font-bold">{t('nav.login')}</button>
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
              <h3 className="text-lg font-bold text-slate-800 mb-1">{t('settings.account_title')}</h3>
              <p className="text-sm text-slate-500 mb-4">{t('settings.account_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">{t('settings.fullname')}</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">{t('settings.email')}</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">{t('settings.role')}</label>
                <input
                  type="text"
                  value={user.role === 'ADMIN' ? t('settings.role_admin') : t('settings.role_user')}
                  disabled
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">{t('settings.quota_title')}</label>
                <input
                  type="text"
                  value={user.role === 'ADMIN' ? t('nav.unlimited') : `${user.remainingQuota ?? 3} / 3`}
                  disabled
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
              {/* Save Button (Animated) */}
              <div 
                className={`md:col-span-2 flex justify-end relative overflow-hidden transition-all duration-500 ease-in-out ${
                  editedName !== user?.fullName ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                {profileError && (
                  <div className="absolute right-[220px] top-1/2 -translate-y-1/2 bg-red-100 text-red-600 p-2 rounded-lg text-xs whitespace-nowrap shadow-sm border border-red-200">
                    {profileError}
                  </div>
                )}
                <button
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile || editedName === user?.fullName}
                  className="flex items-center gap-2 bg-[#F59E0B] hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl shadow-sm font-bold transition-colors"
                >
                  {isSavingProfile ? t('settings.saving') : t('settings.save')}
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{t('settings.pref_title')}</h3>
              <p className="text-sm text-slate-500 mb-4">{t('settings.pref_desc')}</p>
            </div>

            {/* Currency Setting */}
            <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">{t('settings.currency_title')}</h4>
                <p className="text-sm text-slate-500">{t('settings.currency_desc')}</p>
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

            {/* Language Setting */}
            <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">{t('settings.lang_title')}</h4>
                <p className="text-sm text-slate-500">{t('settings.lang_desc')}</p>
              </div>
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="w-full md:w-48 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-[#F59E0B] focus:border-[#F59E0B] p-3 cursor-pointer outline-none font-medium"
              >
                <option value="tr">{t('settings.lang_tr')}</option>
                <option value="en">{t('settings.lang_en')}</option>
              </select>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{t('settings.notif_title')}</h3>
              <p className="text-sm text-slate-500 mb-4">{t('settings.notif_desc')}</p>
            </div>

            <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">{t('settings.notif_flight')}</h4>
                <p className="text-sm text-slate-500">{t('settings.notif_flight_desc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-between opacity-60">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">{t('settings.notif_email')}</h4>
                <p className="text-sm text-slate-500">{t('settings.notif_email_desc')}</p>
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
              <h3 className="text-lg font-bold text-slate-800 mb-1">{t('settings.sec_title')}</h3>
              <p className="text-sm text-slate-500 mb-4">{t('settings.sec_desc')}</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-amber-900 mb-2">{t('settings.sec_pwd_title')}</h4>
              <p className="text-sm text-amber-700 mb-4">
                {t('settings.sec_pwd_desc')}
              </p>
              <button className="px-4 py-2 bg-white text-amber-600 font-bold rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
                {t('settings.sec_pwd_btn')}
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h4 className="font-bold text-red-900 mb-2">{t('settings.sec_del_title')}</h4>
              <p className="text-sm text-red-700 mb-4">
                {t('settings.sec_del_desc')}
              </p>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                {t('settings.sec_del_btn')}
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
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t('settings.title')}</h1>
              <p className="text-slate-500 text-sm">{t('settings.desc')}</p>
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
                  <User className="w-5 h-5" /> {t('settings.tab_account')}
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'preferences' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
                >
                  <Globe className="w-5 h-5" /> {t('settings.tab_preferences')}
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
                >
                  <Bell className="w-5 h-5" /> {t('settings.tab_notifications')}
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}
                >
                  <Shield className="w-5 h-5" /> {t('settings.tab_security')}
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

      {/* Hesabı Silme Modalı */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('settings.modal_del_title')}</h3>
            <p className="text-slate-600 mb-4 text-sm">
              {t('settings.modal_del_desc')}
              <br /><br />
              <span className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg block">
                {t('settings.modal_del_note')}
              </span>
            </p>

            {deleteError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100">
                {deleteError}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('settings.pwd_label')}</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder={t('settings.pwd_ph')}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletePassword('');
                  setDeleteError('');
                }}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                disabled={isDeleting}
              >
                {t('settings.cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? t('settings.saving') : t('settings.confirm_del')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
