import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const AuthPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin !== false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:8081/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || t('auth_page.google_error'));
      }
      
      const data = await res.json();
      login(data);
      const returnTo = location.state?.returnTo || '/';
      navigate(returnTo, { state: { prompt: location.state?.prompt } });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isLogin ? 'http://localhost:8081/api/auth/login' : 'http://localhost:8081/api/auth/register';
    
    const body = isLogin 
      ? { email, password }
      : { fullName: name, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Bir hata oluştu.');
      }

      const data = await response.json();
      login(data); // context update
      
      const returnTo = location.state?.returnTo || '/';
      navigate(returnTo, { state: { prompt: location.state?.prompt } }); // Redirect to planner
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNewPassword(null);

    try {
      const response = await fetch('http://localhost:8081/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Bir hata oluştu.');
      }

      const data = await response.json();
      setNewPassword(data.newPassword);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setForgotPasswordMode(false);
    setNewPassword(null);
    setError(null);
    setPassword('');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sol Kısım - Doğa Resmi (Sadece masaüstünde görünür, mobilde gizlenir) */}
      <div className="hidden lg:block lg:w-[70%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
          alt="Doğa Manzarası"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

        {/* Sol alt köşede logo ve slogan */}
        <div className="absolute bottom-12 left-12 text-white">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="font-extrabold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              HolidayTrip
            </span>
          </Link>
          <p className="text-xl text-slate-200 font-light max-w-xl">
            {t('auth_page.slogan')}
          </p>
        </div>
      </div>

      {/* Sağ Kısım - Giriş/Kayıt Formu (Mobilde tam ekran, masaüstünde %30) */}
      <div className="w-full lg:w-[40%] min-w-[320px] flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-12 py-12 bg-white relative z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.1)] overflow-y-auto">

        {/* Mobilde Üstte Logo Gösterimi */}
        <div className="lg:hidden mb-8 flex justify-center mt-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-extrabold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#1E3A8A] to-blue-600">
              HolidayTrip
            </span>
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto my-auto">
          {newPassword ? (
             <div className="text-center">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Lock className="w-8 h-8" />
               </div>
               <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('auth_page.new_password_title')}</h2>
               <p className="text-slate-500 mb-6">{t('auth_page.new_password_desc')}</p>
               <div className="bg-slate-100 p-4 rounded-xl mb-8 border border-slate-200">
                 <p className="text-2xl font-mono font-bold tracking-widest text-slate-800">{newPassword}</p>
               </div>
               <button
                 onClick={() => {
                   navigator.clipboard.writeText(newPassword);
                   resetToLogin();
                 }}
                 className="w-full flex justify-center items-center gap-2 bg-[#1E3A8A] text-white py-3 rounded-xl font-bold transition-colors hover:bg-blue-900 shadow-md shadow-blue-900/20"
               >
                 {t('auth_page.btn_copy_login')}
               </button>
             </div>
          ) : forgotPasswordMode ? (
             <>
               <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('auth_page.reset_password')}</h2>
               <p className="text-slate-500 mb-6">{t('auth_page.reset_password_desc')}</p>

               {error && (
                 <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-2">
                   <AlertCircle className="w-5 h-5 flex-shrink-0" />
                   <span>{error}</span>
                 </div>
               )}

               <form onSubmit={handleResetPassword} className="space-y-4">
                 <div className="space-y-1">
                   <label className="text-sm font-semibold text-slate-700">{t('auth_page.email')}</label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Mail className="h-5 w-5 text-slate-400" />
                     </div>
                     <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
                       placeholder={t('auth_page.email_ph')}
                     />
                   </div>
                 </div>

                 <button
                   type="submit"
                   disabled={loading}
                   className={`w-full flex justify-center items-center gap-2 bg-[#F59E0B] text-white py-3 rounded-xl font-bold transition-colors shadow-md shadow-amber-600/20 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-amber-600 cursor-pointer'}`}
                 >
                   {loading ? t('auth_page.loading_reset') : t('auth_page.btn_reset')}
                 </button>
               </form>

               <div className="mt-8 text-center pb-8 lg:pb-0">
                 <button type="button" onClick={resetToLogin} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                   {t('auth_page.back_to_login')}
                 </button>
               </div>
             </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                {isLogin ? t('auth_page.welcome') : t('auth_page.create_account')}
              </h2>
              <p className="text-slate-500 mb-6">
                {isLogin 
                  ? t('auth_page.welcome_desc') 
                  : t('auth_page.create_account_desc')}
              </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Kayıt Ol: Ad Soyad */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">{t('auth_page.fullname')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
                    placeholder={t('auth_page.fullname_ph')}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">{t('auth_page.email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
                  placeholder={t('auth_page.email_ph')}
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">{t('auth_page.password')}</label>
                {isLogin && (
                  <button type="button" onClick={() => { setForgotPasswordMode(true); setError(null); }} className="text-sm font-medium text-[#1E3A8A] hover:underline cursor-pointer">
                    {t('auth_page.forgot_pwd')}
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
                  placeholder={t('auth_page.password_ph')}
                />
              </div>
            </div>

            {/* Kayıt Ol: Kullanım Koşulları */}
            {!isLogin && (
              <div className="flex items-start gap-2 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required={!isLogin}
                  className="mt-1 w-4 h-4 text-[#1E3A8A] border-slate-300 rounded focus:ring-[#1E3A8A]"
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  <span className="font-semibold text-[#1E3A8A] hover:underline cursor-pointer">{t('auth_page.terms')}</span> {t('auth_page.and')} <span className="font-semibold text-[#1E3A8A] hover:underline cursor-pointer">{t('auth_page.privacy')}</span> {t('auth_page.read_accept')}
                </label>
              </div>
            )}

            {/* Giriş Yap / Kayıt Ol Butonu */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 bg-[#F59E0B] text-white py-3 rounded-xl font-bold transition-colors shadow-md shadow-amber-600/20 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-amber-600 cursor-pointer'}`}
            >
              {loading ? (
                t('auth_page.processing')
              ) : (
                <>
                  {isLogin ? t('auth_page.login_btn') : t('auth_page.register_btn')}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Veya Şununla Devam Et */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">{t('auth_page.or_continue_with')}</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google Giriş/Kayıt Butonu */}
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google ile giriş sırasında bir hata oluştu.')}
              text={isLogin ? "signin_with" : "signup_with"}
              width="100%"
            />
          </div>

          {/* Alt Geçiş Linki */}
          <div className="mt-8 text-center pb-8 lg:pb-0">
            {isLogin ? (
              <p className="text-slate-600 text-sm">
                {t('auth_page.no_account')}{' '}
                <button type="button" onClick={() => setIsLogin(false)} className="font-bold text-[#F59E0B] hover:underline cursor-pointer">
                  {t('auth_page.register_now')}
                </button>
              </p>
            ) : (
              <p className="text-slate-600 text-sm">
                {t('auth_page.has_account')}{' '}
                <button type="button" onClick={() => setIsLogin(true)} className="font-bold text-[#F59E0B] hover:underline cursor-pointer">
                  {t('auth_page.login_now')}
                </button>
              </p>
            )}
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
