"use client"

import { useState, useMemo, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Calendar as CalendarIcon, 
  Baby, 
  Info, 
  History, 
  HeartPulse, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  addDays, 
  subDays, 
  differenceInDays, 
  format, 
  startOfDay,
  intervalToDuration
} from 'date-fns';

type DueDateMode = 'last-period' | 'ultrasound' | 'conception' | 'ivf';

export default function DueDateCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<DueDateMode>('last-period');
  const [dateInput, setDateInput] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [embryoAge, setEmbryoAge] = useState('5');
  
  // Ultrasound specific
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState(20);
  const [ultrasoundDays, setUltrasoundDays] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    // Initialize with a meaningful date (e.g. 1 month ago)
    setDateInput(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  }, []);

  const results = useMemo(() => {
    if (!isMounted || !dateInput) return null;

    const today = startOfDay(new Date());
    let dueDate: Date;
    let lmpDate: Date;
    let effectiveLmpDate: Date;

    try {
      const inputDate = startOfDay(new Date(dateInput));

      if (mode === 'last-period') {
        lmpDate = inputDate;
        // Naegele's Rule adjustment for cycle length
        const cycleAdj = cycleLength - 28;
        dueDate = addDays(lmpDate, 280 + cycleAdj);
        effectiveLmpDate = addDays(lmpDate, cycleAdj);
      } else if (mode === 'ultrasound') {
        const totalDaysAtScan = (ultrasoundWeeks * 7) + ultrasoundDays;
        effectiveLmpDate = subDays(inputDate, totalDaysAtScan);
        dueDate = addDays(effectiveLmpDate, 280);
      } else if (mode === 'conception') {
        // Conception is day 14 of a 28-day cycle
        effectiveLmpDate = subDays(inputDate, 14);
        dueDate = addDays(effectiveLmpDate, 280);
      } else if (mode === 'ivf') {
        const age = parseInt(embryoAge);
        // Due date is 266 days after ovulation. 
        // Ovulation is roughly Transfer Date minus Embryo Age.
        const offset = 266 - age;
        dueDate = addDays(inputDate, offset);
        effectiveLmpDate = subDays(dueDate, 280);
      } else {
        dueDate = new Date();
        effectiveLmpDate = new Date();
      }

      const daysPregnant = differenceInDays(today, effectiveLmpDate);
      const weeks = Math.floor(daysPregnant / 7);
      const days = daysPregnant % 7;
      const daysRemaining = differenceInDays(dueDate, today);

      const duration = intervalToDuration({ start: effectiveLmpDate, end: today });
      const monthsStr = `${duration.years ? duration.years * 12 + (duration.months || 0) : duration.months || 0} months ${duration.days || 0} days`;

      let trimester = 'First';
      if (weeks >= 28) trimester = 'Third';
      else if (weeks >= 13) trimester = 'Second';

      return {
        dueDate,
        weeks,
        days,
        daysRemaining,
        monthsStr,
        trimester,
        likelyConception: addDays(effectiveLmpDate, 14)
      };
    } catch (e) {
      return null;
    }
  }, [mode, dateInput, cycleLength, ultrasoundWeeks, ultrasoundDays, embryoAge, isMounted]);

  return (
    <CalculatorWrapper
      title="Due Date Calculator"
      description="Calculate your estimated due date using multiple standard medical methods."
      icon={CalendarIcon}
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
                      <SelectItem value="conception">Conception Date</SelectItem>
                      <SelectItem value="ivf">IVF Transfer Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="capitalize text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {mode === 'last-period' ? 'First Day of Last Period:' : 
                     mode === 'ultrasound' ? 'Ultrasound Date:' :
                     mode === 'conception' ? 'Conception Date:' : 'Transfer Date:'}
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

                {mode === 'ivf' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Embryo Age:</Label>
                    <Select value={embryoAge} onValueChange={setEmbryoAge}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Day 3 Embryo</SelectItem>
                        <SelectItem value="5">Day 5 Embryo</SelectItem>
                        <SelectItem value="6">Day 6 Embryo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                Medical Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[10px] text-muted-foreground leading-relaxed">
              Standard calculations assume a 40-week (280-day) gestational period. While these tools provide a reliable estimate, only 4% of babies are born on their exact due date.
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic">
              Please enter valid details to calculate your due date.
            </Card>
          ) : (
            <>
              <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Baby className="w-24 h-24" />
                </div>
                <CardContent className="pt-10 pb-10 text-center relative z-10 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-bold">Estimated Due Date</p>
                    <h3 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">
                      {format(results.dueDate, 'MMMM d, yyyy')}
                    </h3>
                    <p className="text-lg opacity-80 mt-2">
                      {results.daysRemaining > 0 
                        ? `${results.daysRemaining} days remaining` 
                        : results.daysRemaining === 0 ? "Today is the big day!" : "Past due date"}
                    </p>
                  </div>
                  
                  <div className="bg-white/10 p-2 px-6 rounded-full inline-block border border-white/20">
                    <p className="text-xs font-bold uppercase tracking-widest">
                      Current: {results.weeks} Weeks, {results.days} Days
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-primary" />
                      Pregnancy Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Trimester</span>
                      <span className="font-bold text-primary">{results.trimester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Months</span>
                      <span className="font-bold">{results.monthsStr}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      Key Estimates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Likely Conception</span>
                      <span className="font-bold">{format(results.likelyConception, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Term Date</span>
                      <span className="font-bold">{format(addDays(subDays(results.dueDate, 280), 266), 'MMM d, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Term Definitions Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Term Definitions
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">Gestational Age</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is the standard medical measure of how far along a pregnancy is. It is measured in weeks from the first day of the last menstrual period (LMP). Even though conception usually happens two weeks later, the LMP is used because it's a fixed date patients usually remember.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">Trimesters</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pregnancy is divided into three segments. The first trimester (weeks 1-12) involves rapid cellular development. The second (weeks 13-27) is characterized by growth and movement. The third (weeks 28-40) is the final maturation phase.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Calculation Insights</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Naegele's Rule</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">The traditional method of adding 7 days to the LMP, subtracting 3 months, and adding 1 year. Our calculator uses a more precise 280-day model.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">IVF Adjustments</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">For IVF, the due date is extremely precise. It is calculated by adding 266 days to the ovulation date (which is Transfer Date minus Embryo Age).</p>
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
