"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Timer, 
  History, 
  Plus, 
  Trash2, 
  ArrowRightLeft, 
  MapPin, 
  Flag, 
  Info,
  Clock,
  Zap,
  Activity
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

type PaceMode = 'pace' | 'time' | 'distance';

const standardDistances = [
  { label: '5 Kilometers', value: 5, unit: 'km' },
  { label: '10 Kilometers', value: 10, unit: 'km' },
  { label: 'Half Marathon', value: 21.0975, unit: 'km' },
  { label: 'Marathon', value: 42.195, unit: 'km' },
  { label: '5 Miles', value: 5, unit: 'miles' },
  { label: '10 Miles', value: 10, unit: 'miles' },
];

export default function PaceCalculatorPage() {
  // Calculator 1: Standard Pace/Time/Distance
  const [mode, setMode] = useState<PaceMode>('pace');
  const [time, setTime] = useState({ h: 0, m: 20, s: 0 });
  const [dist, setDist] = useState(5);
  const [distUnit, setDistUnit] = useState('km');
  const [pace, setPace] = useState({ m: 4, s: 0 });
  const [paceUnit, setPaceUnit] = useState('min/km');

  // Calculator 2: Multipoint Pace
  const [splits, setSplits] = useState([
    { id: '1', dist: 1, time: { m: 4, s: 0 } },
    { id: '2', dist: 1, time: { m: 4, s: 10 } },
  ]);

  // Calculator 3: Pace Converter
  const [convPace, setConvPace] = useState({ m: 5, s: 0 });
  const [convUnit, setConvPaceUnit] = useState('min/km');

  // Calculator 4: Finish Time
  const [finishDist, setFinishDist] = useState('21.0975');
  const [finishPace, setFinishPace] = useState({ m: 5, s: 0 });
  const [finishPaceUnit, setFinishPaceUnit] = useState('min/km');

  // Logic 1: Standard Solver
  const standardResult = useMemo(() => {
    const totalTimeSec = time.h * 3600 + time.m * 60 + time.s;
    const pacePerUnitSec = pace.m * 60 + pace.s;

    if (mode === 'pace') {
      if (dist === 0) return null;
      const paceSec = totalTimeSec / dist;
      return { 
        m: Math.floor(paceSec / 60), 
        s: Math.floor(paceSec % 60),
        unit: `min/${distUnit}`
      };
    } else if (mode === 'time') {
      const timeSec = dist * pacePerUnitSec;
      return {
        h: Math.floor(timeSec / 3600),
        m: Math.floor((timeSec % 3600) / 60),
        s: Math.floor(timeSec % 60)
      };
    } else {
      if (pacePerUnitSec === 0) return null;
      const calculatedDist = totalTimeSec / pacePerUnitSec;
      return { dist: calculatedDist.toFixed(2), unit: paceUnit.split('/')[1] };
    }
  }, [mode, time, dist, distUnit, pace, paceUnit]);

  // Logic 2: Multipoint
  const multipointResult = useMemo(() => {
    let totalD = 0;
    let totalS = 0;
    splits.forEach(s => {
      totalD += s.dist;
      totalS += s.time.m * 60 + s.time.s;
    });
    if (totalD === 0) return null;
    const avgPaceSec = totalS / totalD;
    return {
      m: Math.floor(avgPaceSec / 60),
      s: Math.floor(avgPaceSec % 60),
      totalDist: totalD.toFixed(2),
      totalTime: `${Math.floor(totalS / 3600)}h ${Math.floor((totalS % 3600) / 60)}m ${totalS % 60}s`
    };
  }, [splits]);

  // Logic 3: Pace Converter
  const conversions = useMemo(() => {
    const pSec = convPace.m * 60 + convPace.s;
    if (pSec === 0) return [];
    
    let baseMinKm = 0;
    if (convUnit === 'min/km') baseMinKm = pSec;
    else baseMinKm = pSec / 1.60934; // min/mile to min/km

    return [
      { label: 'min/km', value: `${Math.floor(baseMinKm / 60)}:${String(Math.floor(baseMinKm % 60)).padStart(2, '0')}` },
      { label: 'min/mile', value: `${Math.floor((baseMinKm * 1.60934) / 60)}:${String(Math.floor((baseMinKm * 1.60934) % 60)).padStart(2, '0')}` },
      { label: 'km/h', value: (60 / (baseMinKm / 60)).toFixed(2) },
      { label: 'mph', value: (60 / (baseMinKm * 1.60934 / 60)).toFixed(2) },
    ];
  }, [convPace, convUnit]);

  // Logic 4: Finish Time
  const predictedFinish = useMemo(() => {
    const d = parseFloat(finishDist);
    const pSec = finishPace.m * 60 + finishPace.s;
    const totalS = d * pSec;
    return {
      h: Math.floor(totalS / 3600),
      m: Math.floor((totalS % 3600) / 60),
      s: Math.floor(totalS % 60)
    };
  }, [finishDist, finishPace]);

  return (
    <CalculatorWrapper
      title="Pace Calculator"
      description="A suite of athletic tools to help runners, cyclists, and athletes manage their performance data."
      icon={Timer}
    >
      <div className="space-y-16">
        
        {/* 1. Main Pace Calculator */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Pace, Time & Distance Solver</h3>
              <p className="text-sm text-muted-foreground">Calculate one variable based on the other two.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-7">
              <CardHeader className="pb-4">
                <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pace">Find Pace</TabsTrigger>
                    <TabsTrigger value="time">Find Time</TabsTrigger>
                    <TabsTrigger value="distance">Find Distance</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="space-y-6">
                {mode !== 'time' && (
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Time</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px]">Hrs</Label>
                        <Input type="number" value={time.h} onChange={(e) => setTime({...time, h: Number(e.target.value)})} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Min</Label>
                        <Input type="number" value={time.m} onChange={(e) => setTime({...time, m: Number(e.target.value)})} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Sec</Label>
                        <Input type="number" value={time.s} onChange={(e) => setTime({...time, s: Number(e.target.value)})} />
                      </div>
                    </div>
                  </div>
                )}

                {mode !== 'distance' && (
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Distance</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="number" value={dist} onChange={(e) => setDist(Number(e.target.value))} />
                      <Select value={distUnit} onValueChange={setDistUnit}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="km">Kilometers</SelectItem>
                          <SelectItem value="miles">Miles</SelectItem>
                          <SelectItem value="meters">Meters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {mode !== 'pace' && (
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Pace</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px]">Min</Label>
                        <Input type="number" value={pace.m} onChange={(e) => setPace({...pace, m: Number(e.target.value)})} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Sec</Label>
                        <Input type="number" value={pace.s} onChange={(e) => setPace({...pace, s: Number(e.target.value)})} />
                      </div>
                      <div className="pt-5">
                        <Select value={paceUnit} onValueChange={setPaceUnit}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="min/km">min/km</SelectItem>
                            <SelectItem value="min/mile">min/mile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-5">
              <Card className="bg-primary text-white h-full flex flex-col justify-center items-center p-8 text-center border-none shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-widest opacity-70">Result</CardTitle>
                </CardHeader>
                <CardContent>
                  {mode === 'pace' && standardResult && (
                    <div className="space-y-1">
                      <div className="text-6xl font-black font-headline">
                        {standardResult.m}:{String(standardResult.s).padStart(2, '0')}
                      </div>
                      <p className="text-lg opacity-80">{standardResult.unit}</p>
                    </div>
                  )}
                  {mode === 'time' && standardResult && (
                    <div className="text-5xl font-black font-headline">
                      {standardResult.h}h {standardResult.m}m {standardResult.s}s
                    </div>
                  )}
                  {mode === 'distance' && standardResult && (
                    <div className="space-y-1">
                      <div className="text-6xl font-black font-headline">{standardResult.dist}</div>
                      <p className="text-lg opacity-80">{standardResult.unit}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* 2. Multipoint Pace Calculator */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Multipoint Split Calculator</h3>
              <p className="text-sm text-muted-foreground">Log multiple splits to find your total time and average pace.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm uppercase font-black text-muted-foreground tracking-widest">Splits Log</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSplits([...splits, { id: Math.random().toString(), dist: 1, time: { m: 4, s: 0 } }])} className="gap-2">
                  <Plus size={14} /> Add Split
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[100px]">Split #</TableHead>
                      <TableHead>Dist (km/mi)</TableHead>
                      <TableHead>Time (Min:Sec)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {splits.map((split, idx) => (
                      <TableRow key={split.id}>
                        <TableCell className="font-bold text-muted-foreground">#{idx + 1}</TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            className="h-8 w-24" 
                            value={split.dist} 
                            onChange={(e) => setSplits(splits.map(s => s.id === split.id ? { ...s, dist: Number(e.target.value) } : s))}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number" 
                              className="h-8 w-16" 
                              value={split.time.m} 
                              onChange={(e) => setSplits(splits.map(s => s.id === split.id ? { ...s, time: { ...s.time, m: Number(e.target.value) } } : s))}
                            />
                            <span>:</span>
                            <Input 
                              type="number" 
                              className="h-8 w-16" 
                              value={split.time.s} 
                              onChange={(e) => setSplits(splits.map(s => s.id === split.id ? { ...s, time: { ...s.time, s: Number(e.target.value) } } : s))}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setSplits(splits.filter(s => s.id !== split.id))}>
                            <Trash2 size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-4">
              <Card className="bg-accent text-white border-none shadow-lg">
                <CardHeader className="pb-1"><CardTitle className="text-[10px] uppercase font-bold opacity-70">Average Pace</CardTitle></CardHeader>
                <CardContent className="text-center py-6">
                  <div className="text-5xl font-black font-headline">
                    {multipointResult?.m}:{String(multipointResult?.s).padStart(2, '0')}
                  </div>
                  <p className="text-xs mt-2 opacity-60">minutes per unit</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Total Distance</span>
                    <span className="font-bold">{multipointResult?.totalDist}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Time</span>
                    <span className="font-bold">{multipointResult?.totalTime}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* 3. Pace Converter */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <ArrowRightLeft size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Pace Converter</h3>
              <p className="text-sm text-muted-foreground">Convert between metric, imperial, and speed-based units.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-5">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Input Pace (Min:Sec)</Label>
                  <div className="flex items-center gap-3">
                    <Input type="number" value={convPace.m} onChange={(e) => setConvPace({...convPace, m: Number(e.target.value)})} />
                    <span>:</span>
                    <Input type="number" value={convPace.s} onChange={(e) => setConvPace({...convPace, s: Number(e.target.value)})} />
                    <Select value={convUnit} onValueChange={setConvPaceUnit}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="min/km">min/km</SelectItem>
                        <SelectItem value="min/mile">min/mile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {conversions.map((c) => (
                  <Card key={c.label} className="border-none shadow-sm bg-muted/30">
                    <CardHeader className="pb-1"><span className="text-[10px] uppercase font-bold text-muted-foreground">{c.label}</span></CardHeader>
                    <CardContent><div className="text-xl font-black text-primary">{c.value}</div></CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* 4. Finish Time Calculator */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent">
              <Flag size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Finish Time Predictor</h3>
              <p className="text-sm text-muted-foreground">Predict your race day results based on targeted pace.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-7">
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label>Race Distance</Label>
                  <Select value={finishDist} onValueChange={setFinishDist}>
                    <SelectTrigger><SelectValue placeholder="Select Distance" /></SelectTrigger>
                    <SelectContent>
                      {standardDistances.map(d => (
                        <SelectItem key={d.label} value={String(d.value)}>{d.label} ({d.value} {d.unit})</SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Distance...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expected Pace (Min:Sec)</Label>
                  <div className="flex items-center gap-3">
                    <Input type="number" value={finishPace.m} onChange={(e) => setFinishPace({...finishPace, m: Number(e.target.value)})} />
                    <span>:</span>
                    <Input type="number" value={finishPace.s} onChange={(e) => setFinishPace({...finishPace, s: Number(e.target.value)})} />
                    <Select value={finishPaceUnit} onValueChange={setFinishPaceUnit}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="min/km">min/km</SelectItem>
                        <SelectItem value="min/mile">min/mile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-5">
              <Card className="bg-primary text-white h-full flex flex-col justify-center items-center p-8 text-center border-none shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-widest opacity-70">Predicted Finish Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-6xl font-black font-headline">
                    {predictedFinish.h}h {predictedFinish.m}m {predictedFinish.s}s
                  </div>
                  <p className="text-xs mt-4 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                    Perfect for race day pacing strategy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Educational Content */}
        <div className="py-12 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Pace vs. Speed
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  While often used interchangeably, **speed** and **pace** provide different perspectives on movement. 
                  <strong>Speed</strong> (e.g., miles per hour) measures how much distance is covered in a fixed amount of time. 
                  <strong>Pace</strong> (e.g., minutes per mile) measures how much time it takes to cover a fixed distance.
                </p>
                <p>
                  For runners and swimmers, pace is the standard metric because it correlates directly with split times and finishing goals. For cyclists and drivers, speed is more common.
                </p>
                <h4 className="font-bold text-foreground">Common Pacing Units</h4>
                <ul className="space-y-2">
                  <li><strong>min/km:</strong> Standard for international road races.</li>
                  <li><strong>min/mile:</strong> Standard in the USA and UK for running.</li>
                  <li><strong>min/100m:</strong> Standard for swimming pool intervals.</li>
                </ul>
              </div>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Pacing Charts
              </h4>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="text-[10px] font-bold">Goal Finish</TableHead>
                      <TableHead className="text-[10px] font-bold text-right">Marathon Pace</TableHead>
                      <TableHead className="text-[10px] font-bold text-right">Half Pace</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[11px]">
                    <TableRow>
                      <TableCell>Sub 3:00 / 1:30</TableCell>
                      <TableCell className="text-right">6:52 min/mi</TableCell>
                      <TableCell className="text-right">6:52 min/mi</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sub 3:30 / 1:45</TableCell>
                      <TableCell className="text-right">8:01 min/mi</TableCell>
                      <TableCell className="text-right">8:01 min/mi</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sub 4:00 / 2:00</TableCell>
                      <TableCell className="text-right">9:09 min/mi</TableCell>
                      <TableCell className="text-right">9:09 min/mi</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                * Consistent pacing is key to achieving a "Negative Split" (running the second half faster than the first).
              </p>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-8 pb-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">How to Use These Tools</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our suite of pacing tools is built to support every phase of your training block:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <Card className="border-none bg-blue-50">
                  <CardContent className="pt-6">
                    <p className="font-bold text-blue-900 mb-1">Training</p>
                    <p className="text-xs text-blue-700">Use the <strong>Solver</strong> to figure out how fast you need to run your intervals based on your target race time.</p>
                  </CardContent>
                </Card>
                <Card className="border-none bg-green-50">
                  <CardContent className="pt-6">
                    <p className="font-bold text-green-900 mb-1">Analysis</p>
                    <p className="text-xs text-green-700">Use the <strong>Multipoint</strong> tool after a long run to see if you stayed consistent or faded in the final miles.</p>
                  </CardContent>
                </Card>
                <Card className="border-none bg-amber-50">
                  <CardContent className="pt-6">
                    <p className="font-bold text-amber-900 mb-1">Planning</p>
                    <p className="text-xs text-amber-700">Use the <strong>Finish Predictor</strong> to set realistic expectations for your next race based on current fitness levels.</p>
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