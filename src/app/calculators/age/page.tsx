"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { User, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    </CalculatorWrapper>
  );
}
