"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { CalendarDays, ArrowRight, TrendingUp, Calculator, Info, History, ChevronRight, Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { addDays, format, differenceInDays } from 'date-fns';

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

        {/* Worked Examples Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Lightbulb size={24} /></div>
            <h3 className="text-2xl font-bold text-primary">Worked Examples</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 1: Contract Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>A business signs a legal contract on <strong>July 1, 2026</strong>, which includes a <strong>90-day</strong> performance window. To ensure they don't miss the deadline, they need to know the exact target date.</p>
                <p>Using the "Add Days" mode, the calculator reveals the deadline is <strong>September 29, 2026</strong>, allowing them to schedule their milestones accordingly.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 2: Event Countdown</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>A couple is getting married on <strong>June 20, 2026</strong>. On <strong>January 1, 2026</strong>, they want to know exactly how many days are left to finalize their preparations.</p>
                <p>The "Duration Between Dates" mode shows there are exactly <strong>170 days</strong> remaining, which is approximately 24.3 weeks, providing a clear timeline for their wedding planner.</p>
              </CardContent>
            </Card>
          </div>
        </section>

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
