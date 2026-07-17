"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { CalendarDays, ArrowRight, TrendingUp, Calculator, Info, History, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { addDays, format, differenceInDays } from 'date-fns';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Date Calculator | Live Day Counter & Date Estimator',
  description: 'Calculate the exact number of days between two dates or add/subtract days from any target date with our free online date calculator and day counter.',
  keywords: [
    'Date calculator',
    'Date estimator',
    'Day counter',
    'days between dates',
    'add days to date',
    'calendar calculator',
    'MyApexCalc'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Precision Date Calculator & Day Counter | MyApexCalc',
    description: 'Easily calculate calendar intervals. Count the days between dates or estimate target dates with our responsive calculation tool.',
    url: 'https://www.myapexcalc.com/calculators/date',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/R4d9kg0f/date-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Date Calculator and Calendar Day Counter Interface',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Date Estimator & Day Counter | MyApexCalc',
    description: 'Find the exact distance between calendar dates or add days to any date instantly.',
    images: ['https://i.ibb.co/R4d9kg0f/date-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/date',
  },
};

export default function DateCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Add/Subtract
  const [startDate, setStartDate] = useState('');
  const [daysValue, setDaysValue] = useState(30);
  const [resultDate, setResultDate] = useState<Date | null>(null);

  // Duration
  const [dateOne, setDateOne] = useState('');
  const [dateTwo, setDateTwo] = useState('');
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const now = new Date();
    setStartDate(now.toISOString().split('T')[0]);
    setDateOne(now.toISOString().split('T')[0]);
    setDateTwo(addDays(now, 7).toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (isMounted && startDate) {
      setResultDate(addDays(new Date(startDate), daysValue));
    }
  }, [startDate, daysValue, isMounted]);

  useEffect(() => {
    if (isMounted && dateOne && dateTwo) {
      setDuration(differenceInDays(new Date(dateTwo), new Date(dateOne)));
    }
  }, [dateOne, dateTwo, isMounted]);

  return (
    <CalculatorWrapper
      title="Date Calculator"
      description="Add or subtract days from a specific date, or find the exact duration between two dates."
      icon={CalendarDays}
    >
      <Tabs defaultValue="add-subtract" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 mb-8">
          <TabsTrigger value="add-subtract" className="font-bold">Add / Subtract Days</TabsTrigger>
          <TabsTrigger value="duration" className="font-bold">Duration Between Dates</TabsTrigger>
        </TabsList>

        <TabsContent value="add-subtract">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle className="text-lg">Inputs</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Days to Add/Subtract (use negative for subtract)</Label>
                  <Input type="number" value={daysValue} onChange={(e) => setDaysValue(Number(e.target.value))} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary text-white flex flex-col justify-center items-center py-10">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xs uppercase tracking-widest opacity-80">Calculated Date</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold font-headline">
                  {resultDate ? format(resultDate, 'PPPP') : '---'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="duration">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle className="text-lg">Select Dates</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={dateOne} onChange={(e) => setDateOne(e.target.value)} />
                </div>
                <div className="space-y-2 text-center text-muted-foreground"><ArrowRight className="mx-auto" /></div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={dateTwo} onChange={(e) => setDateTwo(e.target.value)} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent text-white flex flex-col justify-center items-center py-10">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xs uppercase tracking-widest opacity-80">Difference</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-6xl font-bold font-headline">{Math.abs(duration)}</div>
                <div className="text-xl font-medium opacity-80">Days</div>
                <div className="text-sm opacity-60">≈ {(Math.abs(duration) / 7).toFixed(1)} Weeks</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Master Your Schedule with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are tracking project deadlines, managing a legal timeline, estimating a pregnancy due date, or counting down the days until an exciting vacation, tracking calendar intervals can be surprisingly tricky. Manually flipping through a calendar to account for leap years and months with differing days is tedious and prone to error. Our free online Date calculator simplifies your time planning by serving as a highly precise, instant calendar utility for any timeline.
            </p>

            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              How to Calculate Days and Timelines Accurately
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                A robust calendar calculation requires more than simple subtraction. Our engine treats your target timeline with absolute accuracy by running two primary operations:
              </p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">The Day Counter (Duration Mode)</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To find the exact duration between two points in time, the system converts both dates into a standardized epoch time (milliseconds elapsed since January 1, 1970) to find the absolute difference:
                  </p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Total Elapsed Time = |Date₂ - Date₁|
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                    This duration is then converted back into human-readable intervals, displaying the total count in years, months, weeks, and days.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">The Date Estimator (Add/Subtract Mode)</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you need to estimate a target deadline or look back at a historical event, you can input a starting date and add or subtract a specific number of days, weeks, or months:
                  </p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Target Date = Starting Date ± Specified Time Interval
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                    The algorithm handles complex calendar math automatically—such as advancing the year or skipping leap days—to give you the exact final day of the week.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Choose MyApexCalc for Calendar Planning?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Using an advanced web tool eliminates the headaches of manual date tracking. MyApexCalc is engineered with a clean, fast layout to offer:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">True Leap Year Math</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Never worry about February 29th throwing off your project timeline or milestone countdown again.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Flexible Calculation Modes</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Instantly switch between counting the total days between two dates or adding/subtracting days to find a target deadline.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Historical Data Access</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Easily verify time spans for historical events or long-term personal records with absolute precision across decades.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Time is the distance between any two significant moments. Measure it with precision to ensure your future plans are always on schedule."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
