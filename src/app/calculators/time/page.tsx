"use client"

import { useState, useMemo, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Clock, 
  History, 
  Plus, 
  Minus, 
  CalendarDays, 
  Calculator, 
  Info,
  Type,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Zap,
  Briefcase
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { add, sub, format } from 'date-fns';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Time Calculator | Free Time Sheet & Work Hours Tracker',
  description: 'Calculate elapsed time, add or subtract time, and track your weekly timesheets. Use our free online time calculator for work hours to estimate pay and log shifts.',
  keywords: [
    'Time Calculator',
    'work clock calculator',
    'time calculator for work hours',
    'time sheet calculator',
    'MyApexCalc',
    'hourly timesheet calculator',
    'elapsed time tracker'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Interactive Time & Work Hours Calculator | MyApexCalc',
    description: 'Simplify your shift tracking. Log punch-in and punch-out times, subtract unpaid lunch breaks, and tally cumulative work hours instantly.',
    url: 'https://www.myapexcalc.com/calculators/time',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/TqJgSVm5/time-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Time Calculator and Work Hours Timesheet Log',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Work Time & Hours Tracker | MyApexCalc',
    description: 'Quickly add or subtract hours and minutes or track your complete weekly timesheet with built-in break parameters.',
    images: ['https://i.ibb.co/TqJgSVm5/time-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/time',
  },
};

type TimeMode = 'arithmetic' | 'date-offset' | 'expression';

export default function TimeCalculatorPage() {
  const [mode, setMode] = useState<TimeMode>('arithmetic');
  const [isMounted, setIsMounted] = useState(false);

  // Arithmetic Mode
  const [aTime1, setATime1] = useState({ d: 0, h: 5, m: 30, s: 0 });
  const [aTime2, setATime2] = useState({ d: 0, h: 2, m: 45, s: 0 });
  const [aOp, setAOp] = useState<'add' | 'sub'>('add');

  // Date Offset Mode
  const [doDate, setDoDate] = useState('');
  const [doOffset, setDoOffset] = useState({ d: 0, h: 48, m: 0, s: 0 });
  const [doOp, setDoOp] = useState<'add' | 'sub'>('add');

  // Expression Mode
  const [expr, setExpr] = useState('5h 30m + 2h 45m');

  useEffect(() => {
    setIsMounted(true);
    setDoDate(new Date().toISOString().slice(0, 16));
  }, []);

  const arithmeticResult = useMemo(() => {
    const totalS1 = aTime1.d * 86400 + aTime1.h * 3600 + aTime1.m * 60 + aTime1.s;
    const totalS2 = aTime2.d * 86400 + aTime2.h * 3600 + aTime2.m * 60 + aTime2.s;
    
    let resultS = aOp === 'add' ? totalS1 + totalS2 : totalS1 - totalS2;
    const isNegative = resultS < 0;
    resultS = Math.abs(resultS);

    const d = Math.floor(resultS / 86400);
    const h = Math.floor((resultS % 86400) / 3600);
    const m = Math.floor((resultS % 3600) / 60);
    const s = resultS % 60;

    return { d, h, m, s, isNegative, totalS: resultS };
  }, [aTime1, aTime2, aOp]);

  const dateOffsetResult = useMemo(() => {
    if (!isMounted || !doDate) return null;
    try {
      const base = new Date(doDate);
      const duration = {
        days: doOffset.d,
        hours: doOffset.h,
        minutes: doOffset.m,
        seconds: doOffset.s
      };
      return doOp === 'add' ? add(base, duration) : sub(base, duration);
    } catch (e) {
      return null;
    }
  }, [doDate, doOffset, doOp, isMounted]);

  const expressionResult = useMemo(() => {
    try {
      // Basic expression parser
      // Supports units: d, h, m, s
      // Format: 5h 30m + 1d
      const parts = expr.toLowerCase().split(/(\+|\-)/);
      let totalSeconds = 0;
      let currentOp = '+';

      const parseDuration = (str: string) => {
        let sec = 0;
        const matches = str.match(/(\d+)\s*([dhms])/g);
        if (!matches) return 0;
        matches.forEach(m => {
          const val = parseInt(m);
          const unit = m.slice(-1);
          if (unit === 'd') sec += val * 86400;
          if (unit === 'h') sec += val * 3600;
          if (unit === 'm') sec += val * 60;
          if (unit === 's') sec += val;
        });
        return sec;
      };

      parts.forEach(p => {
        const trimmed = p.trim();
        if (trimmed === '+' || trimmed === '-') {
          currentOp = trimmed;
        } else {
          const val = parseDuration(trimmed);
          if (currentOp === '+') totalSeconds += val;
          else totalSeconds -= val;
        }
      });

      const isNegative = totalSeconds < 0;
      const absS = Math.abs(totalSeconds);
      const d = Math.floor(absS / 86400);
      const h = Math.floor((absS % 86400) / 3600);
      const m = Math.floor((absS % 3600) / 60);
      const s = absS % 60;

      return { d, h, m, s, isNegative };
    } catch (e) {
      return null;
    }
  }, [expr]);

  return (
    <CalculatorWrapper
      title="Time Calculator"
      description="Add, subtract, or convert time durations and calculate date offsets with precision."
      icon={Clock}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="arithmetic" className="text-xs">Arithmetic</TabsTrigger>
                  <TabsTrigger value="date-offset" className="text-xs">Date Offset</TabsTrigger>
                  <TabsTrigger value="expression" className="text-xs">Expression</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === 'arithmetic' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time 1</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1"><Label className="text-[10px]">Days</Label><Input type="number" value={aTime1.d} onChange={(e) => setATime1({...aTime1, d: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Hours</Label><Input type="number" value={aTime1.h} onChange={(e) => setATime1({...aTime1, h: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Min</Label><Input type="number" value={aTime1.m} onChange={(e) => setATime1({...aTime1, m: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Sec</Label><Input type="number" value={aTime1.s} onChange={(e) => setATime1({...aTime1, s: Number(e.target.value)})} /></div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button 
                      variant={aOp === 'add' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setAOp('add')}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </Button>
                    <Button 
                      variant={aOp === 'sub' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setAOp('sub')}
                      className="gap-2"
                    >
                      <Minus className="w-4 h-4" /> Subtract
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time 2</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1"><Label className="text-[10px]">Days</Label><Input type="number" value={aTime2.d} onChange={(e) => setATime2({...aTime2, d: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Hours</Label><Input type="number" value={aTime2.h} onChange={(e) => setATime2({...aTime2, h: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Min</Label><Input type="number" value={aTime2.m} onChange={(e) => setATime2({...aTime2, m: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Sec</Label><Input type="number" value={aTime2.s} onChange={(e) => setATime2({...aTime2, s: Number(e.target.value)})} /></div>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'date-offset' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Base Date & Time</Label>
                    <Input 
                      type="datetime-local" 
                      value={doDate} 
                      onChange={(e) => setDoDate(e.target.value)} 
                    />
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button 
                      variant={doOp === 'add' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setDoOp('add')}
                    >
                      Add Duration
                    </Button>
                    <Button 
                      variant={doOp === 'sub' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setDoOp('sub')}
                    >
                      Subtract Duration
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Offset Duration</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1"><Label className="text-[10px]">Days</Label><Input type="number" value={doOffset.d} onChange={(e) => setDoOffset({...doOffset, d: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Hours</Label><Input type="number" value={doOffset.h} onChange={(e) => setDoOffset({...doOffset, h: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Min</Label><Input type="number" value={doOffset.m} onChange={(e) => setDoOffset({...doOffset, m: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Sec</Label><Input type="number" value={doOffset.s} onChange={(e) => setDoOffset({...doOffset, s: Number(e.target.value)})} /></div>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'expression' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Enter Expression
                    </Label>
                    <Input 
                      placeholder="e.g. 5h 30m + 2d - 1h" 
                      value={expr} 
                      onChange={(e) => setExpr(e.target.value)} 
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Use units: <strong>d</strong> (days), <strong>h</strong> (hours), <strong>m</strong> (minutes), <strong>s</strong> (seconds).
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardContent className="pt-10 pb-10 text-center">
              {mode === 'arithmetic' && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest opacity-80 font-bold">Resulting Duration</p>
                  <h3 className="text-5xl font-black font-headline tracking-tighter">
                    {arithmeticResult.isNegative ? '-' : ''}
                    {arithmeticResult.d > 0 && `${arithmeticResult.d}d `}
                    {arithmeticResult.h}h {arithmeticResult.m}m {arithmeticResult.s}s
                  </h3>
                </div>
              )}

              {mode === 'date-offset' && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest opacity-80 font-bold">Calculated Date</p>
                  <h3 className="text-4xl font-black font-headline tracking-tighter leading-tight">
                    {dateOffsetResult ? format(dateOffsetResult, 'PPPP p') : 'Invalid Date'}
                  </h3>
                </div>
              )}

              {mode === 'expression' && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest opacity-80 font-bold">Expression Result</p>
                  <h3 className="text-5xl font-black font-headline tracking-tighter">
                    {expressionResult?.isNegative ? '-' : ''}
                    {expressionResult?.d ? `${expressionResult.d}d ` : ''}
                    {expressionResult?.h}h {expressionResult?.m}m {expressionResult?.s}s
                  </h3>
                </div>
              )}
            </CardContent>
          </Card>

          {mode === 'arithmetic' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Unit Conversions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Total Seconds</span>
                  <span className="font-mono font-bold">{arithmeticResult.totalS.toLocaleString()} s</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Total Minutes</span>
                  <span className="font-mono font-bold">{(arithmeticResult.totalS / 60).toFixed(2)} min</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Total Hours</span>
                  <span className="font-mono font-bold">{(arithmeticResult.totalS / 3600).toFixed(2)} h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Days</span>
                  <span className="font-mono font-bold">{(arithmeticResult.totalS / 86400).toFixed(2)} d</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
            <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-blue-800 font-bold">Pro Tip</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                You can use negative numbers in the Arithmetic mode to effectively perform subtraction while in "Add" mode, or vice versa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Streamline Your Schedule and Shifts with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are an independent freelancer tracking billable hours, an employee compiling weekly records for payroll, or a manager verifying team schedules, managing time can get messy. Because our standard calendar does not rely on a clean decimal system, adding up hours and minutes manually often results in frustrating rounding errors. Our free online Time Calculator removes the friction from scheduling, serving as an interactive time sheet calculator that logs, converts, and balances your daily schedules automatically.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Math of Elapsed Time: Tracking Shifts Accurately
            </h3>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Adding hours and minutes requires converting human clock intervals into a unified base, running the math, and converting the values back into a standard digital clock format. When you use our work clock calculator to determine total daily shift values, the program processes your start time, end time, and unpaid break times using decimal time tracking standards:
              </p>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">1. Converting Clock Time to Minutes</p>
                <p className="text-sm text-muted-foreground">First, the calculator converts your clock hours (H) and minutes (M) relative to a 24-hour baseline into total cumulative minutes:</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                  Total Minutes = (H × 60) + M
                </div>
                <p className="text-xs text-muted-foreground pt-1 italic">
                  For example, a start time of 8:30 AM is processed as 510 minutes, and a clock-out time of 5:15 PM (17:15) translates to 1,035 minutes.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">2. Calculating Total Net Elapsed Time</p>
                <p className="text-sm text-muted-foreground">To determine your true working time, the calculator finds the difference between your clock-out time (Min_Out) and clock-in time (Min_In), and then subtracts any unpaid lunch breaks (Min_Break):</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border space-y-2 overflow-x-auto">
                  <p>Net Work Minutes = Min<sub>Out</sub> - Min<sub>In</sub> - Min<sub>Break</sub></p>
                  <Separator />
                  <p>Net Work Hours = Net Work Minutes / 60</p>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Using our previous timeline with a standard 45-minute unpaid lunch break, the formula calculates:
                </p>
                <div className="bg-muted/50 p-4 rounded-xl font-mono text-sm text-center border">
                   Net Work Minutes = 1035 - 510 - 45 = 480 minutes
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  This yields exactly 8.0 net working hours.
                </p>
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Simplifying Your Payroll and Invoicing
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Using our dedicated time calculator for work hours helps you bypass payroll errors and negotiate contracts clearly by avoiding common timekeeping mistakes:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Converting Minutes to Decimals</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Many people make the mistake of assuming that 8 hours and 15 minutes is written as "8.15" hours on a invoice. In reality, 15 minutes is 25% of an hour (15/60 = 0.25), so it must be billed as 8.25 hours to get paid correctly.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Accounting for Lunch Breaks</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Always make sure to deduct your required daily breaks to ensure your timesheet calculations match your employer's official punch clock records.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Tracking Weekly Overtime</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Log your shifts daily to keep an active eye on your rolling 40-hour threshold, helping you track overtime rates (1.5x standard pay) seamlessly.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
              <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Why Manage Your Hours with MyApexCalc?
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>All-in-One Timesheet Logging:</strong> Log punch times Monday through Friday in a single layout to calculate your complete weekly totals automatically.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Dual Format Outputs:</strong> View your results in both clean digital clock formats (e.g., 7 hours 45 minutes) and clean decimal format values (e.g., 7.75 hours) for direct payroll entry.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Instant Manual Operations:</strong> Need to do basic math? Switch to our standard time-math mode to easily add or subtract custom hours, minutes, and seconds.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
