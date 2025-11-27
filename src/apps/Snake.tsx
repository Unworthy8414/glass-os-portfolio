import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 120;

// Simple Audio Synth for beeps
const playSound = (type: 'eat' | 'die') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'eat') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        }
    } catch (e) {
        console.error(e);
    }
};

export const Snake: React.FC = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [nextDirection, setNextDirection] = useState({ x: 0, y: -1 }); // Buffer for input
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    
    const lastTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);

    const moveSnake = useCallback((timestamp: number) => {
        if (gameOver) return;

        if (timestamp - lastTimeRef.current < INITIAL_SPEED) {
            animationFrameRef.current = requestAnimationFrame(moveSnake);
            return;
        }
        lastTimeRef.current = timestamp;

        setDirection(nextDirection); // Apply buffered direction

        setSnake((prevSnake) => {
            const newHead = {
                x: prevSnake[0].x + nextDirection.x,
                y: prevSnake[0].y + nextDirection.y
            };

            // Collision Detection
            if (
                newHead.x < 0 || newHead.x >= GRID_SIZE ||
                newHead.y < 0 || newHead.y >= GRID_SIZE ||
                prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
            ) {
                setGameOver(true);
                if (soundEnabled) playSound('die');
                return prevSnake;
            }

            const newSnake = [newHead, ...prevSnake];
            
            // Eat Food
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore(s => s + 1);
                if (soundEnabled) playSound('eat');
                setFood({
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE)
                });
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
        
        animationFrameRef.current = requestAnimationFrame(moveSnake);
    }, [gameOver, nextDirection, food, soundEnabled]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
            
            // Input Buffering Logic: Prevent reversing directly
            switch(e.key) {
                case 'ArrowUp': 
                    if(direction.y !== 1) setNextDirection({ x: 0, y: -1 }); 
                    break;
                case 'ArrowDown': 
                    if(direction.y !== -1) setNextDirection({ x: 0, y: 1 }); 
                    break;
                case 'ArrowLeft': 
                    if(direction.x !== 1) setNextDirection({ x: -1, y: 0 }); 
                    break;
                case 'ArrowRight': 
                    if(direction.x !== -1) setNextDirection({ x: 1, y: 0 }); 
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction]);

    useEffect(() => {
        if (!gameOver) {
            animationFrameRef.current = requestAnimationFrame(moveSnake);
        } else {
            cancelAnimationFrame(animationFrameRef.current);
        }
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [gameOver, moveSnake]);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection({ x: 0, y: -1 });
        setNextDirection({ x: 0, y: -1 });
        setScore(0);
        setGameOver(false);
        setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
        lastTimeRef.current = 0;
    };

    return (
        <div className="w-full h-full bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] flex flex-col items-center justify-center text-white font-sans select-none">
            {/* Header UI */}
            <div className="mb-6 flex justify-between w-[400px] items-center px-4">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold drop-shadow-glow">Score</span>
                    <span className="text-3xl font-light font-mono text-white drop-shadow-lg">{score.toString().padStart(3, '0')}</span>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-gray-500" />}
                    </button>
                    <button 
                        onClick={resetGame} 
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>
            
            {/* Game Board */}
            <div 
                className="relative bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_60px_-15px_rgba(34,211,238,0.15)] backdrop-blur-md"
                style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
            >
                {/* Neon Grid */}
                <div 
                    className="absolute inset-0 opacity-[0.08]" 
                    style={{ 
                        backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`, 
                        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` 
                    }} 
                />

                <AnimatePresence>
                    {gameOver && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20 flex-col"
                        >
                            <h2 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500 drop-shadow-lg">GAME OVER</h2>
                            <button 
                                onClick={resetGame} 
                                className="px-8 py-3 bg-white text-black rounded-full hover:scale-105 transition-transform font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase tracking-wide text-sm"
                            >
                                Restart
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Food with Animation */}
                <motion.div 
                    layoutId="food"
                    className="absolute rounded-full shadow-[0_0_15px_rgba(244,114,182,0.8)]"
                    style={{
                        left: food.x * CELL_SIZE + 2,
                        top: food.y * CELL_SIZE + 2,
                        width: CELL_SIZE - 4,
                        height: CELL_SIZE - 4,
                        background: 'radial-gradient(circle at 30% 30%, #f472b6, #be185d)'
                    }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                />

                {/* Snake Segments */}
                {snake.map((seg, i) => (
                    <motion.div 
                        key={`${seg.x}-${seg.y}`}
                        className="absolute rounded-sm shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                        style={{
                            left: seg.x * CELL_SIZE + 1,
                            top: seg.y * CELL_SIZE + 1,
                            width: CELL_SIZE - 2,
                            height: CELL_SIZE - 2,
                            background: i === 0 ? '#fff' : `rgba(34, 211, 238, ${1 - (i / (snake.length + 15))})`,
                            zIndex: snake.length - i
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.1 }}
                    />
                ))}
            </div>
            <div className="mt-6 text-[10px] text-cyan-200/40 tracking-[0.2em] uppercase font-bold">GlassOS Arcade</div>
        </div>
    );
};
