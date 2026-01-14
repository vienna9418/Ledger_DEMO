
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType } from '../types';
import { getSmartTags, suggestLocations } from '../services/geminiService';
import { MOCK_TRANSACTIONS } from '../constants';

interface EditScreenProps {
  transaction: Transaction | null;
  onSave: (t: Transaction) => void;
  onClose: () => void;
  onManageTags: () => void;
}

const PAYMENT_METHODS = [
  { id: 'wechat', name: '微信', icon: 'payments', color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'alipay', name: '支付宝', icon: 'account_balance_wallet', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'huabei', name: '花呗', icon: 'credit_score', color: 'text-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { id: 'baitiao', name: '白条', icon: 'shopping_bag', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  { id: 'card', name: '银行卡', icon: 'credit_card', color: 'text-slate-500', bgColor: 'bg-slate-50 dark:bg-slate-800' },
];

const EditScreen: React.FC<EditScreenProps> = ({ transaction, onSave, onClose, onManageTags }) => {
  const [type, setType] = useState<TransactionType>(transaction?.type || TransactionType.EXPENSE);
  const [amount, setAmount] = useState<string>(transaction?.amount?.toString() || '');
  const [note, setNote] = useState<string>(transaction?.note || '');
  const [location, setLocation] = useState<string>(transaction?.location || '');
  const [paymentMethod, setPaymentMethod] = useState<string>(transaction?.paymentMethod || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(transaction?.tags || []);
  const [smartTags, setSmartTags] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  const availableTags = ['餐饮', '交通', '工作', '日常', '其他', '购物', '医疗', '旅行'];

  const historicalLocations = Array.from(new Set(
    MOCK_TRANSACTIONS
      .map(t => t.location)
      .filter((l): l is string => !!l && l !== location)
  )).slice(0, 3);

  const handleSave = () => {
    const newTransaction: Transaction = {
      id: transaction?.id || Math.random().toString(36).substr(2, 9),
      type,
      amount: parseFloat(amount) || 0,
      note,
      tags: selectedTags,
      date: transaction?.date || new Intl.DateTimeFormat('zh-CN', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }).format(new Date()),
      time: transaction?.time || new Intl.DateTimeFormat('zh-CN', { 
        hour: '2-digit', minute: '2-digit', hour12: false 
      }).format(new Date()),
      location: location.trim() || undefined,
      paymentMethod: paymentMethod.trim() || undefined,
    };
    onSave(newTransaction);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const fetchFootprintLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const suggestions = await suggestLocations(latitude, longitude, note);
        setLocationSuggestions(suggestions);
        setIsLocationLoading(false);
      },
      (error) => {
        console.error("Location error", error);
        setIsLocationLoading(false);
      },
      { timeout: 5000 }
    );
  }, [note]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (note.length > 5) {
        setIsAiLoading(true);
        const tags = await getSmartTags(note);
        setSmartTags(tags);
        setIsAiLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [note]);

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-hidden font-sans">
      <header className="flex items-center justify-between px-4 py-4">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">添加记录</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 flex flex-col space-y-6 mt-2 overflow-y-auto hide-scrollbar pb-8 px-6">
        {/* Type Toggle */}
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex mx-auto w-full max-w-sm">
          <button 
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
              type === TransactionType.EXPENSE 
              ? 'bg-white dark:bg-slate-700 shadow-sm text-expense' 
              : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            支出
          </button>
          <button 
            onClick={() => setType(TransactionType.INCOME)}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
              type === TransactionType.INCOME 
              ? 'bg-white dark:bg-slate-700 shadow-sm text-income' 
              : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            收入
          </button>
        </div>

        {/* Big Amount */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center relative">
            <span className="text-2xl font-light text-slate-300 absolute left-1/2 -translate-x-20">¥</span>
            <input 
              autoFocus 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent border-none text-6xl font-bold p-0 focus:ring-0 text-center w-full placeholder-slate-200 dark:placeholder-slate-800 text-slate-800 dark:text-slate-100"
              placeholder="0"
              type="number"
            />
          </div>
        </div>

        {/* Note Target Area */}
        <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 transition-all">
          <div className="px-5 py-3 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
            <span className="text-[12px] text-slate-400 font-bold tracking-wider">备注</span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => { setShowLocationPicker(!showLocationPicker); setShowPaymentPicker(false); }}
                className={`p-1.5 rounded-lg transition-colors ${location ? 'text-primary bg-primary/5' : 'text-slate-400 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </button>
              <button 
                onClick={() => { setShowPaymentPicker(!showPaymentPicker); setShowLocationPicker(false); }}
                className={`p-1.5 rounded-lg transition-colors ${paymentMethod ? 'text-primary bg-primary/5' : 'text-slate-400 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
              </button>
              <button className="text-slate-400 hover:text-primary p-1.5">
                <span className="material-symbols-outlined text-[20px]">image</span>
              </button>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <button className="text-slate-400 hover:text-primary p-1.5"><span className="material-symbols-outlined text-[20px]">format_bold</span></button>
              <button className="text-slate-400 hover:text-primary p-1.5"><span className="material-symbols-outlined text-[20px]">checklist</span></button>
            </div>
          </div>

          <div className="relative">
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-transparent border-none resize-none px-5 pt-4 pb-4 focus:ring-0 text-base leading-relaxed placeholder-slate-300 min-h-[160px] text-slate-700 dark:text-slate-200"
              placeholder="记录此时此地的故事..."
            />

            {/* Integrated Pickers */}
            {(showLocationPicker || showPaymentPicker) && (
              <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-200">
                {showLocationPicker && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl">
                      <input 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full placeholder-slate-400"
                        placeholder="手动输入地点..."
                        autoFocus
                      />
                      <button onClick={fetchFootprintLocation} className="text-primary"><span className="material-symbols-outlined text-[20px]">near_me</span></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {locationSuggestions.map(loc => (
                        <button key={loc} onClick={() => { setLocation(loc); setShowLocationPicker(false); }} className="text-[11px] px-3 py-1.5 rounded-xl bg-primary/5 text-primary border border-primary/10 font-medium">#{loc}</button>
                      ))}
                      {historicalLocations.map(loc => (
                        <button key={loc} onClick={() => { setLocation(loc); setShowLocationPicker(false); }} className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">#{loc}</button>
                      ))}
                    </div>
                  </div>
                )}

                {showPaymentPicker && (
                  <div className="grid grid-cols-5 gap-3">
                    {PAYMENT_METHODS.map(pm => (
                      <button 
                        key={pm.id} 
                        onClick={() => { setPaymentMethod(pm.name); setShowPaymentPicker(false); }} 
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${paymentMethod === pm.name ? 'bg-primary/10 border-primary/30' : 'bg-slate-50 dark:bg-slate-800 border-transparent'}`}
                      >
                        <span className={`material-symbols-outlined ${pm.color} text-[24px]`}>{pm.icon}</span>
                        <span className="text-[10px] font-bold text-slate-500">{pm.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer Metadata inside text area area */}
            <div className="flex flex-wrap gap-2 px-5 pb-5">
              {location && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 border border-slate-100 dark:border-slate-700">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {location}
                  <button onClick={() => setLocation('')} className="ml-1 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[16px]">close</span></button>
                </div>
              )}
              {paymentMethod && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 border border-slate-100 dark:border-slate-700">
                  <span className="material-symbols-outlined text-[16px]">credit_card</span>
                  {paymentMethod}
                  <button onClick={() => setPaymentMethod('')} className="ml-1 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[16px]">close</span></button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags Section - Fixed height, single row horizontal scroll */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-slate-400 dark:text-slate-500 text-[12px] font-bold tracking-widest">标签</span>
            <button onClick={onManageTags} className="text-primary text-[12px] font-bold">管理</button>
          </div>
          
          <div className="flex overflow-x-auto gap-2.5 pb-2 -mx-2 px-2 hide-scrollbar">
            {availableTags.map(tag => (
              <button 
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-[13px] font-bold transition-all border ${
                  selectedTags.includes(tag) 
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Optional: Smart Tags hidden by default or shown compactly if requested */}
          {(smartTags.length > 0 || isAiLoading) && (
             <div className="mt-2 p-4 rounded-3xl bg-primary/5 border border-primary/10">
               <div className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase mb-3">
                 <span className="material-symbols-outlined text-[18px]">magic_button</span>
                 <span>智能建议</span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {isAiLoading ? (
                   <div className="h-7 w-28 bg-primary/10 animate-pulse rounded-full"></div>
                 ) : (
                   smartTags.map(st => (
                     <button key={st} onClick={() => toggleTag(st)} className={`text-[12px] px-4 py-1.5 rounded-full transition-all ${selectedTags.includes(st) ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-primary border border-primary/20 font-bold'}`}>+{st}</button>
                   ))
                 )}
               </div>
             </div>
          )}
        </div>
      </div>

      <footer className="px-6 py-6 bg-white/50 dark:bg-background-dark/50 ios-blur mt-auto">
        <div className="flex items-center justify-end mb-5 px-1">
          <span className="text-[12px] text-slate-400 font-bold uppercase">
            {transaction?.date || new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date())}
          </span>
        </div>
        <button 
          onClick={handleSave} 
          className="w-full bg-primary text-white py-4.5 rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-blue-600 active:scale-[0.98] transition-all"
        >
          保存账单
        </button>
      </footer>
    </div>
  );
};

export default EditScreen;
