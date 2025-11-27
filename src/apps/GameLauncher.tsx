import React, { useState } from 'react';
import { Snake } from './Snake';
import { FlappyBird } from './FlappyBird';
import { Gamepad, Bird } from 'lucide-react';

export const GameLauncher: React.FC<{ windowId: string }> = () => {
    const [activeGame, setActiveGame] = useState<'menu' | 'snake' | 'flappy'>('menu');

    if (activeGame === 'snake') return (
        <div className="w-full h-full relative">
             <button onClick={() => setActiveGame('menu')} className="absolute top-4 left-4 z-50 text-white/50 hover:text-white text-xs uppercase font-bold tracking-widest bg-black/20 px-2 py-1 rounded backdrop-blur-md">Back to Menu</button>
             <Snake />
        </div>
    );
    
    if (activeGame === 'flappy') return (
         <div className="w-full h-full relative">
             <button onClick={() => setActiveGame('menu')} className="absolute top-4 left-4 z-50 text-black/50 hover:text-black text-xs uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded backdrop-blur-md">Back to Menu</button>
             <FlappyBird />
        </div>
    );

    return (
        <div className="w-full h-full bg-[#111] text-white flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">ARCADE</h1>
            <p className="text-white/40 text-sm mb-12 uppercase tracking-widest">Choose your game</p>
            
            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                <button 
                    onClick={() => setActiveGame('snake')}
                    className="group relative aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 group-hover:opacity-100 opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <Gamepad size={48} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                        <span className="text-xl font-bold tracking-wide">NEON SNAKE</span>
                    </div>
                </button>

                <button 
                    onClick={() => setActiveGame('flappy')}
                    className="group relative aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/10 hover:border-sky-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                     <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 to-teal-900/20 group-hover:opacity-100 opacity-50 transition-opacity" />
                     <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <Bird size={48} className="text-sky-400 group-hover:text-sky-300 transition-colors" />
                        <span className="text-xl font-bold tracking-wide">FLAPPY BIRD</span>
                    </div>
                </button>
            </div>
        </div>
    );
};
