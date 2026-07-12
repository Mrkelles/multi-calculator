"use client"

import { useState, useCallback } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Binary, History, Info, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
      let processedExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/–/g, '-')
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/Ans/g, ans.toString());

      // Evaluate the expression
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
      if (['+', '–', '×', '÷'].includes(val)) {
        setExpression(display + ' ' + val + ' ');
      } else {
        setDisplay(val);
        setExpression(val);
      }
      setShouldReset(false);
      return;
    }

    if (display === '0' && !['.', '+', '–', '×', '÷'].includes(val)) {
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

        {/* Button Grid matching reference */}
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {/* Row 1 */}
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('sin')}>sin</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('cos')}>cos</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('tan')}>tan</Button>
          <Button variant="ghost" className="bg-slate-800 text-white col-span-2 h-12 md:h-14 font-bold" onClick={() => setIsDegree(!isDegree)}>
            {isDegree ? 'Deg' : 'Rad'}
          </Button>

          {/* Row 2 */}
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('sin-1')}>sin⁻¹</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('cos-1')}>cos⁻¹</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('tan-1')}>tan⁻¹</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('π')}>π</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('e')}>e</Button>

          {/* Row 3 */}
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('**')}>xʸ</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('x3')}>x³</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('x2')}>x²</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('ex')}>eˣ</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('10x')}>10ˣ</Button>

          {/* Row 4 */}
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('**(1/')}>ʸ√x</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('3sqrt')}>∛x</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('sqrt')}>√x</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('ln')}>ln</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('log')}>log</Button>

          {/* Row 5 */}
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('(')}>(</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput(')')}>)</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('1/x')}>1/x</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('/100')}>%</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('n!')}>n!</Button>

          {/* Row 6 */}
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('7')}>7</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('8')}>8</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('9')}>9</Button>
          <Button variant="secondary" className="h-12 md:h-14 font-bold text-primary" onClick={() => handleInput('+')}>+</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-accent/10 text-accent" onClick={backspace}>Back</Button>

          {/* Row 7 */}
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('4')}>4</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('5')}>5</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('6')}>6</Button>
          <Button variant="secondary" className="h-12 md:h-14 font-bold text-primary" onClick={() => handleInput('–')}>–</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-accent/10 text-accent" onClick={() => handleInput('Ans')}>Ans</Button>

          {/* Row 8 */}
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('1')}>1</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('2')}>2</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('3')}>3</Button>
          <Button variant="secondary" className="h-12 md:h-14 font-bold text-primary" onClick={() => handleInput('×')}>×</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-accent/10 text-accent" onClick={() => handleMemory('M+')}>M+</Button>

          {/* Row 9 */}
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('0')}>0</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('.')}>.</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('*10**')}>EXP</Button>
          <Button variant="secondary" className="h-12 md:h-14 font-bold text-primary" onClick={() => handleInput('÷')}>÷</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-accent/10 text-accent" onClick={() => handleMemory('M-')}>M-</Button>

          {/* Row 10 */}
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleFunction('±')}>±</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleFunction('RND')}>RND</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-destructive/10 text-destructive" onClick={clearAll}>AC</Button>
          <Button variant="default" className="h-12 md:h-14 font-bold text-lg" onClick={() => calculate(expression)}>=</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-accent/10 text-accent" onClick={() => handleMemory('MR')}>MR</Button>
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
