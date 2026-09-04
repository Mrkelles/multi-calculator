"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { User, Calendar as CalendarIcon, TrendingUp, Calculator, Info, History, Zap, ChevronRight, Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { intervalToDuration } from 'date-fns';

export default function AgeCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [birthDate, setBirthDate] = useState('1995-01-01');
  const [targetDate, setTargetDate] = useState('');
  const [ageDetails, setAgeDetails] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    setTargetDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (isMounted && birthDate && targetDate) {
      const birth = new Date(birthDate);
      const target = new Date(targetDate);

      if (birth > target) {
        setAgeDetails(null);
        return;
      }

      const duration = intervalToDuration({ start: birth, end: target });
      const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      
      setAgeDetails({
        ...duration,
        totalDays
      });
    }
  }, [birthDate, targetDate, isMounted]);

  return (
    <CalculatorWrapper
      title="Age Calculator"
      description="Determine your exact age in years, months, days, and even find out how many days you've been alive."
      icon={User}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" /> Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Age at the Date of</Label>
              <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {ageDetails ? (
            <>
              <Card className="bg-primary text-white py-10 text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-widest opacity-80">Current Age</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-5xl font-bold font-headline">
                    {ageDetails.years} Years
                  </div>
                  <div className="text-xl font-medium opacity-80">
                    {ageDetails.months} Months, {ageDetails.days} Days
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Total Days</p>
                    <p className="text-2xl font-bold text-accent">{ageDetails.totalDays.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Total Weeks</p>
                    <p className="text-2xl font-bold text-accent">{Math.floor(ageDetails.totalDays / 7).toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="bg-muted/30 border-dashed border-2 flex items-center justify-center p-12 text-muted-foreground">
              Please enter valid dates.
            </Card>
          )}
        </div>
      </div>

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
                <CardTitle className="text-lg">Scenario 1: Marathon Entry</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>A runner born on <strong>May 15, 1985</strong> is entering a marathon on <strong>October 20, 2026</strong>. To ensure they are placed in the correct age division (e.g., 40-44 category), they need to know their exact age on race day.</p>
                <p>The calculator reveals they will be <strong>41 years, 5 months, and 5 days old</strong>, confirming their placement in the 40+ category.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 2: Life Milestones</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>A person celebrating their 30th birthday (born <strong>January 10, 1996</strong>) wants to know exactly how many days they have been alive on their birthday, <strong>January 10, 2026</strong>.</p>
                <p>The calculator shows they have lived for exactly <strong>10,957 days</strong>, accounting for leap years in 1996, 2000, 2004, 2008, 2012, 2016, 2020, and 2024.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Track Your Milestones with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Have you ever needed to know your exact age down to the day for a legal document, a fitness milestone, or a school registration? Or perhaps you are simply curious to see exactly how many days, hours, or even seconds you have been on this planet. Our free online Age calculator is built to give you those answers instantly. By combining modern time-tracking logic with a clean user interface, this comprehensive Date of birth calculator removes the guesswork and delivers a detailed breakdown of your life timeline in a single click.
            </p>

            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              How to Calculate Your Age Down to the Second
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                While simply subtracting your birth year from the current year gives you a rough estimate, a true chronological evaluation is much more dynamic. Our tool accounts for the nuances of the modern calendar, including differing month lengths, leap years, and specific time zone offsets.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When you use our birthday calculator, the underlying engine processes two specific points in time to determine the exact interval:
              </p>
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                Chronological Age = Current Target Date - Date of Birth
              </div>
              <p className="text-muted-foreground leading-relaxed pt-2">
                Rather than just displaying a single number, our system dissects this interval into several digestible metrics:
              </p>
              <ul className="space-y-4 pt-2">
                <li className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Years, Months, and Days</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">The standard way to calculate your age for legal forms, job applications, or medical histories.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Cumulative Totals</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">View your lifetime expressed entirely in months, weeks, days, hours, or even total seconds lived.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">The Birthday Countdown</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">See the exact number of days, hours, and minutes remaining until your next birthday milestone.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Choose MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                While calculating calendar intervals on your fingers is tedious and prone to leap-year math errors, MyApexCalc provides a seamless, lightning-fast dashboard. Our tool offers:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Leap Year Adjustment</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Automatically factors in the extra day added to February every four years, ensuring your cumulative day count is mathematically flawless.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <CalendarIcon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Historical Date Tracking</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Easily calculate the time elapsed between any two historical dates, not just your own birthday.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Responsive and Instant</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Simply select your birth month, day, and year to see your complete chronological summary update in real-time.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Time is the most valuable asset we have. Knowing exactly how much you have lived can provide a powerful perspective on your personal growth."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
