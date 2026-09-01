import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import TravelTips from '../components/home/TravelTips';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <TravelTips />
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} HolidayTrip. {t('home.footer_rights')}</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
