import * as React from 'react';

interface PayPalUSDLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PayPalUSDLogo({ className = '', size = 'md' }: PayPalUSDLogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-8',
    md: 'w-24 h-12',
    lg: 'w-32 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* PayPal P logo */}
        <g>
          <path 
            d="M20 20 L20 80 L35 80 L35 55 L50 55 C65 55 75 45 75 35 C75 25 65 20 50 20 Z M35 35 L35 40 L50 40 C55 40 60 38 60 35 C60 32 55 30 50 30 L35 30 Z" 
            fill="#0070ba"
          />
        </g>
        
        {/* "ayPal" text */}
        <g fill="#0070ba">
          <text x="80" y="45" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">ayPal</text>
        </g>
        
        {/* USD text */}
        <g fill="#142c8e">
          <text x="80" y="65" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">USD</text>
        </g>
        
        {/* Decorative elements */}
        <circle cx="160" cy="35" r="3" fill="#0070ba" opacity="0.6"/>
        <circle cx="170" cy="45" r="2" fill="#142c8e" opacity="0.8"/>
        <circle cx="175" cy="35" r="1.5" fill="#0070ba" opacity="0.7"/>
      </svg>
    </div>
  );
}