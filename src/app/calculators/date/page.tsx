"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    </CalculatorWrapper>
  );
}
