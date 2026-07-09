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
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { addDays, subDays, format, startOfDay, differenceInDays } from 'date-fns';

type ConceptionMode = 'last-period' | 'ultrasound' | 'due-date';

export default function ConceptionCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<ConceptionMode>('last-period');
  const [dateInput, setDateInput] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  
  // Ultrasound specific
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState(22);
  const [ultrasoundDays, setUltrasoundDays] = useState(6);

  useEffect(() => {
    setIsMounted(true);
    // Setting defaults to match one of the examples for testing (Jan 29, 2026 LMP)
    setDateInput('2026-01-29');
  }, []);

  const results = useMemo(() => {
    if (!isMounted || !dateInput) return null;

    try {
      const inputDate = startOfDay(new Date(dateInput));
      let anchorDate: Date; // The most likely conception date

      if (mode === 'due-date') {
        // Conception typically happens 266 days (38 weeks) before the due date
        anchorDate = subDays(inputDate, 266);
      } else if (mode === 'last-period') {
        // Conception happens (Cycle Length - 14) days after the first day of the last period
        const offset = cycleLength - 14;
        anchorDate = addDays(inputDate, offset);
      } else if (mode === 'ultrasound') {
        // Gestational age starts from LMP (roughly 2 weeks before conception)
        const totalDaysAtScan = (ultrasoundWeeks * 7) + ultrasoundDays;
        const effectiveLMP = subDays(inputDate, totalDaysAtScan);
        anchorDate = addDays(effectiveLMP, 14);
      } else {
        return null;
      }

      // Most Probable Conception: Anchor +/- 2 days
      const probConceptionStart = subDays(anchorDate, 2);
      const probConceptionEnd = addDays(anchorDate, 2);

      // Most Probable Intercourse: Conception Start - 3 days to Conception End
      const probIntercourseStart = subDays(probConceptionStart, 3);
      const probIntercourseEnd = probConceptionEnd;

      // Possible Conception: Anchor - 3 to Anchor + 7
      const possibleConceptionStart = subDays(anchorDate, 3);
      const possibleConceptionEnd = addDays(anchorDate, 7);

      // Possible Intercourse: Possible Conception Start - 5 to Possible Conception End
      const possibleIntercourseStart = subDays(possibleConceptionStart, 5);
      const possibleIntercourseEnd = possibleConceptionEnd;

      return {
        anchorDate,
        probConception: { start: probConceptionStart, end: probConceptionEnd },
        probIntercourse: { start: probIntercourseStart, end: probIntercourseEnd },
        possibleConception: { start: possibleConceptionStart, end: possibleConceptionEnd },
        possibleIntercourse: { start: possibleIntercourseStart, end: possibleIntercourseEnd },
        dueDate: mode === 'due-date' ? inputDate : addDays(anchorDate, 266)
      };
    } catch (e) {
      return null;
    }
  }, [mode, dateInput, cycleLength, ultrasoundWeeks, ultrasoundDays, isMounted]);

  return (
    <CalculatorWrapper
      title="Conception Calculator"
      description="Estimate your date of conception and the window of sexual intercourse that led to your pregnancy."
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Length of Pregnancy at Scan:</Label>
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
                Medical Standard
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[10px] text-muted-foreground leading-relaxed">
              Medical professionals measure pregnancy from the last menstrual period (LMP), which is typically 2 weeks before conception. This calculator anchors on a 266-day post-conception duration.
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic text-center">
              Please enter valid details to see your estimated conception window.
            </Card>
          ) : (
            <>
              {/* Primary Results Card */}
              <Card className="border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-32 h-32 text-primary" />
                </div>
                <CardHeader className="bg-primary text-white pb-6 pt-8 text-center relative z-10">
                  <p className="text-xs uppercase tracking-[0.2em] font-black opacity-70 mb-2">Estimated Results</p>
                  <CardTitle className="text-xl font-headline flex items-center justify-center gap-2">
                    Conception Date Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 relative z-10 bg-white">
                  <div className="p-6 space-y-8">
                    {/* Probable Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <CheckCircle2 size={16} />
                        Most Probable Window
                      </div>
                      <div className="grid gap-3">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Conception Dates:</p>
                          <p className="text-lg font-bold text-primary">
                            {format(results.probConception.start, 'MMM d, yyyy')} - {format(results.probConception.end, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Sexual Intercourse Dates:</p>
                          <p className="text-lg font-bold text-primary">
                            {format(results.probIntercourse.start, 'MMM d, yyyy')} - {format(results.probIntercourse.end, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Possible Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider">
                        <Clock size={16} />
                        Possible Window
                      </div>
                      <div className="grid gap-3">
                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                          <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Conception Dates:</p>
                          <p className="text-lg font-bold text-accent">
                            {format(results.possibleConception.start, 'MMM d, yyyy')} - {format(results.possibleConception.end, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                          <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Sexual Intercourse Dates:</p>
                          <p className="text-lg font-bold text-accent">
                            {format(results.possibleIntercourse.start, 'MMM d, yyyy')} - {format(results.possibleIntercourse.end, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 border-t flex gap-3 items-center">
                    <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                    <p className="text-[10px] text-muted-foreground italic">
                      The results of this calculator are estimations only. Biological variation means exact dates can vary.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Details */}
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
                      <span className="font-bold">{format(subDays(results.anchorDate, 14), 'MMM d, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-accent">
                      <CalendarIcon className="w-4 h-4" />
                      Key Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Heartbeat Detectable</span>
                      <span className="font-bold">{format(addDays(results.anchorDate, 28), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End of 1st Trimester</span>
                      <span className="font-bold">{format(addDays(results.anchorDate, 77), 'MMM d, yyyy')}</span>
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
              <h3 className="text-2xl font-bold text-primary">How accurate is this estimate?</h3>
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
          
          <Separator />

          <section className="space-y-6 pb-12">
            <h3 className="text-2xl font-bold text-primary">Pregnancy Term & Due Date</h3>
            <div className="prose prose-slate max-w-none text-muted-foreground space-y-4 text-sm leading-relaxed">
              <p>
                Pregnancy is a term used to describe a woman's state over a time period (~9 months) during which one or more offspring develops inside of a woman. Childbirth usually occurs approximately 38 weeks after conception, or about 40 weeks after the last menstrual period. The World Health Organization defines a normal pregnancy term to last between 37 and 42 weeks. During a person's first OB-GYN visit, the doctor will usually provide an estimated date (based on a sonogram) at which the child will be born, or due date. Alternatively, the due date can also be estimated based on a person's last menstrual period.
              </p>
              <p>
                While the due date can be estimated, the actual length of pregnancy depends on various factors, including age, length of previous pregnancies, and weight of the mother at birth.<sup>1</sup> However, there are still more factors affecting natural variation in pregnancy terms that are not well understood. Studies have shown that fewer than 4% of births occur on the exact due date, 60% occur within a week of the due date, and almost 90% occur within two weeks of the due date.<sup>2</sup> As such, while it is possible to be fairly confident that a person's child will be born within about two weeks of the due date, it is currently not possible to predict the exact day of birth with certainty.
              </p>
            </div>
          </section>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
