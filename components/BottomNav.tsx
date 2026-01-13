
import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onAdd: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, onAdd }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 ios-blur border-t border-slate-100 dark:border-slate-800 px-4 pt-3 pb-8 flex justify-around items-end z-50 transition-all">
      <button 
        onClick={() => onNavigate('HOME')}
        className={`flex flex-col items-center gap-1 w-16 transition-colors ${currentScreen === 'HOME' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <span className={`material-symbols-outlined ${currentScreen === 'HOME' ? 'active-icon' : ''}`}>home</span>
        <span className="text-[10px] font-medium">首页</span>
      </button>

      <button 
        onClick={() => onNavigate('HISTORY')}
        className={`flex flex-col items-center gap-1 transition-colors w-16 ${currentScreen === 'HISTORY' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <span className={`material-symbols-outlined ${currentScreen === 'HISTORY' ? 'active-icon' : ''}`}>schedule</span>
        <span className="text-[10px] font-medium">历史</span>
      </button>

      <div className="relative -top-6 flex flex-col items-center">
        <button 
          onClick={onAdd}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-3xl font-bold">add</span>
        </button>
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1">添加</span>
      </div>

      <button 
        onClick={() => onNavigate('ANALYTICS')}
        className={`flex flex-col items-center gap-1 w-16 transition-colors ${currentScreen === 'ANALYTICS' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <span className={`material-symbols-outlined ${currentScreen === 'ANALYTICS' ? 'active-icon' : ''}`}>bar_chart</span>
        <span className="text-[10px] font-medium">分析</span>
      </button>

      <button 
        onClick={() => onNavigate('SETTINGS')}
        className={`flex flex-col items-center gap-1 w-16 transition-colors ${currentScreen === 'SETTINGS' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <span className={`material-symbols-outlined ${currentScreen === 'SETTINGS' ? 'active-icon' : ''}`}>settings</span>
        <span className="text-[10px] font-medium">设置</span>
      </button>
    </nav>
  );
};

export default BottomNav;
