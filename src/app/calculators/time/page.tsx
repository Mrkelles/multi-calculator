"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Clock, 
  History, 
  Plus, 
  Minus, 
  CalendarDays, 
  Calculator, 
  Info,
  Type
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { add, sub, format, parseISO } from 'date-fns';

type TimeMode = 'arithmetic' | 'date-offset' | 'expression';

export default function TimeCalculatorPage() {
  const [mode, setMode] = useState<TimeMode>('arithmetic');

  // Arithmetic Mode
  const [aTime1, setATime1] = useState({ d: 0, h: 5, m: 30, s: 0 });
  const [aTime2, setATime2] = useState({ d: 0, h: 2, m: 45, s: 0 });
  const [aOp, setAOp] = useState<'add' | 'sub'>('add');

  // Date Offset Mode
  const [doDate, setDoDate] = useState(new Date().toISOString().slice(0, 16));
  const [doOffset, setDoOffset] = useState({ d: 0, h: 48, m: 0, s: 0 });
  const [doOp, setDoOp] = useState<'add' | 'sub'>('add');

  // Expression Mode
  const [expr, setExpr] = useState('5h 30m + 2h 45m');

  const arithmeticResult = useMemo(() => {
    const totalS1 = aTime1.d * 86400 + aTime1.h * 3600 + aTime1.m * 60 + aTime1.s;
    const totalS2 = aTime2.d * 86400 + aTime2.h * 3600 + aTime2.m * 60 + aTime2.s;
    
    let resultS = aOp === 'add' ? totalS1 + totalS2 : totalS1 - totalS2;
    const isNegative = resultS < 0;
    resultS = Math.abs(resultS);

    const d = Math.floor(resultS / 86400);
    const h = Math.floor((resultS % 86400) / 3600);
    const m = Math.floor((resultS % 3600) / 60);
    const s = resultS % 60;

    return { d, h, m, s, isNegative, totalS: resultS };
  }, [aTime1, aTime2, aOp]);

  const dateOffsetResult = useMemo(() => {
    try {
      const base = new Date(doDate);
      const duration = {
        days: doOffset.d,
        hours: doOffset.h,
        minutes: doOffset.m,
        seconds: doOffset.s
      };
      return doOp === 'add' ? add(base, duration) : sub(base, duration);
    } catch (e) {
      return null;
    }
  }, [doDate, doOffset, doOp]);

  const expressionResult = useMemo(() => {
    try {
      // Basic expression parser
      // Supports units: d, h, m, s
      // Format: 5h 30m + 1d
      const parts = expr.toLowerCase().split(/(\+|\-)/);
      let totalSeconds = 0;
      let currentOp = '+';

      const parseDuration = (str: string) => {
        let sec = 0;
        const matches = str.match(/(\d+)\s*([dhms])/g);
        if (!matches) return 0;
        matches.forEach(m => {
          const val = parseInt(m);
          const unit = m.slice(-1);
          if (unit === 'd') sec += val * 86400;
          if (unit === 'h') sec += val * 3600;
          if (unit === 'm') sec += val * 60;
          if (unit === 's') sec += val;
        });
        return sec;
      };

      parts.forEach(p => {
        const trimmed = p.trim();
        if (trimmed === '+' || trimmed === '-') {
          currentOp = trimmed;
        } else {
          const val = parseDuration(trimmed);
          if (currentOp === '+') totalSeconds += val;
          else totalSeconds -= val;
        }
      });

      const isNegative = totalSeconds < 0;
      const absS = Math.abs(totalSeconds);
      const d = Math.floor(absS / 86400);
      const h = Math.floor((absS % 86400) / 3600);
      const m = Math.floor((absS % 3600) / 60);
      const s = absS % 60;

      return { d, h, m, s, isNegative };
    } catch (e) {
      return null;
    }
  }, [expr]);

  return (
    <CalculatorWrapper
      title="Time Calculator"
      description="Add, subtract, or convert time durations and calculate date offsets with precision."
      icon={Clock}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="arithmetic" className="text-xs">Arithmetic</TabsTrigger>
                  <TabsTrigger value="date-offset" className="text-xs">Date Offset</TabsTrigger>
                  <TabsTrigger value="expression" className="text-xs">Expression</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === 'arithmetic' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time 1</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1"><Label className="text-[10px]">Days</Label><Input type="number" value={aTime1.d} onChange={(e) => setATime1({...aTime1, d: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Hours</Label><Input type="number" value={aTime1.h} onChange={(e) => setATime1({...aTime1, h: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Min</Label><Input type="number" value={aTime1.m} onChange={(e) => setATime1({...aTime1, m: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Sec</Label><Input type="number" value={aTime1.s} onChange={(e) => setATime1({...aTime1, s: Number(e.target.value)})} /></div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button 
                      variant={aOp === 'add' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setAOp('add')}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </Button>
                    <Button 
                      variant={aOp === 'sub' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setAOp('sub')}
                      className="gap-2"
                    >
                      <Minus className="w-4 h-4" /> Subtract
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time 2</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1"><Label className="text-[10px]">Days</Label><Input type="number" value={aTime2.d} onChange={(e) => setATime2({...aTime2, d: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Hours</Label><Input type="number" value={aTime2.h} onChange={(e) => setATime2({...aTime2, h: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Min</Label><Input type="number" value={aTime2.m} onChange={(e) => setATime2({...aTime2, m: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Sec</Label><Input type="number" value={aTime2.s} onChange={(e) => setATime2({...aTime2, s: Number(e.target.value)})} /></div>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'date-offset' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Base Date & Time</Label>
                    <Input 
                      type="datetime-local" 
                      value={doDate} 
                      onChange={(e) => setDoDate(e.target.value)} 
                    />
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button 
                      variant={doOp === 'add' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setDoOp('add')}
                    >
                      Add Duration
                    </Button>
                    <Button 
                      variant={doOp === 'sub' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setDoOp('sub')}
                    >
                      Subtract Duration
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Offset Duration</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1"><Label className="text-[10px]">Days</Label><Input type="number" value={doOffset.d} onChange={(e) => setDoOffset({...doOffset, d: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Hours</Label><Input type="number" value={doOffset.h} onChange={(e) => setDoOffset({...doOffset, h: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Min</Label><Input type="number" value={doOffset.m} onChange={(e) => setDoOffset({...doOffset, m: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Sec</Label><Input type="number" value={doOffset.s} onChange={(e) => setDoOffset({...doOffset, s: Number(e.target.value)})} /></div>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'expression' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Enter Expression
                    </Label>
                    <Input 
                      placeholder="e.g. 5h 30m + 2d - 1h" 
                      value={expr} 
                      onChange={(e) => setExpr(e.target.value)} 
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Use units: <strong>d</strong> (days), <strong>h</strong> (hours), <strong>m</strong> (minutes), <strong>s</strong> (seconds).
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardContent className="pt-10 pb-10 text-center">
              {mode === 'arithmetic' && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest opacity-80 font-bold">Resulting Duration</p>
                  <h3 className="text-5xl font-black font-headline tracking-tighter">
                    {arithmeticResult.isNegative ? '-' : ''}
                    {arithmeticResult.d > 0 && `${arithmeticResult.d}d `}
                    {arithmeticResult.h}h {arithmeticResult.m}m {arithmeticResult.s}s
                  </h3>
                </div>
              )}

              {mode === 'date-offset' && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest opacity-80 font-bold">Calculated Date</p>
                  <h3 className="text-4xl font-black font-headline tracking-tighter leading-tight">
                    {dateOffsetResult ? format(dateOffsetResult, 'PPPP p') : 'Invalid Date'}
                  </h3>
                </div>
              )}

              {mode === 'expression' && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest opacity-80 font-bold">Expression Result</p>
                  <h3 className="text-5xl font-black font-headline tracking-tighter">
                    {expressionResult?.isNegative ? '-' : ''}
                    {expressionResult?.d ? `${expressionResult.d}d ` : ''}
                    {expressionResult?.h}h {expressionResult?.m}m {expressionResult?.s}s
                  </h3>
                </div>
              )}
            </CardContent>
          </Card>

          {mode === 'arithmetic' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Unit Conversions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Total Seconds</span>
                  <span className="font-mono font-bold">{arithmeticResult.totalS.toLocaleString()} s</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Total Minutes</span>
                  <span className="font-mono font-bold">{(arithmeticResult.totalS / 60).toFixed(2)} min</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Total Hours</span>
                  <span className="font-mono font-bold">{(arithmeticResult.totalS / 3600).toFixed(2)} h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Days</span>
                  <span className="font-mono font-bold">{(arithmeticResult.totalS / 86400).toFixed(2)} d</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
            <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-blue-800 font-bold">Pro Tip</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                You can use negative numbers in the Arithmetic mode to effectively perform subtraction while in "Add" mode, or vice versa.
              </p>
            </div>
          </div>
        </div>

        {/* Units Definitions Table */}
        <div className="lg:col-span-12 py-10 space-y-8">
          <Separator />
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-primary">Time Unit Definitions</h3>
            </div>
            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">Unit</TableHead>
                    <TableHead className="font-bold">Symbol</TableHead>
                    <TableHead className="text-right font-bold">Base Unit Equivalent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Second</TableCell>
                    <TableCell>s</TableCell>
                    <TableCell className="text-right font-mono">1 second</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Minute</TableCell>
                    <TableCell>m</TableCell>
                    <TableCell className="text-right font-mono">60 seconds</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hour</TableCell>
                    <TableCell>h</TableCell>
                    <TableCell className="text-right font-mono">3,600 seconds</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Day</TableCell>
                    <TableCell>d</TableCell>
                    <TableCell className="text-right font-mono">86,400 seconds</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Week</TableCell>
                    <TableCell>w</TableCell>
                    <TableCell className="text-right font-mono">604,800 seconds</TableCell>
                  </TableRow>
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
                How to Use the Time Calculator
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Managing time is often more complex than standard base-10 math because units follow base-60 (minutes/seconds) or base-24 (hours). The **My Apex Time Calculator** simplifies this by handling all conversions for you.
              </p>
              <h4 className="font-bold text-foreground">Time Arithmetic</h4>
              <p className="text-muted-foreground leading-relaxed">
                Use this mode to add or subtract two durations. For example, if you finished a task in 2 hours and 45 minutes and another in 1 hour and 30 minutes, you can easily find the total time spent.
              </p>
              <h4 className="font-bold text-foreground">Date Offset</h4>
              <p className="text-muted-foreground leading-relaxed">
                Crucial for planning deadlines or logistics. Input a starting date and time, then add a specific number of days or hours to see exactly when that period will end.
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Expression Parser</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our advanced expression mode allows you to string together multiple time units into a single calculation. This is perfect for complex logs where you have multiple segments of time to reconcile.
              </p>
              <div className="bg-muted/30 p-4 rounded-xl space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Example Expressions:</p>
                <ul className="text-xs space-y-1 font-mono text-foreground/80">
                  <li>• 1d 5h + 30m</li>
                  <li>• 12h - 45m + 2h</li>
                  <li>• 100s + 500s - 2m</li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Note: The calculator uses standard Gregorian calendar rules for all date-based offsets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}