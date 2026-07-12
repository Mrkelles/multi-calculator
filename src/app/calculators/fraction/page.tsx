"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Divide, RefreshCw, Hash, Binary, Percent, Info, History, Calculator } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
  if (d === 0) return { n: NaN, d: NaN };
  const common = gcd(n, d);
  let resN = n / common;
  let resD = d / common;
  // Standardize sign to numerator
  if (resD < 0) {
    resN = -resN;
    resD = -resD;
  }
  return { n: resN, d: resD };
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
  if (d === 0n) return { n: 0n, d: 0n };
  const common = gcdBig(n, d);
  let resN = n / common;
  let resD = d / common;
  if (resD < 0n) {
    resN = -resN;
    resD = -resD;
  }
  return { n: resN, d: resD };
};

export default function FractionCalculatorsPage() {
  // 1. Standard Fraction Calculator
  const [f1, setF1] = useState({ n: 2, d: 7 });
  const [f2, setF2] = useState({ n: 3, d: 8 });
  const [fOp, setFOp] = useState('+');

  const standardResult = useMemo(() => {
    let resN = 0;
    let resD = 0;
    if (fOp === '+') { resN = f1.n * f2.d + f2.n * f1.d; resD = f1.d * f2.d; }
    else if (fOp === '-') { resN = f1.n * f2.d - f2.n * f1.d; resD = f1.d * f2.d; }
    else if (fOp === '*') { resN = f1.n * f2.n; resD = f1.d * f2.d; }
    else if (fOp === '/') { resN = f1.n * f2.d; resD = f1.d * f2.n; }

    const simple = simplifyFraction(resN, resD);
    const mixedW = Math.trunc(simple.n / simple.d);
    const mixedN = Math.abs(simple.n % simple.d);

    return { 
      improper: simple, 
      decimal: (resN / resD).toFixed(4),
      mixed: { w: mixedW, n: mixedN, d: simple.d }
    };
  }, [f1, f2, fOp]);

  // 2. Mixed Numbers Calculator
  const [m1, setM1] = useState({ w: -2, n: 3, d: 4 });
  const [m2, setM2] = useState({ w: 3, n: 5, d: 7 });
  const [mOp, setMOp] = useState('+');

  const mixedResult = useMemo(() => {
    // Convert to improper: (w * d + n) / d. Handle negative w correctly.
    const toImproper = (m: any) => {
      const sign = m.w < 0 ? -1 : 1;
      return { n: sign * (Math.abs(m.w) * m.d + m.n), d: m.d };
    };
    const i1 = toImproper(m1);
    const i2 = toImproper(m2);

    let resN = 0, resD = 0;
    if (mOp === '+') { resN = i1.n * i2.d + i2.n * i1.d; resD = i1.d * i2.d; }
    else if (mOp === '-') { resN = i1.n * i2.d - i2.n * i1.d; resD = i1.d * i2.d; }
    else if (mOp === '*') { resN = i1.n * i2.n; resD = i1.d * i2.d; }
    else if (mOp === '/') { resN = i1.n * i2.d; resD = i1.d * i2.n; }

    const simple = simplifyFraction(resN, resD);
    const mixedW = Math.trunc(simple.n / simple.d);
    const mixedN = Math.abs(simple.n % simple.d);

    return { 
      improper: simple, 
      decimal: (resN / resD).toFixed(4),
      mixed: { w: mixedW, n: mixedN, d: simple.d }
    };
  }, [m1, m2, mOp]);

  // 3. Simplify Fraction
  const [simp, setSimp] = useState({ n: 21, d: 98 });
  const simpResult = useMemo(() => {
    const simple = simplifyFraction(simp.n, simp.d);
    const mixedW = Math.trunc(simple.n / simple.d);
    const mixedN = Math.abs(simple.n % simple.d);
    return { simple, mixedW, mixedN };
  }, [simp]);

  // 4. Decimal to Fraction
  const [decVal, setDecVal] = useState('1.375');
  const decToFracResult = useMemo(() => {
    const val = parseFloat(decVal);
    if (isNaN(val)) return null;
    
    // Find precision
    const parts = decVal.split('.');
    const precision = parts[1] ? parts[1].length : 0;
    const denominator = Math.pow(10, precision);
    const numerator = Math.round(val * denominator);
    
    const simple = simplifyFraction(numerator, denominator);
    const mixedW = Math.trunc(simple.n / simple.d);
    const mixedN = Math.abs(simple.n % simple.d);
    
    return { simple, mixedW, mixedN };
  }, [decVal]);

  // 5. Fraction to Decimal
  const [fToD, setFToD] = useState({ n: 2, d: 7 });
  const fToDResult = useMemo(() => (fToD.n / fToD.d).toString(), [fToD]);

  // 6. Big Number Fraction
  const [b1, setB1] = useState({ n: '1234', d: '748892928829' });
  const [b2, setB2] = useState({ n: '33434421132232234333', d: '8877277388288288288' });
  const [bOp, setBOp] = useState('+');

  const bigResult = useMemo(() => {
    try {
      const bn1 = BigInt(b1.n);
      const bd1 = BigInt(b1.d);
      const bn2 = BigInt(b2.n);
      const bd2 = BigInt(b2.d);
      
      let resN = 0n, resD = 0n;
      if (bOp === '+') { resN = bn1 * bd2 + bn2 * bd1; resD = bd1 * bd2; }
      else if (bOp === '-') { resN = bn1 * bd2 - bn2 * bd1; resD = bd1 * bd2; }
      else if (bOp === '*') { resN = bn1 * bn2; resD = bd1 * bd2; }
      else if (bOp === '/') { resN = bn1 * bd2; resD = bd1 * bn2; }

      const simple = simplifyBig(resN, resD);
      return { n: simple.n.toString(), d: simple.d.toString() };
    } catch (e) {
      return { n: 'Error', d: 'Error' };
    }
  }, [b1, b2, bOp]);

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

                <div className="bg-primary text-white p-6 rounded-[2rem] shadow-xl text-center min-w-[160px]">
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
                  <div className="flex-1 bg-muted/50 p-4 rounded-xl text-2xl font-mono font-bold text-center">
                    {fToDResult}
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

              <div className="bg-white p-8 rounded-3xl border shadow-inner">
                <p className="text-xs uppercase font-black text-muted-foreground/60 mb-4 text-center">Calculated Result</p>
                <div className="space-y-4 text-center overflow-x-auto">
                  <div className="text-xl font-bold font-mono text-primary break-all">{bigResult.n}</div>
                  <div className="h-1 bg-primary max-w-md mx-auto" />
                  <div className="text-xl font-bold font-mono text-primary break-all">{bigResult.d}</div>
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
