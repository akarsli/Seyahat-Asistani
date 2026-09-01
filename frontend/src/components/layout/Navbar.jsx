import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plane, Compass, Map, User, Menu, X, LogOut, ChevronDown, Clock, Settings as SettingsIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { currency, setCurrency } = useCurrency();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Ana Sayfa', path: '/', icon: Map },
    { name: 'Keşfet', path: '/destinations', icon: Compass },
    { name: 'Planlarım', path: '/itinerary', icon: Plane },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'Admin Paneli', path: '/admin', icon: User });
  }

  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="w-full px-6 lg:px-12 xl:px-24">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]">
              HolidayTrip
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group text-black font-medium flex items-center gap-1"
                >
                  <link.icon className="w-4 h-4" /> {link.name}
                  <span className={`absolute left-0 -bottom-1 h-[2px] bg-[#F59E0B] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-6">
            {!user && (
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#F59E0B] focus:border-[#F59E0B] block p-2 cursor-pointer outline-none font-medium"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="TRY">TRY (₺)</option>
              </select>
            )}

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-700 hidden lg:block text-sm">
                    Merhaba, {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <p className="font-bold text-slate-800">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="p-3 border-b border-slate-100 bg-amber-50/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Kalan Planlama Hakkınız</span>
                        <span className="text-sm font-bold text-[#F59E0B] bg-amber-100 px-2 py-0.5 rounded-md">
                          {user.role === 'ADMIN' ? '∞' : `${user.remainingQuota ?? 3} / 3`}
                        </span>
                      </div>
                      <div className="w-full bg-amber-200/50 rounded-full h-1.5">
                        <div 
                          className="bg-[#F59E0B] h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: user.role === 'ADMIN' ? '100%' : `${((user.remainingQuota ?? 3) / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>


                    <div className="p-2 border-t border-slate-100">
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left cursor-pointer mb-1"
                      >
                        <SettingsIcon className="w-5 h-5 text-slate-500" />
                        <span>Ayarlar</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-left cursor-pointer"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors border border-slate-200 shadow-sm bg-white cursor-pointer"
                >
                  <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-2">
                    <Link
                      to="/auth"
                      state={{ isLogin: true }}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#F59E0B] text-white hover:bg-orange-400 transition-colors font-semibold mb-2 shadow-sm"
                    >
                      <span>Giriş Yap</span>
                    </Link>
                    <Link
                      to="/auth"
                      state={{ isLogin: false }}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-semibold"
                    >
                      <span>Kayıt Ol</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="px-4 pt-4 border-t border-slate-200 flex flex-col gap-4">
              {!user && (
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#F59E0B] focus:border-[#F59E0B] block p-3 cursor-pointer font-medium"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="TRY">TRY (₺)</option>
                </select>
              )}

              {user ? (
                <div className="w-full flex flex-col gap-3">
                  <div className="bg-slate-100 p-4 rounded-xl flex flex-col gap-1 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{user.fullName}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{user.email}</p>
                      </div>
                    </div>

                    <div className="mt-1 mb-2 bg-white rounded-lg p-3 flex flex-col border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Kalan Planlama Hakkınız</span>
                        <span className="text-sm font-bold text-[#F59E0B] bg-amber-100 px-2 py-0.5 rounded-md">
                          {user.role === 'ADMIN' ? '∞' : `${user.remainingQuota ?? 3} / 3`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div 
                          className="bg-[#F59E0B] h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: user.role === 'ADMIN' ? '100%' : `${((user.remainingQuota ?? 3) / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-2 pt-3 border-t border-slate-200">
                      <Link
                        to="/settings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full flex justify-center items-center gap-2 bg-slate-200/50 text-slate-700 hover:bg-slate-200 px-5 py-3 rounded-xl font-bold transition-colors cursor-pointer"
                      >
                        <SettingsIcon className="w-5 h-5" />
                        <span>Ayarlar</span>
                      </Link>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-5 py-3.5 rounded-xl font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  <Link
                    to="/auth"
                    state={{ isLogin: true }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex justify-center items-center gap-2 bg-[#1E3A8A] text-white px-5 py-3 rounded-xl font-bold shadow-sm"
                  >
                    <span>Giriş Yap</span>
                  </Link>
                  <Link
                    to="/auth"
                    state={{ isLogin: false }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex justify-center items-center gap-2 bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-bold"
                  >
                    <span>Kayıt Ol</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
