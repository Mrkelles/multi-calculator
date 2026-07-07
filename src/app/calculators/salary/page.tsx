"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Wallet, Info, Clock, Calendar, Briefcase, History, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

type SalaryPeriod = 'year' | 'quarter' | 'month' | 'biweek' | 'week' | 'day' | 'hour';

export default function SalaryCalculatorPage() {
  const [amount, setAmount] = useState(50000);
  const [period, setPeriod] = useState<SalaryPeriod>('year');
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [holidays, setHolidays] = useState(10);
  const [vacationDays, setVacationDays] = useState(15);

  const results = useMemo(() => {
    // 1. Calculate Base Yearly (Unadjusted)
    let yearlyBase = 0;
    switch (period) {
      case 'year': yearlyBase = amount; break;
      case 'quarter': yearlyBase = amount * 4; break;
      case 'month': yearlyBase = amount * 12; break;
      case 'biweek': yearlyBase = amount * 26; break;
      case 'week': yearlyBase = amount * 52; break;
      case 'day': yearlyBase = amount * daysPerWeek * 52; break;
      case 'hour': yearlyBase = amount * hoursPerWeek * 52; break;
    }

    // Calculations
    const hoursPerDay = hoursPerWeek / daysPerWeek;
    const totalWorkingDaysPerYear = 52 * daysPerWeek;
    const actualWorkingDaysPerYear = totalWorkingDaysPerYear - holidays - vacationDays;
    
    // Period Breakdowns
    const breakdowns = [
      { label: 'Year', value: yearlyBase },
      { label: 'Quarter', value: yearlyBase / 4 },
      { label: 'Month', value: yearlyBase / 12 },
      { label: 'Bi-Week', value: yearlyBase / 26 },
      { label: 'Week', value: yearlyBase / 52 },
      { label: 'Day', value: yearlyBase / totalWorkingDaysPerYear },
      { label: 'Hour', value: yearlyBase / (52 * hoursPerWeek) },
    ];

    return { breakdowns, actualWorkingDaysPerYear, hoursPerDay };
  }, [amount, period, hoursPerWeek, daysPerWeek, holidays, vacationDays]);

  return (
    <CalculatorWrapper
      title="Salary Calculator"
      description="Convert your pay between hourly, weekly, monthly, and yearly periods while adjusting for your specific work schedule."
      icon={Wallet}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Salary Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salary Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input 
                      type="number" 
                      className="pl-7" 
                      value={amount} 
                      onChange={(e) => setAmount(Number(e.target.value))} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Per Period</Label>
                  <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="biweek">Bi-Week</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="hour">Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Hours / Week</Label>
                  <Input 
                    type="number" 
                    value={hoursPerWeek} 
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Days / Week</Label>
                  <Input 
                    type="number" 
                    value={daysPerWeek} 
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Holidays / Year</Label>
                  <Input 
                    type="number" 
                    value={holidays} 
                    onChange={(e) => setHolidays(Number(e.target.value))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Vacation / Year</Label>
                  <Input 
                    type="number" 
                    value={vacationDays} 
                    onChange={(e) => setVacationDays(Number(e.target.value))} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Work Year Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-muted-foreground">
              <div className="flex justify-between border-b pb-1.5">
                <span>Total Work Days</span>
                <span className="font-bold text-foreground">{260}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span>Actual Working Days</span>
                <span className="font-bold text-foreground">{results.actualWorkingDaysPerYear}</span>
              </div>
              <div className="flex justify-between">
                <span>Hours per Day</span>
                <span className="font-bold text-foreground">{results.hoursPerDay.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results Table */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Salary Conversion Table
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">Time Period</TableHead>
                    <TableHead className="text-right font-bold">Unadjusted Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.breakdowns.map((row) => (
                    <TableRow key={row.label} className={row.label.toLowerCase() === period ? "bg-primary/5" : ""}>
                      <TableCell className="font-medium py-4">{row.label}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-lg">
                        ${row.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
            <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-blue-800 font-bold">Important Note on Taxes</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                These calculations represent <strong>Gross Salary</strong> before any deductions. Your actual take-home pay will be lower after federal, state, and FICA taxes are withheld. Use our <a href="/calculators/tax" className="underline font-bold">Tax Calculator</a> for a more accurate net pay estimate.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Explanation Section */}
        <div className="lg:col-span-12 space-y-12 py-10">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Understanding Your Pay
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Navigating salary conversations requires more than just knowing your annual figure. Whether you are negotiating a new job offer or trying to figure out if an hourly rate is better than a flat monthly stipend, the <strong>My Apex Salary Calculator</strong> breaks down the math for you.
              </p>
              <h4 className="font-bold text-foreground pt-4">Hourly vs. Salaried</h4>
              <p className="text-muted-foreground leading-relaxed">
                Salaried employees usually receive a fixed amount regardless of hours worked, while hourly employees are paid for the exact time they spend on the job. Our calculator assumes a standard 52-week work year (2,080 hours for a 40-hour week) to provide a consistent benchmark for comparison.
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Key Calculation Factors</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Work Hours & Overtime</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Standard full-time is 40 hours/week. If you regularly work overtime, your hourly equivalent for unadjusted periods may vary significantly from a standard salary breakdown.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Vacation and Holidays</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">For salaried workers, these are often "paid time off." For contractors or hourly workers, missing these days means missing pay, which reduces the effective annual total.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <DollarSign className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Gross vs. Net Income</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Gross income is the total before taxes. Net income (Take-home pay) accounts for taxes and benefits like health insurance or 401(k) contributions.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/30 p-8 rounded-[2.5rem] border text-center space-y-4">
            <h3 className="text-xl font-bold text-primary">Need to calculate your Take-Home Pay?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              While the Salary Calculator gives you the breakdown of your gross earnings, our Advanced Tax Calculator can help you see what remains after Uncle Sam takes his cut.
            </p>
            <div className="pt-4">
              <a href="/calculators/tax" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Go to Tax Calculator
              </a>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
