import React, { useState, useEffect } from 'react';
import { CloudSun, Wallet, Activity, MapPin, Sparkles, Clock, Plane, Train, Bus, TrainFront, ArrowRight, Ticket, Loader2, Search, X } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from 'react-i18next';

const DESTINATION_IMAGES = {
  // Türkiye
  'istanbul': 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2098&auto=format&fit=crop',
  'antalya': 'https://images.unsplash.com/photo-1542052125323-e69ad37a47c2?q=80&w=2070&auto=format&fit=crop',
  'ankara': 'https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?q=80&w=2000&auto=format&fit=crop',
  'izmir': 'https://images.unsplash.com/photo-1580126588267-339247ce18e0?q=80&w=2000&auto=format&fit=crop',
  'türkiye': 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2098&auto=format&fit=crop',
  'turkey': 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2098&auto=format&fit=crop',
  
  // Avrupa
  'roma': 'https://images.unsplash.com/photo-1515542622106-78b28af7815b?q=80&w=2070&auto=format&fit=crop',
  'italya': 'https://images.unsplash.com/photo-1515542622106-78b28af7815b?q=80&w=2070&auto=format&fit=crop',
  'italy': 'https://images.unsplash.com/photo-1515542622106-78b28af7815b?q=80&w=2070&auto=format&fit=crop',
  'paris': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop',
  'fransa': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop',
  'france': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop',
  'londra': 'https://images.unsplash.com/photo-1513635269975-59693e0cd156?q=80&w=2070&auto=format&fit=crop',
  'ingiltere': 'https://images.unsplash.com/photo-1513635269975-59693e0cd156?q=80&w=2070&auto=format&fit=crop',
  'london': 'https://images.unsplash.com/photo-1513635269975-59693e0cd156?q=80&w=2070&auto=format&fit=crop',
  'berlin': 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
  'almanya': 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
  'barcelona': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
  'madrid': 'https://images.unsplash.com/photo-1539037116277-4db206753086?q=80&w=2000&auto=format&fit=crop',
  'ispanya': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
  'amsterdam': 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=2070&auto=format&fit=crop',
  'hollanda': 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=2070&auto=format&fit=crop',
  'prag': 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=2000&auto=format&fit=crop',
  'viyana': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=2000&auto=format&fit=crop',

  // Amerika
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop',
  'amerika': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop',
  'los angeles': 'https://images.unsplash.com/photo-1515896769740-96f6510cb061?q=80&w=2000&auto=format&fit=crop',

  // Asya & Diğer
  'tokyo': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
  'japonya': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop',
  'mısır': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?q=80&w=2000&auto=format&fit=crop',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop',
  'yunanistan': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop',
  'atina': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop',
};

const getDestinationImage = (destination) => {
  if (!destination) return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
  
  const query = destination.toLowerCase().trim();
  
  // Exact match
  if (DESTINATION_IMAGES[query]) return DESTINATION_IMAGES[query];
  
  // Partial match
  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (query.includes(key)) {
      return url;
    }
  }
  
  // Default fallback beautiful travel image
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
};

