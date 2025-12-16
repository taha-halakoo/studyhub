import React from 'react';
import { LucideIcon, Ghost } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ 
  title = "No Data Found", 
  description = "There is nothing here yet.", 
  icon: Icon = Ghost, 
  action,
  className = ''
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center animate-fade-in ${className}`}>
      <div className="w-16 h-16 bg-[#252535] rounded-full flex items-center justify-center mb-4 border border-[#313244] shadow-inner">
        <Icon size={32} className="text-[#585b70]" />
      </div>
      <h3 className="text-lg font-bold text-[#cdd6f4] mb-2">{title}</h3>
      <p className="text-sm text-[#a6adc8] max-w-xs leading-relaxed mb-6">{description}</p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};
