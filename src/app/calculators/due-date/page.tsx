"use client"

import { useState, useMemo, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Calendar as CalendarIcon, 
  Baby, 
  Info, 
  History, 
  HeartPulse, 
  Clock,
  ChevronRight,
  TrendingUp,
  Calculator,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { 
  addDays, 
  subDays, 
  differenceInDays, 
  format, 
  startOfDay,
  intervalToDuration
} from 'date-fns';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Due Date Calculator | Pregnancy Birth Date Tracker',
  description: 'Calculate your estimated due date instantly with our free pregnancy due date calculator. Input your last period or conception date to track your baby milestones.',
  keywords: [
    'Due Date Calculator',
    'pregnancy due date calculator',
    'estimated due date calculator',
    'pregnancy chart due date',
    'pregnancy birth date calculator',
    'MyApexCalc',
    'baby due date estimator',
    'conception date calculator'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Pregnancy Due Date Calculator & Milestone Tracker | MyApexCalc',
    description: 'Track your pregnancy timeline. Estimate your child\'s birth date and visualize your progress month-by-month with our interactive calculator.',
    url: 'https://www.myapexcalc.com/calculators/due-date',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/KjppCkBz/due-date-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Pregnancy Due Date Calculator and Weekly Progress Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Pregnancy Due Date & Birth Calculator | MyApexCalc',
    description: 'Find your estimated due date and explore your complete pregnancy timeline instantly.',
    images: ['https://i.ibb.co/KjppCkBz/due-date-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/due-date',
  },
};

type DueDateMode = 'last-period' | 'ultrasound' | 'conception' | 'ivf';

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

export default function DueDateCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<DueDateMode>('last-period');
  const [dateInput, setDateInput] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [embryoAge, setEmbryoAge] = useState('5');
  
  // Ultrasound specific
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState(20);
  const [ultrasoundDays, setUltrasoundDays] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    // Initialize with a meaningful date (e.g. 1 month ago)
    setDateInput(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  }, []);

  const results = useMemo(() => {
    if (!isMounted || !dateInput) return null;

    const today = startOfDay(new Date());
    let dueDate: Date;
    let lmpDate: Date;
    let effectiveLmpDate: Date;

    try {
      const inputDate = startOfDay(new Date(dateInput));

      if (mode === 'last-period') {
        lmpDate = inputDate;
        const cycleAdj = cycleLength - 28;
        dueDate = addDays(lmpDate, 280 + cycleAdj);
        effectiveLmpDate = addDays(lmpDate, cycleAdj);
      } else if (mode === 'ultrasound') {
        const totalDaysAtScan = (ultrasoundWeeks * 7) + ultrasoundDays;
        effectiveLmpDate = subDays(inputDate, totalDaysAtScan);
        dueDate = addDays(effectiveLmpDate, 280);
      } else if (mode === 'conception') {
        effectiveLmpDate = subDays(inputDate, 14);
        dueDate = addDays(effectiveLmpDate, 280);
      } else if (mode === 'ivf') {
        const age = parseInt(embryoAge);
        const offset = 266 - age;
        dueDate = addDays(inputDate, offset);
        effectiveLmpDate = subDays(dueDate, 280);
      } else {
        dueDate = new Date();
        effectiveLmpDate = new Date();
      }

      const totalDays = 280;
      const daysPregnant = differenceInDays(today, effectiveLmpDate);
      const weeks = Math.floor(daysPregnant / 7);
      const days = daysPregnant % 7;
      const daysRemaining = differenceInDays(dueDate, today);
      const progressPercent = Math.min(100, Math.max(0, (daysPregnant / totalDays) * 100));

      const duration = intervalToDuration({ start: effectiveLmpDate, end: today });
      const monthsStr = `${duration.years ? duration.years * 12 + (duration.months || 0) : duration.months || 0} months ${duration.days || 0} days`;

      let trimester = 'First';
      if (weeks >= 28) trimester = 'Third';
      else if (weeks >= 13) trimester = 'Second';

      // Generate schedule
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
          isToday: weeks === w - 1
        });
      }

      return {
        dueDate,
        weeks,
        days,
        daysRemaining,
        monthsStr,
        trimester,
        progressPercent,
        schedule,
        likelyConception: addDays(effectiveLmpDate, 14)
      };
    } catch (e) {
      return null;
    }
  }, [mode, dateInput, cycleLength, ultrasoundWeeks, ultrasoundDays, embryoAge, isMounted]);

  return (
    <CalculatorWrapper
      title="Due Date Calculator"
      description="Calculate your estimated due date using multiple standard medical methods."
      icon={CalendarIcon}
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
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-period">Last Period</SelectItem>
                      <SelectItem value="ultrasound">Ultrasound</SelectItem>
                      <SelectItem value="conception">Conception Date</SelectItem>
                      <SelectItem value="ivf">IVF Transfer Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="capitalize text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {mode === 'last-period' ? 'First Day of Last Period:' : 
                     mode === 'ultrasound' ? 'Ultrasound Date:' :
                     mode === 'conception' ? 'Conception Date:' : 'Transfer Date:'}
                  </Label>
                  <Input 
                    type="date" 
                    value={dateInput} 
                    onChange={(e) => setDateInput(e.target.value)} 
                  />
                </div>

                {mode === 'last-period' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average Cycle Length (Days):</Label>
                    <Input 
                      type="number" 
                      value={cycleLength} 
                      onChange={(e) => setCycleLength(Number(e.target.value))} 
                    />
                  </div>
                )}

                {mode === 'ultrasound' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pregnancy Length at Scan:</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          value={ultrasoundWeeks} 
                          onChange={(e) => setUltrasoundWeeks(Number(e.target.value))} 
                        />
                        <span className="text-xs text-muted-foreground">wks</span>
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Embryo Age:</Label>
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

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                Medical Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[10px] text-muted-foreground leading-relaxed">
              Standard calculations assume a 40-week (280-day) gestational period. While these tools provide a reliable estimate, only 4% of babies are born on their exact due date.
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic">
              Please enter valid details to calculate your due date.
            </Card>
          ) : (
            <>
              <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Baby className="w-24 h-24" />
                </div>
                <CardContent className="pt-10 pb-10 text-center relative z-10 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-bold">Estimated Due Date</p>
                    <h3 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">
                      {format(results.dueDate, 'MMMM d, yyyy')}
                    </h3>
                    <p className="text-lg opacity-80 mt-2">
                      {results.daysRemaining > 0 
                        ? `${results.daysRemaining} days remaining` 
                        : results.daysRemaining === 0 ? "Today is the big day!" : "Past due date"}
                    </p>
                  </div>
                  
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="bg-white/10 p-2 px-6 rounded-full inline-block border border-white/20">
                      <p className="text-xs font-bold uppercase tracking-widest">
                        Current: {results.weeks} Weeks, {results.days} Days
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                        <span>Progress</span>
                        <span>{Math.round(results.progressPercent)}%</span>
                      </div>
                      <Progress value={results.progressPercent} className="h-2 bg-white/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-primary" />
                      Pregnancy Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Trimester</span>
                      <span className="font-bold text-primary">{results.trimester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Months</span>
                      <span className="font-bold">{results.monthsStr}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      Key Estimates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Likely Conception</span>
                      <span className="font-bold">{format(results.likelyConception, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Term Date</span>
                      <span className="font-bold">{format(addDays(subDays(results.dueDate, 280), 266), 'MMM d, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Milestone Schedule */}
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

        {/* Informational Text Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Map Your Pregnancy Journey with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Finding out you are expecting is one of life’s most profound moments, immediately sparking a wave of excitement and curiosity. Almost instantly, the first big question arises: When will we meet our baby? While only a small fraction of babies are born exactly on their projected date, finding a reliable baseline is essential for scheduling prenatal visits, planning your nursery, and sharing the news with loved ones. Our free online Due Date Calculator removes the complexity, serving as a trusted, simple-to-use pregnancy due date calculator that maps your road to parenthood in seconds.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                The Science Behind the Countdown: Calculating Your Date
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  A standard human pregnancy lasts approximately 40 weeks (280 days) from the first day of your last menstrual period (LMP). To establish a highly accurate estimate, our estimated due date calculator processes your timelines utilizing the standard medical calculation system known as Naegele’s Rule:
                </p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                  Estimated Due Date = LMP + 7 days − 3 months + 1 year
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  This formula assumes a standard 28-day menstrual cycle, with ovulation occurring on day 14. If your cycle is shorter or longer, our advanced tool easily adjusts for your unique rhythm, modifying the math to ensure your pregnancy birth date calculator matches your personal biological timeline.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If you happen to know the exact date of your conception (or the date of your IVF embryo transfer), our calculator can bypass menstrual cycle estimations entirely to compute your date directly:
                </p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                  Estimated Due Date = Conception Date + 266 days
                </div>
              </div>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Track Your Timeline with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instead of trying to count calendar weeks on your fingers or dealing with generic apps that require intrusive personal accounts, MyApexCalc provides a clear, seamless, and private dashboard:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Interactive Weekly Milestones</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">See exactly how many weeks and days pregnant you are right now, along with your current trimester standing.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Search className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Comprehensive Pregnancy Chart</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Explore your custom pregnancy chart due date parameters, including estimated windows for heartbeat detection and anatomical scans.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Flexible Calculation Inputs</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Calculate your timeline using your last menstrual period, your exact conception date, or even your target IVF transfer date.</p>
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
