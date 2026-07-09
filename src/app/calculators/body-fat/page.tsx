"use client"

import { useState, useMemo, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Activity, 
  Info, 
  User, 
  History, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

type Gender = 'male' | 'female';
type UnitMode = 'us' | 'metric';

const jacksonPollockData = [
  { age: 20, women: 17.7, men: 8.5 },
  { age: 25, women: 18.4, men: 10.5 },
  { age: 30, women: 19.3, men: 12.7 },
  { age: 35, women: 21.5, men: 13.7 },
  { age: 40, women: 22.2, men: 15.3 },
  { age: 45, women: 22.9, men: 16.4 },
  { age: 50, women: 25.2, men: 18.9 },
  { age: 55, women: 26.3, men: 20.9 },
];

export default function BodyFatCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<UnitMode>('us');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(152);

  // US Mode (Feet + Inches)
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(10);
  const [neckFt, setNeckFt] = useState(1);
  const [neckIn, setNeckIn] = useState(7.5);
  const [waistFt, setWaistFt] = useState(3);
  const [waistIn, setWaistIn] = useState(1.5);
  const [hipFt, setHipFt] = useState(2);
  const [hipIn, setHipIn] = useState(10.5);

  // Metric Mode (Single CM value)
  const [heightCm, setHeightCm] = useState(177.8);
  const [neckCm, setNeckCm] = useState(49.5);
  const [waistCm, setWaistCm] = useState(95.3);
  const [hipCm, setHipCm] = useState(87.6);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const results = useMemo(() => {
    if (!isMounted) return null;

    let h_cm = 0, w_cm = 0, n_cm = 0, hip_cm = 0;
    const w_lbs = mode === 'us' ? weight : weight / 0.453592;

    if (mode === 'us') {
      h_cm = ((heightFt * 12) + heightIn) * 2.54;
      w_cm = ((waistFt * 12) + waistIn) * 2.54;
      n_cm = ((neckFt * 12) + neckIn) * 2.54;
      hip_cm = ((hipFt * 12) + hipIn) * 2.54;
    } else {
      h_cm = heightCm;
      w_cm = waistCm;
      n_cm = neckCm;
      hip_cm = hipCm;
    }

    let bodyFat = 0;
    if (gender === 'male') {
      // High-precision density Navy Formula for Men
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w_cm - n_cm) + 0.15456 * Math.log10(h_cm)) - 450;
    } else {
      // High-precision density Navy Formula for Women
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w_cm + hip_cm - n_cm) + 0.22100 * Math.log10(h_cm)) - 450;
    }

    if (isNaN(bodyFat) || bodyFat < 0) return null;

    const bodyFatMass = w_lbs * (bodyFat / 100);
    const leanBodyMass = w_lbs - bodyFatMass;

    // BMI Method estimation
    const h_m = h_cm / 100;
    const w_kg = w_lbs * 0.453592;
    const bmi = w_kg / (h_m * h_m);
    const bmiBodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * (gender === 'male' ? 1 : 0)) - 5.4;

    // Ideal BF (Jackson & Pollock)
    const closestAgeRow = jacksonPollockData.reduce((prev, curr) => 
      Math.abs(curr.age - age) < Math.abs(prev.age - age) ? curr : prev
    );
    const idealBf = gender === 'male' ? closestAgeRow.men : closestAgeRow.women;
    const bfToLose = Math.max(0, bodyFatMass - (w_lbs * (idealBf / 100)));

    // Category Logic (ACE)
    let category = '';
    let categoryColor = '';
    if (gender === 'male') {
      if (bodyFat < 6) { category = 'Essential Fat'; categoryColor = 'text-blue-500'; }
      else if (bodyFat < 14) { category = 'Athlete'; categoryColor = 'text-green-500'; }
      else if (bodyFat < 18) { category = 'Fitness'; categoryColor = 'text-emerald-600'; }
      else if (bodyFat < 25) { category = 'Acceptable'; categoryColor = 'text-yellow-600'; }
      else { category = 'Obese'; categoryColor = 'text-red-500'; }
    } else {
      if (bodyFat < 14) { category = 'Essential Fat'; categoryColor = 'text-blue-500'; }
      else if (bodyFat < 21) { category = 'Athlete'; categoryColor = 'text-green-500'; }
      else if (bodyFat < 25) { category = 'Fitness'; categoryColor = 'text-emerald-600'; }
      else if (bodyFat < 32) { category = 'Acceptable'; categoryColor = 'text-yellow-600'; }
      else { category = 'Obese'; categoryColor = 'text-red-500'; }
    }

    return {
      bodyFat,
      category,
      categoryColor,
      bodyFatMass,
      leanBodyMass,
      idealBf,
      bfToLose,
      bmiBodyFat
    };
  }, [isMounted, mode, gender, age, weight, heightFt, heightIn, neckFt, neckIn, waistFt, waistIn, hipFt, hipIn, heightCm, neckCm, waistCm, hipCm]);

  const toggleMode = (newMode: UnitMode) => {
    if (newMode === mode) return;
    if (newMode === 'metric') {
      setHeightCm(Number(((heightFt * 12 + heightIn) * 2.54).toFixed(1)));
      setWeight(Number((weight * 0.453592).toFixed(1)));
      setNeckCm(Number(((neckFt * 12 + neckIn) * 2.54).toFixed(1)));
      setWaistCm(Number(((waistFt * 12 + waistIn) * 2.54).toFixed(1)));
      setHipCm(Number(((hipFt * 12 + hipIn) * 2.54).toFixed(1)));
    } else {
      const totalHIn = heightCm / 2.54;
      setHeightFt(Math.floor(totalHIn / 12));
      setHeightIn(Number((totalHIn % 12).toFixed(1)));
      setWeight(Number((weight / 0.453592).toFixed(1)));
      const totalNIn = neckCm / 2.54;
      setNeckFt(Math.floor(totalNIn / 12));
      setNeckIn(Number((totalNIn % 12).toFixed(1)));
      const totalWIn = waistCm / 2.54;
      setWaistFt(Math.floor(totalWIn / 12));
      setWaistIn(Number((totalWIn % 12).toFixed(1)));
      const totalHipIn = hipCm / 2.54;
      setHipFt(Math.floor(totalHipIn / 12));
      setHipIn(Number((totalHipIn % 12).toFixed(1)));
    }
    setMode(newMode);
  };

  return (
    <CalculatorWrapper
      title="Body Fat Calculator"
      description="Estimate your body fat percentage using the U.S. Navy formula and determine your health category."
      icon={Activity}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <Tabs value={mode} onValueChange={(v: any) => toggleMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="us">US Units</TabsTrigger>
                  <TabsTrigger value="metric">Metric Units</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gender</Label>
                  <RadioGroup value={gender} onValueChange={(v: any) => setGender(v)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age</Label>
                    <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Weight ({mode === 'us' ? 'lbs' : 'kg'})
                    </Label>
                    <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                  </div>
                </div>

                {mode === 'us' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Height</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <Input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ft</span>
                        </div>
                        <div className="relative">
                          <Input type="number" step="0.1" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">in</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neck</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <Input type="number" value={neckFt} onChange={(e) => setNeckFt(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ft</span>
                        </div>
                        <div className="relative">
                          <Input type="number" step="0.1" value={neckIn} onChange={(e) => setNeckIn(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">in</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Waist</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <Input type="number" value={waistFt} onChange={(e) => setWaistFt(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ft</span>
                        </div>
                        <div className="relative">
                          <Input type="number" step="0.1" value={waistIn} onChange={(e) => setWaistIn(Number(e.target.value))} className="pr-7" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">in</span>
                        </div>
                      </div>
                    </div>

                    {gender === 'female' && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hip</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <Input type="number" value={hipFt} onChange={(e) => setHipFt(Number(e.target.value))} className="pr-7" />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ft</span>
                          </div>
                          <div className="relative">
                            <Input type="number" step="0.1" value={hipIn} onChange={(e) => setHipIn(Number(e.target.value))} className="pr-7" />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">in</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Height (cm)</Label>
                      <Input type="number" step="0.1" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neck (cm)</Label>
                      <Input type="number" step="0.1" value={neckCm} onChange={(e) => setNeckCm(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Waist (cm)</Label>
                      <Input type="number" step="0.1" value={waistCm} onChange={(e) => setWaistCm(Number(e.target.value))} />
                    </div>
                    {gender === 'female' && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hip (cm)</Label>
                        <Input type="number" step="0.1" value={hipCm} onChange={(e) => setHipCm(Number(e.target.value))} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic">
              Please enter your measurements to see results.
            </Card>
          ) : (
            <>
              <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-24 h-24" />
                </div>
                <CardContent className="pt-10 pb-10 text-center relative z-10 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-bold">Estimated Body Fat</p>
                    <h3 className="text-6xl md:text-7xl font-black font-headline tracking-tighter">
                      {results.bodyFat.toFixed(1)}%
                    </h3>
                  </div>
                  
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="bg-white/10 p-2 px-6 rounded-full inline-block border border-white/20">
                      <p className="text-xs font-bold uppercase tracking-widest">
                        Category: <span className="text-accent-foreground font-black">{results.category}</span>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                        <span>Body Fat Index</span>
                        <span>{results.category}</span>
                      </div>
                      <Progress value={results.bodyFat * 2} className="h-2 bg-white/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Composition Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground font-medium">Body Fat Mass</span>
                      <span className="font-bold">{results.bodyFatMass.toFixed(1)} lbs</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground font-medium">Lean Body Mass</span>
                      <span className="font-bold">{results.leanBodyMass.toFixed(1)} lbs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">BMI Method Est.</span>
                      <span className="font-bold text-muted-foreground">{results.bmiBodyFat.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-accent">
                      <Target className="w-4 h-4" />
                      Goal Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground font-medium">Ideal BF (for age)</span>
                      <span className="font-bold text-primary">{results.idealBf}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Fat to lose for ideal</span>
                      <span className="font-bold text-accent">{results.bfToLose.toFixed(1)} lbs</span>
                    </div>
                    <Separator />
                    <p className="text-[10px] text-muted-foreground leading-tight italic">
                      Ideal percentage based on Jackson & Pollock benchmark for age {age}.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Reference Tables */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-primary">Body Fat Classification</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The American Council on Exercise (ACE) provides standard categories for body fat percentages based on gender and fitness goals.
              </p>
              <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold">Description</TableHead>
                      <TableHead className="font-bold text-right">Women</TableHead>
                      <TableHead className="font-bold text-right">Men</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Essential fat</TableCell>
                      <TableCell className="text-right">10-13%</TableCell>
                      <TableCell className="text-right">2-5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Athletes</TableCell>
                      <TableCell className="text-right">14-20%</TableCell>
                      <TableCell className="text-right">6-13%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-emerald-600">Fitness</TableCell>
                      <TableCell className="text-right">21-24%</TableCell>
                      <TableCell className="text-right">14-17%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Average</TableCell>
                      <TableCell className="text-right">25-31%</TableCell>
                      <TableCell className="text-right">18-24%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-red-500">Obese</TableCell>
                      <TableCell className="text-right">32%+</TableCell>
                      <TableCell className="text-right">25%+</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Jackson & Pollock Method</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A popular age-based benchmark for understanding body fat composition targets.
              </p>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="text-[10px] font-bold">Age</TableHead>
                      <TableHead className="text-[10px] font-bold text-right">Women</TableHead>
                      <TableHead className="text-[10px] font-bold text-right">Men</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[11px]">
                    {jacksonPollockData.map((row) => (
                      <TableRow key={row.age}>
                        <TableCell>{row.age}</TableCell>
                        <TableCell className="text-right">{row.women}%</TableCell>
                        <TableCell className="text-right">{row.men}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-8 pb-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Understanding Body Fat Percentage</h3>
              <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
                <p>
                  The scientific definition of body fat percentage is the total mass of fat divided by total body mass, multiplied by 100. Body fat includes essential body fat and storage body fat. Essential body fat is necessary to maintain life and reproductive functions. The percentage of essential fat is 2–5% in men, and 10–13% in women.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-accent" /> Essential Body Fat
                    </h4>
                    <p className="text-xs">Essential fat is the level below which physical and physiological health would be negatively affected. It is necessary for the proper functioning of the hormonal, reproductive, and immune systems.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-accent" /> Storage Body Fat
                    </h4>
                    <p className="text-xs">Storage body fat consists of fat accumulation in adipose tissue, part of which protects internal organs in the chest and abdomen. This is the fat that typically fluctuates based on diet and exercise.</p>
                  </div>
                </div>
                <p className="pt-4">
                  The **U.S. Navy method** implemented in this calculator provides a reliable estimate for the general population. While DEXA scans or hydrostatic weighing are more accurate "gold standards," the Navy method is highly accessible and requires only a measuring tape.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
