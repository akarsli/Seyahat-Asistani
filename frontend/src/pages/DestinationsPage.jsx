import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { MapPin, Star, X, Plane, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DestinationsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDest, setSelectedDest] = useState(null);

  const destinations = [
    {
      id: 1,
      name: t('destinations.paris_name', { defaultValue: 'Paris' }),
      country: t('destinations.paris_country'),
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop',
      description: t('destinations.paris_desc'),
      highlights: [t('destinations.paris_hl_1'), t('destinations.paris_hl_2'), t('destinations.paris_hl_3'), t('destinations.paris_hl_4')],
      tags: [t('destinations.paris_tag_1'), t('destinations.paris_tag_2'), t('destinations.paris_tag_3')]
    },
    {
      id: 2,
      name: t('destinations.rome_name', { defaultValue: 'Roma' }),
      country: t('destinations.rome_country'),
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop',
      description: t('destinations.rome_desc'),
      highlights: [t('destinations.rome_hl_1'), t('destinations.rome_hl_2'), t('destinations.rome_hl_3'), t('destinations.rome_hl_4')],
      tags: [t('destinations.rome_tag_1'), t('destinations.rome_tag_2'), t('destinations.rome_tag_3')]
    },
    {
      id: 3,
      name: t('destinations.bali_name', { defaultValue: 'Bali' }),
      country: t('destinations.bali_country'),
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
      description: t('destinations.bali_desc'),
      highlights: [t('destinations.bali_hl_1'), t('destinations.bali_hl_2'), t('destinations.bali_hl_3'), t('destinations.bali_hl_4')],
      tags: [t('destinations.bali_tag_1'), t('destinations.bali_tag_2'), t('destinations.bali_tag_3')]
    },
    {
      id: 4,
      name: t('destinations.tokyo_name', { defaultValue: 'Tokyo' }),
      country: t('destinations.tokyo_country'),
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop',
      description: t('destinations.tokyo_desc'),
      highlights: [t('destinations.tokyo_hl_1'), t('destinations.tokyo_hl_2'), t('destinations.tokyo_hl_3'), t('destinations.tokyo_hl_4')],
      tags: [t('destinations.tokyo_tag_1'), t('destinations.tokyo_tag_2'), t('destinations.tokyo_tag_3')]
    },
    {
      id: 5,
      name: t('destinations.cap_name', { defaultValue: 'Kapadokya' }),
      country: t('destinations.cap_country'),
      image: 'https://image.pollinations.ai/prompt/beautiful%20landscape%20cappadocia%20turkey%20hot%20air%20balloons?width=1000&height=1000&nologo=true&seed=42',
      description: t('destinations.cap_desc'),
      highlights: [t('destinations.cap_hl_1'), t('destinations.cap_hl_2'), t('destinations.cap_hl_3'), t('destinations.cap_hl_4')],
      tags: [t('destinations.cap_tag_1'), t('destinations.cap_tag_2'), t('destinations.cap_tag_3')]
    },
    {
      id: 6,
      name: t('destinations.ny_name', { defaultValue: 'New York' }),
      country: t('destinations.ny_country'),
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop',
      description: t('destinations.ny_desc'),
      highlights: [t('destinations.ny_hl_1'), t('destinations.ny_hl_2'), t('destinations.ny_hl_3'), t('destinations.ny_hl_4')],
      tags: [t('destinations.ny_tag_1'), t('destinations.ny_tag_2'), t('destinations.ny_tag_3')]
    }
  ];

  const handlePlanClick = (destinationName) => {
    navigate('/itinerary', { state: { prompt: `${destinationName} ${t('destinations.prompt_text')}` } });
  };


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      {/* Header Section */}
      <div className="pt-32 pb-16 px-6 md:px-12 xl:px-24 bg-gradient-to-br from-indigo-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {t('destinations.page_title')}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-light max-w-2xl mx-auto">
            {t('destinations.page_desc')}
          </p>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map(dest => (
            <div 
              key={dest.id}
              onClick={() => setSelectedDest(dest)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 cursor-pointer group flex flex-col h-full transform hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-blue-200 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{dest.country}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-slate-600 line-clamp-2 mb-4 flex-1">{dest.description}</p>
                <div className="flex flex-wrap gap-2">
                  {dest.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
      {selectedDest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedDest(null)}
          ></div>
          
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedDest(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="md:w-2/5 h-64 md:h-auto relative">
              <img 
                src={selectedDest.image} 
                alt={selectedDest.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 md:bg-gradient-to-r md:from-transparent md:to-slate-900/90"></div>
            </div>
            
            <div className="md:w-3/5 p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                  <MapPin className="w-5 h-5" />
                  {selectedDest.country}
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-4">{selectedDest.name}</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {selectedDest.description}
                </p>
                
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" /> {t('destinations.highlights')}
                </h4>
                <ul className="space-y-2 mb-8">
                  {selectedDest.highlights.map(hl => (
                    <li key={hl} className="flex items-center gap-2 text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      {hl}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => handlePlanClick(selectedDest.name)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-200"
              >
                <Plane className="w-5 h-5" />
                {selectedDest.name} {t('destinations.create_plan')}
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
