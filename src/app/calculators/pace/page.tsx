
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
  Activity,
  ChevronRight
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

const raceEvents = [
  { label: '400 meters', value: 400, unit: 'meters' },
  { label: '800 meters', value: 800, unit: 'meters' },
  { label: '1 Kilometer', value: 1, unit: 'km' },
  { label: '3 Kilometers', value: 3, unit: 'km' },
  { label: '5 Kilometers', value: 5, unit: 'km' },
  { label: '10 Kilometers', value: 10, unit: 'km' },
  { label: '15 Kilometers', value: 15, unit: 'km' },
  { label: '20 Kilometers', value: 20, unit: 'km' },
  { label: 'Half Marathon', value: 21.0975, unit: 'km' },
  { label: 'Marathon', value: 42.195, unit: 'km' },
  { label: '1 Mile', value: 1, unit: 'miles' },
  { label: '3 Miles', value: 3, unit: 'miles' },
  { label: '5 Miles', value: 5, unit: 'miles' },
  { label: '10 Miles', value: 10, unit: 'miles' },
];

type PaceMode = 'pace' | 'time' | 'distance';

interface TimeValue {
  h: number;
  m: number;
  s: number;
}

interface MultiSplit {
  id: string;
  dist: number;
  time: TimeValue;
}

export default function PaceCalculatorPage() {
  // Calculator 1: Standard Pace/Time/Distance
  const [mode, setMode] = useState<PaceMode>('pace');
  const [time, setTime] = useState<TimeValue>({ h: 0, m: 20, s: 0 });
  const [dist, setDist] = useState(5);
  const [distUnit, setDistUnit] = useState('km');
  const [pace, setPace] = useState<TimeValue>({ h: 0, m: 4, s: 0 });
  const [paceSpeed, setPaceSpeed] = useState(15); // for km/h etc
  const [paceUnit, setPaceUnit] = useState('per kilometer');

  const isSpeedUnit = (unit: string) => [
    'miles per hour', 
    'kilometers per hour', 
    'meters per minute', 
    'meters per second', 
    'yards per minute', 
    'yards per second'
  ].includes(unit);

  // Logic 1: Standard Solver
  const standardResult = useMemo(() => {
    const totalTimeSec = time.h * 3600 + time.m * 60 + time.s;
    
    // Constants
    const MILE_TO_KM = 1.609344;
    const YARD_TO_KM = 0.0009144;

    // Convert input distance to KM
    let inputDistInKm = dist;
    if (distUnit === 'miles') inputDistInKm = dist * MILE_TO_KM;
    else if (distUnit === 'meters') inputDistInKm = dist / 1000;
    else if (distUnit === 'yards') inputDistInKm = dist * YARD_TO_KM;

    let pacePerKmSec = 0;

    if (mode === 'pace') {
      if (inputDistInKm === 0) return null;
      pacePerKmSec = totalTimeSec / inputDistInKm;
    } else {
      // Get pace from input field
      if (isSpeedUnit(paceUnit)) {
        if (paceSpeed <= 0) return null;
        let speedKps = 0; // km per second
        if (paceUnit === 'miles per hour') speedKps = (paceSpeed * MILE_TO_KM) / 3600;
        else if (paceUnit === 'kilometers per hour') speedKps = paceSpeed / 3600;
        else if (paceUnit === 'meters per minute') speedKps = (paceSpeed / 1000) / 60;
        else if (paceUnit === 'meters per second') speedKps = paceSpeed / 1000;
        else if (paceUnit === 'yards per minute') speedKps = (paceSpeed * YARD_TO_KM) / 60;
        else if (paceUnit === 'yards per second') speedKps = paceSpeed * YARD_TO_KM;
        
        pacePerKmSec = 1 / speedKps;
      } else {
        const paceInputSec = pace.h * 3600 + pace.m * 60 + pace.s;
        if (paceUnit === 'per kilometer') pacePerKmSec = paceInputSec;
        else if (paceUnit === 'per mile') pacePerKmSec = paceInputSec / MILE_TO_KM;
      }
    }

    if (pacePerKmSec <= 0) return null;

    // Calculate solved values
    let solvedTimeSec = totalTimeSec;
    let solvedDistInKm = inputDistInKm;

    if (mode === 'time') {
      solvedTimeSec = inputDistInKm * pacePerKmSec;
    } else if (mode === 'distance') {
      solvedDistInKm = totalTimeSec / pacePerKmSec;
    }

    const pacePerMileSec = pacePerKmSec * MILE_TO_KM;

    const formatTime = (totalSeconds: number) => {
      const roundedSeconds = Math.round(totalSeconds);
      const h = Math.floor(roundedSeconds / 3600);
      const m = Math.floor((roundedSeconds % 3600) / 60);
      const s = roundedSeconds % 60;
      if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      return `${m}:${String(s).padStart(2, '0')}`;
    };

    const formatPaceLong = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = (seconds % 60).toFixed(2);
      return `${m} minutes and ${s} seconds`;
    };

    const diffUnits = [
      { label: 'per mile', value: formatPaceLong(pacePerMileSec) },
      { label: 'per kilometer', value: formatPaceLong(pacePerKmSec) },
      { label: 'miles/hour', value: (3600 / pacePerMileSec).toFixed(2) },
      { label: 'kilometers/hour', value: (3600 / pacePerKmSec).toFixed(2) },
      { label: 'meters/minute', value: (1000 / (pacePerKmSec / 60)).toFixed(0) },
      { label: 'meters/second', value: (1000 / pacePerKmSec).toFixed(2) },
    ];

    const raceTimes = raceEvents.map(event => {
      let dKm = event.value;
      if (event.unit === 'miles') dKm = event.value * MILE_TO_KM;
      else if (event.unit === 'meters') dKm = event.value / 1000;
      return {
        label: event.label,
        time: formatTime(dKm * pacePerKmSec)
      };
    });

    const getSplitsForUnit = (unitInKm: number, unitLabel: string, targetDistKm: number) => {
      const res = [];
      let i = 1;
      while (i * unitInKm < targetDistKm - 0.0001) {
        res.push({
          dist: `${i}${unitLabel}`,
          time: formatTime(i * unitInKm * pacePerKmSec)
        });
        i++;
      }
      // Add final distance
      const finalLabel = `${(targetDistKm / unitInKm).toFixed(2).replace(/\.00$/, '').replace(/\.0$/, '')}${unitLabel}`;
      res.push({
        dist: finalLabel,
        time: formatTime(targetDistKm * pacePerKmSec)
      });
      return res;
    };

    // Result object based on current unit settings for the primary display
    let primaryPaceM = 0;
    let primaryPaceS = 0;
    let primaryPaceH = 0;
    if (paceUnit === 'per kilometer' || mode === 'pace' && distUnit === 'km') {
      primaryPaceH = Math.floor(pacePerKmSec / 3600);
      primaryPaceM = Math.floor((pacePerKmSec % 3600) / 60);
      primaryPaceS = Math.floor(pacePerKmSec % 60);
    } else {
      primaryPaceH = Math.floor(pacePerMileSec / 3600);
      primaryPaceM = Math.floor((pacePerMileSec % 3600) / 60);
      primaryPaceS = Math.floor(pacePerMileSec % 60);
    }

    // Convert solved distance back to original unit
    let finalDist = solvedDistInKm;
    if (distUnit === 'miles') finalDist = solvedDistInKm / MILE_TO_KM;
    else if (distUnit === 'meters') finalDist = solvedDistInKm * 1000;
    else if (distUnit === 'yards') finalDist = solvedDistInKm / YARD_TO_KM;

    return { 
      pm: primaryPaceM, 
      ps: primaryPaceS,
      ph: primaryPaceH,
      h: Math.floor(solvedTimeSec / 3600),
      tm: Math.floor((solvedTimeSec % 3600) / 60),
      ts: Math.floor(solvedTimeSec % 60),
      dist: finalDist.toFixed(2),
      unit: distUnit,
      paceUnitLabel: paceUnit.replace('per ', ''),
      diffUnits,
      raceTimes,
      kmSplits: getSplitsForUnit(1, 'K', solvedDistInKm),
      mileSplits: getSplitsForUnit(MILE_TO_KM, ' Mile', solvedDistInKm)
    };
  }, [mode, time, dist, distUnit, pace, paceSpeed, paceUnit]);

  const handleEventSelect = (val: string) => {
    if (val === 'custom') return;
    const event = raceEvents.find(e => e.label === val);
    if (event) {
      setDist(event.value);
      setDistUnit(event.unit === 'meters' ? 'meters' : event.unit === 'miles' ? 'miles' : 'km');
    }
  };

  // Calculator 2: Multipoint Pace Calculator
  const [multiUnit, setMultiUnit] = useState('km');
  const [multiSplits, setMultiSplits] = useState<MultiSplit[]>([
    { id: '1', dist: 1, time: { h: 0, m: 4, s: 0 } },
    { id: '2', dist: 1, time: { h: 0, m: 4, s: 10 } },
  ]);

  const multipointResult = useMemo(() => {
    let totalD = 0;
    let totalS = 0;
    multiSplits.forEach(s => {
      totalD += s.dist;
      totalS += s.time.h * 3600 + s.time.m * 60 + s.time.s;
    });
    if (totalD === 0) return null;
    const avgPaceSec = totalS / totalD;
    return {
      m: Math.floor(avgPaceSec / 60),
      s: Math.floor(avgPaceSec % 60),
      totalDist: totalD.toFixed(2),
      totalTime: `${Math.floor(totalS / 3600)}h ${Math.floor((totalS % 3600) / 60)}m ${totalS % 60}s`
    };
  }, [multiSplits]);

  return (
    <CalculatorWrapper
      title="Pace Calculator"
      description="Calculate pace, time, or distance for running and cycling with precise split analysis."
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
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Event Preset</Label>
                  <Select onValueChange={handleEventSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- Or pick an event --" />
                    </SelectTrigger>
                    <SelectContent>
                      {raceEvents.map(e => (
                        <SelectItem key={e.label} value={e.label}>{e.label}</SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Distance...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {mode !== 'time' && (
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Time (hh:mm:ss)</Label>
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
                          <SelectItem value="yards">Yards</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {mode !== 'pace' && (
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Pace / Speed</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isSpeedUnit(paceUnit) ? (
                        <div className="space-y-1">
                          <Label className="text-[10px]">Value</Label>
                          <Input 
                            type="number" 
                            step="0.1" 
                            value={paceSpeed} 
                            onChange={(e) => setPaceSpeed(Number(e.target.value))} 
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px]">Hrs</Label>
                            <Input type="number" value={pace.h} onChange={(e) => setPace({...pace, h: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px]">Min</Label>
                            <Input type="number" value={pace.m} onChange={(e) => setPace({...pace, m: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px]">Sec</Label>
                            <Input type="number" value={pace.s} onChange={(e) => setPace({...pace, s: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}
                      <div className="pt-5">
                        <Select value={paceUnit} onValueChange={setPaceUnit}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="per kilometer">per kilometer</SelectItem>
                            <SelectItem value="per mile">per mile</SelectItem>
                            <SelectItem value="miles per hour">miles per hour</SelectItem>
                            <SelectItem value="kilometers per hour">kilometers per hour</SelectItem>
                            <SelectItem value="meters per minute">meters per minute</SelectItem>
                            <SelectItem value="meters per second">meters per second</SelectItem>
                            <SelectItem value="yards per minute">yards per minute</SelectItem>
                            <SelectItem value="yards per second">yards per second</SelectItem>
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
                  <CardTitle className="text-xs uppercase tracking-widest opacity-70">Primary Result</CardTitle>
                </CardHeader>
                <CardContent>
                  {!standardResult ? (
                    <p className="text-sm italic opacity-60">Enter data to see results</p>
                  ) : (
                    <>
                      {mode === 'pace' && (
                        <div className="space-y-1">
                          <div className="text-6xl font-black font-headline">
                            {standardResult.ph > 0 && `${standardResult.ph}:`}
                            {String(standardResult.pm).padStart(2, '0')}:
                            {String(standardResult.ps).padStart(2, '0')}
                          </div>
                          <p className="text-lg opacity-80">min/{standardResult.unit}</p>
                        </div>
                      )}
                      {mode === 'time' && (
                        <div className="space-y-1">
                          <div className="text-5xl font-black font-headline">
                            {standardResult.h > 0 && `${standardResult.h}h `}
                            {standardResult.tm}m {standardResult.ts}s
                          </div>
                          <p className="text-sm opacity-80">Total Duration</p>
                        </>
                      )}
                      {mode === 'distance' && (
                        <div className="space-y-1">
                          <div className="text-6xl font-black font-headline">{standardResult.dist}</div>
                          <p className="text-lg opacity-80">{standardResult.unit}</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {standardResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <Card className="border-none bg-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Pace in Different Units</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableBody>
                      {standardResult.diffUnits.map((u) => (
                        <TableRow key={u.label}>
                          <TableCell className="text-xs font-mono font-bold text-foreground">{u.value}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{u.label}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-none bg-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Popular Race Times</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2">
                    <div className="border-r">
                      <Table>
                        <TableBody>
                          {standardResult.raceTimes.slice(0, 6).map((rt) => (
                            <TableRow key={rt.label}>
                              <TableCell className="text-[10px] font-bold text-muted-foreground">{rt.label}</TableCell>
                              <TableCell className="text-xs font-mono font-bold text-right">{rt.time}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div>
                      <Table>
                        <TableBody>
                          {standardResult.raceTimes.slice(6, 12).map((rt) => (
                            <TableRow key={rt.label}>
                              <TableCell className="text-[10px] font-bold text-muted-foreground">{rt.label}</TableCell>
                              <TableCell className="text-xs font-mono font-bold text-right">{rt.time}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none bg-accent/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-accent">Kilometer Splits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {standardResult.kmSplits.map((s, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-lg border border-accent/10 shadow-sm text-center">
                          <p className="text-[10px] uppercase font-black text-muted-foreground mb-0.5">{s.dist}</p>
                          <p className="text-xs font-mono font-bold text-accent">{s.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Mile Splits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {standardResult.mileSplits.map((s, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-lg border border-primary/10 shadow-sm text-center">
                          <p className="text-[10px] uppercase font-black text-muted-foreground mb-0.5">{s.dist}</p>
                          <p className="text-xs font-mono font-bold text-primary">{s.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </section>

        <Separator />

        {/* 2. Multipoint Pace Calculator */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent">
              <Activity size={24} />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary">Multipoint Pace Calculator</h3>
                <p className="text-sm text-muted-foreground">Log multiple splits to find your total time and average pace.</p>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs font-bold whitespace-nowrap">Global Unit:</Label>
                <Select value={multiUnit} onValueChange={setMultiUnit}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">km</SelectItem>
                    <SelectItem value="miles">miles</SelectItem>
                    <SelectItem value="meters">meters</SelectItem>
                    <SelectItem value="yards">yards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm uppercase font-black text-muted-foreground tracking-widest">Splits Log</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setMultiSplits([...multiSplits, { id: Math.random().toString(), dist: 1, time: { h: 0, m: 4, s: 0 } }])} className="gap-2">
                  <Plus size={14} /> Add Split
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[100px]">Split #</TableHead>
                      <TableHead>Distance ({multiUnit})</TableHead>
                      <TableHead>Time (hh:mm:ss)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {multiSplits.map((split, idx) => (
                      <TableRow key={split.id}>
                        <TableCell className="font-bold text-muted-foreground">#{idx + 1}</TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            className="h-8 w-24" 
                            value={split.dist} 
                            onChange={(e) => setMultiSplits(multiSplits.map(s => s.id === split.id ? { ...s, dist: Number(e.target.value) } : s))}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Input 
                              type="number" 
                              className="h-8 w-14 p-1 text-center" 
                              value={split.time.h} 
                              onChange={(e) => setMultiSplits(multiSplits.map(s => s.id === split.id ? { ...s, time: { ...s.time, h: Number(e.target.value) } } : s))}
                            />
                            <span className="text-xs">:</span>
                            <Input 
                              type="number" 
                              className="h-8 w-14 p-1 text-center" 
                              value={split.time.m} 
                              onChange={(e) => setMultiSplits(multiSplits.map(s => s.id === split.id ? { ...s, time: { ...s.time, m: Number(e.target.value) } } : s))}
                            />
                            <span className="text-xs">:</span>
                            <Input 
                              type="number" 
                              className="h-8 w-14 p-1 text-center" 
                              value={split.time.s} 
                              onChange={(e) => setMultiSplits(multiSplits.map(s => s.id === split.id ? { ...s, time: { ...s.time, s: Number(e.target.value) } } : s))}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setMultiSplits(multiSplits.filter(s => s.id !== split.id))}>
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
                  <p className="text-xs mt-2 opacity-60">min/{multiUnit}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Total Distance</span>
                    <span className="font-bold">{multipointResult?.totalDist} {multiUnit}</span>
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

      </div>
    </CalculatorWrapper>
  );
}

