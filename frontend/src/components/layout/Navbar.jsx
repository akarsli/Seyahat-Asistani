import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plane, Compass, Map, User, Menu, X, LogOut } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { currency, setCurrency } = useCurrency();
  const { user, logout } = useAuth();

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
          <div className="hidden md:flex items-center gap-4">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-none border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#F59E0B] focus:border-[#F59E0B] block p-2 cursor-pointer font-medium"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="TRY">TRY (₺)</option>
            </select>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-700 hidden lg:block">
                  Merhaba, {user.fullName.split(' ')[0]}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                to="/auth"
                className="flex items-center gap-2 border-2 cursor-pointer border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm transform hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                <span>Giriş Yap / Kayıt Ol</span>
              </Link>
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="px-4 pt-4 border-t border-slate-200 flex flex-col gap-4">
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

              {user ? (
                <div className="w-full flex flex-col gap-3">
                  <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-center gap-2 text-slate-700 font-semibold">
                    <User className="w-5 h-5 text-slate-500" />
                    Merhaba, {user.fullName}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-5 py-3 rounded-xl font-bold transition-colors shadow-sm"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex justify-center items-center gap-2 bg-[#1E3A8A] text-white px-5 py-3 rounded-xl font-bold shadow-sm"
                >
                  <User className="w-5 h-5" />
                  <span>Giriş Yap / Kayıt Ol</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
