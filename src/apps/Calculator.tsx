import React, { useState, useEffect, useCallback } from 'react';

interface CalculatorProps {
  windowId: string;
  size: { width: number; height: number };
}

export const Calculator: React.FC<CalculatorProps> = ({ size }) => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [isTrapped, setIsTrapped] = useState(false);
  const isScientific = size.width > 350;

  const safeEval = (expr: string) => {
      // Trap: Check for malicious keywords before any replacement
      if (/alert|script|document|window|console|eval|Function/.test(expr)) {
          setIsTrapped(true);
          throw new Error("Nice try");
      }

      // Replace visual symbols with JS math
      let cleanExpr = expr
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/√\(/g, 'Math.sqrt(')
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/\^/g, '**'); // Power

      // Handle factorial (!) simplistic approach for single numbers (e.g., 5!)
      // A real parser is better, but for this we'll use a regex replace for "number!" pattern
      cleanExpr = cleanExpr.replace(/(\d+)!/g, (_, n) => {
          let f = 1;
          for (let i = 2; i <= parseInt(n); i++) f *= i;
          return f.toString();
      });

      // eslint-disable-next-line no-eval
      return eval(cleanExpr);
  };

  const handleInput = useCallback((key: string) => {
      if (key === 'C') {
          setDisplay('0');
          return;
      }
      
      if (key === '=' || key === 'Enter') {
           try { 
               const result = safeEval(display);
               setDisplay(String(Number(result.toFixed(8))).slice(0, 12)); 
           } catch { setDisplay('Error'); }
           return;
      }

      if (key === 'Backspace') {
          setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
          return;
      }

      // Scientific / Memory Logic
      if (key === 'mc') { setMemory(0); return; }
      if (key === 'm+') { setMemory(m => m + parseFloat(display || '0')); return; }
      if (key === 'm-') { setMemory(m => m - parseFloat(display || '0')); return; }
      if (key === 'mr') { setDisplay(String(memory)); return; }
      if (key === 'Rand') { setDisplay(String(Math.random().toFixed(6))); return; }

      // Functions that wrap input or append
      const functions: Record<string, string> = {
          'sin': 'sin(', 'cos': 'cos(', 'tan': 'tan(', 
          'log10': 'log(', 'ln': 'ln(', '²√x': '√('
      };
      if (functions[key]) {
          setDisplay(prev => prev === '0' ? functions[key] : prev + functions[key]);
          return;
      }

      // Power / Factorial
      if (key === 'x²') { setDisplay(prev => `${prev}^2`); return; }
      if (key === 'x³') { setDisplay(prev => `${prev}^3`); return; }
      if (key === 'xʸ') { setDisplay(prev => `${prev}^`); return; }
      if (key === 'x!') { setDisplay(prev => `${prev}!`); return; }
      if (key === '10ˣ') { setDisplay(prev => `10^${prev}`); return; } // Simplified
      if (key === 'eˣ') { setDisplay(prev => `e^${prev}`); return; } // Simplified

      // Operators
      const operators: Record<string, string> = { '/': '÷', '*': '×', '-': '-', '+': '+' };
      if (operators[key]) {
          setDisplay(prev => prev + operators[key]);
          return;
      }

      // Numbers / Constants
      if (/^[0-9.]$/.test(key) || key === 'π' || key === 'e') {
          setDisplay(prev => prev === '0' || prev === 'Error' ? key : prev + key);
          return;
      }
      
      // Parenthesis
      if (key === '(' || key === ')') {
          setDisplay(prev => prev === '0' ? key : prev + key);
          return;
      }

      // Allow any other single char (letters for traps)
      if (key.length === 1) {
          setDisplay(prev => prev === '0' || prev === 'Error' ? key : prev + key);
      }

  }, [display, memory]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          // Allow alphabet for "scientific" keys... and traps ;)
          if (/[0-9a-zA-Z.+\-*/=]|Enter|Backspace|Escape|\(|\)/.test(e.key)) {
              e.preventDefault(); 
              if (e.key === 'Escape') handleInput('C');
              else handleInput(e.key);
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  const basicButtons = [
    'C', '±', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  const scientificButtons = [
    '(', ')', 'mc', 'm+', 'm-', 'mr',
    '2nd', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ',
    '1/x', '²√x', '³√x', 'ʸ√x', 'ln', 'log10',
    'x!', 'sin', 'cos', 'tan', 'e', 'EE',
    'Rad', 'sinh', 'cosh', 'tanh', 'π', 'Rand'
  ];

  return (
    <div className={`w-full h-full bg-[#1c1c1c] text-white flex flex-col p-2 select-none font-light transition-all duration-1000 ${isTrapped ? 'rotate-180 grayscale pointer-events-none animate-pulse' : ''}`}>
      <div className="flex-1 flex items-end justify-end text-5xl px-4 pb-4 break-all overflow-hidden tabular-nums tracking-tight text-right">
        {isTrapped ? '🙃' : display}
      </div>
      <div className="flex gap-2 h-[80%]">
        {isScientific && (
           <div className="grid grid-cols-6 gap-2 w-1/2">
              {scientificButtons.map(btn => (
                  <button 
                    key={btn} 
                    className="bg-[#2d2d2d] rounded text-[10px] hover:bg-[#3d3d3d] transition-colors flex items-center justify-center"
                    onClick={() => handleInput(btn)}
                  >
                      {btn}
                  </button>
              ))}
           </div>
        )}
        <div className={`grid grid-cols-4 gap-2 ${isScientific ? 'w-1/2' : 'w-full'}`}>
           {basicButtons.map(btn => (
             <button 
                key={btn} 
                className={`
                    text-xl rounded-full font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm
                    ${btn === '0' ? 'col-span-2 !justify-start pl-7 w-full' : ''}
                    ${['÷', '×', '-', '+', '='].includes(btn) ? 'bg-orange-500 hover:bg-orange-400 text-white' : ''}
                    ${['C', '±', '%'].includes(btn) ? 'bg-[#3a3a3a] hover:bg-[#4a4a4a]' : ''}
                    ${!['÷', '×', '-', '+', '=', 'C', '±', '%'].includes(btn) ? 'bg-[#555] hover:bg-[#666]' : ''}
                `}
                onClick={() => handleInput(btn)}
             >
                {btn}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};
