'use client';

import { useEffect, useState, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FileText, Package, Clock, CheckCircle, AlertCircle, Settings, Volume2, Play, Bell, BellOff, StopCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { ALARM_SOUNDS, getAlarmSettings, setAlarmSettings } from '@/lib/alarmSettings';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface OrderItem {
  productId: {
    _id: string;
    title: string;
    image: string;
    price: number;
    businessId: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: {
    name: string;
    email: string;
    phone?: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { firebaseUser, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    revenue: 0,
  });

  // Alarm Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [selectedSound, setSelectedSound] = useState('custom');
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchOrders();

    // Load local settings
    const settings = getAlarmSettings();
    setAlarmEnabled(settings.enabled);
    setSelectedSound(settings.soundId);
  }, []);

  const saveSettings = (enabled: boolean, sound: string) => {
    setAlarmEnabled(enabled);
    setSelectedSound(sound);
    setAlarmSettings(enabled, sound);
  };

  const toggleTestSound = () => {
    if (isPlayingTest) {
      if (testAudioRef.current) {
        testAudioRef.current.pause();
        testAudioRef.current.currentTime = 0;
      }
      setIsPlayingTest(false);
      return;
    }

    const sound = ALARM_SOUNDS.find(s => s.id === selectedSound) || ALARM_SOUNDS[0];
    if (sound) {
      if (testAudioRef.current) {
        testAudioRef.current.pause();
      }
      const audio = new Audio(sound.src);
      audio.volume = 1.0;

      audio.onended = () => setIsPlayingTest(false);

      audio.play()
        .then(() => setIsPlayingTest(true))
        .catch(e => {
          console.error("Test audio failed:", e);
          toast.error("Could not play sound. Check browser permissions.");
          setIsPlayingTest(false);
        });

      testAudioRef.current = audio;
    }
  };

  const simulateIncomingOrder = async () => {
    if (!firebaseUser) return;

    // DISPATCH PRIME REQUEST IMMEDIATELY ON CLICK
    // This allows SellerAlarm to play() within the user gesture context
    window.dispatchEvent(new Event('SELLER_ALARM_PRIME'));

    toast.success("Simulation starting in 5 seconds... Switch tabs NOW to test background!", {
      duration: 4500,
      style: { background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }
    });

    setTimeout(async () => {
      try {
        await addDoc(collection(db, 'seller_notifications'), {
          sellerUid: firebaseUser.uid,
          title: 'Test Order Incoming!',
          orderId: 'SIMULATED-' + Date.now(),
          status: 'unread',
          timestamp: serverTimestamp(),
          message: 'This is a simulation of a new order to test the alarm.',
          simulated: true
        });
      } catch (e: any) {
        console.error("Simulation failed:", e);
        toast.error("Simulation failed: " + e.message);
      }
    }, 5000);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<Order[]>('/api/business/orders');
      if (res.data) {
        setOrders(res.data);
        calculateStats(res.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Order[]) => {
    const s = {
      total: data.length,
      pending: data.filter(o => o.status === 'CREATED' || o.status === 'PAID').length,
      processing: data.filter(o => o.status === 'PROCESSING' || o.status === 'SHIPPED').length,
      completed: data.filter(o => o.status === 'DELIVERED').length,
      revenue: data.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    };
    setStats(s);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED': return 'text-yellow-600 bg-yellow-50';
      case 'PAID': return 'text-blue-600 bg-blue-50';
      case 'PROCESSING': return 'text-purple-600 bg-purple-50';
      case 'SHIPPED': return 'text-indigo-600 bg-indigo-50';
      case 'DELIVERED': return 'text-green-600 bg-green-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF']}>
      <div className="space-y-6">
        {/* Header with Settings Toggle */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600">Manage and track your customer orders</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showSettings ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
          >
            <Settings className="h-4 w-4" />
            <span>Alarm Settings</span>
          </button>
        </div>

        {/* Alarm Settings Panel */}
        {showSettings && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6 animate-in slide-in-from-top-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-gray-700" />
              Notification Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Toggle Alarm */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {alarmEnabled ? (
                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                      <Bell className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-200 rounded-full text-gray-500">
                      <BellOff className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <span className="block font-medium text-gray-900">Order Alarm</span>
                    <span className="text-sm text-gray-500">{alarmEnabled ? 'Sound is on' : 'Sound is off'}</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={alarmEnabled}
                    onChange={(e) => saveSettings(e.target.checked, selectedSound)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Sound Selection */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notification Sound</label>
                  <select
                    value={selectedSound}
                    onChange={(e) => saveSettings(alarmEnabled, e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    {ALARM_SOUNDS.map(sound => (
                      <option key={sound.id} value={sound.id}>{sound.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={toggleTestSound}
                    className={`p-2 rounded-full transition-colors ${isPlayingTest ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
                    title={isPlayingTest ? "Stop Test" : "Play Test Sound"}
                  >
                    {isPlayingTest ? <StopCircle className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>

                  <button
                    onClick={simulateIncomingOrder}
                    className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    title="Simulate a new order to test alarm (5s delay)"
                  >
                    Simulate Order (5s)
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: The alarm will play continuously until you manually acknowledge the new order popup.
            </p>
          </div>
        )}

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button onClick={fetchOrders} className="text-sm text-blue-600 hover:text-blue-800">Refresh</button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No orders yet</p>
                        <p className="text-sm text-gray-400 mt-2">Orders will appear here once customers start purchasing</p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.userId?.name || 'Guest'}
                          <div className="text-xs text-gray-400">{order.userId?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">
                          View Details
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
