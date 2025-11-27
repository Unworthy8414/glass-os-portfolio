import React from 'react';

export const D20Icon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {/* Outer Hexagon */}
        <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" />
        
        {/* Inner Triangle (pointing down) */}
        <path d="M12 16 L7 8 L17 8 Z" />
        
        {/* Connecting lines */}
        <path d="M12 2 V 8" />
        <path d="M12 16 V 22" />
        <path d="M21 7 L17 8" />
        <path d="M21 17 L12 16" /> {/* Actually usually connects to vertices */}
        <path d="M3 17 L7 8" /> {/* Wait, this looks messy. Let's use standard projection */}
        
        {/* Standard Projection Cleanup */}
        <path d="M12 22 V 16" />
        <path d="M12 2 V 8" />
        <path d="M7 8 L 3 7" />
        <path d="M17 8 L 21 7" />
        <path d="M7 8 L 3 17" />
        <path d="M17 8 L 21 17" />
        <path d="M12 16 L 3 17" />
        <path d="M12 16 L 21 17" />
    </svg>
);
