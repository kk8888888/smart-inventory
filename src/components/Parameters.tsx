import React from 'react';
import { Minus, Plus, Lock, RotateCcw, Lightbulb, TrendingUp, ChevronDown, ChevronUp, Loader2, Check, AlertCircle } from 'lucide-react';
import { InventoryData } from '../types';

interface ParametersProps {
  inventory: InventoryData;
  setInventory: (data: InventoryData) => void;
  onApply: () => void;
  onReset: () => void;
  isSaving?: boolean;
  saveStatus?: 'idle' | 'success' | 'error';
}

export default function Parameters({ inventory, setInventory, onApply, onReset, isSaving, saveStatus }: ParametersProps) {
  const updateField = (field: keyof InventoryData, value: string | number) => {
    setInventory({ ...inventory, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="py-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 font-headline uppercase">⚙️ PARAMETERS</h1>
        <p className="text-slate-500 text-sm mt-1">Adjust system constraints for real-time calculation.</p>
      </div>

      <div className="space-y-4">
        {/* PRODUCT INFO SECTION */}
        <section className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900" />
          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-3">PRODUCT INFO</label>
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-slate-500 block mb-1">Product Name</span>
              <input 
                type="text"
                value={inventory.productName}
                onChange={(e) => updateField('productName', e.target.value)}
                className="w-full bg-slate-50 border-none rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block mb-1">SKU</span>
              <input 
                type="text"
                value={inventory.sku}
                disabled
                className="w-full bg-slate-100 border-none rounded-lg px-3 py-2 text-sm font-bold text-slate-400"
              />
            </div>
          </div>
        </section>

        {/* INVENTORY SECTION */}
        <section className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-3">INVENTORY</label>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900">Current Stock</span>
              <div className="flex items-center bg-slate-50 rounded-lg p-1">
                <button 
                  onClick={() => updateField('currentStock', Math.max(0, inventory.currentStock - 1))}
                  className="p-2 hover:bg-slate-100 rounded transition-colors active:scale-90"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 font-bold text-lg">{inventory.currentStock}</span>
                <button 
                  onClick={() => updateField('currentStock', inventory.currentStock + 1)}
                  className="p-2 hover:bg-slate-100 rounded transition-colors active:scale-90"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900">Target Stock</span>
              <div className="flex items-center bg-slate-50 rounded-lg p-1">
                <button 
                  onClick={() => updateField('targetStock', Math.max(0, inventory.targetStock - 1))}
                  className="p-2 hover:bg-slate-100 rounded transition-colors active:scale-90"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 font-bold text-lg">{inventory.targetStock}</span>
                <button 
                  onClick={() => updateField('targetStock', inventory.targetStock + 1)}
                  className="p-2 hover:bg-slate-100 rounded transition-colors active:scale-90"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FINANCIALS SECTION */}
        <section className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600" />
          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-3">FINANCIALS & SALES</label>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-900">Expected Sales (Monthly)</span>
              <input 
                type="number"
                value={inventory.expectedSales}
                onChange={(e) => updateField('expectedSales', parseInt(e.target.value) || 0)}
                className="w-24 bg-slate-50 border-none rounded-lg px-3 py-1 text-right font-bold focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-900">Unit Cost ($)</span>
              <input 
                type="number"
                step="0.01"
                value={inventory.unitCost}
                onChange={(e) => updateField('unitCost', parseFloat(e.target.value) || 0)}
                className="w-24 bg-slate-50 border-none rounded-lg px-3 py-1 text-right font-bold focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-900">Allocated Budget ($)</span>
              <input 
                type="number"
                value={inventory.allocatedBudget}
                onChange={(e) => updateField('allocatedBudget', parseInt(e.target.value) || 0)}
                className="w-24 bg-slate-50 border-none rounded-lg px-3 py-1 text-right font-bold focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </section>

        {/* LEAD TIME SECTION */}
        <section className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600" />
          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-3">LEAD TIME</label>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-900">Supplier Days</span>
            <div className="flex items-center bg-slate-50 rounded-lg p-1">
              <button 
                onClick={() => updateField('leadTime', Math.max(1, inventory.leadTime - 1))}
                className="p-2 hover:bg-slate-100 rounded transition-colors active:scale-90"
              >
                <ChevronDown size={14} />
              </button>
              <span className="px-4 font-bold text-lg">{inventory.leadTime}</span>
              <button 
                onClick={() => updateField('leadTime', inventory.leadTime + 1)}
                className="p-2 hover:bg-slate-100 rounded transition-colors active:scale-90"
              >
                <ChevronUp size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* DEMAND CONTROL SECTION */}
        <section className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600" />
          <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">DEMAND CONTROL</label>
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-black uppercase">[Peak]</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-900">Season Multiplier</span>
              <span className="text-xl font-black text-blue-600">{inventory.seasonMultiplier}x</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="3" 
              step="0.1" 
              value={inventory.seasonMultiplier}
              onChange={(e) => updateField('seasonMultiplier', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
          </div>
        </section>

        {/* RISK MITIGATION SECTION */}
        <section className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-4">RISK MITIGATION</label>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-900">Safety Buffer</span>
              <span className="text-xl font-black text-slate-900">{inventory.safetyBuffer}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={inventory.safetyBuffer}
              onChange={(e) => updateField('safetyBuffer', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" 
            />
          </div>
        </section>
      </div>

      {/* Primary Actions */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <button 
          onClick={onApply}
          disabled={isSaving}
          className={`font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${
            saveStatus === 'success' ? 'bg-green-600 shadow-green-600/20' :
            saveStatus === 'error' ? 'bg-red-600 shadow-red-600/20' :
            'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
          } text-white disabled:opacity-50`}
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : saveStatus === 'success' ? (
            <Check size={18} />
          ) : saveStatus === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <Lock size={18} />
          )}
          <span>
            {isSaving ? 'SAVING...' : 
             saveStatus === 'success' ? 'SAVED!' : 
             saveStatus === 'error' ? 'FAILED' : 
             'APPLY'}
          </span>
        </button>
        <button 
          onClick={onReset}
          disabled={isSaving}
          className="border-2 border-slate-200 text-slate-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
        >
          <RotateCcw size={18} />
          <span>RESET</span>
        </button>
      </div>

      {/* Informational Card */}
      <div className="mt-10 p-6 rounded-2xl bg-slate-100 border border-slate-200">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <TrendingUp className="text-blue-600" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Decision Impact</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Based on these 4 parameters, the system predicts a <span className="text-green-600 font-bold">12% ROI increase</span> for the current Q3 cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
