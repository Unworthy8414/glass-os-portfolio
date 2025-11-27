import React from 'react';
import LiquidGlass from 'liquid-glass-react';

interface GlassProps {
    className?: string;
    children?: React.ReactNode;
}

export const GlassSurface: React.FC<GlassProps> = ({ className, children }) => {
    return (
        <div className={`h-full w-full ${className}`}>
            {/* @ts-ignore */}
            <LiquidGlass
                blurAmount={20}
                saturation={110}
                elasticity={0.1}
                className="h-full w-full"
            >
                {/* We need a container here that is full size but transparent */}
                <div className="h-full w-full flex flex-col bg-white/5">
                    {children}
                </div>
            </LiquidGlass>
        </div>
    );
};
