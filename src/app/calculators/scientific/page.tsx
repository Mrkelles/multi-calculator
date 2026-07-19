"use client"

import { useState, useCallback } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Binary, 
  History, 
  Info, 
  RotateCcw,
  TrendingUp,
  Calculator,
  ChevronRight,
  Zap,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'Free Scientific Calculator | Advanced Online Math & Science Tool',
  description: 'Solve complex equations instantly with our free online scientific calculator. Perform trigonometric, logarithmic, and algebraic calculations with this advanced tool.',
  keywords: [
    'Scientific Calculator',
    'advanced calculator',
    'smart calculator',
    'MyApexCalc',
    'trigonometry calculator',
    'logarithmic solver',
    'engineering calculator online'
  ],
  
  openGraph: {
    title: 'Interactive Scientific & Advanced Calculator | MyApexCalc',
    description: 'Solve equations, calculate trigonometry, and analyze functions. An advanced, responsive, and smart calculator designed for students and professionals.',
    url: 'https://www.myapexcalc.com/calculators/scientific',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/F42rYBZY/scientific-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Scientific Calculator showing trigonometric, logarithmic, and memory function layout',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Advanced Scientific & Smart Calculator | MyApexCalc',
    description: 'A powerful online scientific calculator featuring parenthetical grouping, trigonometry, exponentials, and physical constants.',
    images: ['https://i.ibb.co/F42rYBZY/scientific-calculator.png'],
  },

  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/scientific',
  },
};

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

        {/* Button Grid */}
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('sin')}>sin</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('cos')}>cos</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('tan')}>tan</Button>
          
          <div className="col-span-2 bg-slate-100 rounded-md flex items-center justify-center h-12 md:h-14">
            <RadioGroup
              value={isDegree ? 'deg' : 'rad'}
              onValueChange={(v) => setIsDegree(v === 'deg')}
              className="flex items-center gap-3"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="deg" id="deg" className="w-3 h-3 border-slate-400" />
                <Label htmlFor="deg" className="text-[10px] md:text-xs font-bold uppercase cursor-pointer text-slate-600">Deg</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="rad" id="rad" className="w-3 h-3 border-slate-400" />
                <Label htmlFor="rad" className="text-[10px] md:text-xs font-bold uppercase cursor-pointer text-slate-600">Rad</Label>
              </div>
            </RadioGroup>
          </div>

          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('sin-1')}>sin⁻¹</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('cos-1')}>cos⁻¹</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('tan-1')}>tan⁻¹</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('π')}>π</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('e')}>e</Button>

          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('**')}>xʸ</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('x3')}>x³</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('x2')}>x²</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('ex')}>eˣ</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('10x')}>10ˣ</Button>

          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('**(1/')}>ʸ√x</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('3sqrt')}>∛x</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('sqrt')}>√x</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('ln')}>ln</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('log')}>log</Button>

          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('(')}>(</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput(')')}>)</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('1/x')}>1/x</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleInput('/100')}>%</Button>
          <Button variant="ghost" className="bg-slate-100 h-12 md:h-14 font-bold" onClick={() => handleFunction('n!')}>n!</Button>

          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('7')}>7</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('8')}>8</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('9')}>9</Button>
          <Button variant="secondary" className="h-12 md:h-14 font-bold text-primary" onClick={() => handleInput('+')}>+</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-accent/10 text-accent" onClick={backspace}>Back</Button>

          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('4')}>4</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('5')}>5</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('6')}>6</Button>
          <Button variant="secondary" className="h-12 md:h-14 font-bold text-primary" onClick={() => handleInput('–')}>–</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-accent/10 text-accent" onClick={() => handleInput('Ans')}>Ans</Button>

          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('1')}>1</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('2')}>2</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('3')}>3</Button>
          <Button variant="secondary" className="h-12 md:h-14 font-bold text-primary" onClick={() => handleInput('×')}>×</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-accent/10 text-accent" onClick={() => handleMemory('M+')}>M+</Button>

          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('0')}>0</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('.')}>.</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleInput('*10**')}>EXP</Button>
          <Button variant="secondary" className="h-12 md:h-14 font-bold text-primary" onClick={() => handleInput('÷')}>÷</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-accent/10 text-accent" onClick={() => handleMemory('M-')}>M-</Button>

          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleFunction('±')}>±</Button>
          <Button variant="outline" className="h-12 md:h-14 font-bold bg-white" onClick={() => handleFunction('RND')}>RND</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-destructive/10 text-destructive" onClick={clearAll}>AC</Button>
          <Button variant="default" className="h-12 md:h-14 font-bold text-lg" onClick={() => calculate(expression)}>=</Button>
          <Button variant="ghost" className="h-12 md:h-14 font-bold bg-accent/10 text-accent" onClick={() => handleMemory('MR')}>MR</Button>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Tackle Complex Mathematics with the MyApexCalc Smart Tool
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              From high school algebra and trigonometry to advanced university-level calculus, physics, and engineering, standard arithmetic calculators quickly fall short. When your work involves complex functions, exponents, logarithms, and parenthetical equations, you need a responsive, highly capable math companion. Our free online Scientific Calculator is designed to bridge that gap, serving as an advanced calculator and highly intuitive smart calculator that handles multi-step formulas directly in your web browser.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Architecture of Complex Calculations: Order of Operations
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                A core feature of any high-quality scientific calculator is its strict adherence to the mathematical order of operations, commonly remembered as PEMDAS (Parentheses, Exponents, Multiplication and Division, Addition and Subtraction).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When you enter a multi-layered equation into our mathematical parser, the calculator processes your inputs step-by-step using standard algebraic hierarchies:
              </p>
              
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                2 + 3 × sin(π / 2) - 4²
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-sm font-bold text-foreground">Resolution Steps:</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">1. Parentheses & Angles:</span>
                    <span>Evaluates the interior angle: π / 2 radians (90°).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">2. Trigonometric Functions:</span>
                    <span>Calculates the sine: sin(1.5708) = 1.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">3. Exponents & Roots:</span>
                    <span>Evaluates the power: 4² = 16.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">4. Multiplication:</span>
                    <span>Multiplies the coefficients: 3 × 1 = 3.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">5. Addition & Subtraction:</span>
                    <span>Finalizes the arithmetic left-to-right: 2 + 3 - 16 = -11.</span>
                  </li>
                </ul>
              </div>

              <p className="text-muted-foreground leading-relaxed pt-2">
                Without advanced algebraic logic, a simple linear calculator would process the equation sequentially from left to right, yielding an incorrect result of -11.5 or worse. Our smart backend ensures mathematical integrity for every calculation.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Key Advanced Features
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our advanced calculations suite includes specialized modules designed to streamline complex academic and professional tasks:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <LayoutGrid className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Trigonometric Capabilities</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Effortlessly calculate sine (sin), cosine (cos), tangent (tan), and their corresponding inverse functions in both Degrees and Radians modes.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Logarithmic & Exponential Engines</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Solve growth, decay, and scaling problems using common logarithms (log₁₀), natural logarithms (ln), and custom base exponents (xʸ).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Scientific Constants & Memory</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Store intermediate values in temporary memory (M+, M-, MR) and access key mathematical constants like Pi (π) and Euler's number (e) with a single tap.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Why Choose MyApexCalc?</p>
                <p className="text-[10px] text-muted-foreground leading-tight italic">
                  "Skip the hassle of dedicated hardware. MyApexCalc provides a sleek, modern, and mathematically sound interface for real-time expression rendering on any device."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
