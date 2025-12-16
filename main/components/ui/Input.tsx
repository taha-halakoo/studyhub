import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', id, ...props }: InputProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold uppercase text-[#a6adc8] mb-1 tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={`
          w-full bg-[#1e1e2e] text-white 
          border border-[#313244] rounded-lg px-4 py-3
          placeholder-[#585b70] outline-none 
          focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa] 
          transition-all duration-200
          ${error ? 'border-[#f38ba8] focus:border-[#f38ba8] focus:ring-[#f38ba8]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span id={errorId} className="text-xs text-[#f38ba8] mt-1 block" role="alert">{error}</span>}
    </div>
  );
};