"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Timer, 
  Plus, 
  Trash2, 
  Calculator, 
  Info, 
  History, 
  Clock, 
  Calendar, 
  Briefcase,
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'Accurate Time Card Calculator | Free Timesheet & Punch Clock Tracker',
  description: 'Calculate employee shifts and weekly hours instantly. Use our free time card calculator to compute punch clock cards, deduct breaks, and export clean timesheets.',
  keywords: [
    'time card calculator',
    'clock card calculator',
    'time punch clock calculator',
    'time card sheet calculator',
    'timesheet calculator',
    'work time clock calculator',
    'MyApexCalc',
    'payroll hours calculator',
    'biweekly time card tool'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Precision Time Card & Punch Clock Calculator | MyApexCalc',
    description: 'Track weekly payroll effortlessly. Input daily clock-in and clock-out markers, subtract unpaid breaks, and sum hourly totals instantly.',
    url: 'https://www.myapexcalc.com/calculators/time-card',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/WN51Xcrr/time-card-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Time Card Calculator and Employee Shift Log Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Employee Time Card Sheet Calculator | MyApexCalc',
    description: 'Banish payroll errors. Compute daily work hours, manage lunch breaks, and tally up weekly timesheets instantly.',
    images: ['https://i.ibb.co/WN51Xcrr/time-card-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/time-card',
  },
};

interface TimeRow {
  id: string;
  day: string;
  start: string;
  end: string;
  break: number; // in minutes
}

