"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Divide, RefreshCw, Hash, Binary, Percent, Info, Calculator, ChevronDown, ChevronUp, History } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

/**
 * Utility functions for fraction math
 */
const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    a %= b;
    [a, b] = [b, a];
  }
  return a;
};

const simplifyFraction = (n: number, d: number) => {
  if (d === 0) return { n: NaN, d: NaN, gcd: 1 };
  const common = gcd(n, d);
  let resN = n / common;
  let resD = d / common;
  // Standardize sign to numerator
  if (resD < 0) {
    resN = -resN;
    resD = -resD;
  }
  return { n: resN, d: resD, gcd: common };
};

// BigInt version
const gcdBig = (a: bigint, b: bigint): bigint => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b > 0n) {
    a %= b;
    [a, b] = [b, a];
  }
  return a;
};

const simplifyBig = (n: bigint, d: bigint) => {
  if (d === 0n) return { n: 0n, d: 0n, gcd: 1n };
  const common = gcdBig(n, d);
  let resN = n / common;
  let resD = d / common;
  if (resD < 0n) {
    resN = -resN;
    resD = -resD;
  }
  return { n: resN, d: resD, gcd: common };
};

export default function FractionCalculatorsPage() {
  // UI Toggles
  const [showStandardSteps, setShowStandardSteps] = useState(false);
  const [showMixedSteps, setShowMixedSteps] = useState(false);
  const [showSimplifySteps, setShowSimplifySteps] = useState(false);
  const [showDecToFracSteps, setShowDecToFracSteps] = useState(false);
  const [showFracToDecSteps, setShowFracToDecSteps] = useState(false);
  const [showBigSteps, setShowBigSteps] = useState(false);

  // 1. Standard Fraction Calculator
  const [f1, setF1] = useState({ n: 2, d: 7 });
  const [f2, setF2] = useState({ n: 3, d: 8 });
  const [fOp, setFOp] = useState('+');

  const standardResult = useMemo(() => {
    let resN = 0;
    let resD = 0;
    const steps = [];

    if (fOp === '+') { 
      resN = f1.n * f2.d + f2.n * f1.d; resD = f1.d * f2.d; 
      steps.push(`To add, find a common denominator: ${f1.d} × ${f2.d} = ${resD}`);
      steps.push(`Adjust numerators: (${f1.n} × ${f2.d}) + (${f2.n} × ${f1.d}) = ${f1.n * f2.d} + ${f2.n * f1.d} = ${resN}`);
    } else if (fOp === '-') { 
      resN = f1.n * f2.d - f2.n * f1.d; resD = f1.d * f2.d; 
      steps.push(`To subtract, find a common denominator: ${f1.d} × ${f2.d} = ${resD}`);
      steps.push(`Adjust numerators: (${f1.n} × ${f2.d}) - (${f2.n} × ${f1.d}) = ${f1.n * f2.d} - ${f2.n * f1.d} = ${resN}`);
    } else if (fOp === '*') { 
      resN = f1.n * f2.n; resD = f1.d * f2.d; 
      steps.push(`Multiply numerators: ${f1.n} × ${f2.n} = ${resN}`);
      steps.push(`Multiply denominators: ${f1.d} × ${f2.d} = ${resD}`);
    } else if (fOp === '/') { 
      resN = f1.n * f2.d; resD = f1.d * f2.n; 
      steps.push(`Multiply the first fraction by the reciprocal of the second: (${f1.n}/${f1.d}) × (${f2.d}/${f2.n})`);
      steps.push(`Result: ${f1.n} × ${f2.d} = ${resN} (num), ${f1.d} × ${f2.n} = ${resD} (den)`);
    }

    const simple = simplifyFraction(resN, resD);
    if (simple.gcd > 1) {
      steps.push(`Simplify by dividing both by GCD (${simple.gcd}): ${resN}/${simple.gcd} = ${simple.n}, ${resD}/${simple.gcd} = ${simple.d}`);
    }
    
    const mixedW = Math.trunc(simple.n / simple.d);
    const mixedN = Math.abs(simple.n % simple.d);

    return { 
      improper: simple, 
      decimal: (resN / (resD || 1)).toFixed(4),
      mixed: { w: mixedW, n: mixedN, d: simple.d },
      steps
    };
  }, [f1, f2, fOp]);

  // 2. Mixed Numbers Calculator
  const [m1, setM1] = useState({ w: -2, n: 3, d: 4 });
  const [m2, setM2] = useState({ w: 3, n: 5, d: 7 });
  const [mOp, setMOp] = useState('+');

  const mixedResult = useMemo(() => {
    const steps: string[] = [];
    const toImproper = (m: any, label: string) => {
      const sign = m.w < 0 ? -1 : 1;
      const valN = sign * (Math.abs(m.w) * m.d + m.n);
      steps.push(`Convert ${label} to improper: (${m.w} × ${m.d} + ${m.n}) / ${m.d} = ${valN}/${m.d}`);
      return { n: valN, d: m.d };
    };
    
    const i1 = toImproper(m1, "first number");
    const i2 = toImproper(m2, "second number");

    let resN = 0, resD = 0;
    if (mOp === '+') { resN = i1.n * i2.d + i2.n * i1.d; resD = i1.d * i2.d; }
    else if (mOp === '-') { resN = i1.n * i2.d - i2.n * i1.d; resD = i1.d * i2.d; }
    else if (mOp === '*') { resN = i1.n * i2.n; resD = i1.d * i2.d; }
    else if (mOp === '/') { resN = i1.n * i2.d; resD = i1.d * i2.n; }

    steps.push(`Perform operation: result is ${resN}/${resD}`);

    const simple = simplifyFraction(resN, resD);
    if (simple.gcd > 1) {
      steps.push(`Simplify: ${simple.n}/${simple.d}`);
    }

    const mixedW = Math.trunc(simple.n / simple.d);
    const mixedN = Math.abs(simple.n % simple.d);
    if (mixedW !== 0) {
      steps.push(`Convert to mixed number: ${mixedW} ${mixedN}/${simple.d}`);
    }

    return { 
      improper: simple, 
      decimal: (resN / (resD || 1)).toFixed(4),
      mixed: { w: mixedW, n: mixedN, d: simple.d },
      steps
    };
  }, [m1, m2, mOp]);

  // 3. Simplify Fraction
  const [simp, setSimp] = useState({ n: 21, d: 98 });
  const simpResult = useMemo(() => {
    const simple = simplifyFraction(simp.n, simp.d);
    const mixedW = Math.trunc(simple.n / simple.d);
    const mixedN = Math.abs(simple.n % simple.d);
    const steps = [
      `Numerator: ${simp.n}, Denominator: ${simp.d}`,
      `Find the Greatest Common Divisor (GCD): ${simple.gcd}`,
      `Divide numerator: ${simp.n} ÷ ${simple.gcd} = ${simple.n}`,
      `Divide denominator: ${simp.d} ÷ ${simple.gcd} = ${simple.d}`,
      `Final fraction: ${simple.n}/${simple.d}`
    ];
    return { simple, mixedW, mixedN, steps };
  }, [simp]);

  // 4. Decimal to Fraction
  const [decVal, setDecVal] = useState('1.375');
  const decToFracResult = useMemo(() => {
    const val = parseFloat(decVal);
    if (isNaN(val)) return null;
    
    const parts = decVal.split('.');
    const precision = parts[1] ? parts[1].length : 0;
    const denominator = Math.pow(10, precision);
    const numerator = Math.round(val * denominator);
    
    const simple = simplifyFraction(numerator, denominator);
    const mixedW = Math.trunc(simple.n / simple.d);
    const mixedN = Math.abs(simple.n % simple.d);
    
    const steps = [
      `Identify decimal places: ${precision}`,
      `Place value as fraction: ${numerator} / ${denominator}`,
      `Find GCD of ${numerator} and ${denominator}: ${simple.gcd}`,
      `Simplify: ${simple.n} / ${simple.d}`
    ];

    return { simple, mixedW, mixedN, steps };
  }, [decVal]);

  // 5. Fraction to Decimal
  const [fToD, setFToD] = useState({ n: 2, d: 7 });
  const fToDResult = useMemo(() => {
    const res = fToD.n / (fToD.d || 1);
    const steps = [
      `Operation: ${fToD.n} ÷ ${fToD.d}`,
      `Perform division to get the decimal equivalent.`,
      `Result: ${res}`
    ];
    return { value: res.toString(), steps };
  }, [fToD]);

  // 6. Big Number Fraction
  const [b1, setB1] = useState({ n: '1234', d: '748892928829' });
  const [b2, setB2] = useState({ n: '33434421132232234333', d: '8877277388288288288' });
  const [bOp, setBOp] = useState('+');

  const bigResult = useMemo(() => {
    const steps = [];
    try {
      const bn1 = BigInt(b1.n);
      const bd1 = BigInt(b1.d);
      const bn2 = BigInt(b2.n);
      const bd2 = BigInt(b2.d);
      
      let resN = 0n, resD = 0n;
      if (bOp === '+') { resN = bn1 * bd2 + bn2 * bd1; resD = bd1 * bd2; steps.push(`(n1*d2 + n2*d1) / (d1*d2)`); }
      else if (bOp === '-') { resN = bn1 * bd2 - bn2 * bd1; resD = bd1 * bd2; steps.push(`(n1*d2 - n2*d1) / (d1*d2)`); }
      else if (bOp === '*') { resN = bn1 * bn2; resD = bd1 * bd2; steps.push(`(n1*n2) / (d1*d2)`); }
      else if (bOp === '/') { resN = bn1 * bd2; resD = bd1 * bn2; steps.push(`(n1*d2) / (d1*n2)`); }

      const simple = simplifyBig(resN, resD);
      steps.push(`Simplified by GCD: ${simple.gcd.toString()}`);
      return { n: simple.n.toString(), d: simple.d.toString(), steps };
    } catch (e) {
      return { n: 'Error', d: 'Error', steps: ["Invalid big integer input"] };
    }
  }, [b1, b2, bOp]);

  const StepBox = ({ steps, isVisible }: { steps: string[], isVisible: boolean }) => {
    if (!isVisible) return null;
    return (
      <div className="mt-4 p-4 bg-muted/50 rounded-xl border border-dashed border-primary/20 animate-in fade-in slide-in-from-top-2">
        <h4 className="text-[10px] font-black uppercase text-primary tracking-widest mb-3">Step-by-Step Calculation</h4>
        <ul className="space-y-2">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-xs text-muted-foreground">
              <span className="font-bold text-primary">{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <CalculatorWrapper
      title="Fraction Calculator"
      description="Advanced fraction tools for addition, subtraction, mixed numbers, simplification, and precise decimal conversions."
      icon={Divide}
    >
      <div className="space-y-12">
        {/* 1. Standard Fraction Calculator */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><Divide size={24} /></div>
            <h3 className="text-2xl font-bold text-primary">Standard Fractions</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-7">
              <CardContent className="pt-8">
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                  {/* Fraction 1 */}
                  <div className="flex flex-col items-center gap-2">
                    <Input type="number" className="w-20 text-center font-bold" value={f1.n} onChange={e => setF1({...f1, n: Number(e.target.value)})} />
                    <div className="w-24 h-0.5 bg-foreground" />
                    <Input type="number" className="w-20 text-center font-bold" value={f1.d} onChange={e => setF1({...f1, d: Number(e.target.value)})} />
                  </div>
                  
                  {/* Operator */}
                  <Select value={fOp} onValueChange={setFOp}>
                    <SelectTrigger className="w-20 h-14 text-xl font-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+">+</SelectItem>
                      <SelectItem value="-">-</SelectItem>
                      <SelectItem value="*">×</SelectItem>
                      <SelectItem value="/">÷</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Fraction 2 */}
                  <div className="flex flex-col items-center gap-2">
                    <Input type="number" className="w-20 text-center font-bold" value={f2.n} onChange={e => setF2({...f2, n: Number(e.target.value)})} />
                    <div className="w-24 h-0.5 bg-foreground" />
                    <Input type="number" className="w-20 text-center font-bold" value={f2.d} onChange={e => setF2({...f2, d: Number(e.target.value)})} />
                  </div>

                  <div className="text-3xl font-black text-muted-foreground">=</div>

                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 text-center min-w-[120px]">
                    <div className="text-3xl font-black text-primary">{standardResult.improper.n}</div>
                    <div className="w-full h-1 bg-primary my-2" />
                    <div className="text-3xl font-black text-primary">{standardResult.improper.d}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-accent text-white border-none shadow-lg">
                <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest opacity-70">Mixed Number & Decimal</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-center">
                  <div className="text-4xl font-black">
                    {standardResult.mixed.w !== 0 && standardResult.mixed.w}
                    {standardResult.mixed.n !== 0 && (
                      <span className="inline-flex flex-col items-center align-middle text-2xl ml-2">
                        <span>{standardResult.mixed.n}</span>
                        <span className="w-8 h-0.5 bg-white my-1" />
                        <span>{standardResult.mixed.d}</span>
                      </span>
                    )}
                    {standardResult.mixed.w === 0 && standardResult.mixed.n === 0 && '0'}
                  </div>
                  <Separator className="bg-white/20" />
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Decimal Equivalent</p>
                    <p className="text-2xl font-bold font-mono">{standardResult.decimal}</p>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full mt-4 bg-white/10 hover:bg-white/20 border-white/20"
                    onClick={() => setShowStandardSteps(!showStandardSteps)}
                  >
                    {showStandardSteps ? <ChevronUp className="mr-2" size={14} /> : <ChevronDown className="mr-2" size={14} />}
                    Show Calculation
                  </Button>
                  <StepBox steps={standardResult.steps} isVisible={showStandardSteps} />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* 2. Mixed Numbers Calculator */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Hash size={24} /></div>
            <h3 className="text-2xl font-bold text-primary">Mixed Numbers</h3>
          </div>
          <Card>
            <CardContent className="pt-8">
              <div className="flex flex-wrap items-center justify-center gap-8">
                {/* Mixed 1 */}
                <div className="flex items-center gap-2">
                  <Input type="number" className="w-16 h-16 text-xl text-center font-black border-2 border-primary/20" value={m1.w} onChange={e => setM1({...m1, w: Number(e.target.value)})} />
                  <div className="flex flex-col items-center gap-1">
                    <Input type="number" className="w-16 h-10 text-center font-bold" value={m1.n} onChange={e => setM1({...m1, n: Number(e.target.value)})} />
                    <div className="w-16 h-0.5 bg-foreground" />
                    <Input type="number" className="w-16 h-10 text-center font-bold" value={m1.d} onChange={e => setM1({...m1, d: Number(e.target.value)})} />
                  </div>
                </div>

                <Select value={mOp} onValueChange={setMOp}>
                  <SelectTrigger className="w-16 h-16 text-2xl font-black"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+">+</SelectItem>
                    <SelectItem value="-">-</SelectItem>
                    <SelectItem value="*">×</SelectItem>
                    <SelectItem value="/">÷</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mixed 2 */}
                <div className="flex items-center gap-2">
                  <Input type="number" className="w-16 h-16 text-xl text-center font-black border-2 border-primary/20" value={m2.w} onChange={e => setM2({...m2, w: Number(e.target.value)})} />
                  <div className="flex flex-col items-center gap-1">
                    <Input type="number" className="w-16 h-10 text-center font-bold" value={m2.n} onChange={e => setM2({...m2, n: Number(e.target.value)})} />
                    <div className="w-16 h-0.5 bg-foreground" />
                    <Input type="number" className="w-16 h-10 text-center font-bold" value={m2.d} onChange={e => setM2({...m2, d: Number(e.target.value)})} />
                  </div>
                </div>

                <div className="text-3xl font-black text-muted-foreground">=</div>

                <div className="bg-primary text-white p-6 rounded-[2rem] shadow-xl text-center min-w-[200px]">
                  <p className="text-[10px] uppercase font-bold opacity-60 mb-2">Final Result</p>
                  <div className="text-4xl font-black">
                    {mixedResult.mixed.w !== 0 && mixedResult.mixed.w}
                    {mixedResult.mixed.n !== 0 && (
                      <span className="inline-flex flex-col items-center align-middle text-2xl ml-2">
                        <span>{mixedResult.mixed.n}</span>
                        <span className="w-8 h-0.5 bg-white my-1" />
                        <span>{mixedResult.mixed.d}</span>
                      </span>
                    )}
                    {mixedResult.mixed.w === 0 && mixedResult.mixed.n === 0 && '0'}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm opacity-80 italic">
                    Improper: {mixedResult.improper.n}/{mixedResult.improper.d}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full mt-6 bg-white/10 hover:bg-white/20 border-white/20"
                    onClick={() => setShowMixedSteps(!showMixedSteps)}
                  >
                    {showMixedSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    <span className="ml-2">Show Calculation</span>
                  </Button>
                  <div className="text-left">
                    <StepBox steps={mixedResult.steps} isVisible={showMixedSteps} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 3. Simplify Fraction */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><RefreshCw size={24} /></div>
            <h3 className="text-2xl font-bold text-primary">Simplify Fraction</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-8 flex flex-col items-center gap-4">
                <Input type="number" className="w-32 text-center text-lg font-bold" value={simp.n} onChange={e => setSimp({...simp, n: Number(e.target.value)})} />
                <div className="w-40 h-1 bg-foreground" />
                <Input type="number" className="w-32 text-center text-lg font-bold" value={simp.d} onChange={e => setSimp({...simp, d: Number(e.target.value)})} />
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none flex flex-col justify-center items-center text-center p-8">
              <p className="text-xs uppercase font-bold text-muted-foreground mb-4">Simplified Version</p>
              <div className="text-5xl font-black text-primary">
                {simpResult.simple.n}
                <span className="mx-2 text-muted-foreground/30">/</span>
                {simpResult.simple.d}
              </div>
              {simpResult.mixedW !== 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  As Mixed: <strong>{simpResult.mixedW} {simpResult.mixedN}/{simpResult.simple.d}</strong>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-6 gap-2"
                onClick={() => setShowSimplifySteps(!showSimplifySteps)}
              >
                {showSimplifySteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Show Calculation
              </Button>
              <div className="w-full text-left">
                <StepBox steps={simpResult.steps} isVisible={showSimplifySteps} />
              </div>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 4 & 5. Conversions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Decimal to Fraction */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-xl text-accent"><Binary size={24} /></div>
              <h3 className="text-xl font-bold text-primary">Decimal to Fraction</h3>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Label>Decimal Value</Label>
                <Input value={decVal} onChange={e => setDecVal(e.target.value)} placeholder="e.g. 1.375" />
                <div className="pt-4 text-center">
                  {decToFracResult ? (
                    <div className="space-y-2">
                      <div className="text-3xl font-black text-accent">{decToFracResult.simple.n} / {decToFracResult.simple.d}</div>
                      <p className="text-xs text-muted-foreground">Mixed: {decToFracResult.mixedW} {decToFracResult.mixedN}/{decToFracResult.simple.d}</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-accent"
                        onClick={() => setShowDecToFracSteps(!showDecToFracSteps)}
                      >
                        {showDecToFracSteps ? "Hide Calculation" : "Show Calculation"}
                      </Button>
                      <StepBox steps={decToFracResult.steps} isVisible={showDecToFracSteps} />
                    </div>
                  ) : <p className="text-sm italic opacity-50">Invalid decimal</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fraction to Decimal */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary"><Percent size={24} /></div>
              <h3 className="text-xl font-bold text-primary">Fraction to Decimal</h3>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Input type="number" className="w-20 text-center" value={fToD.n} onChange={e => setFToD({...fToD, n: Number(e.target.value)})} />
                    <div className="w-20 h-0.5 bg-foreground" />
                    <Input type="number" className="w-20 text-center" value={fToD.d} onChange={e => setFToD({...fToD, d: Number(e.target.value)})} />
                  </div>
                  <div className="text-2xl font-black text-muted-foreground">→</div>
                  <div className="flex-1 space-y-4">
                    <div className="bg-muted/50 p-4 rounded-xl text-2xl font-mono font-bold text-center">
                      {fToDResult.value}
                    </div>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="w-full text-primary"
                      onClick={() => setShowFracToDecSteps(!showFracToDecSteps)}
                    >
                      {showFracToDecSteps ? "Hide Calculation" : "Show Calculation"}
                    </Button>
                    <StepBox steps={fToDResult.steps} isVisible={showFracToDecSteps} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 6. Big Number Fraction Calculator */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><History size={24} /></div>
            <h3 className="text-2xl font-bold text-primary">Big Number Fractions</h3>
          </div>
          <Card className="bg-slate-50 border-2 border-dashed">
            <CardHeader><CardTitle className="text-sm">Extended Precision Engine</CardTitle></CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-6">
                <div className="space-y-4">
                  <Input value={b1.n} onChange={e => setB1({...b1, n: e.target.value})} placeholder="Large Numerator" />
                  <Separator />
                  <Input value={b1.d} onChange={e => setB1({...b1, d: e.target.value})} placeholder="Large Denominator" />
                </div>
                
                <div className="flex justify-center">
                  <Select value={bOp} onValueChange={setBOp}>
                    <SelectTrigger className="w-24 h-24 text-4xl font-black rounded-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+">+</SelectItem>
                      <SelectItem value="-">-</SelectItem>
                      <SelectItem value="*">×</SelectItem>
                      <SelectItem value="/">÷</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Input value={b2.n} onChange={e => setB2({...b2, n: e.target.value})} placeholder="Large Numerator" />
                  <Separator />
                  <Input value={b2.d} onChange={e => setB2({...b2, d: e.target.value})} placeholder="Large Denominator" />
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border shadow-inner text-center">
                <p className="text-xs uppercase font-black text-muted-foreground/60 mb-4">Calculated Result</p>
                <div className="space-y-4 overflow-x-auto">
                  <div className="text-xl font-bold font-mono text-primary break-all">{bigResult.n}</div>
                  <div className="h-1 bg-primary max-w-md mx-auto" />
                  <div className="text-xl font-bold font-mono text-primary break-all">{bigResult.d}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-8"
                  onClick={() => setShowBigSteps(!showBigSteps)}
                >
                  {showBigSteps ? <ChevronUp className="mr-2" size={14} /> : <ChevronDown className="mr-2" size={14} />}
                  Show Calculation
                </Button>
                <div className="text-left">
                  <StepBox steps={bigResult.steps} isVisible={showBigSteps} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 space-y-12 py-10">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Info className="w-6 h-6" />
                Understanding Fractions
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                A fraction represents a part of a whole. The top number, the <strong>numerator</strong>, represents how many parts you have, while the bottom number, the <strong>denominator</strong>, represents how many parts make up the whole.
              </p>
              <h4 className="font-bold text-foreground">Proper vs. Improper Fractions</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                A <strong>proper fraction</strong> has a numerator smaller than its denominator (e.g., 3/4). An <strong>improper fraction</strong> has a numerator equal to or larger than its denominator (e.g., 7/4), which can also be expressed as a <strong>mixed number</strong> (1 3/4).
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Calculation Tips</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Common Denominators</p>
                    <p className="text-xs text-muted-foreground">To add or subtract fractions, you must first find a common denominator. Our calculator handles this automatically by multiplying the cross-products.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Simplify Often</p>
                    <p className="text-xs text-muted-foreground">Always use the <strong>Greatest Common Divisor (GCD)</strong> to reduce your fraction to its simplest terms for cleaner reporting.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
