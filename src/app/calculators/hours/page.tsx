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
  Calendar
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

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 flex gap-4">
            <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-primary font-bold">Pro Tip</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use the **Between Times** mode for daily shift calculations and the **Between Dates** mode for long-term project duration tracking.
              </p>
            </div>
          </div>
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

        {/* Informational Text Section */}
        <div className="lg:col-span-12 space-y-12 py-10">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                How the Hours Calculator Works
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Measuring time spans accurately can be complex due to the varying number of days in months and the transition between AM/PM. The **My Apex Hours Calculator** simplifies this process by allowing you to choose between specific daily shifts or long-term date ranges.
              </p>
              <h4 className="font-bold text-foreground">Hours Between Two Times</h4>
              <p className="text-muted-foreground leading-relaxed">
                This mode is ideal for daily labor tracking. You can input your start and end times, subtract a lunch break, and instantly get the total billable hours. Our engine handles midnight rollovers automatically—so a shift from 10 PM to 6 AM is correctly calculated as 8 hours.
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Features & Accuracy</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <CalendarDays className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Precise Date Ranges</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Calculate exact durations over weeks or months, accounting for every minute. Perfect for long-distance travel planning or project milestone tracking.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Decimal Output</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Easily convert durations into decimal format (e.g., 8h 30m = 8.50) to simplify invoice generation or payroll processing.</p>
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