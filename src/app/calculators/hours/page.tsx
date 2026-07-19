"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Clock, 
  CalendarDays, 
  Info, 
  ArrowRight, 
  History, 
  Calculator,
  Calendar,
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
import { Separator } from '@/components/ui/separator';
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
// this Client Component.
const metadata: Metadata = {
  title: 'Accurate Hours Calculator | Free Hour to Hour Time Tracker',
  description: 'Calculate hours between times instantly. Use our free hours calculator to count your work hours, track elapsed time, and compute weekly timesheets.',
  keywords: [
    'time to time calculator',
    'Hours Calculator',
    'hour to hour calculator',
    'count my work hours',
    'calculate your work hours',
    'MyApexCalc',
    'elapsed hours tracker',
    'shift duration calculator'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Precision Hour to Hour & Work Hours Calculator | MyApexCalc',
    description: 'Calculate time to time spans instantly. Easily track elapsed working hours, subtract breaks, and log your shifts with our free tool.',
    url: 'https://www.myapexcalc.com/calculators/hours',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/TqJgSVm5/hours-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Hours Calculator and Work Shift Tracker Interface',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Work Hours & Hour-to-Hour Calculator | MyApexCalc',
    description: 'Quickly count your work hours and calculate accurate elapsed time spans between any two clock markers.',
    images: ['https://i.ibb.co/TqJgSVm5/hours-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/hours',
  },
};

export default function HoursCalculatorPage() {
  const [mode, setMode] = useState<'times' | 'dates'>('times');

  // Mode: Between Times
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breakMin, setBreakMin] = useState(0);

  // Mode: Between Dates
  const [startDateTime, setStartDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [endDateTime, setEndDateTime] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16));

  const timesResult = useMemo(() => {
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    
    let startTotal = sH * 60 + sM;
    let endTotal = eH * 60 + eM;

    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }

    const diff = endTotal - startTotal - breakMin;
    const hours = Math.floor(Math.max(0, diff) / 60);
    const minutes = Math.max(0, diff) % 60;
    const decimal = (Math.max(0, diff) / 60).toFixed(2);

    return { hours, minutes, decimal, totalMin: Math.max(0, diff) };
  }, [startTime, endTime, breakMin]);

  const datesResult = useMemo(() => {
    try {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      const diffMs = end.getTime() - start.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      
      const hours = Math.floor(Math.max(0, diffMin) / 60);
      const minutes = Math.max(0, diffMin) % 60;
      const decimal = (Math.max(0, diffMin) / 60).toFixed(2);
      const days = (Math.max(0, diffMin) / 1440).toFixed(2);

      return { hours, minutes, decimal, days, totalMin: Math.max(0, diffMin) };
    } catch (e) {
      return null;
    }
  }, [startDateTime, endDateTime]);

  const periodReference = [
    { period: '1 Day', hours: 24, label: 'Full Rotation' },
    { period: '1 Week', hours: 168, label: '7 Full Days' },
    { period: 'Average Month', hours: 730.48, label: '30.44 Days (avg)' },
    { period: 'Common Work Year', hours: 2080, label: '52 Weeks x 40h' },
    { period: 'Calendar Year', hours: 8760, label: '365 Days x 24h' },
  ];

  return (
    <CalculatorWrapper
      title="Hours Calculator"
      description="Find the exact number of hours and minutes between two times or two dates with precision."
      icon={Clock}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="times" className="text-xs font-bold">Between Times</TabsTrigger>
                  <TabsTrigger value="dates" className="text-xs font-bold">Between Dates</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === 'times' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    <p className="text-[10px] text-muted-foreground italic">Handles overnight shifts automatically.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Break (Minutes)</Label>
                    <Input type="number" value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value))} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start Date & Time</Label>
                    <Input type="datetime-local" value={startDateTime} onChange={(e) => setStartDateTime(e.target.value)} />
                  </div>
                  <div className="space-y-2 text-center text-muted-foreground"><ArrowRight className="mx-auto" /></div>
                  <div className="space-y-2">
                    <Label>End Date & Time</Label>
                    <Input type="datetime-local" value={endDateTime} onChange={(e) => setEndDateTime(e.target.value)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Info className="w-4 h-4 text-primary" />
                Quick Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Use <strong>Between Times</strong> for daily shift calculations and <strong>Between Dates</strong> for long-term project duration tracking.
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-70 font-bold text-center">Total Duration</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 pb-10">
              <div className="text-6xl md:text-7xl font-black font-headline tracking-tighter">
                {mode === 'times' ? timesResult.hours : datesResult?.hours}
                <span className="text-2xl md:text-3xl opacity-60 ml-1">h</span> 
                {mode === 'times' ? timesResult.minutes : datesResult?.minutes}
                <span className="text-2xl md:text-3xl opacity-60 ml-1">m</span>
              </div>
              <Separator className="bg-white/20" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider">Decimal Hours</p>
                  <p className="text-3xl font-bold font-mono">{mode === 'times' ? timesResult.decimal : datesResult?.decimal}</p>
                </div>
                {mode === 'dates' && (
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider">Total Days</p>
                    <p className="text-3xl font-bold font-mono">{datesResult?.days}</p>
                  </div>
                )}
                {mode === 'times' && (
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider">Total Minutes</p>
                    <p className="text-3xl font-bold font-mono">{timesResult.totalMin}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Time Period Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">Period</TableHead>
                    <TableHead className="text-right font-bold">Total Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodReference.map((p) => (
                    <TableRow key={p.period}>
                      <TableCell className="font-medium text-xs">{p.period}</TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold">{p.hours.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Tally Your Time Effortlessly with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are trying to count my work hours for a freelance gig, track study sessions, or keep tabs on your team's weekly shifts, manual time calculations are notoriously tricky. Because our clock systems operate on base-60 increments rather than a base-100 decimal system, simple arithmetic like adding "8:45" to "9:30" can quickly lead to payroll disputes and stressful math mistakes. Our free online Hours Calculator acts as an intuitive, direct hour to hour calculator that does all the heavy lifting for you, giving you an exact breakdown of your elapsed time in seconds.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Mathematics of Elapsed Time
            </h3>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Calculating a clean interval using a time to time calculator requires converting clock hours and minutes into standard minutes, executing the math across the 12-hour AM/PM divide, and translating the results.
              </p>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">Step 1: Converting to Cumulative Minutes</p>
                <p className="text-sm text-muted-foreground">First, we convert both your starting and ending clock coordinates into absolute minutes relative to midnight (00:00):</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border">
                  Total Minutes = (Hours x 60) + Minutes
                </div>
                <p className="text-xs text-muted-foreground pt-1 italic">
                  For instance, 8:45 AM is processed as (8 x 60) + 45 = 525 minutes. 5:15 PM (17:15) is (17 x 60) + 15 = 1,035 minutes.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">Step 2: Running the Interval Calculation</p>
                <p className="text-sm text-muted-foreground">To calculate your work hours while factoring in unpaid breaks, we find the difference between your markers:</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border">
                  Net Minutes = End Minutes - Start Minutes - Break Minutes
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">Step 3: Translating to Decimal Hours</p>
                <p className="text-sm text-muted-foreground">To bill clients accurately, divide your net working minutes by 60 to yield a decimal format:</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border">
                  Decimal Hours = Net Work Minutes / 60
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                The Pitfalls of Manual Time Tracking
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Using an automated calculator prevents common billing errors that can cost you money:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">The "Decimal" Time Trap</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Many people write 7 hours and 45 minutes as "7.45" hours on invoices. In reality, 45 minutes is 75% of an hour (45/60=0.75), meaning you should bill for 7.75 hours to be paid correctly.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Tracking Night Shifts</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Calculating spans that cross over midnight (e.g., 10:00 PM to 6:00 AM) can be confusing. Our engine handles these rollovers automatically.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
              <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Why Choose MyApexCalc?
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Instant Shift Logging:</strong> Daily totals compile as you type.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Dual-Format Outputs:</strong> View standard clock time or clean decimal fractions.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>No Sign-Up Required:</strong> Calculate your wages privately with zero data walls.</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <Briefcase className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Time is your most limited resource. Measuring it with precision is the key to both professional success and personal balance."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
