"use client"

import { useState, useMemo, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Baby, 
  Calendar as CalendarIcon, 
  Clock, 
  Info, 
  HeartPulse, 
  CheckCircle2, 
  History, 
  ChevronRight,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  addDays, 
  subDays, 
  differenceInDays, 
  format, 
  startOfDay,
  intervalToDuration
} from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Pregnancy Calculator | Conception to Birth Tracker',
  description: 'Track your pregnancy timeline week-by-week. Use our free pregnancy calculator to estimate your conception date, current term, and baby milestones.',
  keywords: [
    'ovulation predictor kits',
    'pregnancy calculator',
    'ovulation cycle calculator',
    'pregnancy estimator',
    'pregnancy term calculator',
    'conception to birth calculator',
    'MyApexCalc',
    'pregnancy timeline'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Precision Pregnancy Calculator & Term Estimator | MyApexCalc',
    description: 'Monitor your development milestones. Estimate your term progress and ovulation timelines instantly with our interactive pregnancy estimator.',
    url: 'https://www.myapexcalc.com/calculators/pregnancy',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/GvDqL4Yx/pregnancy-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Pregnancy Calculator Week-by-Week Dashboard Tracker',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Pregnancy Term & Timeline Calculator | MyApexCalc',
    description: 'Track your journey from conception to birth with our highly accurate online calendar.',
    images: ['https://i.ibb.co/GvDqL4Yx/pregnancy-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/pregnancy',
  },
};

type PregnancyMode = 'due-date' | 'last-period' | 'ultrasound' | 'conception' | 'ivf';

const MILESTONES: Record<number, string> = {
  3: 'Baby conceived',
  4: 'Pregnancy test positive',
  6: 'Heartbeat detectable by ultrasound',
  13: 'Miscarriage risk decreases',
  18: 'Baby begins making noticeable movements, can hear sounds, and gender can be found out.',
  23: 'Premature baby may survive',
  28: 'Baby can breathe',
  38: 'Full Term'
};

const BABY_SIZES: Record<number, { lengthCm: number; lengthIn: number; weightG: number; weightLb: number }> = {
  8: { lengthCm: 1.6, lengthIn: 0.6, weightG: 1, weightLb: 0.002 },
  12: { lengthCm: 5.4, lengthIn: 2.1, weightG: 14, weightLb: 0.03 },
  16: { lengthCm: 11.6, lengthIn: 4.6, weightG: 100, weightLb: 0.22 },
  20: { lengthCm: 25.6, lengthIn: 10.1, weightG: 300, weightLb: 0.66 },
  23: { lengthCm: 28.9, lengthIn: 11.38, weightG: 501, weightLb: 1.1 },
  25: { lengthCm: 34.6, lengthIn: 13.62, weightG: 660, weightLb: 1.46 },
  28: { lengthCm: 37.6, lengthIn: 14.8, weightG: 1000, weightLb: 2.2 },
  32: { lengthCm: 42.4, lengthIn: 16.7, weightG: 1700, weightLb: 3.7 },
  36: { lengthCm: 47.4, lengthIn: 18.7, weightG: 2600, weightLb: 5.7 },
  40: { lengthCm: 51.2, lengthIn: 20.2, weightG: 3400, weightLb: 7.5 },
};

const getBabySize = (weeks: number) => {
  const weekKeys = Object.keys(BABY_SIZES).map(Number).sort((a, b) => a - b);
  let closestWeek = weekKeys[0];
  for (const wk of weekKeys) {
    if (weeks >= wk) closestWeek = wk;
    else break;
  }
  return BABY_SIZES[closestWeek];
};

