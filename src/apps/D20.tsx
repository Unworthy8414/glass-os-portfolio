import React, { useState, useRef } from 'react';

export const D20: React.FC = () => {
    const [result, setResult] = useState<number | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    const d20Ref = useRef<HTMLDivElement>(null);

    const faceSize = 80; 
    const apothem = faceSize * Math.sqrt(3) * (3 + Math.sqrt(5)) / 12; 

    const getFaces = () => {
        const faces: { style: string, rx: number, ry: number, rz: number }[] = [];
        const r = apothem * 1.02; 
        const tilt1 = 52.62;
        const tilt2 = 10.81;

        // Ring 1 (Top Cap): Tip Up.
        for (let i = 0; i < 5; i++) {
            const ry = i * 72;
            const rx = tilt1;
            const rz = 0;
            faces.push({ 
                style: `rotateY(${ry}deg) rotateX(${rx}deg) translateZ(${r}px)`,
                rx, ry, rz 
            });
        }

        // Ring 2 (Upper Mid): Tip Down.
        for (let i = 0; i < 5; i++) {
            const ry = i * 72;
            const rx = tilt2;
            const rz = 180;
            faces.push({ 
                style: `rotateY(${ry}deg) rotateX(${rx}deg) translateZ(${r}px) rotateZ(${rz}deg)`,
                rx, ry, rz 
            });
        }

        // Ring 3 (Lower Mid): Tip Up.
        for (let i = 0; i < 5; i++) {
            const ry = i * 72 + 36;
            const rx = -tilt2;
            const rz = 0;
            faces.push({ 
                style: `rotateY(${ry}deg) rotateX(${rx}deg) translateZ(${r}px)`,
                rx, ry, rz 
            });
        }

        // Ring 4 (Bottom Cap): Tip Down.
        for (let i = 0; i < 5; i++) {
            const ry = i * 72 + 36;
            const rx = -tilt1;
            const rz = 180;
            faces.push({ 
                style: `rotateY(${ry}deg) rotateX(${rx}deg) translateZ(${r}px) rotateZ(${rz}deg)`,
                rx, ry, rz 
            });
        }

        return faces;
    };

    const faces = getFaces();

    const roll = () => {
        if (isRolling) return;
        setIsRolling(true);
        setResult(null);

        const targetIndex = Math.floor(Math.random() * 20);
        const targetFace = faces[targetIndex];
        const spins = 4 + Math.floor(Math.random() * 3); // 4 to 6 spins

        if (d20Ref.current) {
             // Calculate target rotation to bring face to front
             // We want to invert the face's rotation.
             // Order of application on face: Y -> X -> Z(180)
             // Order of "unwinding" on container: Z(-180) -> X(-x) -> Y(-y)
             // Plus extra spins on Y and X axes for effect.
             
             const targetRx = -targetFace.rx + (spins * 360); 
             const targetRy = -targetFace.ry + (spins * 360);
             const targetRz = -targetFace.rz; 

             d20Ref.current.style.transition = 'transform 3s cubic-bezier(0.15, 0, 0.15, 1)'; // Ease out
             // Apply in reverse order of face construction: Z, then X, then Y
             d20Ref.current.style.transform = `rotateZ(${targetRz}deg) rotateX(${targetRx}deg) rotateY(${targetRy}deg)`;
        }

        setTimeout(() => {
            setIsRolling(false);
            setResult(targetIndex + 1);
        }, 3000);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#1e1e1e]/90 text-white font-sans backdrop-blur-sm overflow-hidden">
            <div className="relative flex-1 w-full flex items-center justify-center perspective-container">
                <div className="scene">
                    <div 
                        ref={d20Ref}
                        className="d20"
                        style={{ transform: 'rotateX(-20deg) rotateY(-20deg)' }}
                    >
                        {/* Faces */}
                        {faces.map((face, i) => (
                             <div 
                                key={i} 
                                className="face" 
                                style={{ transform: face.style }}
                             >
                                 {i + 1}
                             </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-32 flex flex-col items-center justify-start gap-4 pb-8 z-10">
                <div className="h-16 flex items-center justify-center">
                    {result !== null && !isRolling && (
                        <div className="text-5xl font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-in zoom-in duration-300">
                            {result}
                        </div>
                    )}
                    {isRolling && (
                        <div className="text-lg text-white/50 animate-pulse">
                            Rolling...
                        </div>
                    )}
                </div>
                
                <button
                    onClick={roll}
                    disabled={isRolling}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-800/50 disabled:text-white/30 disabled:cursor-not-allowed rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 ring-1 ring-white/20"
                >
                    Roll D20
                </button>
            </div>

            <style>{`
                .perspective-container {
                    perspective: 1000px;
                }
                .scene {
                    width: 200px;
                    height: 200px;
                    position: relative;
                    transform-style: preserve-3d;
                }
                .d20 {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    transform-style: preserve-3d;
                }
                .face {
                    position: absolute;
                    width: ${faceSize}px;
                    height: ${faceSize * Math.sqrt(3) / 2}px;
                    background: rgba(30, 64, 175, 0.85); 
                    border-bottom: 1px solid rgba(147, 197, 253, 0.3); /* Subtle borders */
                    color: white;
                    font-size: 30px;
                    font-weight: bold;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    
                    /* Center positioning */
                    left: calc(50% - ${faceSize / 2}px);
                    top: calc(50% - ${faceSize * Math.sqrt(3) / 4}px);
                    
                    /* Shape */
                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                    transform-origin: 50% 66.66%; /* Approx Centroid */
                    backface-visibility: hidden; /* Hide back for solidity */
                    
                    /* Text adjustment */
                    padding-top: ${faceSize * 0.3}px;
                }
                /* Add some internal bevel/shadow effect */
                .face::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%);
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};
