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
  Briefcase 
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

interface TimeRow {
  id: string;
  day: string;
  start: string;
  end: string;
  break: number; // in minutes
}

export default function HoursCalculatorPage() {
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

  const periodReference = [
    { period: '1 Day', hours: 24, label: 'Full Rotation' },
    { period: '1 Week', hours: 168, label: '7 Full Days' },
    { period: '1 Fortnight', hours: 336, label: '14 Full Days' },
    { period: 'Average Month', hours: 730.48, label: '30.44 Days (avg)' },
    { period: 'Common Work Year', hours: 2080, label: '52 Weeks x 40h' },
    { period: 'Calendar Year', hours: 8760, label: '365 Days x 24h' },
    { period: 'Leap Year', hours: 8784, label: '366 Days x 24h' },
  ];

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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Quick Conversion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Total Minutes</span>
                <span className="font-bold">{(Number(results.totalDecimal) * 60).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Seconds</span>
                <span className="font-bold">{(Number(results.totalDecimal) * 3600).toLocaleString()}</span>
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

        {/* Hours in different time periods table */}
        <div className="lg:col-span-12 py-10 space-y-8">
          <Separator />
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-primary">Hours in Different Time Periods</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Understanding time at a macro scale helps with long-term project planning and annual goal setting. Below are the standard hour counts for common calendar periods.
            </p>
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">Time Period</TableHead>
                    <TableHead className="text-right font-bold">Total Hours</TableHead>
                    <TableHead className="text-right font-bold hidden md:table-cell">Context</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodReference.map((p) => (
                    <TableRow key={p.period} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium">{p.period}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary">
                        {p.hours.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground hidden md:table-cell">
                        {p.label}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                How the Time Card Calculator Works
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are tracking your billable hours for a client or managing your team's weekly timesheet, calculating time accurately can be tricky due to the base-60 nature of clocks. The **My Apex Time Card Calculator** does the heavy lifting by converting minutes into decimals and handling overnight shift rollovers.
              </p>
              <h4 className="font-bold text-foreground">Why use Decimal Hours for Time Cards?</h4>
              <p className="text-muted-foreground leading-relaxed">
                Most payroll systems and billing software require time to be entered in a decimal format (e.g., 7.5 hours instead of 7 hours and 30 minutes). This allows for easy multiplication against an hourly wage or rate, ensuring your time card is accurate for accounting.
              </p>
            </section>

            <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Key Features</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Briefcase className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Break Deduction</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Automatically subtract lunch or rest breaks from your total shift length to get actual "on-the-clock" time on your card.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Overnight Shifts</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Our math handles transitions across midnight. If you start at 10:00 PM and end at 6:00 AM, the time card correctly identifies that as an 8-hour shift.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Weekly Accumulation</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">The calculator sums all daily totals into a single weekly figure, making Friday payroll preparation and time card submission a breeze.</p>
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