import React from 'react';
import { CloudSun, Wallet, Activity, MapPin, Sparkles, Clock } from 'lucide-react';

const ItineraryDetails = ({ data }) => {
  if (!data) return null;

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      {/* Banner */}
      <div className="relative h-64 w-full">
        <img 
          src={`https://loremflickr.com/1600/900/${encodeURIComponent(data.destination.split(',')[0].trim())},landscape/all`} 
          alt={data.destination} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {data.destination}
            </span>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
              {data.durationDays} Days
            </span>
          </div>
          <h1 className="text-4xl font-bold">{data.title}</h1>
          <p className="text-slate-200 mt-2 font-light">{data.description}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Hava Durumu</p>
              <p className="text-lg font-bold text-slate-800">{data.weather || 'Bilinmiyor'}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Tahmini Bütçe</p>
              <p className="text-lg font-bold text-slate-800">{data.estimatedBudget}</p>
            </div>
          </div>
        </div>

        {/* Interactive Map Placeholder */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="h-64 bg-slate-200 relative flex items-center justify-center">
            <MapPin className="w-12 h-12 text-slate-400 opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-lg font-medium text-slate-600 shadow-sm border border-slate-200">
                 Interactive Map Loading...
               </span>
            </div>
          </div>
        </div>

        {/* Itinerary Timeline */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Gün Gün Rota</h2>
          
          {data.dailyPlans && data.dailyPlans.map((day, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">{day.dayNumber}. Gün: {day.dayTitle}</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {day.activities && day.activities.map((act, actIdx) => (
                  <div key={actIdx} className="relative pl-6 border-l-2 border-slate-200 pb-2 last:pb-0">
                    <div className={`absolute w-4 h-4 rounded-full border-4 border-white -left-[9px] top-1 ${act.isAiSuggestion || act.aiSuggestion ? 'bg-indigo-500' : 'bg-blue-900'}`}></div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className={`text-sm font-semibold ${act.isAiSuggestion || act.aiSuggestion ? 'text-blue-900' : 'text-blue-900'}`}>
                            {act.time}
                          </span>
                          {(act.isAiSuggestion || act.aiSuggestion) && (
                            <span className="ml-2 bg-indigo-50 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-indigo-100">
                              <Sparkles className="w-3 h-3" /> AI Önerisi
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">{act.title}</h4>
                        <p className="text-slate-600 mt-1 text-sm">{act.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
        </div>

      </div>
    </div>
  );
};

export default ItineraryDetails;
