import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Compass, Map, User } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { currency, setCurrency } = useCurrency();

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

            <button className="flex items-center gap-2 border-2 cursor-pointer border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm transform hover:-translate-y-0.5">
              <User className="w-4 h-4" />
              <span>Giriş Yap</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
