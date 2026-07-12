"use client"

import { useState, useCallback } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Binary, History, Info, RotateCcw, Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ScientificCalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isDegree, setIsDegree] = useState(true);
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);
  const [shouldReset, setShouldReset] = useState(false);

  // Helper for Factorial
  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const calculate = useCallback((expr: string) => {
    try {
      // Basic parser logic for complex functions
      // In a real app we might use a library like mathjs, 
      // but for MVP we will map common keys to Math object.
      let processedExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/Ans/g, ans.toString());

      // Evaluate the expression
      // WARNING: Using Function constructor for dynamic math evaluation
      // In production, use a safe math parser.
      const result = new Function(`return ${processedExpr}`)();
      
      if (isNaN(result) || !isFinite(result)) throw new Error('Math Error');
      
      const formatted = parseFloat(result.toFixed(10)).toString();
      setDisplay(formatted);
      setAns(result);
      setShouldReset(true);
    } catch (err) {
      setDisplay('Error');
      setShouldReset(true);
    }
  }, [ans]);

  const handleInput = (val: string) => {
    if (shouldReset) {
      if (['+', '-', '×', '÷'].includes(val)) {
        setExpression(display + ' ' + val + ' ');
      } else {
        setDisplay(val);
        setExpression(val);
      }
      setShouldReset(false);
      return;
    }

    if (display === '0' && !['.', '+', '-', '×', '÷'].includes(val)) {
      setDisplay(val);
      setExpression(val);
    } else {
      setDisplay(prev => prev + val);
      setExpression(prev => prev + val);
    }
  };

  const handleFunction = (func: string) => {
    let currentVal = parseFloat(display);
    let res = 0;

    switch (func) {
      case 'sin':
        res = isDegree ? Math.sin(currentVal * (Math.PI / 180)) : Math.sin(currentVal);
        break;
      case 'cos':
        res = isDegree ? Math.cos(currentVal * (Math.PI / 180)) : Math.cos(currentVal);
        break;
      case 'tan':
        res = isDegree ? Math.tan(currentVal * (Math.PI / 180)) : Math.tan(currentVal);
        break;
      case 'sin-1':
        res = isDegree ? Math.asin(currentVal) * (180 / Math.PI) : Math.asin(currentVal);
        break;
      case 'cos-1':
        res = isDegree ? Math.acos(currentVal) * (180 / Math.PI) : Math.acos(currentVal);
        break;
      case 'tan-1':
        res = isDegree ? Math.atan(currentVal) * (180 / Math.PI) : Math.atan(currentVal);
        break;
      case 'log':
        res = Math.log10(currentVal);
        break;
      case 'ln':
        res = Math.log(currentVal);
        break;
      case 'x2':
        res = Math.pow(currentVal, 2);
        break;
      case 'x3':
        res = Math.pow(currentVal, 3);
        break;
      case 'ex':
        res = Math.exp(currentVal);
        break;
      case '10x':
        res = Math.pow(10, currentVal);
        break;
      case '1/x':
        res = 1 / currentVal;
        break;
      case 'sqrt':
        res = Math.sqrt(currentVal);
        break;
      case '3sqrt':
        res = Math.cbrt(currentVal);
        break;
      case 'n!':
        res = factorial(Math.floor(currentVal));
        break;
      case '±':
        res = currentVal * -1;
        break;
      case 'RND':
        res = Math.random();
        break;
      default:
        return;
    }

    const formatted = parseFloat(res.toFixed(10)).toString();
    setDisplay(formatted);
    setExpression(formatted);
    setShouldReset(true);
  };

  const handleMemory = (op: string) => {
    const current = parseFloat(display);
    if (isNaN(current)) return;

    switch (op) {
      case 'M+': setMemory(prev => prev + current); break;
      case 'M-': setMemory(prev => prev - current); break;
      case 'MR': setDisplay(memory.toString()); setExpression(memory.toString()); break;
    }
    setShouldReset(true);
  };

  const clearAll = () => {
    setDisplay('0');
    setExpression('');
    setShouldReset(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      setDisplay('0');
      setExpression('');
    }
  };

  const buttons = [
    // Row 1: Scientific
    { label: 'sin', action: () => handleFunction('sin'), type: 'sci' },
    { label: 'cos', action: () => handleFunction('cos'), type: 'sci' },
    { label: 'tan', action: () => handleFunction('tan'), type: 'sci' },
    { label: isDegree ? 'Deg' : 'Rad', action: () => setIsDegree(!isDegree), type: 'toggle' },
    { label: 'π', action: () => handleInput('π'), type: 'sci' },

    // Row 2
    { label: 'sin⁻¹', action: () => handleFunction('sin-1'), type: 'sci' },
    { label: 'cos⁻¹', action: () => handleFunction('cos-1'), type: 'sci' },
    { label: 'tan⁻¹', action: () => handleFunction('tan-1'), type: 'sci' },
    { label: 'e', action: () => handleInput('e'), type: 'sci' },
    { label: 'Ans', action: () => handleInput('Ans'), type: 'util' },

    // Row 3
    { label: 'xʸ', action: () => handleInput('**'), type: 'sci' },
    { label: 'x³', action: () => handleFunction('x3'), type: 'sci' },
    { label: 'x²', action: () => handleFunction('x2'), type: 'sci' },
    { label: 'eˣ', action: () => handleFunction('ex'), type: 'sci' },
    { label: '10ˣ', action: () => handleFunction('10x'), type: 'sci' },

    // Row 4
    { label: 'ʸ√x', action: () => handleInput('**(1/'), type: 'sci' },
    { label: '³√x', action: () => handleFunction('3sqrt'), type: 'sci' },
    { label: '√x', action: () => handleFunction('sqrt'), type: 'sci' },
    { label: 'ln', action: () => handleFunction('ln'), type: 'sci' },
    { label: 'log', action: () => handleFunction('log'), type: 'sci' },

    // Row 5
    { label: '(', action: () => handleInput('('), type: 'sci' },
    { label: ')', action: () => handleInput(')'), type: 'sci' },
    { label: '1/x', action: () => handleFunction('1/x'), type: 'sci' },
    { label: '%', action: () => handleInput('/100'), type: 'sci' },
    { label: 'n!', action: () => handleFunction('n!'), type: 'sci' },

    // Standard Numpad Starts
    { label: '7', action: () => handleInput('7'), type: 'num' },
    { label: '8', action: () => handleInput('8'), type: 'num' },
    { label: '9', action: () => handleInput('9'), type: 'num' },
    { label: '+', action: () => handleInput('+'), type: 'op' },
    { label: 'Back', action: backspace, type: 'util' },

    { label: '4', action: () => handleInput('4'), type: 'num' },
    { label: '5', action: () => handleInput('5'), type: 'num' },
    { label: '6', action: () => handleInput('6'), type: 'num' },
    { label: '–', action: () => handleInput('-'), type: 'op' },
    { label: 'M+', action: () => handleMemory('M+'), type: 'util' },

    { label: '1', action: () => handleInput('1'), type: 'num' },
    { label: '2', action: () => handleInput('2'), type: 'num' },
    { label: '3', action: () => handleInput('3'), type: 'num' },
    { label: '×', action: () => handleInput('*'), type: 'op' },
    { label: 'M-', action: () => handleMemory('M-'), type: 'util' },

    { label: '0', action: () => handleInput('0'), type: 'num' },
    { label: '.', action: () => handleInput('.'), type: 'num' },
    { label: 'EXP', action: () => handleInput('*10**'), type: 'num' },
    { label: '÷', action: () => handleInput('/'), type: 'op' },
    { label: 'MR', action: () => handleMemory('MR'), type: 'util' },

    { label: '±', action: () => handleFunction('±'), type: 'num' },
    { label: 'RND', action: () => handleFunction('RND'), type: 'num' },
    { label: 'AC', action: clearAll, type: 'clear' },
    { label: '=', action: () => calculate(expression), type: 'equal' },
    { label: '(', action: () => handleInput('('), type: 'num' }, // Placeholder or filler
  ];

  return (
    <CalculatorWrapper
      title="Scientific Calculator"
      description="A professional-grade scientific calculator for engineering, physics, and advanced mathematics."
      icon={Binary}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-slate-900 text-white border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-6 space-y-2">
            <div className="h-6 text-slate-400 text-right font-mono text-sm overflow-hidden whitespace-nowrap">
              {expression || '\u00A0'}
            </div>
            <div className="h-16 flex items-center justify-end font-mono text-4xl font-bold tracking-tighter overflow-x-auto custom-scrollbar">
              {display}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <div className="flex gap-2">
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", isDegree ? "bg-primary text-white" : "text-slate-500")}>DEG</span>
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", !isDegree ? "bg-primary text-white" : "text-slate-500")}>RAD</span>
                {memory !== 0 && <span className="text-[10px] font-bold text-accent">M</span>}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Scientific Engine v2.0
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {buttons.slice(0, 50).map((btn, idx) => (
            <Button
              key={idx}
              variant={btn.type === 'num' ? 'outline' : btn.type === 'op' ? 'secondary' : btn.type === 'equal' ? 'default' : 'ghost'}
              className={cn(
                "h-12 md:h-14 text-xs md:text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm",
                btn.type === 'sci' && "bg-slate-100 hover:bg-slate-200 text-slate-700",
                btn.type === 'num' && "bg-white hover:bg-slate-50 text-slate-900 border-slate-200",
                btn.type === 'op' && "bg-primary/10 hover:bg-primary/20 text-primary border-none",
                btn.type === 'clear' && "bg-destructive/10 hover:bg-destructive/20 text-destructive border-none",
                btn.type === 'util' && "bg-accent/10 hover:bg-accent/20 text-accent border-none",
                btn.type === 'equal' && "bg-primary text-white hover:bg-primary/90",
                btn.type === 'toggle' && "bg-slate-800 text-white hover:bg-slate-700"
              )}
              onClick={btn.action}
            >
              {btn.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <Info className="w-5 h-5" />
              Usage Guide
            </h3>
            <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
              <p>
                Our <strong>Scientific Calculator</strong> supports complex operations. For functions like <strong>sin</strong> or <strong>log</strong>, first enter the value on the display, then click the function button.
              </p>
              <ul className="space-y-2">
                <li>• <strong>Ans:</strong> Recalls the result of your last calculation.</li>
                <li>• <strong>EXP:</strong> Scientific notation (e.g. 5 EXP 3 = $5 \times 10^3$).</li>
                <li>• <strong>M+ / M-:</strong> Add or subtract the current display value from persistent memory.</li>
              </ul>
            </div>
          </section>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-primary" />
                Precision & Modes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-3 leading-relaxed">
              <p>Calculations are performed with double-precision floating point math. Large results are automatically rounded to 10 decimal places for display clarity.</p>
              <Separator />
              <p>The <strong>Deg/Rad</strong> toggle affects only trigonometric functions. Ensure you are in the correct mode before performing engineering calculations.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
