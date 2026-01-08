import React, { useState, useEffect } from 'react';
import { Currency, RecordMap, DailyRecord } from './types';
import { Calendar } from './components/Calendar';
import { DailyEditor } from './components/DailyEditor';

const App: React.FC = () => {
  // --- State ---
  const [currency, setCurrency] = useState<Currency>(Currency.TWD);
  const [currentDate, setCurrentDate] = useState(new Date()); // Controls the Calendar View Month
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // If not null, show Editor
  const [records, setRecords] = useState<RecordMap>({});

  // --- Persistence ---
  // Load data on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('salary_app_records');
    const savedCurrency = localStorage.getItem('salary_app_currency');
    
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
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem('salary_app_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('salary_app_currency', currency);
  }, [currency]);

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
      setSelectedDate(null); // Go back to calendar
    }
  };

  const handleBack = () => {
    setSelectedDate(null);
  };

  // Helper to find most recent hourly rate for UX convenience
  const getLastHourlyRate = (): number => {
    const dates = Object.keys(records).sort();
    if (dates.length > 0) {
      return records[dates[dates.length - 1]].hourlyRate;
    }
    return 183; // Default
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex items-start justify-center p-4 pt-8 sm:pt-12">
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
        <Calendar
          currentDate={currentDate}
          records={records}
          currency={currency}
          onDateClick={handleDateClick}
          onMonthChange={handleMonthChange}
        />
      )}
    </div>
  );
};

export default App;