const ItineraryDetails = ({ data }) => {
  const { t } = useTranslation();
  const { convertPriceText } = useCurrency();
  
  const [liveFlights, setLiveFlights] = useState({});
  const [loadingFlights, setLoadingFlights] = useState({});
  const [errorFlights, setErrorFlights] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchLiveFlights = async (depIata, arrIata, force = false) => {
    const routeKey = `${depIata}-${arrIata}`;
    if (liveFlights[routeKey] && !force) {
      return;
    }
    
    setLoadingFlights(prev => ({...prev, [routeKey]: true}));
    setErrorFlights(prev => ({...prev, [routeKey]: null}));
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2); // Search 2 days ahead to ensure full day availability
      const searchDate = tomorrow.toISOString().split('T')[0];
      const response = await fetch(`http://localhost:8081/api/flights?dep_iata=${depIata}&arr_iata=${arrIata}&date=${searchDate}`);
      if (!response.ok) throw new Error(t('itinerary_details.fetch_live_error'));
      const data = await response.json();
      // Sort by price ascending and take top 5
      const sortedData = data.sort((a, b) => a.price - b.price).slice(0, 5);
      setLiveFlights(prev => ({...prev, [routeKey]: sortedData}));
    } catch (err) {
      setErrorFlights(prev => ({...prev, [routeKey]: err.message}));
    } finally {
      setLoadingFlights(prev => ({...prev, [routeKey]: false}));
    }
  };

  useEffect(() => {
    if (data && data.transportOptions) {
      data.transportOptions.forEach(ticket => {
        if (ticket.type === 'Plane' && ticket.departureIata && ticket.arrivalIata) {
          fetchLiveFlights(ticket.departureIata, ticket.arrivalIata);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const openTicketModal = (ticket, dayNumber, tIdx) => {
    const routeKey = ticket.departureIata && ticket.arrivalIata ? `${ticket.departureIata}-${ticket.arrivalIata}` : null;
    setSelectedTicket({ ...ticket, routeKey, dayNumber, tIdx });
    setShowModal(true);
    
    if (ticket.type === 'Plane' && ticket.departureIata && ticket.arrivalIata) {
      fetchLiveFlights(ticket.departureIata, ticket.arrivalIata);
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
          src={getDestinationImage(data.destination || 'City')}
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
              {data.durationDays} {t('itinerary_details.days')}
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
              <p className="text-sm text-slate-500 font-medium">{t('itinerary_details.weather')}</p>
              <p className="text-lg font-bold text-slate-800">{data.weather || t('itinerary_details.weather_unknown')}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{t('itinerary_details.estimated_budget')}</p>
              <p className="text-lg font-bold text-slate-800">{convertPriceText(data.estimatedBudget)}</p>
            </div>
          </div>
        </div>

        {/* Itinerary Timeline */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-800">{t('itinerary_details.day_by_day_title')}</h2>

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

                      const routeKey = ticket.departureIata && ticket.arrivalIata ? `${ticket.departureIata}-${ticket.arrivalIata}` : null;
                      const realFlight = routeKey && liveFlights[routeKey] && liveFlights[routeKey].length > 0 ? liveFlights[routeKey][0] : null;

                      const displayProvider = realFlight ? realFlight.airline : ticket.provider;
                      const displayFlightNo = realFlight ? realFlight.flightNumber : ticket.flightNumber;
                      const displayDepTime = realFlight ? formatFlightTime(realFlight.departureTime) : (ticket.departure && ticket.departure.includes('-') ? ticket.departure.split('-')[1].trim() : '');
                      const displayArrTime = realFlight ? formatFlightTime(realFlight.arrivalTime) : (ticket.arrival && ticket.arrival.includes('-') ? ticket.arrival.split('-')[1].trim() : '');
                      const displayDepCity = ticket.departure ? ticket.departure.split('-')[0].trim() : '-';
                      const displayArrCity = ticket.arrival ? ticket.arrival.split('-')[0].trim() : '-';
                      const displayPrice = realFlight && realFlight.price ? `$${realFlight.price}` : ticket.price;

                      return (
                        <div 
                          key={tIdx} 
                          onClick={() => openTicketModal(ticket, dayNumber, tIdx)}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all relative group"
                        >
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {realFlight && <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1"><Sparkles className="w-3 h-3"/> {t('itinerary_details.live_data')}</span>}
                            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">{t('itinerary_details.view_details')}</span>
                          </div>
                          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 overflow-hidden relative group-logo`}>
                                <img
                                  src={`https://logo.clearbit.com/${(displayProvider || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`}
                                  alt={displayProvider || 'Provider'}
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
                                <span className="font-bold text-slate-800">{displayProvider}</span>
                                {displayFlightNo && <span className="text-sm font-semibold text-slate-400">{displayFlightNo}</span>}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1">
                              {realFlight && realFlight.price && <Sparkles className="w-3 h-3 text-green-500" />}
                              {convertPriceText(displayPrice)}
                            </span>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between relative">
                            {/* Ticket Cutout Effects */}
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-200"></div>
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-200"></div>

                            <div className="flex items-center justify-between mb-4 px-4">
                              <div className="text-center">
                                <p className="text-xs text-slate-500 font-medium mb-1">{t('itinerary_details.departure')}</p>
                                <p className="font-bold text-slate-800 truncate max-w-[100px]">{displayDepCity}</p>
                                <p className="text-sm text-slate-500 font-bold">{displayDepTime}</p>
                              </div>
                              <div className="flex flex-col items-center px-2 flex-1">
                                <p className="text-xs text-slate-400 font-medium mb-1">{ticket.duration}</p>
                                <div className="w-full flex items-center gap-1 text-slate-300">
                                  <div className="h-[2px] flex-1 border-t-2 border-dashed border-slate-300"></div>
                                  
                                  {realFlight && realFlight.hasLayovers ? (
                                    <div className="flex flex-col items-center text-slate-500 px-1 mt-1">
                                      <p className="text-[10px] font-bold text-green-600 uppercase leading-none">{realFlight.layoverCount} {t('itinerary_details.layover')}</p>
                                      <p className="text-[9px] font-medium whitespace-nowrap mt-0.5 text-slate-400 truncate max-w-[60px]" title={realFlight.layoverAirports}>{realFlight.layoverAirports}</p>
                                    </div>
                                  ) : ticket.layoverCity && !realFlight ? (
                                    <div className="flex flex-col items-center text-slate-500 px-1 mt-1">
                                      <p className="text-[10px] font-bold text-orange-500 uppercase leading-none">{ticket.layoverCity}</p>
                                      <p className="text-[9px] whitespace-nowrap mt-0.5">{ticket.layoverDuration} {t('itinerary_details.layover_wait')}</p>
                                    </div>
                                  ) : (
                                    <TransportIcon className={`w-4 h-4 ${realFlight ? 'text-green-500' : 'text-slate-400'}`} />
                                  )}

                                  <div className="h-[2px] flex-1 border-t-2 border-dashed border-slate-300"></div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-slate-500 font-medium mb-1">{t('itinerary_details.arrival')}</p>
                                <p className="font-bold text-slate-800 truncate max-w-[100px]">{displayArrCity}</p>
                                <p className="text-sm text-slate-500 font-bold">{displayArrTime}</p>
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
                      {renderTickets(topTickets, t('itinerary_details.transport_title'), day.dayNumber)}

                      {/* Day Itinerary */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                          <h3 className="text-lg font-bold text-slate-800">{t('itinerary_details.day_title', { dayNumber: day.dayNumber, dayTitle: day.dayTitle })}</h3>
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
                                        <Sparkles className="w-3 h-3" /> {t('itinerary_details.ai_suggestion')}
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
                          {renderTickets(bottomTickets, t('itinerary_details.return_transport_title'))}
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
                <Ticket className="w-5 h-5 text-indigo-600" /> {t('itinerary_details.ticket_details')}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Header Ticket (Shows Real Flight if available, else AI Suggestion) */}
              {(() => {
                const modalRouteKey = selectedTicket.routeKey;
                const modalRealFlight = modalRouteKey && liveFlights[modalRouteKey] && liveFlights[modalRouteKey].length > 0 ? liveFlights[modalRouteKey][0] : null;

                const displayProvider = modalRealFlight ? modalRealFlight.airline : selectedTicket.provider;
                const displayFlightNo = modalRealFlight ? modalRealFlight.flightNumber : selectedTicket.flightNumber;
                const displayDepTime = modalRealFlight ? formatFlightTime(modalRealFlight.departureTime) : (selectedTicket.departure && selectedTicket.departure.includes('-') ? selectedTicket.departure.split('-')[1].trim() : '');
                const displayArrTime = modalRealFlight ? formatFlightTime(modalRealFlight.arrivalTime) : (selectedTicket.arrival && selectedTicket.arrival.includes('-') ? selectedTicket.arrival.split('-')[1].trim() : '');
                const displayDepCity = selectedTicket.departure ? selectedTicket.departure.split('-')[0].trim() : '-';
                const displayArrCity = selectedTicket.arrival ? selectedTicket.arrival.split('-')[0].trim() : '-';
                const displayPrice = modalRealFlight && modalRealFlight.price ? `$${modalRealFlight.price}` : selectedTicket.price;

                return (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">
                          {modalRealFlight ? t('itinerary_details.live_data') : (selectedTicket.type === 'Plane' ? t('itinerary_details.recommended_flight') : t('itinerary_details.recommended_ticket'))}
                        </p>
                        <div className="flex items-baseline gap-3">
                          <p className="font-extrabold text-2xl text-slate-800">{displayProvider}</p>
                          {displayFlightNo && <p className="font-bold text-lg text-slate-400">{displayFlightNo}</p>}
                        </div>
                      </div>
                      <span className="font-bold text-indigo-700 bg-indigo-100 px-4 py-1.5 rounded-full shadow-sm">
                        {convertPriceText(displayPrice)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                       <div>
                         <p className="text-xs font-semibold text-slate-400 uppercase mb-1">{t('itinerary_details.departure')}</p>
                         <p className="font-bold text-slate-800 text-lg">{displayDepCity}</p>
                         <p className="text-slate-500">{displayDepTime}</p>
                       </div>
                       <div>
                         <p className="text-xs font-semibold text-slate-400 uppercase mb-1">{t('itinerary_details.arrival')}</p>
                         <p className="font-bold text-slate-800 text-lg">{displayArrCity}</p>
                         <p className="text-slate-500">{displayArrTime}</p>
                       </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-4 text-sm font-medium">
                       <div className="flex items-center gap-1.5 text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                         <Clock className="w-4 h-4 text-slate-400"/> {selectedTicket.duration}
                       </div>
                       {modalRealFlight && modalRealFlight.hasLayovers ? (
                         <div className="flex items-center gap-1.5 text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                           <MapPin className="w-4 h-4 text-orange-500"/> {modalRealFlight.layoverCount} {t('itinerary_details.layover')}: {modalRealFlight.layoverAirports}
                         </div>
                       ) : selectedTicket.layoverCity && !modalRealFlight ? (
                         <div className="flex items-center gap-1.5 text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                           <MapPin className="w-4 h-4 text-orange-500"/> {t('itinerary_details.layover')}: {selectedTicket.layoverCity} ({selectedTicket.layoverDuration})
                         </div>
                       ) : null}
                    </div>
                  </div>
                );
              })()}

              {/* Live Flights List */}
              {selectedTicket.type === 'Plane' && selectedTicket.departureIata && selectedTicket.arrivalIata && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-500" /> {t('itinerary_details.alt_live_flights')}
                  </h4>
                  
                  {loadingFlights[selectedTicket.routeKey] ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                      <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
                      <p className="font-medium">{t('itinerary_details.loading_flights')}</p>
                    </div>
                  ) : errorFlights[selectedTicket.routeKey] ? (
                    <div className="bg-red-50 p-5 rounded-2xl text-red-600 text-sm text-center border border-red-100">
                      {errorFlights[selectedTicket.routeKey]}
                    </div>
                  ) : liveFlights[selectedTicket.routeKey] && liveFlights[selectedTicket.routeKey].length > 0 ? (
                    <div className="space-y-3">
                      {liveFlights[selectedTicket.routeKey].map((lf, lfIdx) => (
                        <div key={lfIdx} className={`bg-white border p-4 rounded-xl shadow-sm flex items-center justify-between hover:border-indigo-300 transition-colors group ${lfIdx === 0 ? 'border-green-300 bg-green-50/30' : 'border-slate-200'}`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {lf.airline ? lf.airline.substring(0,2).toUpperCase() : 'FL'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm mb-0.5">{lf.airline} {lf.flightNumber}</p>
                              <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 uppercase tracking-wider">
                                <Plane className="w-3 h-3" /> {t('itinerary_details.live_data')} {lfIdx === 0 && ` ${t('itinerary_details.recommended')}`}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-5 text-center items-center">
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('itinerary_details.departure')}</p>
                              <p className="font-bold text-slate-800 text-base">{formatFlightTime(lf.departureTime)}</p>
                            </div>
                            {lf.hasLayovers ? (
                              <div className="flex flex-col items-center justify-center px-3">
                                <p className="text-[9px] font-bold text-green-600 uppercase mb-0.5">{lf.layoverCount} {t('itinerary_details.layover')}</p>
                                <div className="w-12 h-px bg-slate-300 relative">
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                </div>
                                <p className="text-[8px] text-slate-400 mt-0.5 max-w-[60px] truncate" title={lf.layoverAirports}>{lf.layoverAirports}</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center px-3">
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">{t('itinerary_details.direct')}</p>
                                <div className="w-12 h-px bg-slate-300"></div>
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('itinerary_details.arrival')}</p>
                              <p className="font-bold text-slate-800 text-base">{formatFlightTime(lf.arrivalTime)}</p>
                            </div>
                            {lf.price > 0 && (
                              <div className="ml-4 pl-4 border-l border-slate-200">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('itinerary_details.price')}</p>
                                <p className="font-bold text-indigo-600 text-base">{convertPriceText(`$${lf.price}`)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-6 rounded-2xl text-slate-500 text-sm text-center border border-slate-200 border-dashed">
                      {t('itinerary_details.no_live_flights')}
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
