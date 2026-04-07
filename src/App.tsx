/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signIn, handleFirestoreError, OperationType } from './lib/firebase';
import { InventoryData, Activity, ChatMessage, ForecastPoint } from './types';
import { analyzeInventory, getChatResponse, analyzeStockImage } from './services/gemini';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Parameters from './components/Parameters';
import Chatbot from './components/Chatbot';
import { LogIn, Package, Loader2, Zap } from 'lucide-react';

const DEFAULT_INVENTORY: InventoryData = {
  sku: 'SKU-9942',
  productName: 'Organic Coffee Beans (1kg)',
  currentStock: 45,
  targetStock: 130,
  expectedSales: 150,
  unitCost: 12.50,
  allocatedBudget: 5000,
  leadTime: 2,
  seasonMultiplier: 1.5,
  safetyBuffer: 15,
  lastUpdated: new Date().toISOString(),
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inputs' | 'dashboard' | 'alerts'>('dashboard');
  const [inventory, setInventory] = useState<InventoryData>(DEFAULT_INVENTORY);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [recommendation, setRecommendation] = useState({
    summary: 'Analyzing current stock levels...',
    recommendation: 'Calculating optimal order volume...',
    reasoning: 'Optimization engine is processing demand forecasts.',
    risks: [],
    stockoutEta: 10,
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!user) return;

    const invRef = doc(db, 'inventory', DEFAULT_INVENTORY.sku);
    const actRef = collection(db, 'activities');
    const chatRef = doc(db, 'chats', user.uid);

    const unsubInv = onSnapshot(invRef, (doc) => {
      if (doc.exists()) {
        setInventory(doc.data() as InventoryData);
      } else {
        setDoc(invRef, DEFAULT_INVENTORY).catch(e => handleFirestoreError(e, OperationType.WRITE, 'inventory'));
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, 'inventory'));

    const unsubAct = onSnapshot(query(actRef, orderBy('timestamp', 'desc'), limit(10)), (snap) => {
      if (snap.empty) {
        // Seed initial data
        const initialActivities = [
          { type: 'shipment', description: 'Inbound Shipment #4492', timestamp: '2 hours ago', units: 12 },
          { type: 'order', description: 'New Batch Order', timestamp: 'Scheduled for Day 12', status: 'Pending' },
        ];
        initialActivities.forEach(a => addDoc(actRef, a));
      }
      const acts = snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity));
      setActivities(acts);
    }, (e) => handleFirestoreError(e, OperationType.GET, 'activities'));

    const unsubChat = onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        setChatHistory(doc.data().messages || []);
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, 'chats'));

    return () => {
      unsubInv();
      unsubAct();
      unsubChat();
    };
  }, [user]);

  // AI Analysis Trigger
  const runAiAnalysis = useCallback(async () => {
    if (!user || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const result = await analyzeInventory(inventory, activities);
      setRecommendation(result);
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAiLoading(false);
    }
  }, [user, inventory, activities, isAiLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      runAiAnalysis();
    }, 2000); // Debounce AI calls
    return () => clearTimeout(timer);
  }, [
    inventory.currentStock, 
    inventory.targetStock, 
    inventory.expectedSales, 
    inventory.unitCost, 
    inventory.allocatedBudget, 
    inventory.leadTime, 
    inventory.seasonMultiplier, 
    inventory.safetyBuffer
  ]);

  // Forecast Data Generation (Mocked based on inputs)
  const generateForecast = (): ForecastPoint[] => {
    const points: ForecastPoint[] = [];
    let current = inventory.currentStock;
    const dailyDemand = 10 * inventory.seasonMultiplier;
    
    for (let i = 0; i <= 14; i++) {
      const predicted = dailyDemand * (1 + Math.sin(i / 2) * 0.2);
      current -= predicted;
      points.push({
        day: i,
        predicted: predicted * 5, // Scale for chart
        projectedStock: Math.max(0, current + 50), // Scale for chart
        isRiskZone: current < (inventory.targetStock * (inventory.safetyBuffer / 100)),
      });
    }
    return points;
  };

  const handleSendMessage = async (text: string, base64Image?: string) => {
    if (!user) return;
    
    const newUserMsg: ChatMessage = { role: 'user', text: text || (base64Image ? "Analyzed this image." : ""), timestamp: new Date().toISOString() };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setIsAiLoading(true);

    try {
      let responseText = "";
      if (base64Image) {
        responseText = await analyzeStockImage(base64Image.split(',')[1]);
      } else {
        responseText = await getChatResponse(updatedHistory, text);
      }

      const newAiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date().toISOString() };
      const finalHistory = [...updatedHistory, newAiMsg];
      
      await setDoc(doc(db, 'chats', user.uid), { messages: finalHistory });
    } catch (error) {
      console.error("Chat failed", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await setDoc(doc(db, 'inventory', inventory.sku), { 
        ...inventory, 
        lastUpdated: new Date().toISOString() 
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      handleFirestoreError(error, OperationType.WRITE, `inventory/${inventory.sku}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-600/20">
          <Package className="text-white" size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Smart Inventory DSS</h1>
        <p className="text-slate-500 mb-8 max-w-xs">
          Advanced decision support system for modern logistics managers.
        </p>
        <button 
          onClick={() => signIn()}
          className="flex items-center gap-3 bg-white border border-slate-200 px-8 py-4 rounded-2xl font-bold text-slate-700 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <LogIn size={20} />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
      {activeTab === 'dashboard' && (
        <Dashboard 
          inventory={inventory} 
          activities={activities} 
          recommendation={recommendation} 
        />
      )}
      {activeTab === 'alerts' && (
        <Analytics 
          data={generateForecast()} 
          riskProbability={84.2} 
          stockoutEta={recommendation.stockoutEta} 
          actionableInsight={`Increasing purchase orders by ${Math.round(inventory.targetStock - inventory.currentStock)} units by Day 3 will mitigate the projected Day 10 stockout.`}
        />
      )}
      {activeTab === 'inputs' && (
        <Parameters 
          inventory={inventory} 
          setInventory={setInventory} 
          onApply={handleApply}
          onReset={() => setInventory(DEFAULT_INVENTORY)}
          isSaving={isSaving}
          saveStatus={saveStatus}
        />
      )}

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-50"
      >
        <Zap size={24} fill={isChatOpen ? 'currentColor' : 'none'} />
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md relative">
            <button 
              onClick={() => setIsChatOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-blue-200 transition-colors"
            >
              Close
            </button>
            <Chatbot 
              history={chatHistory} 
              onSendMessage={handleSendMessage} 
              isLoading={isAiLoading} 
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
