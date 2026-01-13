
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';

interface HistoryScreenProps {
  transactions: Transaction[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ transactions }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const startDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const numDays = daysInMonth(year, month);
  const firstDay = startDayOfMonth(year, month);

  const monthNames = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ];

  // Group transactions for summary
  const dailyData: Record<number, { inc: number, exp: number }> = {};
  transactions.forEach(t => {
    const match = t.date.match(/(\d+)年(\d+)月(\d+)日/);
    if (match) {
      const y = parseInt(match[1]);
      const m = parseInt(match[2]) - 1;
      const d = parseInt(match[3]);
      if (y === year && m === month) {
        if (!dailyData[d]) dailyData[d] = { inc: 0, exp: 0 };
        if (t.type === TransactionType.INCOME) dailyData[d].inc += t.amount;
        else if (t.type === TransactionType.EXPENSE) dailyData[d].exp += t.amount;
      }
    }
  });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const totalMonthlyInc = Object.values(dailyData).reduce((s, v) => s + v.inc, 0);
  const totalMonthlyExp = Object.values(dailyData).reduce((s, v) => s + v.exp, 0);
  const totalMonthlyNet = totalMonthlyInc - totalMonthlyExp;

  const renderDays = () => {
    const days = [];
    // Prev month days
    const prevMonthDays = daysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="h-10 flex items-center justify-center text-slate-300 dark:text-slate-600 text-xs font-light">
          {prevMonthDays - i}
        </div>
      );
    }

    // Current month days
    for (let d = 1; d <= numDays; d++) {
      const hasData = !!dailyData[d];
      const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
      
      days.push(
        <div key={`curr-${d}`} className="h-10 flex flex-col items-center justify-center relative group cursor-pointer">
          <div className={`
            w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all
            ${isToday ? 'bg-primary text-white font-bold shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}
            ${!isToday && hasData ? 'text-primary font-bold bg-primary/5' : 'text-slate-600 dark:text-slate-300'}
          `}>
            {d}
          </div>
          {!isToday && hasData && (
            <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></div>
          )}
        </div>
      );
    }

    // Next month days
    const totalSlots = 42; 
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push(
        <div key={`next-${i}`} className="h-10 flex items-center justify-center text-slate-300 dark:text-slate-600 text-xs font-light">
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden px-6 pt-12 font-sans">
      {/* Search Header */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
        <input 
          disabled
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-[12px] focus:ring-0 placeholder-slate-400 shadow-sm" 
          placeholder="搜索往期账单..." 
          type="text"
        />
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">tune</span>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {year}年 {monthNames[month]}
        </h2>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary transition-colors hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-100">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary transition-colors hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-100">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Minimal Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-3 mb-8">
        <div className="grid grid-cols-7 mb-3">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <div key={d} className="text-center text-[11px] font-bold text-slate-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {renderDays()}
        </div>
      </div>

      {/* Monthly Summary Section */}
      <div className="space-y-6 overflow-y-auto hide-scrollbar pb-10">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">本月统计</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[100px] flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <span className="material-symbols-outlined text-income text-[18px]">trending_up</span>
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-0.5 whitespace-nowrap">累计收入</p>
                <p className="text-[13px] font-bold text-income">¥{totalMonthlyInc.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex-1 min-w-[100px] flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <span className="material-symbols-outlined text-expense text-[18px]">trending_down</span>
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-0.5 whitespace-nowrap">累计支出</p>
                <p className="text-[13px] font-bold text-expense">¥{totalMonthlyExp.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex-1 min-w-[100px] flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <span className="material-symbols-outlined text-primary text-[18px]">account_balance_wallet</span>
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-0.5 whitespace-nowrap">净收入</p>
                <p className="text-[13px] font-bold text-primary">¥{totalMonthlyNet.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Shortcuts Section (Memos Style) */}
        <div>
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">快捷磁贴</h3>
           <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/20 transition-all">
                <span className="material-symbols-outlined text-primary text-[24px]">link</span>
                <span className="text-[11px] font-bold text-slate-600">链接 0</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/20 transition-all">
                <span className="material-symbols-outlined text-primary text-[24px]">checklist</span>
                <span className="text-[11px] font-bold text-slate-600">待办 0</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/20 transition-all">
                <span className="material-symbols-outlined text-primary text-[24px]">code</span>
                <span className="text-[11px] font-bold text-slate-600">代码 0</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;
