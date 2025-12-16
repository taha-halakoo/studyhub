import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = "font-bold rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#89b4fa] text-[#1e1e2e] hover:bg-white shadow-lg shadow-[#89b4fa]/20",
    secondary: "bg-[#313244] text-white hover:bg-[#45475a] border border-[#45475a]",
    danger: "bg-[#f38ba8]/10 text-[#f38ba8] hover:bg-[#f38ba8] hover:text-[#1e1e2e] border border-[#f38ba8]/20",
    ghost: "text-[#a6adc8] hover:text-white hover:bg-[#313244]/50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <Spinner size={16} className="mr-2" />}
      {children}
    </button>
  );
};