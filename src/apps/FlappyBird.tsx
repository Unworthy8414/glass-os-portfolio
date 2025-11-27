import React, { useState, useEffect, useRef } from 'react';

const GRAVITY = 0.4;
const JUMP = -7;
const PIPE_SPEED = 3;
const PIPE_SPAWN_RATE = 2000;

export const FlappyBird: React.FC = () => {
    const [birdY, setBirdY] = useState(250);
    const [velocity, setVelocity] = useState(0);
    const [pipes, setPipes] = useState<{ x: number; topHeight: number }[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    
    const gameLoop = useRef<number | null>(null);
    const lastPipeTime = useRef<number>(0);

    const resetGame = () => {
        setBirdY(250);
        setVelocity(0);
        setPipes([]);
        setScore(0);
        setGameOver(false);
        setGameStarted(false);
    };

    useEffect(() => {
        if (!gameStarted || gameOver) {
            if (gameLoop.current) cancelAnimationFrame(gameLoop.current);
            return;
        }

        const loop = (timestamp: number) => {
            // Physics
            setBirdY(y => y + velocity);
            setVelocity(v => v + GRAVITY);

            // Pipes
            if (timestamp - lastPipeTime.current > PIPE_SPAWN_RATE) {
                setPipes(p => [...p, { x: 900, topHeight: Math.random() * 200 + 100 }]);
                lastPipeTime.current = timestamp;
            }

            setPipes(currentPipes => {
                return currentPipes
                    .map(p => ({ ...p, x: p.x - PIPE_SPEED }))
                    .filter(p => p.x > -60);
            });
            
            gameLoop.current = requestAnimationFrame(loop);
        };

        gameLoop.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(gameLoop.current!);
    }, [gameStarted, gameOver, velocity]); 

    // Separate Collision Effect
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const birdTop = birdY;
        const birdBottom = birdY + 30; // 30 is player size
        const birdLeft = 50; // fixed x
        const birdRight = 80;

        // Bounds
        if (birdTop < 0 || birdBottom > 500) {
            setGameOver(true);
        }

        pipes.forEach(p => {
             const pipeLeft = p.x;
             const pipeRight = p.x + 50;
             const gapTop = p.topHeight;
             const gapBottom = p.topHeight + 150; // Gap size

             if (birdRight > pipeLeft && birdLeft < pipeRight) {
                 if (birdTop < gapTop || birdBottom > gapBottom) {
                     setGameOver(true);
                 }
             }
        });

    }, [birdY, pipes, gameStarted, gameOver]);

    // Score fix: Count pipes passed
    useEffect(() => {
        if (!gameStarted || gameOver) return;
        const passed = pipes.filter(p => p.x + 50 <= 50 && p.x + 50 > 50 - PIPE_SPEED);
        if (passed.length > 0) setScore(s => s + 1);
    }, [pipes, gameStarted, gameOver]);


    const jump = () => {
        if (!gameStarted) setGameStarted(true);
        if (!gameOver) setVelocity(JUMP);
        else resetGame();
    };

    return (
        <div 
            className="w-full h-full relative overflow-hidden bg-slate-900 select-none cursor-pointer font-mono" 
            onClick={jump}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10" 
                style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
            />
            
            {/* Ground */}
            <div className="absolute bottom-0 w-full h-2 bg-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.6)] z-20" />

            {/* Player (Neon Box) */}
            <div 
                className="absolute left-[50px] w-[30px] h-[30px] bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] border border-white z-30"
                style={{ top: birdY, transform: `rotate(${velocity * 5}deg)` }}
            />

            {/* Obstacles (Neon Columns) */}
            {pipes.map((p, i) => (
                <React.Fragment key={i}>
                    {/* Top Column */}
                    <div 
                        className="absolute w-[50px] bg-cyan-900/80 border-x border-b border-cyan-400/50 z-20 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                        style={{ left: p.x, top: 0, height: p.topHeight }}
                    />
                    {/* Bottom Column */}
                    <div 
                        className="absolute w-[50px] bg-cyan-900/80 border-x border-t border-cyan-400/50 z-20 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                        style={{ left: p.x, top: p.topHeight + 150, bottom: 0 }}
                    />
                </React.Fragment>
            ))}

            {/* UI */}
            <div className="absolute top-10 w-full text-center z-50 pointer-events-none">
                <span className="text-6xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] opacity-80">{score}</span>
            </div>

            {/* Game Over / Start Screen */}
            {(!gameStarted || gameOver) && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-50 backdrop-blur-sm">
                    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl text-center border border-white/10 max-w-sm w-full mx-4">
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 mb-2 tracking-tighter">
                            {gameOver ? 'CRASHED' : 'FLOATY BOX'}
                        </h1>
                        <p className="text-gray-400 mb-6 text-sm uppercase tracking-widest">{gameOver ? `Score: ${score}` : 'Tap to Float'}</p>
                        <button className="w-full px-6 py-3 bg-white text-slate-900 font-bold rounded hover:bg-gray-200 transition-all uppercase tracking-wider text-sm">
                            {gameOver ? 'Retry' : 'Start Game'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
