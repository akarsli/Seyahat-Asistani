import React from 'react';
import { Ticket, Map as MapIcon, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TravelTips = () => {
  const { t } = useTranslation();

  const tips = [
    {
      id: 1,
      slug: 'ucuza-bilet-bulma',
      title: t('tips.cheap_tickets_title'),
      description: t('tips.cheap_tickets_desc'),
      icon: <Ticket className="w-8 h-8 text-blue-500" />,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-blue-900 to-cyan-400'
    },
    {
      id: 2,
      slug: 'gizli-kalmis-rotalar',
      title: t('tips.hidden_routes_title'),
      description: t('tips.hidden_routes_desc'),
      icon: <MapIcon className="w-8 h-8 text-indigo-500" />,
      image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 3,
      slug: 'yerel-lezzet-duraklari',
      title: t('tips.local_tastes_title'),
      description: t('tips.local_tastes_desc'),
      icon: <Utensils className="w-8 h-8 text-rose-500" />,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-rose-500 to-orange-400'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{t('tips.section_title')}</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('tips.section_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tips.map((tip) => (
            <Link key={tip.id} to={`/tips/${tip.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute top-4 left-4 z-20 bg-white p-3 rounded-2xl shadow-lg`}>
                  {tip.icon}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{tip.title}</h3>
                <p className="text-slate-600 flex-1 leading-relaxed">
                  {tip.description}
                </p>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <span className={`inline-flex items-center font-semibold text-transparent bg-clip-text bg-gradient-to-r ${tip.color} group-hover:opacity-80 transition-opacity`}>
                    {t('tips.read_more')}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelTips;
