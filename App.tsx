
import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import EditScreen from './screens/EditScreen';
import TagsScreen from './screens/TagsScreen';
import HistoryScreen from './screens/HistoryScreen';
import BottomNav from './components/BottomNav';
import { Screen, Transaction, TransactionType } from './types';
import { MOCK_TRANSACTIONS } from './constants';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddClick = () => {
    setEditingTransaction(null);
    setCurrentScreen('EDIT');
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
    } else {
      setTransactions(prev => [transaction, ...prev]);
    }
    setCurrentScreen('HOME');
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setCurrentScreen('EDIT');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen 
          transactions={transactions} 
          onEdit={handleEditTransaction} 
        />;
      case 'HISTORY':
        return <HistoryScreen transactions={transactions} />;
      case 'EDIT':
        return (
          <EditScreen 
            transaction={editingTransaction} 
            onSave={handleSaveTransaction} 
            onClose={() => setCurrentScreen('HOME')}
            onManageTags={() => setCurrentScreen('TAGS')}
          />
        );
      case 'TAGS':
        return <TagsScreen onBack={() => setCurrentScreen('EDIT')} />;
      case 'ANALYTICS':
        return (
          <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">analytics</span>
            <h2 className="text-xl font-bold">分析功能即将上线</h2>
            <p className="text-slate-500 mt-2">在这里您可以查看收支趋势与明细统计</p>
            <button 
              onClick={() => setCurrentScreen('HOME')}
              className="mt-6 text-primary font-medium"
            >
              回到首页
            </button>
          </div>
        );
      case 'SETTINGS':
        return (
          <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">settings</span>
            <h2 className="text-xl font-bold">设置</h2>
            <p className="text-slate-500 mt-2">偏好设置、深色模式与数据导出</p>
            <button 
              onClick={() => setCurrentScreen('HOME')}
              className="mt-6 text-primary font-medium"
            >
              回到首页
            </button>
          </div>
        );
      default:
        return <HomeScreen transactions={transactions} onEdit={handleEditTransaction} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden flex flex-col">
      <div className="flex-1 pb-24">
        {renderScreen()}
      </div>
      
      {currentScreen !== 'EDIT' && currentScreen !== 'TAGS' && (
        <BottomNav 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
          onAdd={handleAddClick}
        />
      )}
    </div>
  );
};

export default App;
