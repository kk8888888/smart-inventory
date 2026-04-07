import React from 'react';
import { motion } from 'motion/react';
import { Settings, ClipboardList, LayoutDashboard, BellRing, LogOut, User } from 'lucide-react';
import { auth, signOut } from '../lib/firebase';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'inputs' | 'dashboard' | 'alerts';
  setActiveTab: (tab: 'inputs' | 'dashboard' | 'alerts') => void;
  user: any;
}

export default function Layout({ children, activeTab, setActiveTab, user }: LayoutProps) {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans pb-24">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-white shadow-sm flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                <User size={20} />
              </div>
            )}
          </div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-wider">
            📦 SMART INVENTORY DSS
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => signOut()} className="text-slate-500 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
          <button className="text-slate-500 hover:text-blue-600 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4 max-w-md mx-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center pt-3 pb-6 px-4 bg-white/80 backdrop-blur-xl z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-slate-100">
        <button
          onClick={() => setActiveTab('inputs')}
          className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
            activeTab === 'inputs' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <ClipboardList size={24} fill={activeTab === 'inputs' ? 'currentColor' : 'none'} />
          <span className="text-[11px] font-semibold uppercase tracking-tighter mt-1">Inputs</span>
          {activeTab === 'inputs' && (
            <motion.div layoutId="activeTab" className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
            activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard size={24} fill={activeTab === 'dashboard' ? 'currentColor' : 'none'} />
          <span className="text-[11px] font-semibold uppercase tracking-tighter mt-1">Dashboard</span>
          {activeTab === 'dashboard' && (
            <motion.div layoutId="activeTab" className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
            activeTab === 'alerts' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <BellRing size={24} fill={activeTab === 'alerts' ? 'currentColor' : 'none'} />
          <span className="text-[11px] font-semibold uppercase tracking-tighter mt-1">Alerts</span>
          {activeTab === 'alerts' && (
            <motion.div layoutId="activeTab" className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
          )}
        </button>
      </nav>
    </div>
  );
}
