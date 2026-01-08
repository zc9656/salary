
import React, { useState, useMemo } from 'react';
import { Currency, SalaryInputs } from '../types.ts';
import { InputGroup } from './InputGroup.tsx';
import { generateSalaryInsights } from '../services/geminiService.ts';

interface QuickCalculatorProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  inputs: SalaryInputs;
  setInputs: React.Dispatch<React.SetStateAction<SalaryInputs>>;
}

export const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  currency,
  onCurrencyChange,
  inputs,
  setInputs
}) => {
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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

  const getAIAdvice = async () => {
    if (totalSalary <= 0) return;
    setIsLoading(true);
    try {
      const advice = await generateSalaryInsights(inputs, { total: totalSalary }, currency);
      setInsight(advice);
    } catch (err) {
      setInsight('哎呀，AI 正在休息，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 ring-1 ring-slate-900/5 max-w-md w-full mx-auto p-8 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">快速計算器</h2>
        <p className="text-slate-500 text-sm mt-1">即時得出您的預期收入</p>
      </div>

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
        />

        <InputGroup
          label="上班時長 (Hours)"
          value={inputs.workHours}
          onChange={(v) => handleInputChange('workHours', v)}
          suffix="小時"
          min={0}
        />
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-blue-100 text-center shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2">
           <span className="flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
           </span>
        </div>
        <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-1">計算結果</p>
        <div className="text-4xl font-black text-slate-900 tracking-tight my-2">
          <span className="text-xl text-blue-400 font-medium mr-1">{currency}</span>
          {totalSalary.toLocaleString()}
        </div>
        <p className="text-slate-400 text-xs font-mono">
          {inputs.hourlyRate} × {inputs.workHours}
        </p>
      </div>

      <button
        onClick={getAIAdvice}
        disabled={isLoading || totalSalary === 0}
        className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-slate-200"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span>獲取 AI 理財分析</span>
          </>
        )}
      </button>

      {insight && (
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-sm text-slate-700 leading-relaxed animate-fade-in">
          <p className="font-bold text-blue-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15.657 14.243a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.464 14.95a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 111.414-1.414l.707.707z" /></svg>
            AI 理財建議
          </p>
          {insight}
        </div>
      )}
    </div>
  );
};
