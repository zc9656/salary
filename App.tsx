
import React, { useState, useEffect } from 'react';
import { Currency, RecordMap, DailyRecord, SalaryInputs } from './types.ts';
import { Calendar } from './components/Calendar.tsx';
import { DailyEditor } from './components/DailyEditor.tsx';
import { QuickCalculator } from './components/QuickCalculator.tsx';

const App: React.FC = () => {
  // --- State ---
  const [currency, setCurrency] = useState<Currency>(Currency.TWD);
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null); 
  const [records, setRecords] = useState<RecordMap>({});
  const [view, setView] = useState<'calendar' | 'quick'>('calendar');
  const [quickInputs, setQuickInputs] = useState<SalaryInputs>({
    hourlyRate: 183,
    workHours: 0
  });

  // --- Persistence ---
  useEffect(() => {
    const savedRecords = localStorage.getItem('salary_app_records');
    const savedCurrency = localStorage.getItem('salary_app_currency');
    const savedQuick = localStorage.getItem('salary_app_quick');
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }
    
    if (savedCurrency) {
      setCurrency(savedCurrency as Currency);
    }

    if (savedQuick) {
      try {
        setQuickInputs(JSON.parse(savedQuick));
      } catch (e) {
        console.error("Failed to parse quick inputs", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('salary_app_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('salary_app_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('salary_app_quick', JSON.stringify(quickInputs));
  }, [quickInputs]);

  // --- Handlers ---
  const handleMonthChange = (increment: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + increment);
      return newDate;
    });
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const handleSaveRecord = (record: DailyRecord) => {
    if (selectedDate) {
      setRecords(prev => ({
        ...prev,
        [selectedDate]: record
      }));
      setSelectedDate(null);
    }
  };

  const handleBack = () => {
    setSelectedDate(null);
  };

  const handleClearAll = () => {
    if (window.confirm('確定要清除所有已儲存的工時資料嗎？此動作無法復原。')) {
      setRecords({});
      localStorage.removeItem('salary_app_records');
      alert('資料已清空');
    }
  };

  const getLastHourlyRate = (): number => {
    const dates = Object.keys(records).sort();
    if (dates.length > 0) {
      return records[dates[dates.length - 1]].hourlyRate;
    }
    return quickInputs.hourlyRate || 183;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center p-4 pt-8 sm:pt-12">
      <div className="max-w-md w-full mb-6">
        <div className="flex justify-center items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">薪資計算大師</h1>
        </div>
        <p className="text-slate-500 text-center text-sm mb-8 flex items-center justify-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          資料已自動儲存至本機
        </p>
        
        {!selectedDate && (
          <div className="flex bg-slate-200/50 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setView('calendar')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${view === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              工時日誌
            </button>
            <button 
              onClick={() => setView('quick')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${view === 'quick' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              快速計算
            </button>
          </div>
        )}
      </div>

      <div className="w-full animate-fade-in">
        {selectedDate ? (
          <DailyEditor
            dateStr={selectedDate}
            initialRecord={records[selectedDate]}
            defaultHourlyRate={getLastHourlyRate()}
            currency={currency}
            onSave={handleSaveRecord}
            onBack={handleBack}
            onCurrencyChange={setCurrency}
          />
        ) : (
          <>
            {view === 'calendar' ? (
              <Calendar
                currentDate={currentDate}
                records={records}
                currency={currency}
                onDateClick={handleDateClick}
                onMonthChange={handleMonthChange}
              />
            ) : (
              <QuickCalculator 
                currency={currency} 
                onCurrencyChange={setCurrency}
                inputs={quickInputs}
                setInputs={setQuickInputs}
              />
            )}
          </>
        )}
      </div>
      
      <footer className="mt-12 text-slate-400 text-xs text-center pb-8 space-y-4">
        <button 
          onClick={handleClearAll}
          className="text-slate-300 hover:text-rose-400 transition-colors underline decoration-dotted"
        >
          清除所有儲存資料
        </button>
        <p>&copy; {new Date().getFullYear()} Salary Master • 您的隱私受本機儲存保護</p>
      </footer>
    </div>
  );
};

export default App;
