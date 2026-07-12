
"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Timer, 
  Plus, 
  Trash2, 
  ArrowRightLeft, 
  Info,
  Clock,
  Zap,
  Activity,
  ChevronRight,
  RefreshCw,
  Trophy
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  // 1. Standard Pace/Time/Distance
  const [mode, setMode] = useState<PaceMode>('pace');
  const [time, setTime] = useState<TimeValue>({ h: 0, m: 20, s: 0 });
  const [dist, setDist] = useState(5);
  const [distUnit, setDistUnit] = useState('km');
  
  // Single string pace for 'per mile' / 'per km'
  const [paceString, setPaceString] = useState('00:04:00');
  const [paceSpeed, setPaceSpeed] = useState(15); 
  const [paceUnit, setPaceUnit] = useState('per kilometer');

  const isSpeedUnit = (unit: string) => [
    'miles per hour', 
    'kilometers per hour', 
    'meters per minute', 
    'meters per second', 
    'yards per minute', 
    'yards per second'
  ].includes(unit);

  const parsePaceString = (str: string) => {
    const parts = str.split(':').map(p => Number(p.trim()));
    let h = 0, m = 0, s = 0;
    if (parts.length === 3) {
      [h, m, s] = parts;
    } else if (parts.length === 2) {
      [m, s] = parts;
    } else if (parts.length === 1) {
      [s] = parts;
    }
    return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
  };

  const formatTime = (totalSeconds: number) => {
    const roundedSeconds = Math.round(totalSeconds);
    const h = Math.floor(roundedSeconds / 3600);
    const m = Math.floor((roundedSeconds % 3600) / 60);
    const s = roundedSeconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const standardResult = useMemo(() => {
    const totalTimeSec = time.h * 3600 + time.m * 60 + time.s;
    const MILE_TO_KM = 1.609344;
    const YARD_TO_KM = 0.0009144;

    let inputDistInKm = dist;
    if (distUnit === 'miles') inputDistInKm = dist * MILE_TO_KM;
    else if (distUnit === 'meters') inputDistInKm = dist / 1000;
    else if (distUnit === 'yards') inputDistInKm = dist * YARD_TO_KM;

    let pacePerKmSec = 0;

    if (mode === 'pace') {
      if (inputDistInKm === 0) return null;
      pacePerKmSec = totalTimeSec / inputDistInKm;
    } else {
      if (isSpeedUnit(paceUnit)) {
        if (paceSpeed <= 0) return null;
        let speedKps = 0; 
        if (paceUnit === 'miles per hour') speedKps = (paceSpeed * MILE_TO_KM) / 3600;
        else if (paceUnit === 'kilometers per hour') speedKps = paceSpeed / 3600;
        else if (paceUnit === 'meters per minute') speedKps = (paceSpeed / 1000) / 60;
        else if (paceUnit === 'meters per second') speedKps = paceSpeed / 1000;
        else if (paceUnit === 'yards per minute') speedKps = (paceSpeed * YARD_TO_KM) / 60;
        else if (paceUnit === 'yards per second') speedKps = paceSpeed * YARD_TO_KM;
        pacePerKmSec = 1 / speedKps;
      } else {
        const paceInputSec = parsePaceString(paceString);
        if (paceUnit === 'per kilometer') pacePerKmSec = paceInputSec;
        else if (paceUnit === 'per mile') pacePerKmSec = paceInputSec / MILE_TO_KM;
      }
    }

    if (pacePerKmSec <= 0) return null;

    let solvedTimeSec = totalTimeSec;
    let solvedDistInKm = inputDistInKm;

    if (mode === 'time') solvedTimeSec = inputDistInKm * pacePerKmSec;
    else if (mode === 'distance') solvedDistInKm = totalTimeSec / pacePerKmSec;

    const pacePerMileSec = pacePerKmSec * MILE_TO_KM;

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

    const getSplitsForUnit = (unitInKm: number, unitLabel: string, targetDistKm: number) => {
      const res = [];
      let i = 1;
      // We go up to the target distance. If the target is exactly a whole unit, don't duplicate.
      while (i * unitInKm < targetDistKm - 0.001) {
        res.push({ dist: `${i}${unitLabel}`, time: formatTime(i * unitInKm * pacePerKmSec) });
        i++;
      }
      // Add the final split for the exact distance
      const finalValLabel = (targetDistKm / unitInKm).toFixed(2).replace(/\.00$/, '').replace(/\.0$/, '');
      res.push({ dist: `${finalValLabel}${unitLabel}`, time: formatTime(targetDistKm * pacePerKmSec) });
      return res;
    };

    return { 
      ph: Math.floor(pacePerKmSec / 3600), pm: Math.floor((pacePerKmSec % 3600) / 60), ps: Math.floor(pacePerKmSec % 60),
      pm_mi: Math.floor(pacePerMileSec / 3600), pmm_mi: Math.floor((pacePerMileSec % 3600) / 60), pms_mi: Math.floor(pacePerMileSec % 60),
      h: Math.floor(solvedTimeSec / 3600), tm: Math.floor((solvedTimeSec % 3600) / 60), ts: Math.floor(solvedTimeSec % 60),
      dist: solvedDistInKm,
      allDistances: {
        km: solvedDistInKm.toFixed(2),
        miles: (solvedDistInKm / MILE_TO_KM).toFixed(2),
        meters: (solvedDistInKm * 1000).toFixed(0),
        yards: (solvedDistInKm / YARD_TO_KM).toFixed(0)
      },
      diffUnits,
      kmSplits: getSplitsForUnit(1, 'K', solvedDistInKm),
      mileSplits: getSplitsForUnit(MILE_TO_KM, ' Mile', solvedDistInKm)
    };
  }, [mode, time, dist, distUnit, paceString, paceSpeed, paceUnit]);

  // 2. Multipoint Pace
  const [multiUnit, setMultiUnit] = useState('km');
  const [multiSplits, setMultiSplits] = useState<MultiSplit[]>([
    { id: '1', dist: 1, time: { h: 0, m: 4, s: 0 } },
    { id: '2', dist: 1, time: { h: 0, m: 4, s: 10 } },
  ]);

  const multipointResult = useMemo(() => {
    let totalD = 0, totalS = 0;
    multiSplits.forEach(s => {
      totalD += s.dist;
      totalS += s.time.h * 3600 + s.time.m * 60 + s.time.s;
    });
    if (totalD === 0) return null;
    const avgPaceSec = totalS / totalD;
    return {
      m: Math.floor(avgPaceSec / 60), s: Math.floor(avgPaceSec % 60),
      totalDist: totalD.toFixed(2),
      totalTime: formatTime(totalS)
    };
  }, [multiSplits]);

  // 3. Standalone Pace Converter
  const [convPace, setConvPace] = useState<TimeValue>({ h: 0, m: 5, s: 0 });
  const [convUnit, setConvUnit] = useState('per mile');
  const convResults = useMemo(() => {
    const MILE_TO_KM = 1.609344;
    const totalS = convPace.h * 3600 + convPace.m * 60 + convPace.s;
    if (totalS === 0) return null;
    const pk = convUnit === 'per kilometer' ? totalS : totalS / MILE_TO_KM;
    const pm = pk * MILE_TO_KM;
    return [
      { label: 'per mile', value: formatTime(pm) },
      { label: 'per kilometer', value: formatTime(pk) },
      { label: 'mph', value: (3600 / pm).toFixed(2) },
      { label: 'kph', value: (3600 / pk).toFixed(2) },
    ];
  }, [convPace, convUnit]);

  // 4. Standalone Finish Time Predictor
  const [finishPace, setFinishPace] = useState<TimeValue>({ h: 0, m: 4, s: 30 });
  const [finishUnit, setFinishUnit] = useState('per kilometer');
  const finishResults = useMemo(() => {
    const MILE_TO_KM = 1.609344;
    const totalS = finishPace.h * 3600 + finishPace.m * 60 + finishPace.s;
    if (totalS === 0) return null;
    const pk = finishUnit === 'per kilometer' ? totalS : totalS / MILE_TO_KM;
    return raceEvents.map(e => {
      let dKm = e.value;
      if (e.unit === 'miles') dKm *= MILE_TO_KM;
      else if (e.unit === 'meters') dKm /= 1000;
      return { label: e.label, time: formatTime(dKm * pk) };
    });
  }, [finishPace, finishUnit]);

  return (
    <CalculatorWrapper
      title="Pace Calculator"
      description="Advanced toolkit for runners and cyclists to solve pace, analyze splits, convert units, and predict finish times."
      icon={Timer}
    >
      <div className="space-y-16">
        
        {/* 1. Main Solver */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><Zap size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Pace, Time & Distance Solver</h3>
              <p className="text-sm text-muted-foreground">Find any value based on the other two.</p>
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
                  <Select onValueChange={(v) => {
                    const e = raceEvents.find(x => x.label === v);
                    if (e) { setDist(e.value); setDistUnit(e.unit === 'meters' ? 'meters' : e.unit === 'miles' ? 'miles' : 'km'); }
                  }}>
                    <SelectTrigger><SelectValue placeholder="-- Or pick an event --" /></SelectTrigger>
                    <SelectContent>
                      {raceEvents.map(e => <SelectItem key={e.label} value={e.label}>{e.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {mode !== 'time' && (
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Time (hh:mm:ss)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Input type="number" placeholder="Hr" value={time.h} onChange={e => setTime({...time, h: Number(e.target.value)})} />
                      <Input type="number" placeholder="Min" value={time.m} onChange={e => setTime({...time, m: Number(e.target.value)})} />
                      <Input type="number" placeholder="Sec" value={time.s} onChange={e => setTime({...time, s: Number(e.target.value)})} />
                    </div>
                  </div>
                )}

                {mode !== 'distance' && (
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Distance</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="number" value={dist} onChange={e => setDist(Number(e.target.value))} />
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
                        <Input 
                          type="number" 
                          step="0.1" 
                          value={paceSpeed} 
                          onChange={e => setPaceSpeed(Number(e.target.value))} 
                          placeholder="Speed value"
                        />
                      ) : (
                        <Input 
                          type="text" 
                          value={paceString} 
                          onChange={e => setPaceString(e.target.value)} 
                          placeholder="hh:mm:ss"
                        />
                      )}
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
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-5">
              <Card className="bg-primary text-white h-full flex flex-col justify-center items-center p-8 text-center border-none shadow-xl">
                <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest opacity-70">Primary Result</CardTitle></CardHeader>
                <CardContent className="w-full">
                  {!standardResult ? <p className="italic opacity-60">Enter data to see results</p> : (
                    <>
                      {mode === 'pace' && (
                        <div className="space-y-1">
                          <div className="text-6xl font-black font-headline">
                            {standardResult.ph > 0 && `${standardResult.ph}:`}{String(standardResult.pm).padStart(2, '0')}:{String(standardResult.ps).padStart(2, '0')}
                          </div>
                          <p className="text-lg opacity-80">min/{distUnit}</p>
                        </div>
                      )}
                      {mode === 'time' && (
                        <div className="space-y-1">
                          <div className="text-5xl font-black font-headline">
                            {standardResult.h > 0 && `${standardResult.h}h `}{standardResult.tm}m {standardResult.ts}s
                          </div>
                          <p className="text-sm opacity-80">Total Duration</p>
                        </div>
                      )}
                      {mode === 'distance' && (
                        <div className="space-y-4">
                          <div className="text-5xl md:text-6xl font-black font-headline">
                            {standardResult.allDistances[distUnit as keyof typeof standardResult.allDistances] || standardResult.dist}
                            <span className="text-2xl ml-2 opacity-70">{distUnit}</span>
                          </div>
                          <Separator className="bg-white/20" />
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-medium opacity-90 text-left">
                            {distUnit !== 'km' && <div>{standardResult.allDistances.km} km</div>}
                            {distUnit !== 'miles' && <div>{standardResult.allDistances.miles} miles</div>}
                            {distUnit !== 'meters' && <div>{standardResult.allDistances.meters} meters</div>}
                            {distUnit !== 'yards' && <div>{standardResult.allDistances.yards} yards</div>}
                          </div>
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
              {mode !== 'distance' && (
                <Card className="border-none bg-muted/20">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Pace in Different Units</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableBody>
                        {standardResult.diffUnits.map(u => (
                          <TableRow key={u.label}>
                            <TableCell className="text-xs font-mono font-bold">{u.value}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{u.label}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              <div className={mode === 'distance' ? 'md:col-span-2' : ''}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-none bg-accent/5">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-wider text-accent">Kilometer Splits</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                      {standardResult.kmSplits.slice(0, 16).map((s, i) => (
                        <div key={i} className="bg-white p-2 rounded-lg border text-center">
                          <p className="text-[10px] font-black text-muted-foreground">{s.dist}</p>
                          <p className="text-xs font-mono font-bold text-accent">{s.time}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="border-none bg-primary/5">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Mile Splits</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                      {standardResult.mileSplits.slice(0, 16).map((s, i) => (
                        <div key={i} className="bg-white p-2 rounded-lg border text-center">
                          <p className="text-[10px] font-black text-muted-foreground">{s.dist}</p>
                          <p className="text-xs font-mono font-bold text-primary">{s.time}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </section>

        <Separator />

        {/* 2. Multipoint Pace */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Activity size={24} /></div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary">Multipoint Pace Calculator</h3>
                <p className="text-sm text-muted-foreground">Average pace across varying splits.</p>
              </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8">
              <CardHeader className="flex justify-between flex-row">
                <CardTitle className="text-sm uppercase font-black text-muted-foreground">Splits Log</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setMultiSplits([...multiSplits, { id: Math.random().toString(), dist: 1, time: { h: 0, m: 4, s: 0 } }])}>
                  <Plus size={14} className="mr-2" /> Add Split
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead>Split</TableHead><TableHead>Dist ({multiUnit})</TableHead><TableHead>Time (hh:mm:ss)</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {multiSplits.map((s, i) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-bold">#{i+1}</TableCell>
                        <TableCell><Input type="number" className="w-20" value={s.dist} onChange={e => setMultiSplits(multiSplits.map(x => x.id === s.id ? {...x, dist: Number(e.target.value)} : x))} /></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Input className="w-12 p-1 text-center" value={s.time.h} onChange={e => setMultiSplits(multiSplits.map(x => x.id === s.id ? {...x, time: {...x.time, h: Number(e.target.value)}} : x))} />
                            <Input className="w-12 p-1 text-center" value={s.time.m} onChange={e => setMultiSplits(multiSplits.map(x => x.id === s.id ? {...x, time: {...x.time, m: Number(e.target.value)}} : x))} />
                            <Input className="w-12 p-1 text-center" value={s.time.s} onChange={e => setMultiSplits(multiSplits.map(x => x.id === s.id ? {...x, time: {...x.time, s: Number(e.target.value)}} : x))} />
                          </div>
                        </TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => setMultiSplits(multiSplits.filter(x => x.id !== s.id))}><Trash2 size={14} /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <div className="lg:col-span-4 space-y-4">
              <Card className="bg-accent text-white border-none shadow-lg text-center p-6">
                <p className="text-[10px] uppercase font-bold opacity-70 mb-2">Average Pace</p>
                <div className="text-5xl font-black font-headline">{multipointResult?.m}:{String(multipointResult?.s).padStart(2, '0')}</div>
                <p className="text-xs opacity-60">min/{multiUnit}</p>
              </Card>
              <Card><CardContent className="pt-6 space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span>Total Distance</span><span className="font-bold">{multipointResult?.totalDist} {multiUnit}</span></div>
                <div className="flex justify-between"><span>Total Time</span><span className="font-bold">{multipointResult?.totalTime}</span></div>
              </CardContent></Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* 3. Pace Converter */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><RefreshCw size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Pace Converter</h3>
              <p className="text-sm text-muted-foreground">Convert between pace and speed standards.</p>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase">Input Pace (hh:mm:ss)</Label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="H" value={convPace.h} onChange={e => setConvPace({...convPace, h: Number(e.target.value)})} />
                  <Input type="number" placeholder="M" value={convPace.m} onChange={e => setConvPace({...convPace, m: Number(e.target.value)})} />
                  <Input type="number" placeholder="S" value={convPace.s} onChange={e => setConvPace({...convPace, s: Number(e.target.value)})} />
                  <Select value={convUnit} onValueChange={setConvUnit}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per mile">per mile</SelectItem>
                      <SelectItem value="per kilometer">per kilometer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {convResults?.map(r => (
                  <div key={r.label} className="bg-muted/30 p-3 rounded-lg text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{r.label}</p>
                    <p className="text-xl font-bold text-primary">{r.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 4. Finish Time Predictor */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Trophy size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Finish Time Predictor</h3>
              <p className="text-sm text-muted-foreground">Estimated times for major race distances.</p>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-8 max-w-xl">
                <Label className="text-sm font-bold whitespace-nowrap">Your Pace:</Label>
                <div className="flex gap-2 w-full">
                  <Input type="number" placeholder="H" value={finishPace.h} onChange={e => setFinishPace({...finishPace, h: Number(e.target.value)})} />
                  <Input type="number" placeholder="M" value={finishPace.m} onChange={e => setFinishPace({...finishPace, m: Number(e.target.value)})} />
                  <Input type="number" placeholder="S" value={finishPace.s} onChange={e => setFinishPace({...finishPace, s: Number(e.target.value)})} />
                  <Select value={finishUnit} onValueChange={setFinishUnit}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per kilometer">per kilometer</SelectItem>
                      <SelectItem value="per mile">per mile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {finishResults?.map(fr => (
                  <div key={fr.label} className="border p-3 rounded-xl hover:border-primary transition-colors">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">{fr.label}</p>
                    <p className="text-lg font-bold text-primary">{fr.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </CalculatorWrapper>
  );
}
