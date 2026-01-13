
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface HomeScreenProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ transactions, onEdit }) => {
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  // Group by date
  const grouped = transactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const getDailySummary = (dateTransactions: Transaction[]) => {
    const inc = dateTransactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
    const exp = dateTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
    return { inc, exp };
  };

  return (
    <div className="p-0">
      <div className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 ios-blur px-6 pt-12 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">每日概览</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">早上好，Alex</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
            <img 
              alt="User" 
              src="https://picsum.photos/seed/user123/100/100" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">总收入</p>
            <p className="text-xl font-bold text-income">¥{totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">总支出</p>
            <p className="text-xl font-bold text-expense">¥{totalExpense.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <main className="px-4 space-y-6 mt-4">
        {sortedDates.map(date => {
          const { inc, exp } = getDailySummary(grouped[date]);
          return (
            <section key={date}>
              <div className="flex items-center justify-between px-2 mb-3">
                <h2 className="font-semibold text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest">{date}</h2>
                <div className="flex items-center gap-3">
                   <div className="flex gap-2 text-[10px] font-bold">
                      {inc > 0 && <span className="text-income">入 ¥{inc.toFixed(0)}</span>}
                      {exp > 0 && <span className="text-expense">支 ¥{exp.toFixed(0)}</span>}
                   </div>
                   <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                    {grouped[date].length} 条记录
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {grouped[date].map(t => (
                  <div 
                    key={t.id}
                    onClick={() => onEdit(t)}
                    className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 group active:scale-[0.98] transition-all cursor-pointer relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${
                          t.type === TransactionType.INCOME ? 'text-income' : 
                          'text-expense'
                        }`}>
                          {t.type === TransactionType.INCOME ? '+' : '-'}
                          ¥{t.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          t.type === TransactionType.INCOME 
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                          : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {t.type === TransactionType.INCOME ? '收入' : '支出'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{t.time}</span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                      {t.note}
                      {t.tags.length > 0 && (
                        <span className="text-primary font-medium ml-2">
                          {t.tags.map(tag => `#${tag}`).join(' ')}
                        </span>
                      )}
                    </p>

                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-medium border-t border-slate-50 dark:border-slate-700/30 pt-2">
                      {t.location && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          {t.location}
                        </span>
                      )}
                      {t.paymentMethod && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">credit_card</span>
                          {t.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default HomeScreen;
