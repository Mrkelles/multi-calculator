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
  TrendingUp
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

    try {
      const inputDate = startOfDay(new Date(dateInput));

      if (mode === 'due-date') {
        dueDate = inputDate;
        lmpDate = subDays(dueDate, 280);
      } else if (mode === 'last-period') {
        lmpDate = inputDate;
        dueDate = addDays(lmpDate, 280);
      } else if (mode === 'conception') {
        lmpDate = subDays(inputDate, 14);
        dueDate = addDays(lmpDate, 280);
      } else if (mode === 'ultrasound') {
        dueDate = inputDate;
        lmpDate = subDays(dueDate, 280);
      } else if (mode === 'ivf') {
        const age = parseInt(embryoAge);
        const offset = 266 - age;
        dueDate = addDays(inputDate, offset);
        lmpDate = subDays(dueDate, 280);
      } else {
        dueDate = inputDate;
        lmpDate = subDays(dueDate, 280);
      }

      const totalDays = 280;
      const daysPregnant = differenceInDays(today, lmpDate);
      const weeksPregnant = Math.max(0, Math.floor(daysPregnant / 7));
      const remainingDays = Math.max(0, daysPregnant % 7);
      const progressPercent = Math.min(100, Math.max(0, (daysPregnant / totalDays) * 100));

      const duration = intervalToDuration({ start: lmpDate, end: today });
      const monthsStr = `${duration.years ? duration.years * 12 + (duration.months || 0) : duration.months || 0} months ${duration.days || 0} days`;

      let trimester = 'First';
      if (weeksPregnant >= 28) trimester = 'Third';
      else if (weeksPregnant >= 13) trimester = 'Second';

      const babySize = getBabySize(weeksPregnant);
      const likelyConception = addDays(lmpDate, 14);

      const schedule = [];
      for (let w = 1; w <= 42; w++) {
        const weekStart = addDays(lmpDate, (w - 1) * 7);
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
  }, [mode, dateInput, embryoAge, isMounted]);

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
                      <SelectItem value="ultrasound">Ultrasound (Estimated Due Date)</SelectItem>
                      <SelectItem value="ivf">IVF Transfer Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="capitalize text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {mode.replace('-', ' ')} {mode === 'ultrasound' ? '(Est. Due Date)' : ''}
                  </Label>
                  <Input 
                    type="date" 
                    value={dateInput} 
                    onChange={(e) => setDateInput(e.target.value)} 
                  />
                </div>

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
                      Week #{results.weeksPregnant}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Understanding the Math
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                A standard pregnancy lasts about 280 days (40 weeks) from the first day of your last menstrual period (LMP). Because exact conception dates are rarely known, the LMP serves as the universal baseline for medical professionals to track growth and development.
              </p>
            </section>

            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Definition of Terms</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <CalendarIcon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Gestational Age</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">The age of the pregnancy measured from the first day of the last menstrual period, used to standardize prenatal care.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Full Term Status</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Considered reached at 38 weeks. By this point, fetal development is typically complete and safe for birth.</p>
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