export default function PregnancyCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<PregnancyMode>('due-date');
  const [dateInput, setDateInput] = useState('');
  const [embryoAge, setEmbryoAge] = useState('5');
  const [cycleLength, setCycleLength] = useState(28);
  
  // Ultrasound specific fields
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState(22);
  const [ultrasoundDays, setUltrasoundDays] = useState(6);

  useEffect(() => {
    setIsMounted(true);
    // Default to a date that shows some progress (e.g., 20 weeks from now)
    setDateInput(format(addDays(new Date(), 140), 'yyyy-MM-dd'));
  }, []);

  const results = useMemo(() => {
    if (!isMounted || !dateInput) return null;
    
    const today = startOfDay(new Date());
    let dueDate: Date;
    let lmpDate: Date;
    let effectiveLmpDate: Date;

    try {
      const inputDate = startOfDay(new Date(dateInput));

      if (mode === 'due-date') {
        dueDate = inputDate;
        lmpDate = subDays(dueDate, 280);
        effectiveLmpDate = lmpDate;
      } else if (mode === 'last-period') {
        lmpDate = inputDate;
        const cycleAdj = cycleLength - 28;
        dueDate = addDays(lmpDate, 280 + cycleAdj);
        effectiveLmpDate = addDays(lmpDate, cycleAdj);
      } else if (mode === 'conception') {
        lmpDate = subDays(inputDate, 14);
        dueDate = addDays(lmpDate, 280);
        effectiveLmpDate = lmpDate;
      } else if (mode === 'ultrasound') {
        const totalDaysAtUltrasound = (ultrasoundWeeks * 7) + ultrasoundDays;
        effectiveLmpDate = subDays(inputDate, totalDaysAtUltrasound);
        dueDate = addDays(effectiveLmpDate, 280);
        lmpDate = effectiveLmpDate;
      } else if (mode === 'ivf') {
        const age = parseInt(embryoAge);
        const offset = 266 - age;
        dueDate = addDays(inputDate, offset);
        lmpDate = subDays(dueDate, 280);
        effectiveLmpDate = lmpDate;
      } else {
        dueDate = inputDate;
        lmpDate = subDays(dueDate, 280);
        effectiveLmpDate = lmpDate;
      }

      const totalDays = 280;
      const daysPregnant = differenceInDays(today, effectiveLmpDate);
      const weeksPregnant = Math.max(0, Math.floor(daysPregnant / 7));
      const remainingDays = Math.max(0, daysPregnant % 7);
      const progressPercent = Math.min(100, Math.max(0, (daysPregnant / totalDays) * 100));

      const duration = intervalToDuration({ start: effectiveLmpDate, end: today });
      const monthsStr = `${duration.years ? duration.years * 12 + (duration.months || 0) : duration.months || 0} months ${duration.days || 0} days`;

      let trimester = 'First';
      if (weeksPregnant >= 28) trimester = 'Third';
      else if (weeksPregnant >= 13) trimester = 'Second';

      const babySize = getBabySize(weeksPregnant);
      const likelyConception = addDays(lmpDate, mode === 'last-period' ? cycleLength - 14 : 14);

      const schedule = [];
      for (let w = 1; w <= 42; w++) {
        const weekStart = addDays(effectiveLmpDate, (w - 1) * 7);
        const weekEnd = addDays(weekStart, 6);
        let trimesterLabel = '';
        if (w === 1) trimesterLabel = 'first trimester';
        if (w === 13) trimesterLabel = 'second trimester';
        if (w === 28) trimesterLabel = 'third trimester';

        schedule.push({
          week: w,
          range: `${format(weekStart, 'MMM d, yyyy')} - ${format(weekEnd, 'MMM d, yyyy')}`,
          trimester: trimesterLabel,
          milestone: MILESTONES[w] || '',
          isToday: weeksPregnant === w - 1
        });
      }

      return {
        weeksPregnant,
        remainingDays,
        monthsStr,
        trimester,
        progressPercent,
        dueDate,
        likelyConception,
        babySize,
        schedule
      };
    } catch (e) {
      return null;
    }
  }, [mode, dateInput, embryoAge, cycleLength, ultrasoundWeeks, ultrasoundDays, isMounted]);

  return (
    <CalculatorWrapper
      title="Pregnancy Calculator"
      description="Estimate your due date and track your pregnancy progress week by week based on your unique cycle or medical milestones."
      icon={Baby}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">Calculation Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Calculate Based On:</Label>
                  <Select value={mode} onValueChange={(v: any) => setMode(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select calculation mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="due-date">Due Date</SelectItem>
                      <SelectItem value="last-period">Last Period</SelectItem>
                      <SelectItem value="conception">Conception Date</SelectItem>
                      <SelectItem value="ultrasound">Ultrasound</SelectItem>
                      <SelectItem value="ivf">IVF Transfer Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="capitalize text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {mode === 'last-period' ? 'First Day of Your Last Period:' : 
                     mode === 'ultrasound' ? 'Ultrasound Date:' :
                     `${mode.replace('-', ' ')}`}
                  </Label>
                  <Input 
                    type="date" 
                    value={dateInput} 
                    onChange={(e) => setDateInput(e.target.value)} 
                  />
                </div>

                {mode === 'last-period' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average Length of Your Cycles (in days)</Label>
                    <Input 
                      type="number" 
                      value={cycleLength} 
                      onChange={(e) => setCycleLength(Number(e.target.value))} 
                    />
                  </div>
                )}

                {mode === 'ultrasound' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Length of Pregnancy at the Time:</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          value={ultrasoundWeeks} 
                          onChange={(e) => setUltrasoundWeeks(Number(e.target.value))} 
                        />
                        <span className="text-xs text-muted-foreground">weeks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          value={ultrasoundDays} 
                          onChange={(e) => setUltrasoundDays(Number(e.target.value))} 
                        />
                        <span className="text-xs text-muted-foreground">days</span>
                      </div>
                    </div>
                  </div>
                )}

                {mode === 'ivf' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Embryo Age</Label>
                    <Select value={embryoAge} onValueChange={setEmbryoAge}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Day 3 Embryo</SelectItem>
                        <SelectItem value="5">Day 5 Embryo</SelectItem>
                        <SelectItem value="6">Day 6 Embryo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic">
              Please enter valid dates to see results.
            </Card>
          ) : (
            <>
              <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Baby className="w-24 h-24" />
                </div>
                <CardContent className="pt-10 pb-10 text-center relative z-10 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-bold">Current Progress</p>
                    <h3 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">
                      Week #{results.weeksPregnant + 1}
                    </h3>
                    <p className="text-lg opacity-80 mt-1">
                      ({results.weeksPregnant} weeks {results.remainingDays} days or {results.monthsStr})
                    </p>
                  </div>
                  
                  <div className="bg-white/10 p-2 px-6 rounded-full inline-block border border-white/20">
                    <p className="text-xs font-bold uppercase tracking-widest">{results.trimester} Trimester</p>
                  </div>

                  <div className="pt-4 max-w-sm mx-auto space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase opacity-80 tracking-widest">
                      <span>Completion</span>
                      <span>{Math.round(results.progressPercent)}%</span>
                    </div>
                    <Progress value={results.progressPercent} className="h-3 bg-white/20" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Estimated Baby Size
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Avg. Length</span>
                      <span className="font-bold">{results.babySize.lengthIn.toFixed(2)} in ({results.babySize.lengthCm.toFixed(1)} cm)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Weight</span>
                      <span className="font-bold">{results.babySize.weightLb.toFixed(2)} lbs ({results.babySize.weightG} g)</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-accent" />
                      Key Estimates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Due Date</span>
                      <span className="font-bold text-primary">{format(results.dueDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conception</span>
                      <span className="font-bold">{format(results.likelyConception, 'MMM d, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {results && (
          <div className="lg:col-span-12 py-10 space-y-8">
            <Separator />
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <HeartPulse className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-primary">Milestone Schedule</h3>
              </div>
              <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-bold w-[120px]">Week</TableHead>
                        <TableHead className="font-bold">Date Range</TableHead>
                        <TableHead className="font-bold">Trimester</TableHead>
                        <TableHead className="font-bold">Milestones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.schedule.map((row) => (
                        <TableRow key={row.week} className={row.isToday ? "bg-primary/5 font-bold border-l-4 border-l-primary" : ""}>
                          <TableCell className="font-medium text-primary">
                            Week {row.week} {row.isToday && "(Today)"}
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap">{row.range}</TableCell>
                          <TableCell className="text-[10px] uppercase font-black text-muted-foreground/60">
                            {row.trimester}
                          </TableCell>
                          <TableCell className="text-xs font-medium text-accent">
                            {row.milestone}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="lg:col-span-12 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Track Your Journey with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Embarking on the road to parenthood is a remarkable, life-changing experience. From the early days of family planning to the moment you welcome your little one, keeping close track of your physical milestones helps you feel connected, prepared, and confident. Whether you are trying to understand your body's natural rhythms or already looking forward to your estimated delivery date, our free online pregnancy calculator is designed to act as your complete companion from conception to birth calculator tracking.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                The Science of Conception: Mapping Your Timeline
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  A typical pregnancy is measured from the first day of your last menstrual period (LMP) because the exact moment of conception is rarely known. To bridge this gap, our multi-function pregnancy estimator relies on your cycle details to trace your journey backward and forward:
                </p>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">The Ovulation and Conception Window:</p>
                  <p className="text-sm text-muted-foreground">For those currently trying to conceive, tracking your ovulation window is key. Most women ovulate roughly midway through their menstrual cycle. Using an ovulation cycle calculator alongside physical tracking tools like ovulation predictor kits can help pinpoint your most fertile days.</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Estimated Ovulation Day = First Day of LMP + (Cycle Length - 14)
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">The Pregnancy Term and Progression:</p>
                  <p className="text-sm text-muted-foreground">Once pregnancy is confirmed, our pregnancy term calculator converts your cycle dates into active development weeks. Medical practice divides these 40 weeks into three key trimesters, tracking your progress using gestational age:</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Gestational Age (in Days) = Current Date - First Day of LMP
                  </div>
                  <p className="text-xs text-muted-foreground pt-1 italic">
                    This gestational age calculation is translated into completed weeks and days, giving you an immediate view of your current term and the structural development taking place inside your body.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Choose the MyApexCalc Pregnancy Tracker?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instead of sorting through cluttered online forums or dealing with invasive apps, MyApexCalc delivers a secure, streamlined experience:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Interactive Development Milestones</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Instantly see your baby's estimated weight, height, and current development phase based on your exact week of pregnancy.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Custom Cycle Adjustments</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Tailor your results by adjusting your average cycle length, ensuring the calculations match your personal biology.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Comprehensive Pregnancy Roadmap</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Review a simple annual timeline showcasing major milestones, including key testing windows, fetal growth stages, and your countdown to delivery.</p>
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
