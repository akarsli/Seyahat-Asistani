import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ItineraryDetails from '../components/itinerary/ItineraryDetails';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ViewItineraryPage = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { state: { isLogin: true, returnTo: `/itinerary/${id}` } });
    }
  }, [user, authLoading, navigate, id]);

  useEffect(() => {
    if (user && id) {
      fetchPlanDetails();
    }
  }, [user, id]);

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8081/api/itinerary/${id}`);
      if (!response.ok) {
        throw new Error('Plan bulunamadı veya bir hata oluştu.');
      }
      const rawData = await response.json();
      setData(rawData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (!user && loading)) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto w-full mb-6">
         <button 
           onClick={() => navigate('/history')}
           className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 cursor-pointer"
         >
           <ArrowLeft className="w-5 h-5" />
           Geçmiş Planlara Dön
         </button>
      </div>

      <div className="flex-1 w-full relative overflow-y-auto max-w-7xl mx-auto pb-12 shadow-xl bg-white rounded-t-3xl border border-slate-200">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center p-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#1E3A8A] mb-4" />
            <p className="text-slate-500 font-medium text-lg">Plan detayları yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center p-20 text-center">
             <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md w-full border border-red-200">
               <h2 className="text-xl font-bold mb-2">Hata Oluştu</h2>
               <p>{error}</p>
             </div>
          </div>
        ) : data ? (
          <ItineraryDetails data={data} />
        ) : null}
      </div>
    </div>
  );
};

export default ViewItineraryPage;