export default function TimeCardCalculatorPage() {
  const [rows, setRows] = useState<TimeRow[]>([
    { id: '1', day: 'Monday', start: '09:00', end: '17:00', break: 60 },
    { id: '2', day: 'Tuesday', start: '09:00', end: '17:00', break: 60 },
    { id: '3', day: 'Wednesday', start: '09:00', end: '17:00', break: 60 },
    { id: '4', day: 'Thursday', start: '09:00', end: '17:00', break: 60 },
    { id: '5', day: 'Friday', start: '09:00', end: '17:00', break: 60 },
  ]);

  const updateRow = (id: string, field: keyof TimeRow, value: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const nextDay = days[rows.length % 7];
    setRows([...rows, { 
      id: Math.random().toString(), 
      day: nextDay, 
      start: '09:00', 
      end: '17:00', 
      break: 60 
    }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const results = useMemo(() => {
    let totalMinutes = 0;
    const processedRows = rows.map(row => {
      const [startH, startM] = row.start.split(':').map(Number);
      const [endH, endM] = row.end.split(':').map(Number);
      
      let startTotal = startH * 60 + startM;
      let endTotal = endH * 60 + endM;

      // Handle overnight shift
      if (endTotal < startTotal) {
        endTotal += 24 * 60;
      }

      const diff = endTotal - startTotal - row.break;
      const hours = Math.floor(Math.max(0, diff) / 60);
      const minutes = Math.max(0, diff) % 60;
      
      totalMinutes += Math.max(0, diff);

      return {
        ...row,
        rowTotal: `${hours}h ${minutes}m`,
        rowDecimal: (Math.max(0, diff) / 60).toFixed(2)
      };
    });

    const totalH = Math.floor(totalMinutes / 60);
    const totalM = totalMinutes % 60;
    const totalDecimal = (totalMinutes / 60).toFixed(2);

    return { processedRows, totalH, totalM, totalDecimal };
  }, [rows]);

  return (
    <CalculatorWrapper
      title="Time Card Calculator"
      description="Generate a professional weekly time card with break deductions, decimal conversions, and overnight shift support."
      icon={Timer}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Time Card Log</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Enter your clock-in and clock-out times for each day of the week.</p>
              </div>
              <Button onClick={addRow} size="sm" className="gap-2 rounded-xl">
                <Plus className="w-4 h-4" /> Add Day
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[120px]">Day</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Break (min)</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.processedRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Input 
                            className="h-8 text-xs font-bold border-none bg-transparent focus:ring-1" 
                            value={row.day} 
                            onChange={(e) => updateRow(row.id, 'day', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="time" 
                            className="h-9" 
                            value={row.start} 
                            onChange={(e) => updateRow(row.id, 'start', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="time" 
                            className="h-9" 
                            value={row.end} 
                            onChange={(e) => updateRow(row.id, 'end', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            className="h-9 w-20" 
                            value={row.break} 
                            onChange={(e) => updateRow(row.id, 'break', Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-primary">
                          {row.rowTotal}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => removeRow(row.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-70 font-bold text-center">Total Duration</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2 pb-10">
              <div className="text-6xl font-black font-headline tracking-tighter">
                {results.totalH}<span className="text-2xl opacity-60 ml-1">h</span> {results.totalM}<span className="text-2xl opacity-60 ml-1">m</span>
              </div>
              <Separator className="bg-white/20 my-4" />
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold opacity-60">Decimal Hours</p>
                <p className="text-3xl font-bold font-mono">{results.totalDecimal}</p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
            <Clock className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-blue-800 font-bold">Pro Tip</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Calculating pay from your time card? Multiply the <strong>Decimal Hours</strong> by your hourly rate to get your gross earnings.
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
              Simplify Your Weekly Payroll and Hours Tracking with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Managing employee hours or tracking your own freelance work week should not mean wrestling with messy spreadsheets and confusing mental math. Because standard clocks run on a 60-minute cycle rather than a base-100 decimal framework, adding up shift logs manually frequently introduces rounding errors that lead to costly payroll disputes. Our free online time card calculator serves as a robust, automated digital clock card calculator to help you record, balance, and review your complete work week effortlessly.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Math of Shift Tracking: Processing Your Punch Card
            </h3>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                To convert mixed clock hours, minutes, and AM/PM indicators into numbers that can be added together, our time punch clock calculator breaks every daily entry down to an absolute baseline of minutes relative to midnight (00:00):
              </p>
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                Total Daily Minutes = (H x 60) + M
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For instance, an employee clocking in at 8:15 AM is recorded by our system at 495 minutes. When they punch out for the day at 5:00 PM (which translates to 17:00 on a 24-hour track), their departure is logged at 1,020 minutes. To isolate the actual hours worked, our work time clock calculator finds the exact length of the shift interval and subtracts any unpaid lunch breaks (Break<sub>min</sub>):
              </p>
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border space-y-2 overflow-x-auto">
                <p>Net Shift Minutes = Punch Out - Punch In - Break<sub>min</sub></p>
                <Separator />
                <p>Net Shift Minutes = 1,020 - 495 - 30 (for a 30-min break) = 495 minutes</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To change this raw data into an entry ready for an accounting invoice, the system divides the final sum by 60 to generate a decimal format:
              </p>
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                Decimal Hours = 495 minutes / 60 = 8.25 hours
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Avoid Common Timesheet Reporting Errors
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Using a dedicated time card sheet calculator keeps your record keeping accurate and protects your budget from two common payroll traps:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Misinterpreting Minute Fractions</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">A very common mistake is writing down a shift of 8 hours and 30 minutes as "8.30" hours on a timesheet. Because 30 minutes is exactly half an hour (30 / 60 = 0.5), it must be processed as 8.5 hours to ensure accurate wage distribution.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Tracking Overtime Correctly</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Keeping a daily timesheet calculator running lets you track exactly when you pass the standard 40-hour weekly ceiling, ensuring any extra time is flagged for overtime premium rates (1.5 x baseline wages).</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
              <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Why Log Your Shifts with MyApexCalc?
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Complete 7-Day Grid Entry:</strong> Tally up hours for an entire week at once by entering simple daily clock markers into a clean, unified dashboard.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Dual Format Summary:</strong> View your final calculations rendered side-by-side in traditional hours-and-minutes readouts and clean decimals for easy typing into payroll programs.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Privacy-First Operations:</strong> Track your employee records or project hours privately. Our client-side script processes your data entirely on your device.</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <Briefcase className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Precision in timekeeping is the foundation of a fair workplace. Count every minute with confidence."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
