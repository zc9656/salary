import React, { useState, useMemo, useEffect } from 'react';
import { Currency, SalaryInputs, DailyRecord } from '../types';
import { InputGroup } from './InputGroup';

interface DailyEditorProps {
  dateStr: string;
  initialRecord?: DailyRecord;
  defaultHourlyRate: number;
  currency: Currency;
  onSave: (record: DailyRecord) => void;
  onBack: () => void;
  onCurrencyChange: (c: Currency) => void;
}

export const DailyEditor: React.FC<DailyEditorProps> = ({
  dateStr,
  initialRecord,
  defaultHourlyRate,
  currency,
  onSave,
  onBack,
  onCurrencyChange
}) => {
  const [inputs, setInputs] = useState<SalaryInputs>({
    hourlyRate: initialRecord?.hourlyRate || defaultHourlyRate,
    workHours: initialRecord?.workHours || 0,
  });

  const totalSalary = useMemo(() => {
    return Math.round(inputs.hourlyRate * inputs.workHours);
  }, [inputs]);

  const handleInputChange = (field: keyof SalaryInputs, value: string) => {
    const numVal = parseFloat(value);
    setInputs(prev => ({
      ...prev,
      [field]: isNaN(numVal) ? 0 : numVal
    }));
  };

  const handleSave = () => {
    onSave({
      hourlyRate: inputs.hourlyRate,
      workHours: inputs.workHours,
      total: totalSalary
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 ring-1 ring-slate-900/5 max-w-md w-full mx-auto">
      {/* Header */}
      <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          返回行事曆
        </button>
        <div className="text-slate-800 font-bold">
            {dateStr}
        </div>
        <div className="w-20"></div> {/* Spacer for center alignment */}
      </div>

      <div className="p-8 space-y-8">
        {/* Top Banner */}
        <div className="text-center">
             <h2 className="text-2xl font-bold text-slate-800">編輯當日工時</h2>
             <p className="text-slate-500 text-sm mt-1">輸入您的時薪與工作時數</p>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="flex justify-end">
             <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 py-1.5 px-3 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              >
                {Object.values(Currency).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
          </div>

          <InputGroup
            label="時薪 (Hourly Rate)"
            value={inputs.hourlyRate}
            onChange={(v) => handleInputChange('hourlyRate', v)}
            suffix={currency}
            min={0}
            placeholder="輸入時薪"
          />

          <InputGroup
            label="上班時長 (Hours)"
            value={inputs.workHours}
            onChange={(v) => handleInputChange('workHours', v)}
            suffix="小時"
            min={0}
            placeholder="輸入工作時數"
          />
        </div>

        {/* Live Calculation */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium mb-1">當日薪資預估</p>
            <div className="text-4xl font-black text-slate-900 tracking-tight my-2">
              <span className="text-xl text-slate-400 font-medium mr-1">$</span>
              {totalSalary.toLocaleString()}
            </div>
            <p className="text-slate-400 text-xs font-mono">
               {inputs.hourlyRate} × {inputs.workHours}
            </p>
        </div>

        {/* Actions */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98]"
        >
          確認儲存
        </button>
      </div>
    </div>
  );
};
