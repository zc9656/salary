import React from 'react';

interface InputGroupProps {
  label: string;
  value: number | string;
  onChange: (val: string) => void;
  type?: 'number' | 'text';
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  placeholder?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  min,
  max,
  step,
  suffix,
  placeholder
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-slate-600 tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 font-semibold"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
