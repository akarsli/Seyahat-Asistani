import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Map, LogOut, Loader2, ArrowLeft, TrendingUp, CheckCircle2, Activity, Calendar, Zap, DollarSign, Search, Trophy } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [selectedUserForQuota, setSelectedUserForQuota] = useState(null);
  const [newQuotaValue, setNewQuotaValue] = useState('');
  const [updatingQuota, setUpdatingQuota] = useState(false);
  
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [chartFilter, setChartFilter] = useState('all'); // 'all', 'plans', 'users'

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'ADMIN') {
        navigate('/'); // Redirect non-admins to home
      } else {
        fetchAllData();
      }
    }
  }, [user, authLoading, navigate]);

  const fetchAllData = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, plansRes] = await Promise.all([
        fetch(`http://localhost:8081/api/admin/stats?email=${user.email}`),
        fetch(`http://localhost:8081/api/admin/users?email=${user.email}`),
        fetch(`http://localhost:8081/api/admin/plans?email=${user.email}`)
      ]);

      if (!statsRes.ok || !usersRes.ok || !plansRes.ok) throw new Error('Veriler çekilirken hata oluştu.');

      setStats(await statsRes.json());
      
      const usersData = await usersRes.json();
      setUsers(usersData);
      setPlans(await plansRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setDataLoading(false);
    }
  };

  const openQuotaModal = (user) => {
    setSelectedUserForQuota(user);
    setNewQuotaValue(user.remainingQuota);
    setIsQuotaModalOpen(true);
  };

  const closeQuotaModal = () => {
    setIsQuotaModalOpen(false);
    setSelectedUserForQuota(null);
    setNewQuotaValue('');
  };

  const handleUpdateQuota = async () => {
    if (!selectedUserForQuota || newQuotaValue === '') return;

    setUpdatingQuota(true);
    try {
      const response = await fetch(`http://localhost:8081/api/admin/users/${selectedUserForQuota.id}/quota?email=${user.email}&newQuota=${newQuotaValue}`, {
        method: 'PUT'
      });
      
      if (!response.ok) throw new Error('Kota güncellenemedi.');
      
      // Update local state
      setUsers(users.map(u => u.id === selectedUserForQuota.id ? { ...u, remainingQuota: parseInt(newQuotaValue) } : u));
      closeQuotaModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingQuota(false);
    }
  };

  if (authLoading || (!user && dataLoading)) return null;

  const StatCard = ({ title, value, icon, color, subtext, subtextColor }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${color}-100 text-${color}-600 flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
      {subtext && (
        <div className={`mt-4 pt-3 border-t border-slate-50 text-sm font-bold text-${subtextColor || 'slate-500'}`}>
          {subtext}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 relative z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <LayoutDashboard className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Yönetim Paneli</h1>
          </div>
          <p className="text-xs text-slate-400 font-medium">HolidayTrip Admin Console</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Activity className="w-5 h-5" />
            Genel Bakış
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Users className="w-5 h-5" />
            Kullanıcılar
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'plans' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Map className="w-5 h-5" />
            Üretilen Rotalar
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Siteye Dön
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative z-10 overflow-y-auto max-h-screen">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {activeTab === 'dashboard' && 'Genel İstatistikler'}
              {activeTab === 'users' && 'Kullanıcı Yönetimi'}
              {activeTab === 'plans' && 'Platformdaki Rotalar'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
               <p className="text-xs text-slate-500 font-medium">Sistem Yöneticisi</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
               {user.fullName.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        <main className="p-8">
          {dataLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-indigo-600">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-semibold text-slate-500">Veriler Yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center font-medium">
              {error}
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && stats && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    <StatCard title="Toplam Kullanıcı" value={stats.totalUsers} icon={<Users className="w-7 h-7" />} color="blue" />
                    <StatCard title="Üretilen Rotalar" value={stats.totalPlans} icon={<Map className="w-7 h-7" />} color="amber" />
                    <StatCard title="Bugün Yeni Kayıt" value={stats.usersToday} icon={<TrendingUp className="w-7 h-7" />} color="green" />
                    <StatCard title="Bugün Üretilen" value={stats.plansToday} icon={<Activity className="w-7 h-7" />} color="indigo" />
                    <StatCard 
                      title="Limiti Dolanlar" 
                      value={stats.usersOutOfQuota || 0} 
                      icon={<Zap className="w-7 h-7" />} 
                      color="red" 
                      subtext={`Toplam kullanıcıların %${stats.totalUsers > 0 ? Math.round(((stats.usersOutOfQuota || 0) / stats.totalUsers) * 100) : 0}'i`}
                      subtextColor="red-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard 
                      title="AI Token Kullanımı" 
                      value={stats.totalTokens?.toLocaleString('tr-TR') || 0} 
                      icon={<Zap className="w-7 h-7" />} 
                      color="purple" 
                    />
                    <StatCard 
                      title="AI Tahmini Maliyet" 
                      value={`$${(stats.totalCostUsd || 0).toFixed(4)}`} 
                      icon={<DollarSign className="w-7 h-7" />} 
                      color="emerald" 
                    />
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-600" />
                        Son 7 Günlük Kullanım Trendi
                      </h3>
                      <select 
                        value={chartFilter}
                        onChange={(e) => setChartFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer font-medium"
                      >
                        <option value="all">Tümü</option>
                        <option value="plans">Sadece Rotalar</option>
                        <option value="users">Sadece Kayıtlar</option>
                      </select>
                    </div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          {(chartFilter === 'all' || chartFilter === 'plans') && (
                            <Line type="monotone" name="Üretilen Rota" dataKey="newPlans" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                          )}
                          {(chartFilter === 'all' || chartFilter === 'users') && (
                            <Line type="monotone" name="Yeni Kayıt" dataKey="newUsers" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top 5 Destinations */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-amber-500" /> 
                          Popüler Destinasyonlar (Top 5)
                        </h3>
                      </div>
                      <div className="p-5">
                        <div className="space-y-4">
                          {(stats.topDestinations || []).map((dest, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-200 text-slate-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-indigo-50 text-indigo-500'}`}>
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-semibold text-slate-700 text-sm">{dest.name.split(',')[0]}</span>
                                  <span className="text-xs font-bold text-slate-500">{dest.count} arama</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                  <div 
                                    className="bg-indigo-500 h-1.5 rounded-full" 
                                    style={{ width: `${(dest.count / Math.max(...stats.topDestinations.map(d => d.count))) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {(!stats.topDestinations || stats.topDestinations.length === 0) && (
                            <p className="text-slate-500 text-sm text-center py-4">Henüz veri yok</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Son Kayıt Olanlar */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Users className="w-5 h-5 text-indigo-600" /> 
                          Son Kayıt Olanlar
                        </h3>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {users.slice(-5).reverse().map(u => (
                          <div key={u.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                              <p className="font-semibold text-slate-800">{u.fullName}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Map className="w-5 h-5 text-amber-500" /> 
                          Son Üretilen Rotalar
                        </h3>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {plans.slice(0, 5).map(p => (
                          <div key={p.id} className="p-4 flex flex-col gap-1 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start">
                              <p className="font-bold text-slate-800 truncate pr-4">{p.title || p.destination}</p>
                              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">
                                {new Date(p.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">Hazırlatan: {p.userName}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm max-w-md focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                    <Search className="w-5 h-5 text-slate-400 ml-2" />
                    <input 
                      type="text" 
                      placeholder="İsim veya e-posta ile ara..." 
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full bg-transparent border-none outline-none px-3 py-1.5 text-slate-700 placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-xs">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">İsim & E-posta</th>
                          <th className="px-6 py-4">Yetki</th>
                          <th className="px-6 py-4 text-center">Kalan Kota</th>
                          <th className="px-6 py-4 text-right">Kayıt Tarihi</th>
                          <th className="px-6 py-4 text-center">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.filter(u => 
                          u.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                        ).map(u => (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-slate-500 font-medium">#{u.id}</td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-800">{u.fullName}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-600 font-bold border border-amber-100">
                                {u.role === 'ADMIN' ? '∞' : u.remainingQuota}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-slate-500 whitespace-nowrap">
                              {new Date(u.createdAt).toLocaleString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {u.role !== 'ADMIN' && (
                                <button 
                                  onClick={() => openQuotaModal(u)}
                                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer border border-indigo-200"
                                >
                                  Kota Güncelle
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {users.filter(u => 
                          u.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                        ).length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">
                              Aramanızla eşleşen kullanıcı bulunamadı.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              )}

              {activeTab === 'plans' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-xs">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Rota Başlığı & Hedef</th>
                          <th className="px-6 py-4">Kullanıcı</th>
                          <th className="px-6 py-4 text-right">Oluşturulma Tarihi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {plans.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-slate-500 font-medium">#{p.id}</td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-800">{p.title || 'İsimsiz Rota'}</p>
                              <p className="text-xs font-medium text-amber-600">{p.destination}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-slate-700">{p.userName}</p>
                              <p className="text-xs text-slate-500">{p.userEmail}</p>
                            </td>
                            <td className="px-6 py-4 text-right text-slate-500 whitespace-nowrap">
                              {new Date(p.createdAt).toLocaleString('tr-TR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Quota Update Modal */}
        {isQuotaModalOpen && selectedUserForQuota && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl flex flex-col">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Kota Güncelle</h2>
              <p className="text-slate-500 mb-6">
                <strong className="text-slate-700">{selectedUserForQuota.fullName}</strong> adlı kullanıcının kotasını düzenliyorsunuz.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Yeni Kota Sayısı</label>
                <input 
                  type="number" 
                  min="0"
                  value={newQuotaValue}
                  onChange={(e) => setNewQuotaValue(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-slate-700"
                  placeholder="Sayı girin..."
                />
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={closeQuotaModal}
                  className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleUpdateQuota}
                  disabled={updatingQuota}
                  className="flex-1 px-5 py-3 rounded-xl font-bold text-white bg-[#F59E0B] hover:bg-amber-600 shadow-md shadow-amber-600/20 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {updatingQuota ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
