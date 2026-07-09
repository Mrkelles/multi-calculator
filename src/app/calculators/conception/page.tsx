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
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { addDays, subDays, format, startOfDay } from 'date-fns';

type ConceptionMode = 'last-period' | 'ultrasound' | 'due-date';

export default function ConceptionCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<ConceptionMode>('last-period');
  const [dateInput, setDateInput] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  
  // Ultrasound specific
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState(12);
  const [ultrasoundDays, setUltrasoundDays] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    // Initialize with a default date (e.g., today)
    setDateInput(format(new Date(), 'yyyy-MM-dd'));
  }, []);

  const results = useMemo(() => {
    if (!isMounted || !dateInput) return null;

    try {
      const inputDate = startOfDay(new Date(dateInput));
      let conceptionDate: Date;

      if (mode === 'due-date') {
        // Conception typically happens 266 days (38 weeks) before the due date
        conceptionDate = subDays(inputDate, 266);
      } else if (mode === 'last-period') {
        // Conception usually happens (Cycle Length - 14) days after the first day of the last period
        // For standard 28-day cycle, it's day 14.
        const offset = cycleLength - 14;
        conceptionDate = addDays(inputDate, offset);
      } else if (mode === 'ultrasound') {
        // Gestational age starts from LMP (roughly 2 weeks before conception)
        // Conception Date = Ultrasound Date - (Weeks * 7 + Days) + 14 days
        const totalDaysAtScan = (ultrasoundWeeks * 7) + ultrasoundDays;
        const effectiveLMP = subDays(inputDate, totalDaysAtScan);
        conceptionDate = addDays(effectiveLMP, 14);
      } else {
        return null;
      }

      // Likely Window: 3 days around the estimate
      const windowStart = subDays(conceptionDate, 1);
      const windowEnd = addDays(conceptionDate, 1);

      return {
        conceptionDate,
        windowStart,
        windowEnd,
        dueDate: mode === 'due-date' ? inputDate : addDays(conceptionDate, 266)
      };
    } catch (e) {
      return null;
    }
  }, [mode, dateInput, cycleLength, ultrasoundWeeks, ultrasoundDays, isMounted]);

  return (
    <CalculatorWrapper
      title="Conception Calculator"
      description="Estimate your date of conception based on your due date, last menstrual period, or ultrasound results."
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pregnancy Length at Scan:</Label>
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
                Medical Model
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[10px] text-muted-foreground leading-relaxed">
              Medical professionals measure pregnancy from the last menstrual period (LMP), which is typically 2 weeks before conception. Our calculator accounts for this 2-week offset in all calculations.
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic">
              Please enter valid details to see results.
            </Card>
          ) : (
            <>
              <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24" />
                </div>
                <CardContent className="pt-10 pb-12 text-center relative z-10 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-bold">Estimated Conception Date</p>
                    <h3 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">
                      {format(results.conceptionDate, 'MMMM d, yyyy')}
                    </h3>
                  </div>
                  
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="bg-white/10 p-3 px-6 rounded-2xl border border-white/20">
                      <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Likely Conception Window</p>
                      <p className="text-sm font-medium">
                        {format(results.windowStart, 'MMM d')} - {format(results.windowEnd, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <span className="font-bold">{format(subDays(results.conceptionDate, 14), 'MMM d, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-accent">
                      <Clock className="w-4 h-4" />
                      Key Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Heartbeat Detectable</span>
                      <span className="font-bold">{format(addDays(results.conceptionDate, 28), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End of 1st Trimester</span>
                      <span className="font-bold">{format(addDays(results.conceptionDate, 77), 'MMM d, yyyy')}</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Understanding Conception
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  **Conception** is the moment when a sperm fertilizes an egg. While many people think of this as a specific "day," it actually occurs during a biological window. Sperm can survive inside the female reproductive tract for up to five days, while an egg is viable for only about 12 to 24 hours after ovulation.
                </p>
                <p>
                  This means that sexual intercourse occurring several days before ovulation can still lead to conception. Most conception calculators, including this one, use a statistical midpoint based on standard gestation periods.
                </p>
                <h4 className="font-bold text-foreground pt-4">Fertile Window & Ovulation</h4>
                <p>
                  For a standard 28-day cycle, ovulation usually occurs around Day 14. Your most fertile days are the three days leading up to and including the day of ovulation. Knowing your conception date can help clarify your pregnancy timeline and is often one of the first questions parents-to-be have.
                </p>
              </div>
            </section>

            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Search className="w-5 h-5 text-accent" />
                Term Definitions
              </h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Gestational Age</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">The age of the pregnancy measured from the first day of the last period. This is the age used by doctors.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Fetal Age (Conceptional Age)</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">The actual age of the developing baby from the moment of conception. It is typically 2 weeks less than the gestational age.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Due Date (EDD)</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">The estimated date of delivery, calculated as 280 days (40 weeks) from the LMP or 266 days from conception.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-8 pb-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">How Accurate is this estimate?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                While this calculator provides a highly reliable estimate based on medical standards, it is important to understand that every body is unique. 
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <Card className="border-none bg-blue-50">
                  <CardContent className="pt-6">
                    <p className="font-bold text-blue-900 mb-1">Cycle Variation</p>
                    <p className="text-xs text-blue-700">If your cycles are irregular, calculating based on LMP may be less accurate. In these cases, an early ultrasound is the most reliable dating method.</p>
                  </CardContent>
                </Card>
                <Card className="border-none bg-green-50">
                  <CardContent className="pt-6">
                    <p className="font-bold text-green-900 mb-1">Conception Timing</p>
                    <p className="text-xs text-green-700">Conception doesn't always happen on the day of intercourse. Sperm can survive up to 5 days, waiting for the egg to be released.</p>
                  </CardContent>
                </Card>
                <Card className="border-none bg-amber-50">
                  <CardContent className="pt-6">
                    <p className="font-bold text-amber-900 mb-1">Medical Follow-up</p>
                    <p className="text-xs text-amber-700">Always confirm your dating with your OB-GYN or midwife, as they will use clinical measurements to monitor growth.</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}