import React, { useRef, useState, useCallback, useEffect } from 'react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  intensity?: number;
}

export const TiltCard = ({ 
  children, 
  className = '', 
  disabled = false,
  intensity = 15,
  ...props 
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [shine, setShine] = useState('');
  
  // Performance: Track animation frame to prevent layout thrashing
  const requestRef = useRef<number>();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disabled) return;
    
    // Persist event values since React recycles events, 
    // though less of an issue with RAF, it's safer for calculation
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (requestRef.current) return; // Skip if a frame is already requested

    requestRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      const rotateX = ((y - rect.height / 2) / rect.height) * -intensity;
      const rotateY = ((x - rect.width / 2) / rect.width) * intensity;

      setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
      
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      setShine(`radial-gradient(circle at ${shineX.toFixed(1)}% ${shineY.toFixed(1)}%, rgba(255,255,255,0.1), transparent 50%)`);
      
      requestRef.current = undefined;
    });
  }, [disabled, intensity]);

  const handleMouseLeave = useCallback(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = undefined;
    
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setShine('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`transition-all duration-300 ease-out transform-gpu will-change-transform bg-[#1e1e2e]/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      {...props} 
    >
      <div 
        className="absolute inset-0 z-10 pointer-events-none rounded-[inherit] transition-opacity duration-200" 
        style={{ background: shine }}
      />
      {children}
    </div>
  );
};