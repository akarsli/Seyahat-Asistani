import React, { useState } from 'react';
import { CloudSun, Wallet, Activity, MapPin, Sparkles, Clock, Plane, Train, Bus, TrainFront, ArrowRight, Ticket, Loader2, Search, X } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const ItineraryDetails = ({ data }) => {
  const { convertPriceText } = useCurrency();
  
  const [liveFlights, setLiveFlights] = useState({});
  const [loadingFlights, setLoadingFlights] = useState({});
  const [errorFlights, setErrorFlights] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openTicketModal = (ticket, dayNumber, tIdx) => {
    const uniqueKey = `${dayNumber}-${tIdx}-${ticket.departureIata}`;
    setSelectedTicket({ ...ticket, uniqueKey, dayNumber, tIdx });
    setShowModal(true);
    
    if (ticket.type === 'Plane' && ticket.departureIata && ticket.arrivalIata) {
      fetchLiveFlights(uniqueKey, ticket.departureIata, ticket.arrivalIata, true);
    }
  };

  const fetchLiveFlights = async (uniqueKey, depIata, arrIata, force = false) => {
    if (liveFlights[uniqueKey] && !force) {
      return;
    }
    
    setLoadingFlights(prev => ({...prev, [uniqueKey]: true}));
    setErrorFlights(prev => ({...prev, [uniqueKey]: null}));
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`http://localhost:8081/api/flights?dep_iata=${depIata}&arr_iata=${arrIata}&date=${today}`);
      if (!response.ok) throw new Error("Canlı veriler alınamadı.");
      const data = await response.json();
      setLiveFlights(prev => ({...prev, [uniqueKey]: data.slice(0, 3)})); // Show top 3
    } catch (err) {
      setErrorFlights(prev => ({...prev, [uniqueKey]: err.message}));
    } finally {
      setLoadingFlights(prev => ({...prev, [uniqueKey]: false}));
    }
  };

  const formatFlightTime = (timeStr) => {
    if (!timeStr) return '-';
    // Handle formats like "2024-10-15 08:30" or "2024-10-15T08:30:00"
    try {
      if (timeStr.includes(' ')) return timeStr.split(' ')[1].substring(0, 5);
      if (timeStr.includes('T')) return timeStr.split('T')[1].substring(0, 5);
      return timeStr;
    } catch (e) {
      return timeStr;
    }
  };

  if (!data) return null;

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      {/* Banner */}
      <div className="relative h-64 w-full bg-slate-200">
        <img
          src={`https://image.pollinations.ai/prompt/beautiful%20landmark%20cityscape%20of%20${encodeURIComponent((data.destination || 'City').split(',')[0].trim())}?width=1600&height=900&nologo=true&seed=42`}
          alt={data.destination || 'Destination'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {data.destination}
            </span>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
              {data.durationDays} Gün
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
              <p className="text-lg font-bold text-slate-800">{convertPriceText(data.estimatedBudget)}</p>
            </div>
          </div>
        </div>

        {/* Itinerary Timeline */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-800">Gün Gün Rota</h2>

          {(() => {
            // Reusable component for rendering ticket cards
            const renderTickets = (tickets, title, dayNumber = null) => {
              if (!tickets || tickets.length === 0) return null;

              const displayTitle = dayNumber ? `${title} (${dayNumber}. Gün)` : title;

              return (
                <div className="mb-6 space-y-4">
                  <h3 className="text-lg font-bold text-indigo-600 flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    {displayTitle}
                  </h3>
                  <div className={`grid grid-cols-1 ${tickets.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
                    {tickets.map((ticket, tIdx) => {
                      let TransportIcon = Plane;
                      let bgClass = "bg-blue-50 text-blue-600";

                      if (ticket.type === 'Train') {
                        TransportIcon = Train;
                        bgClass = "bg-emerald-50 text-emerald-600";
                      } else if (ticket.type === 'Bus') {
                        TransportIcon = Bus;
                        bgClass = "bg-amber-50 text-amber-600";
                      } else if (ticket.type === 'Subway') {
                        TransportIcon = TrainFront;
                        bgClass = "bg-fuchsia-50 text-fuchsia-600";
                      }

                      return (
                        <div 
                          key={tIdx} 
                          onClick={() => openTicketModal(ticket, dayNumber, tIdx)}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all relative group"
                        >
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">Detayları Gör</span>
                          </div>
                          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 overflow-hidden relative group-logo`}>
                                <img
                                  src={`https://logo.clearbit.com/${(ticket.provider || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`}
                                  alt={ticket.provider || 'Provider'}
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="w-full h-full items-center justify-center hidden fallback-icon" style={{ display: 'none' }}>
                                  <TransportIcon className={`w-5 h-5 ${bgClass.split(' ')[1]}`} />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">{ticket.provider}</span>
                                {ticket.flightNumber && <span className="text-sm font-semibold text-slate-400">{ticket.flightNumber}</span>}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                              {convertPriceText(ticket.price)}
                            </span>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between relative">
                            {/* Ticket Cutout Effects */}
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-200"></div>
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-200"></div>

                            <div className="flex items-center justify-between mb-4 px-4">
                              <div className="text-center">
                                <p className="text-xs text-slate-500 font-medium mb-1">Kalkış</p>
                                <p className="font-bold text-slate-800 truncate max-w-[100px]">{ticket.departure ? ticket.departure.split('-')[0].trim() : '-'}</p>
                                <p className="text-sm text-slate-500">{ticket.departure && ticket.departure.includes('-') ? ticket.departure.split('-')[1].trim() : ''}</p>
                              </div>
                              <div className="flex flex-col items-center px-2 flex-1">
                                <p className="text-xs text-slate-400 font-medium mb-1">{ticket.duration}</p>
                                <div className="w-full flex items-center gap-1 text-slate-300">
                                  <div className="h-[2px] flex-1 border-t-2 border-dashed border-slate-300"></div>
                                  
                                  {ticket.layoverCity ? (
                                    <div className="flex flex-col items-center text-slate-500 px-1 mt-1">
                                      <p className="text-[10px] font-bold text-orange-500 uppercase leading-none">{ticket.layoverCity}</p>
                                      <p className="text-[9px] whitespace-nowrap mt-0.5">{ticket.layoverDuration} Bekleme</p>
                                    </div>
                                  ) : (
                                    <TransportIcon className="w-4 h-4 text-slate-400" />
                                  )}

                                  <div className="h-[2px] flex-1 border-t-2 border-dashed border-slate-300"></div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-slate-500 font-medium mb-1">Varış</p>
                                <p className="font-bold text-slate-800 truncate max-w-[100px]">{ticket.arrival ? ticket.arrival.split('-')[0].trim() : '-'}</p>
                                <p className="text-sm text-slate-500">{ticket.arrival && ticket.arrival.includes('-') ? ticket.arrival.split('-')[1].trim() : ''}</p>
                              </div>
                            </div>

                            {ticket.description && (
                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center">
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-500" />
                                  {ticket.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            };

            return (
              <>
                {data.dailyPlans && data.dailyPlans.map((day, idx) => {
                  const isLastDay = idx === data.dailyPlans.length - 1;
                  const dayTickets = data.transportOptions ? data.transportOptions.filter(t => t.targetDayNumber === day.dayNumber) : [];

                  // Gidiş ve ara transfer biletleri (Son gün hariç ve dönüş bileti olmayanlar üstte)
                  const topTickets = dayTickets.filter(t => !isLastDay && !t.isReturnTicket);
                  // Dönüş ve son gün biletleri (Planın altında gösterilecek)
                  const bottomTickets = dayTickets.filter(t => isLastDay || t.isReturnTicket);

                  return (
                    <div key={idx} className="space-y-4">

                      {/* Render Arrival/Transfer Tickets for this day (at the top) */}
                      {renderTickets(topTickets, "Ulaşım", day.dayNumber)}

                      {/* Day Itinerary */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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

                      {/* Render Return/Last Day Tickets at the bottom of the day */}
                      {bottomTickets.length > 0 && (
                        <div className="pt-4">
                          {renderTickets(bottomTickets, "Dönüş Yolculuğu (Eve Dönüş)")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            );
          })()}

        </div>

      </div>

      {/* Ticket Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/90 backdrop-blur-md p-5 flex justify-between items-center border-b border-slate-100 z-10 rounded-t-3xl">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-600" /> Bilet Detayları
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* AI Suggested Ticket */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{selectedTicket.type === 'Plane' ? 'Önerilen Uçuş' : 'Önerilen Bilet'}</p>
                    <div className="flex items-baseline gap-3">
                      <p className="font-extrabold text-2xl text-slate-800">{selectedTicket.provider}</p>
                      {selectedTicket.flightNumber && <p className="font-bold text-lg text-slate-400">{selectedTicket.flightNumber}</p>}
                    </div>
                  </div>
                  <span className="font-bold text-indigo-700 bg-indigo-100 px-4 py-1.5 rounded-full shadow-sm">{convertPriceText(selectedTicket.price)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                   <div>
                     <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Kalkış</p>
                     <p className="font-bold text-slate-800 text-lg">{selectedTicket.departure ? selectedTicket.departure.split('-')[0].trim() : '-'}</p>
                     <p className="text-slate-500">{selectedTicket.departure && selectedTicket.departure.includes('-') ? selectedTicket.departure.split('-')[1].trim() : ''}</p>
                   </div>
                   <div>
                     <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Varış</p>
                     <p className="font-bold text-slate-800 text-lg">{selectedTicket.arrival ? selectedTicket.arrival.split('-')[0].trim() : '-'}</p>
                     <p className="text-slate-500">{selectedTicket.arrival && selectedTicket.arrival.includes('-') ? selectedTicket.arrival.split('-')[1].trim() : ''}</p>
                   </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-4 text-sm font-medium">
                   <div className="flex items-center gap-1.5 text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                     <Clock className="w-4 h-4 text-slate-400"/> {selectedTicket.duration}
                   </div>
                   {selectedTicket.layoverCity && (
                     <div className="flex items-center gap-1.5 text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                       <MapPin className="w-4 h-4 text-orange-500"/> Aktarma: {selectedTicket.layoverCity} ({selectedTicket.layoverDuration})
                     </div>
                   )}
                </div>
              </div>

              {/* Live Flights List */}
              {selectedTicket.type === 'Plane' && selectedTicket.departureIata && selectedTicket.arrivalIata && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-500" /> Alternatif Canlı Uçuşlar (Bugün)
                  </h4>
                  
                  {loadingFlights[selectedTicket.uniqueKey] ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                      <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
                      <p className="font-medium">Canlı uçuşlar AirLabs'tan getiriliyor...</p>
                    </div>
                  ) : errorFlights[selectedTicket.uniqueKey] ? (
                    <div className="bg-red-50 p-5 rounded-2xl text-red-600 text-sm text-center border border-red-100">
                      {errorFlights[selectedTicket.uniqueKey]}
                    </div>
                  ) : liveFlights[selectedTicket.uniqueKey] && liveFlights[selectedTicket.uniqueKey].length > 0 ? (
                    <div className="space-y-3">
                      {liveFlights[selectedTicket.uniqueKey].map((lf, lfIdx) => (
                        <div key={lfIdx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between hover:border-indigo-300 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {lf.airline_iata}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm mb-0.5">{lf.airline_iata} {lf.flight_number}</p>
                              <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 uppercase tracking-wider">
                                <Plane className="w-3 h-3" /> Canlı Veri
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-5 text-center items-center">
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Kalkış</p>
                              <p className="font-bold text-slate-800 text-base">{formatFlightTime(lf.dep_time)}</p>
                            </div>
                            <div className="w-6 h-px bg-slate-300"></div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Varış</p>
                              <p className="font-bold text-slate-800 text-base">{formatFlightTime(lf.arr_time)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-6 rounded-2xl text-slate-500 text-sm text-center border border-slate-200 border-dashed">
                      Bu rota için bugün canlı uçuş bulunamadı.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryDetails;
