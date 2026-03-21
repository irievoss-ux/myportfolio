"use client";

import { useState, useCallback, useEffect } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [storedValue, setStoredValue] = useState<number | null>(null);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const calculate = (left: number, right: number, op: string): number => {
    switch (op) {
      case '+': return left + right;
      case '−': return left - right;
      case '×': return left * right;
      case '÷': return right !== 0 ? left / right : 0;
      default: return right;
    }
  };

  const performOperation = useCallback((nextOp: string) => {
    const currentValue = parseFloat(display);

    if (storedValue !== null && pendingOperator && !waitingForOperand) {
      const result = calculate(storedValue, currentValue, pendingOperator);
      const resultStr = parseFloat(result.toFixed(10)).toString();
      setDisplay(resultStr);
      setStoredValue(result);
      setExpression(`${result} ${nextOp === '=' ? '' : nextOp}`);
    } else {
      setStoredValue(currentValue);
      setExpression(`${currentValue} ${nextOp === '=' ? '' : nextOp}`);
    }

    if (nextOp === '=') {
      setPendingOperator(null);
      setStoredValue(null);
    } else {
      setPendingOperator(nextOp);
    }
    setWaitingForOperand(true);
  }, [display, storedValue, pendingOperator, waitingForOperand]);

  const clearAll = () => {
    setDisplay('0');
    setExpression('');
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay((-value).toString());
  };

  const percent = () => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  };

  const sqrt = () => {
    const value = parseFloat(display);
    setDisplay(value >= 0 ? Math.sqrt(value).toString() : 'Error');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
      else if (e.key === '.') inputDot();
      else if (e.key === '+') performOperation('+');
      else if (e.key === '-') performOperation('−');
      else if (e.key === '*') performOperation('×');
      else if (e.key === '/') { e.preventDefault(); performOperation('÷'); }
      else if (e.key === 'Enter' || e.key === '=') performOperation('=');
      else if (e.key === 'Escape') clearAll();
      else if (e.key === 'Backspace') backspace();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const btnBase = 'flex items-center justify-center rounded-[5px] border text-sm font-medium transition-all active:scale-95';
  const btnNum = `${btnBase} border-[#8aa0b8] bg-[linear-gradient(180deg,#ffffff_0%,#e8eef4_100%)] text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:brightness-105`;
  const btnOp = `${btnBase} border-[#8897a8] bg-[linear-gradient(180deg,#f0f4f8_0%,#c8d4e0_100%)] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:brightness-105`;
  const btnEq = `${btnBase} border-[#5a8abf] bg-[linear-gradient(180deg,#7db7f0_0%,#2a6ec4_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:brightness-110`;

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#ecf2f8_0%,#d6e2ee_100%)] font-sans">
      {/* Menu bar */}
      <div className="flex gap-4 border-b border-[#b5c6d6] bg-[#f0f4f8] px-3 py-1 text-[11px] text-slate-600">
        <span className="cursor-default px-1 hover:bg-blue-100">View</span>
        <span className="cursor-default px-1 hover:bg-blue-100">Edit</span>
        <span className="cursor-default px-1 hover:bg-blue-100">Help</span>
      </div>

      {/* Display */}
      <div className="mx-3 mt-3 rounded-[6px] border border-[#7a93aa] bg-white p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
        <div className="min-h-[16px] text-right text-[10px] text-slate-400">{expression}</div>
        <div className="text-right text-[28px] font-light text-slate-900 tracking-wide overflow-hidden">{display}</div>
      </div>

      {/* Memory row */}
      <div className="mx-3 mt-2 flex gap-1">
        {[
          { label: 'MC', action: () => setMemory(0) },
          { label: 'MR', action: () => { setDisplay(memory.toString()); setWaitingForOperand(true); } },
          { label: 'MS', action: () => setMemory(parseFloat(display)) },
          { label: 'M+', action: () => setMemory(memory + parseFloat(display)) },
          { label: 'M−', action: () => setMemory(memory - parseFloat(display)) },
        ].map((btn) => (
          <button key={btn.label} type="button" onClick={btn.action} className={`${btnOp} h-8 flex-1 text-[11px]`}>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Button grid */}
      <div className="mx-3 mt-2 mb-3 grid flex-1 grid-cols-5 gap-1">
        <button type="button" onClick={percent} className={`${btnOp} h-10`}>%</button>
        <button type="button" onClick={sqrt} className={`${btnOp} h-10`}>√</button>
        <button type="button" onClick={clearEntry} className={`${btnOp} h-10`}>CE</button>
        <button type="button" onClick={clearAll} className={`${btnOp} h-10`}>C</button>
        <button type="button" onClick={backspace} className={`${btnOp} h-10`}>⌫</button>

        <button type="button" onClick={() => { const v = parseFloat(display); if (v !== 0) setDisplay((1 / v).toString()); }} className={`${btnOp} h-10`}>1/x</button>
        <button type="button" onClick={() => inputDigit('7')} className={`${btnNum} h-10`}>7</button>
        <button type="button" onClick={() => inputDigit('8')} className={`${btnNum} h-10`}>8</button>
        <button type="button" onClick={() => inputDigit('9')} className={`${btnNum} h-10`}>9</button>
        <button type="button" onClick={() => performOperation('÷')} className={`${btnOp} h-10`}>÷</button>

        <button type="button" onClick={toggleSign} className={`${btnOp} h-10`}>±</button>
        <button type="button" onClick={() => inputDigit('4')} className={`${btnNum} h-10`}>4</button>
        <button type="button" onClick={() => inputDigit('5')} className={`${btnNum} h-10`}>5</button>
        <button type="button" onClick={() => inputDigit('6')} className={`${btnNum} h-10`}>6</button>
        <button type="button" onClick={() => performOperation('×')} className={`${btnOp} h-10`}>×</button>

        <div />
        <button type="button" onClick={() => inputDigit('1')} className={`${btnNum} h-10`}>1</button>
        <button type="button" onClick={() => inputDigit('2')} className={`${btnNum} h-10`}>2</button>
        <button type="button" onClick={() => inputDigit('3')} className={`${btnNum} h-10`}>3</button>
        <button type="button" onClick={() => performOperation('−')} className={`${btnOp} h-10`}>−</button>

        <div />
        <button type="button" onClick={() => inputDigit('0')} className={`${btnNum} col-span-2 h-10`}>0</button>
        <button type="button" onClick={inputDot} className={`${btnNum} h-10`}>.</button>
        <button type="button" onClick={() => performOperation('+')} className={`${btnOp} h-10`}>+</button>

        <button type="button" onClick={() => performOperation('=')} className={`${btnEq} col-span-5 h-10`}>=</button>
      </div>
    </div>
  );
}
