import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ForecastPoint } from '../types';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  data: ForecastPoint[];
  riskProbability: number;
  stockoutEta: number;
  actionableInsight: string;
}

export default function Analytics({ data, riskProbability, stockoutEta, actionableInsight }: AnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="text-blue-600" size={18} />
          <h2 className="font-extrabold text-slate-900 tracking-tight uppercase text-sm">
            PREDICTED DEMAND VS. CURRENT STOCK (14-DAY)
          </h2>
        </div>
        <p className="text-slate-500 text-xs font-medium">
          Visualization of AI predictive model outcomes for SKU-9942.
        </p>
      </div>

      {/* Primary Chart Card */}
      <div className="bg-white rounded-xl p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-blue-600"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Predicted Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-slate-300"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Projected Stock</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-200"></span>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Stockout Zone</span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                tickFormatter={(val) => val === 0 ? 'TODAY' : `DAY ${val}`}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelFormatter={(val) => `Day ${val}`}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#2563eb" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorPredicted)" 
              />
              <Area 
                type="monotone" 
                dataKey="projectedStock" 
                stroke="#94a3b8" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                fill="none" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Meta Data Row */}
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Max Probability Risk</span>
            <span className="text-xl font-bold text-red-600 tracking-tight">{riskProbability}%</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Stockout ETA</span>
            <span className="text-xl font-bold text-slate-900 tracking-tight">{stockoutEta} Days</span>
          </div>
        </div>
      </div>

      {/* Actionable Insight Card */}
      <div className="bg-slate-100 rounded-xl p-4 flex items-start gap-4 mb-24">
        <div className="bg-amber-100 p-2 rounded-lg">
          <Lightbulb className="text-amber-600" size={20} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Actionable Intelligence</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {actionableInsight}
          </p>
        </div>
      </div>
    </div>
  );
}
