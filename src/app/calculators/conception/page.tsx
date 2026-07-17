"use client"

import { useState, useMemo, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Sparkles, 
  Info, 
  History, 
  Calendar as CalendarIcon, 
  Heart, 
  ChevronRight,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { addDays, subDays, format, startOfDay } from 'date-fns';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Conception Calculator | Estimate Conception Date',
  description: 'Find your estimated date of conception instantly. Input your due date or last period to figure out your conception date with our free online calculator.',
  keywords: [
    'ovulation date calculator',
    'conception calculator',
    'conception estimator',
    'conception date calculator',
    'figure out conception date',
    'conception date',
    'conception to birth calculator',
    'estimated date of conception',
    'MyApexCalc',
    'pregnancy conception tracker'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Pregnancy Conception Calculator & Estimator | MyApexCalc',
    description: 'Pinpoint your exact moment of beginning. Run a quick conception calculation using your due date or cycle milestones with our custom tracker.',
    url: 'https://www.myapexcalc.com/calculators/conception',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/9mJYJCKw/conception-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Conception Calculator and Milestone Estimator Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Conception Date Estimator | MyApexCalc',
    description: 'Discover your estimated date of conception and explore your timeline from conception to birth.',
    images: ['https://i.ibb.co/9mJYJCKw/conception-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/conception',
  },
};

type ConceptionMode = 'last-period' | 'ultrasound' | 'due-date';

export default function ConceptionCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<ConceptionMode>('last-period');
  const [dateInput, setDateInput] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  
  // Ultrasound specific
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState(22);
  const [ultrasoundDays, setUltrasoundDays] = useState(6);

  useEffect(() => {
    setIsMounted(true);
    // Setting defaults to match one of the examples for testing (Jan 29, 2026 LMP)
    setDateInput('2026-01-29');
  }, []);

  const results = useMemo(() => {
    if (!isMounted || !dateInput) return null;

    try {
      const inputDate = startOfDay(new Date(dateInput));
      let anchorDate: Date; // The most likely conception date

      if (mode === 'due-date') {
        // Conception typically happens 266 days (38 weeks) before the due date
        anchorDate = subDays(inputDate, 266);
      } else if (mode === 'last-period') {
        // Conception happens (Cycle Length - 14) days after the first day of the last period
        const offset = cycleLength - 14;
        anchorDate = addDays(inputDate, offset);
      } else if (mode === 'ultrasound') {
        // Gestational age starts from LMP (roughly 2 weeks before conception)
        const totalDaysAtScan = (ultrasoundWeeks * 7) + ultrasoundDays;
        const effectiveLMP = subDays(inputDate, totalDaysAtScan);
        anchorDate = addDays(effectiveLMP, 14);
      } else {
        return null;
      }

      // Most Probable Conception: Anchor +/- 2 days
      const probConceptionStart = subDays(anchorDate, 2);
      const probConceptionEnd = addDays(anchorDate, 2);

      // Most Probable Intercourse: Conception Start - 3 days to Conception End
      const probIntercourseStart = subDays(probConceptionStart, 3);
      const probIntercourseEnd = probConceptionEnd;

      // Possible Conception: Anchor - 3 to Anchor + 7
      const possibleConceptionStart = subDays(anchorDate, 3);
      const possibleConceptionEnd = addDays(anchorDate, 7);

      // Possible Intercourse: Possible Conception Start - 5 to Possible Conception End
      const possibleIntercourseStart = subDays(possibleConceptionStart, 5);
      const possibleIntercourseEnd = possibleConceptionEnd;

      return {
        anchorDate,
        probConception: { start: probConceptionStart, end: probConceptionEnd },
        probIntercourse: { start: probIntercourseStart, end: probIntercourseEnd },
        possibleConception: { start: possibleConceptionStart, end: possibleConceptionEnd },
        possibleIntercourse: { start: possibleIntercourseStart, end: possibleIntercourseEnd },
        dueDate: mode === 'due-date' ? inputDate : addDays(anchorDate, 266)
      };
    } catch (e) {
      return null;
    }
  }, [mode, dateInput, cycleLength, ultrasoundWeeks, ultrasoundDays, isMounted]);

  return (
    <CalculatorWrapper
      title="Conception Calculator"
      description="Estimate your date of conception and the window of sexual intercourse that led to your pregnancy."
      icon={Sparkles}
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
                      <SelectItem value="due-date">Expected Due Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="capitalize text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {mode === 'last-period' ? 'First Day of Last Period:' : 
                     mode === 'ultrasound' ? 'Ultrasound Date:' : 'Expected Due Date:'}
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Length of Pregnancy at Scan:</Label>
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
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                Medical Standard
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[10px] text-muted-foreground leading-relaxed">
              Medical professionals measure pregnancy from the last menstrual period (LMP), which is typically 2 weeks before conception. This calculator anchors on a 266-day post-conception duration.
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic text-center">
              Please enter valid details to see your estimated conception window.
            </Card>
          ) : (
            <>
              {/* Primary Results Card */}
              <Card className="border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-32 h-32 text-primary" />
                </div>
                <CardHeader className="bg-primary text-white pb-6 pt-8 text-center relative z-10">
                  <p className="text-xs uppercase tracking-[0.2em] font-black opacity-70 mb-2">Estimated Results</p>
                  <CardTitle className="text-xl font-headline flex items-center justify-center gap-2">
                    Conception Date Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 relative z-10 bg-white">
                  <div className="p-6 space-y-8">
                    {/* Probable Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <CheckCircle2 size={16} />
                        Most Probable Window
                      </div>
                      <div className="grid gap-3">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Conception Dates:</p>
                          <p className="text-lg font-bold text-primary">
                            {format(results.probConception.start, 'MMM d, yyyy')} - {format(results.probConception.end, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Sexual Intercourse Dates:</p>
                          <p className="text-lg font-bold text-primary">
                            {format(results.probIntercourse.start, 'MMM d, yyyy')} - {format(results.probIntercourse.end, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Possible Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider">
                        <Clock size={16} />
                        Possible Window
                      </div>
                      <div className="grid gap-3">
                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                          <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Conception Dates:</p>
                          <p className="text-lg font-bold text-accent">
                            {format(results.possibleConception.start, 'MMM d, yyyy')} - {format(results.possibleConception.end, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                          <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Sexual Intercourse Dates:</p>
                          <p className="text-lg font-bold text-accent">
                            {format(results.possibleIntercourse.start, 'MMM d, yyyy')} - {format(results.possibleIntercourse.end, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 border-t flex gap-3 items-center">
                    <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                    <p className="text-[10px] text-muted-foreground italic">
                      The results of this calculator are estimations only. Biological variation means exact dates can vary.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Heart className="w-4 h-4 text-primary" />
                      Pregnancy Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Estimated Due Date</span>
                      <span className="font-bold text-primary">{format(results.dueDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. LMP Date</span>
                      <span className="font-bold">{format(subDays(results.anchorDate, 14), 'MMM d, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-accent">
                      <CalendarIcon className="w-4 h-4" />
                      Key Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Heartbeat Detectable</span>
                      <span className="font-bold">{format(addDays(results.anchorDate, 28), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End of 1st Trimester</span>
                      <span className="font-bold">{format(addDays(results.anchorDate, 77), 'MMM d, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Reference & Info Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Trace the Beginning of Your Journey with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                For many expecting parents, knowing when their baby is due is only one piece of the puzzle. There is an incredible curiosity surrounding the exact moment your story truly began. Understanding your timeline helps you trace back key memories, calculate accurate fetal development, and establish a clear timeline for your doctor's visits. Our free online conception calculator is built to give you those answers, serving as a highly precise conception estimator to help you trace back your milestones.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                The Science of Conception: How We Track the Date
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Because the physical joining of egg and sperm happens quietly inside the body, pinpointing the exact moment of fertilization is rarely possible without medical assistance. However, using standard gynecological math, we can narrow down your estimated date of conception to a highly accurate 3-to-5-day window. Depending on the information you have available, our conception date calculator uses two primary math methods to work backward:
                </p>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">Method 1: Calculating Backwards From Your Due Date</p>
                  <p className="text-sm text-muted-foreground">If you have already visited an obstetrician or used a due date estimator, your due date is the most reliable anchor point. Because a full-term pregnancy typically lasts exactly 266 days from the actual day of fertilizing, the calculator subtracts this fixed interval:</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Estimated Conception Date = Estimated Due Date - 266 days
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">Method 2: Calculating From Your Last Menstrual Period (LMP)</p>
                  <p className="text-sm text-muted-foreground">If you are early in your journey and only know your cycles, our ovulation date calculator determines the window based on when your egg was released. Conception typically occurs within 12 to 24 hours of ovulation:</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Estimated Ovulation Day = First Day of LMP + (Average Cycle Length - 14)
                  </div>
                  <p className="text-xs text-muted-foreground pt-1 italic">
                    Because sperm can live inside the reproductive tract for up to five days, your active conception window actually spans the 5 days before ovulation plus the day of ovulation itself.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Use MyApexCalc to Figure Out Conception Date?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instead of scratching your head trying to calculate backward on a standard calendar, MyApexCalc provides a seamless, stress-free layout that offers:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Dynamic Timeline</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">View a continuous timeline showing your estimated fertilization window, your current progress week-by-week, and your final due date.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Flexible Cycle Modeling</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Adjust your average cycle length (from 22 to 45 days) to ensure the timeline matches your personal biology.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Search className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Clear Trimester Milestones</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Instantly see where your conception date places you on your trimester calendar, along with dates for key developmental milestones.</p>
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
