import React from 'react';
import { AlertTriangle, CheckCircle, History, Package, ShoppingCart, Zap } from 'lucide-react';
import { InventoryData, Activity } from '../types';
import { motion } from 'motion/react';

interface DashboardProps {
  inventory: InventoryData;
  activities: Activity[];
  recommendation: {
    summary: string;
    recommendation: string;
    reasoning: string;
    risks: string[];
    stockoutEta: number;
  };
}

export default function Dashboard({ inventory, activities, recommendation }: DashboardProps) {
  const isCritical = recommendation.stockoutEta <= 3;

  return (
    <div className="space-y-4">
      {/* Critical Alert Banner */}
      {isCritical && (
        <motion.section
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-xl overflow-hidden bg-red-600 shadow-lg shadow-red-600/10 p-5 flex items-start gap-3"
        >
          <AlertTriangle className="text-white shrink-0" size={24} />
          <div>
            <h2 className="text-white font-black text-sm uppercase tracking-widest leading-tight">
              CRITICAL ALERT: PREDICTED STOCKOUT IN {recommendation.stockoutEta} DAYS
            </h2>
            <p className="text-white/90 text-xs mt-1 font-medium">
              {recommendation.summary}
            </p>
          </div>
        </motion.section>
      )}

      {/* Metrics Row */}
      <section className="grid grid-cols-3 gap-3">
        <div className={`bg-white p-3 rounded-xl border-l-2 ${inventory.currentStock < 50 ? 'border-red-500' : 'border-green-500'}`}>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tighter">Current Stock</p>
          <p className="text-lg font-black text-slate-900 mt-1">{inventory.currentStock}</p>
          <span className={`text-[9px] font-bold ${inventory.currentStock < 50 ? 'text-red-500' : 'text-green-500'}`}>
            {inventory.currentStock < 50 ? 'Low' : 'Healthy'}
          </span>
        </div>
        <div className="bg-white p-3 rounded-xl">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tighter">Target Stock</p>
          <p className="text-lg font-black text-slate-900 mt-1">{inventory.targetStock}</p>
          <span className="text-[9px] font-bold text-blue-600">Units</span>
        </div>
        <div className="bg-white p-3 rounded-xl border-l-2 border-green-500">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tighter">Spoilage Risk</p>
          <p className="text-lg font-black text-slate-900 mt-1">Low</p>
          <span className="text-[9px] font-bold text-green-500">Green</span>
        </div>
      </section>

      {/* Recommendation Card */}
      <section className="bg-white rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-blue-600" size={18} fill="currentColor" />
            <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">System Recommendation</h3>
          </div>
          <p className="text-lg font-bold text-slate-900 leading-tight">
            {recommendation.recommendation}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {recommendation.reasoning}
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2 relative z-10">
          <button className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-transform">
            <CheckCircle size={18} fill="currentColor" />
            ACCEPT & GENERATE PO
          </button>
          <button className="w-full border-2 border-slate-200 text-slate-500 py-3 rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform">
            OVERRIDE (I will handle it)
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Activity</h4>
          <History className="text-slate-400" size={18} />
        </div>
        <div className="divide-y divide-slate-50">
          {activities.map((activity) => (
            <div key={activity.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                  {activity.type === 'shipment' ? (
                    <Package className="text-slate-500" size={14} />
                  ) : activity.type === 'order' ? (
                    <ShoppingCart className="text-slate-500" size={14} />
                  ) : (
                    <AlertTriangle className="text-red-500" size={14} />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold">{activity.description}</p>
                  <p className="text-[10px] text-slate-400">{activity.timestamp}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold ${
                activity.units && activity.units > 0 ? 'text-green-600' : 'text-blue-600'
              }`}>
                {activity.units ? `+${activity.units} Units` : activity.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
