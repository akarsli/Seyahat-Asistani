import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { Map, Calendar, ArrowRight, Loader2, Plane, LogIn, Trash2 } from 'lucide-react';

const HistoryPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { state: { isLogin: true, returnTo: '/history' } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8081/api/itinerary/history?email=${user.email}`);
      if (!response.ok) {
        throw new Error('Geçmiş planlar alınamadı.');
      }
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, planId) => {
    e.preventDefault(); // Prevent navigating to the itinerary
    if (!window.confirm('Bu planı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/itinerary/${planId}?email=${user.email}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Plan silinemedi.');
      }
      
      // Update UI
      setHistory(history.filter(plan => plan.id !== planId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
            <LogIn className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-slate-500 mb-8">
            Geçmiş planlarınızı görüntüleyebilmek için giriş yapmalısınız.
          </p>
          <Link
            to="/auth"
            state={{ isLogin: true, returnTo: '/history' }}
            className="w-full bg-[#F59E0B] hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex justify-center items-center"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 pt-28">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Geçmiş Planlarım</h1>
            <p className="text-slate-500">Daha önce yapay zeka ile oluşturduğunuz tüm seyahat rotalarınız burada saklanır.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-[#1E3A8A] mb-4" />
            <p>Planlarınız yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200 flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Map className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Henüz Bir Planınız Yok</h2>
            <p className="text-slate-500 mb-8 max-w-md">Görünüşe göre yapay zeka asistanımızla henüz bir rota oluşturmamışsınız. Hemen yeni bir macera planlamaya ne dersiniz?</p>
            <Link
              to="/itinerary"
              className="bg-[#1E3A8A] text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-900 transition-colors shadow-md flex items-center gap-2"
            >
              <Plane className="w-5 h-5" />
              İlk Planınızı Oluşturun
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden group flex flex-col">
                <div className="h-32 bg-gradient-to-r from-[#1E3A8A] to-blue-600 p-6 flex flex-col justify-end relative overflow-hidden">
                  <Map className="absolute -top-6 -right-6 w-32 h-32 text-white opacity-10 transform group-hover:scale-110 transition-transform duration-500" />
                  
                  <button 
                    onClick={(e) => handleDelete(e, plan.id)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-red-500 hover:text-white text-white/80 p-2 rounded-full backdrop-blur-sm transition-colors z-20 cursor-pointer"
                    title="Planı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <h3 className="text-xl font-bold text-white relative z-10 truncate">{plan.title || 'Seyahat Planı'}</h3>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Oluşturulma: {new Date(plan.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 font-medium mb-6">
                    <Map className="w-5 h-5 text-[#F59E0B]" />
                    <span className="truncate">{plan.destination || 'Belirtilmedi'}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <Link
                      to={`/itinerary/${plan.id}`}
                      className="flex items-center justify-between text-[#1E3A8A] font-bold hover:text-blue-700 group/btn"
                    >
                      <span>Planı İncele</span>
                      <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
