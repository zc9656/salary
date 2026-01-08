import React from 'react';
import { RecordMap, Currency } from '../types';

interface CalendarProps {
  currentDate: Date;
  records: RecordMap;
  currency: Currency;
  onDateClick: (dateStr: string) => void;
  onMonthChange: (increment: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  records,
  currency,
  onDateClick,
  onMonthChange,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of the month and number of days
  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate calendar days
  const calendarDays = [];
  // Pad empty days at start
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Fill actual days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getRecord = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return records[dateStr];
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateClick(dateStr);
  };

  const monthNames = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ];

  // Calculate monthly total
  const monthlyTotal = Object.entries(records).reduce((sum, [date, record]) => {
    const [rYear, rMonth] = date.split('-').map(Number);
    if (rYear === year && rMonth === month + 1) {
      return sum + record.total;
    }
    return sum;
  }, 0);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 ring-1 ring-slate-900/5 max-w-md w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => onMonthChange(-1)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-xl font-bold tracking-wide">
            {year}年 {monthNames[month]}
          </h2>
          <button 
            onClick={() => onMonthChange(1)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="text-center">
          <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">本月累計預估</p>
          <p className="text-3xl font-bold">{monthlyTotal.toLocaleString()} <span className="text-sm font-normal opacity-80">{currency}</span></p>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2 text-center">
          {['日', '一', '二', '三', '四', '五', '六'].map((d, i) => (
            <div key={i} className={`text-xs font-bold ${i === 0 || i === 6 ? 'text-rose-500' : 'text-slate-400'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square"></div>;
            }

            const record = getRecord(day);
            const hasRecord = record && record.total > 0;

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`
                  relative flex flex-col items-center justify-start pt-2 aspect-square rounded-xl transition-all duration-200 border
                  ${hasRecord 
                    ? 'bg-blue-50 border-blue-100 hover:bg-blue-100' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }
                `}
              >
                <span className={`text-sm font-semibold ${hasRecord ? 'text-blue-700' : 'text-slate-700'}`}>
                  {day}
                </span>
                
                {hasRecord && (
                  <span className="mt-1 text-[10px] font-bold text-blue-600 bg-blue-100/50 px-1 rounded-md transform scale-90 whitespace-nowrap overflow-hidden max-w-full">
                    +{record.total.toLocaleString()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
