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
  Trophy,
  TrendingUp,
  LineChart as LineChartIcon
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
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer 
} from 'recharts';

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
  const MILE_TO_KM = 1.609344;
  const YARD_TO_KM = 0.0009144;

  const isSpeedUnit = (unit: string) => [
    'miles per hour', 
    'kilometers per hour', 
    'meters per minute', 
    'meters per second', 
    'yards per minute', 
    'yards per second'
  ].includes(unit);

  const formatTime = (totalSeconds: number) => {
    const roundedSeconds = Math.round(totalSeconds);
    const h = Math.floor(roundedSeconds / 3600);
    const m = Math.floor((roundedSeconds % 3600) / 60);
    const s = roundedSeconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const formatPaceLong = (secondsInput: number) => {
    let total = Math.round(secondsInput * 100) / 100;
    
    let h = Math.floor(total / 3600);
    total %= 3600;
    let m = Math.floor(total / 60);
    let s = Math.round(total % 60);

    if (s >= 60) {
      s -= 60;
      m += 1;
    }
    if (m >= 60) {
      m -= 60;
      h += 1;
    }
    
    const parts = [];
    if (h > 0) parts.push(`${h} hour${h !== 1 ? 's' : ''}`);
    if (m > 0) parts.push(`${m} minute${m !== 1 ? 's' : ''}`);
    if (s > 0 || parts.length === 0) {
      parts.push(`${s} second${s !== 1 ? 's' : ''}`);
    }
    
    if (parts.length === 1) return parts[0];
    const last = parts.pop();
    return parts.join(', ') + ' and ' + last;
  };

  // Utility to convert distance/time to preferred unit string
  const calculatePaceInUnit = (distKm: number, timeSec: number, unit: string) => {
    if (distKm <= 0 || timeSec <= 0) return "0";
    
    if (isSpeedUnit(unit)) {
      let speed = 0;
      if (unit === 'miles per hour') speed = (distKm / MILE_TO_KM) / (timeSec / 3600);
      else if (unit === 'kilometers per hour') speed = distKm / (timeSec / 3600);
      else if (unit === 'meters per minute') speed = (distKm * 1000) / (timeSec / 60);
      else if (unit === 'meters per second') speed = (distKm * 1000) / timeSec;
      else if (unit === 'yards per minute') speed = (distKm / YARD_TO_KM) / (timeSec / 60);
      else if (unit === 'yards per second') speed = (distKm / YARD_TO_KM) / timeSec;
      return speed.toFixed(2);
    } else {
      let paceSec = 0;
      if (unit === 'per kilometer') paceSec = timeSec / distKm;
      else if (unit === 'per mile') paceSec = timeSec / (distKm / MILE_TO_KM);
      return formatTime(paceSec);
    }
  };

  // 1. Solver States
  const [mode, setMode] = useState<PaceMode>('pace');
  const [time, setTime] = useState<TimeValue>({ h: 0, m: 20, s: 0 });
  const [dist, setDist] = useState(5);
  const [distUnit, setDistUnit] = useState('km');
  const [paceTime, setPaceTime] = useState<TimeValue>({ h: 0, m: 4, s: 0 });
  const [speedInputValue, setSpeedInputValue] = useState('15');
  const [paceUnit, setPaceUnit] = useState('per kilometer');

  const standardResult = useMemo(() => {
    const totalTimeSec = time.h * 3600 + time.m * 60 + time.s;
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
        const speedVal = parseFloat(speedInputValue);
        if (isNaN(speedVal) || speedVal <= 0) return null;
        let speedKps = 0; 
        if (paceUnit === 'miles per hour') speedKps = (speedVal * MILE_TO_KM) / 3600;
        else if (paceUnit === 'kilometers per hour') speedKps = speedVal / 3600;
        else if (paceUnit === 'meters per minute') speedKps = (speedVal / 1000) / 60;
        else if (paceUnit === 'meters per second') speedKps = speedVal / 1000;
        else if (paceUnit === 'yards per minute') speedKps = (speedVal * YARD_TO_KM) / 60;
        else if (paceUnit === 'yards per second') speedKps = speedVal * YARD_TO_KM;
        pacePerKmSec = 1 / speedKps;
      } else {
        const totalPaceInputSec = paceTime.h * 3600 + paceTime.m * 60 + paceTime.s;
        if (totalPaceInputSec <= 0) return null;
        if (paceUnit === 'per kilometer') pacePerKmSec = totalPaceInputSec;
        else if (paceUnit === 'per mile') pacePerKmSec = totalPaceInputSec / MILE_TO_KM;
      }
    }

    if (pacePerKmSec <= 0) return null;

    let solvedTimeSec = totalTimeSec;
    let solvedDistInKm = inputDistInKm;

    if (mode === 'time') solvedTimeSec = inputDistInKm * pacePerKmSec;
    else if (mode === 'distance') solvedDistInKm = totalTimeSec / pacePerKmSec;

    const pacePerMileSec = pacePerKmSec * MILE_TO_KM;

    const getSplitsForUnit = (unitInKm: number, unitLabel: string, targetDistKm: number) => {
      const res = [];
      let i = 1;
      while (i * unitInKm < targetDistKm - 0.001) {
        res.push({ dist: `${i}${unitLabel}`, time: formatTime(i * unitInKm * pacePerKmSec) });
        i++;
      }
      
      const roundedFinish = (targetDistKm / unitInKm).toFixed(2).replace(/\.00$/, '');
      const lastLabel = `${roundedFinish}${unitLabel}`;
      const prevLabel = res.length > 0 ? res[res.length - 1].dist : '';
      
      if (lastLabel !== prevLabel) {
        res.push({ dist: lastLabel, time: formatTime(targetDistKm * pacePerKmSec) });
      }
      
      return res;
    };

    return { 
      ph: Math.floor(pacePerKmSec / 3600), pm: Math.floor((pacePerKmSec % 3600) / 60), ps: Math.round(pacePerKmSec % 60),
      h: Math.floor(solvedTimeSec / 3600), tm: Math.floor((solvedTimeSec % 3600) / 60), ts: Math.round(solvedTimeSec % 60),
      dist: solvedDistInKm,
      allDistances: {
        km: solvedDistInKm.toFixed(2),
        miles: (solvedDistInKm / MILE_TO_KM).toFixed(2),
        meters: (solvedDistInKm * 1000).toFixed(0),
        yards: (solvedDistInKm / YARD_TO_KM).toFixed(0)
      },
      diffUnits: [
        { label: 'per mile', value: formatPaceLong(pacePerMileSec) },
        { label: 'per kilometer', value: formatPaceLong(pacePerKmSec) },
        { label: 'miles/hour', value: (3600 / pacePerMileSec).toFixed(2) },
        { label: 'kilometers/hour', value: (3600 / pacePerKmSec).toFixed(2) },
        { label: 'meters/minute', value: (1000 / (pacePerKmSec / 60)).toFixed(0) },
        { label: 'meters/second', value: (1000 / pacePerKmSec).toFixed(2) },
        { label: 'yards/minute', value: (1 / (pacePerKmSec * YARD_TO_KM / 60)).toFixed(0) },
        { label: 'yards/second', value: (1 / (pacePerKmSec * YARD_TO_KM)).toFixed(2) },
      ],
      predictions: raceEvents.map(e => {
        let dKm = e.value;
        if (e.unit === 'miles') dKm *= MILE_TO_KM;
        else if (e.unit === 'meters') dKm /= 1000;
        return { label: e.label, time: formatTime(dKm * pacePerKmSec) };
      }),
      kmSplits: getSplitsForUnit(1, 'K', solvedDistInKm),
      mileSplits: getSplitsForUnit(MILE_TO_KM, ' Mile', solvedDistInKm)
    };
  }, [mode, time, dist, distUnit, paceTime, speedInputValue, paceUnit]);

  // 2. Multipoint States
  const [multiUnit, setMultiUnit] = useState('km');
  const [preferredResultUnit, setPreferredResultUnit] = useState('miles per hour');
  const [multiSplits, setMultiSplits] = useState<MultiSplit[]>([
    { id: '1', dist: 1, time: { h: 0, m: 3, s: 25 } },
    { id: '2', dist: 2, time: { h: 0, m: 6, s: 55 } },
    { id: '3', dist: 3, time: { h: 0, m: 10, s: 25 } },
    { id: '4', dist: 4, time: { h: 0, m: 14, s: 1 } },
  ]);

  const multipointResult = useMemo(() => {
    if (multiSplits.length === 0) return null;
    
    const toKm = (val: number) => {
      if (multiUnit === 'miles') return val * MILE_TO_KM;
      if (multiUnit === 'meters') return val / 1000;
      if (multiUnit === 'yards') return val * YARD_TO_KM;
      return val;
    };

    const tableData = [];
    let prevDistKm = 0;
    let prevTimeSec = 0;

    for (let i = 0; i < multiSplits.length; i++) {
      const current = multiSplits[i];
      const currentDistKm = toKm(current.dist);
      const currentTimeSec = current.time.h * 3600 + current.time.m * 60 + current.time.s;

      const sectionDistKm = Math.max(0, currentDistKm - prevDistKm);
      const sectionTimeSec = Math.max(0, currentTimeSec - prevTimeSec);

      const sectionPace = calculatePaceInUnit(sectionDistKm, sectionTimeSec, preferredResultUnit);
      const accumulatedPace = calculatePaceInUnit(currentDistKm, currentTimeSec, preferredResultUnit);

      tableData.push({
        marker: i + 1,
        sectionDist: sectionDistKm,
        sectionTime: formatTime(sectionTimeSec),
        sectionPace,
        accumulatedPace,
        chartVal: parseFloat(sectionPace) || 0
      });

      prevDistKm = currentDistKm;
      prevTimeSec = currentTimeSec;
    }

    const lastRow = tableData[tableData.length - 1];
    return {
      tableData,
      averagePace: lastRow.accumulatedPace
    };
  }, [multiSplits, multiUnit, preferredResultUnit]);

  // 3. Converter States
  const [convPace, setConvPace] = useState<TimeValue>({ h: 0, m: 5, s: 0 });
  const [convSpeed, setConvSpeed] = useState('12');
  const [convUnit, setConvUnit] = useState('per mile');

  const convResults = useMemo(() => {
    let pacePerKmSec = 0;
    if (isSpeedUnit(convUnit)) {
      const speedVal = parseFloat(convSpeed);
      if (isNaN(speedVal) || speedVal <= 0) return null;
      let speedKps = 0; 
      if (convUnit === 'miles per hour') speedKps = (speedVal * MILE_TO_KM) / 3600;
      else if (convUnit === 'kilometers per hour') speedKps = speedVal / 3600;
      else if (convUnit === 'meters per minute') speedKps = (speedVal / 1000) / 60;
      else if (convUnit === 'meters per second') speedKps = speedVal / 1000;
      else if (convUnit === 'yards per minute') speedKps = (speedVal * YARD_TO_KM) / 60;
      else if (convUnit === 'yards per second') speedKps = speedVal * YARD_TO_KM;
      pacePerKmSec = 1 / speedKps;
    } else {
      const totalS = convPace.h * 3600 + convPace.m * 60 + convPace.s;
      if (totalS <= 0) return null;
      if (convUnit === 'per kilometer') pacePerKmSec = totalS;
      else if (convUnit === 'per mile') pacePerKmSec = totalS / MILE_TO_KM;
    }
    const pacePerMileSec = pacePerKmSec * MILE_TO_KM;
    return [
      { label: 'per mile', value: formatPaceLong(pacePerMileSec) },
      { label: 'per kilometer', value: formatPaceLong(pacePerKmSec) },
      { label: 'miles/hour', value: (3600 / pacePerMileSec).toFixed(2) },
      { label: 'kilometers/hour', value: (3600 / pacePerKmSec).toFixed(2) },
      { label: 'meters/minute', value: (1000 / (pacePerKmSec / 60)).toFixed(0) },
      { label: 'meters/second', value: (1000 / pacePerKmSec).toFixed(2) },
      { label: 'yards/minute', value: (1 / (pacePerKmSec * YARD_TO_KM / 60)).toFixed(0) },
      { label: 'yards/second', value: (1 / (pacePerKmSec * YARD_TO_KM)).toFixed(2) },
    ];
  }, [convPace, convSpeed, convUnit]);

  // 4. Predictor States
  const [predCurrentDist, setPredCurrentDist] = useState(1);
  const [predCurrentUnit, setPredCurrentUnit] = useState('miles');
  const [predElapsedTime, setPredElapsedTime] = useState<TimeValue>({ h: 0, m: 6, s: 15 });
  const [predFullDist, setPredFullDist] = useState(5);
  const [predFullUnit, setPredFullUnit] = useState('miles');

  const finishResults = useMemo(() => {
    const totalElapsedSec = predElapsedTime.h * 3600 + predElapsedTime.m * 60 + predElapsedTime.s;
    if (totalElapsedSec <= 0 || predCurrentDist <= 0 || predFullDist <= 0) return null;
    const toKm = (val: number, unit: string) => {
      if (unit === 'miles') return val * MILE_TO_KM;
      if (unit === 'meters') return val / 1000;
      if (unit === 'yards') return val * YARD_TO_KM;
      return val;
    };
    const currentKm = toKm(predCurrentDist, predCurrentUnit);
    const fullKm = toKm(predFullDist, predFullUnit);
    const pacePerKmSec = totalElapsedSec / currentKm;
    const totalFinishTimeSec = pacePerKmSec * fullKm;
    return {
      finishTime: formatPaceLong(totalFinishTimeSec),
      units: [
        { label: 'Per Mile', value: formatPaceLong(pacePerKmSec * MILE_TO_KM) },
        { label: 'Per Kilometer', value: formatPaceLong(pacePerKmSec) },
        { label: 'Miles Per Hour', value: (3600 / (pacePerKmSec * MILE_TO_KM)).toFixed(1) },
        { label: 'Kilometers Per Hour', value: (3600 / pacePerKmSec).toFixed(2) },
        { label: 'Meters Per Minute', value: (1000 / (pacePerKmSec / 60)).toFixed(1) },
        { label: 'Meters Per Second', value: (1000 / pacePerKmSec).toFixed(2) },
        { label: 'Yards Per Minute', value: (1 / (pacePerKmSec * YARD_TO_KM / 60)).toFixed(1) },
        { label: 'Yards Per Second', value: (1 / (pacePerKmSec * YARD_TO_KM)).toFixed(2) },
      ]
    };
  }, [predCurrentDist, predCurrentUnit, predElapsedTime, predFullDist, predFullUnit]);

  return (
    <CalculatorWrapper
      title="Pace Calculator"
      description="Advanced performance analysis for athletes. Calculate pace, time, distance, and predicted race results."
      icon={Timer}
    >
      <div className="space-y-16">
        
        {/* 1. Solver Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><Zap size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Pace, Time & Distance Solver</h3>
              <p className="text-sm text-muted-foreground">Solve any parameter by entering the other two.</p>
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
                    <div className="space-y-3">
                      {(!isSpeedUnit(paceUnit)) ? (
                        <div className="grid grid-cols-3 gap-3">
                          <Input type="number" placeholder="Hr" value={paceTime.h} onChange={e => setPaceTime({...paceTime, h: Number(e.target.value)})} />
                          <Input type="number" placeholder="Min" value={paceTime.m} onChange={e => setPaceTime({...paceTime, m: Number(e.target.value)})} />
                          <Input type="number" placeholder="Sec" value={paceTime.s} onChange={e => setPaceTime({...paceTime, s: Number(e.target.value)})} />
                        </div>
                      ) : (
                        <Input type="number" value={speedInputValue} onChange={e => setSpeedInputValue(e.target.value)} />
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
                        <div className="space-y-4 text-left">
                          <div className="text-center mb-4">
                            <div className="text-5xl font-black font-headline mb-1">{standardResult.dist.toFixed(2)}</div>
                            <p className="text-xs opacity-70 uppercase font-bold tracking-widest">Kilometers Calculated</p>
                          </div>
                          <Separator className="bg-white/20" />
                          <div className="grid grid-cols-2 gap-y-3 pt-2">
                            <div><p className="text-[10px] opacity-60 uppercase font-bold">Miles</p><p className="text-lg font-bold">{standardResult.allDistances.miles}</p></div>
                            <div><p className="text-[10px] opacity-60 uppercase font-bold">Kilometers</p><p className="text-lg font-bold">{standardResult.allDistances.km}</p></div>
                            <div><p className="text-[10px] opacity-60 uppercase font-bold">Meters</p><p className="text-lg font-bold">{standardResult.allDistances.meters}</p></div>
                            <div><p className="text-[10px] opacity-60 uppercase font-bold">Yards</p><p className="text-lg font-bold">{standardResult.allDistances.yards}</p></div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          {standardResult && mode !== 'distance' && (
            <div className="space-y-8 pt-4">
              <Card className="border-none bg-muted/20">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Pace in Different Units</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table><TableBody>
                      {standardResult.diffUnits.map(u => (
                        <TableRow key={u.label}>
                          <TableCell className="text-xs font-mono font-bold">{u.value}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{u.label}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody></Table>
                </CardContent>
              </Card>
              <Card><CardHeader><CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Popular Race Distances</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {standardResult.predictions.map(p => (
                    <div key={p.label} className="p-3 border rounded-xl hover:border-primary transition-colors">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">{p.label}</p>
                      <p className="text-lg font-bold text-primary font-mono">{p.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none bg-accent/5"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-wider text-accent">Kilometer Splits</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2">
                    {standardResult.kmSplits.map((s, i) => (
                      <div key={i} className="bg-white p-2 rounded-lg border text-center">
                        <p className="text-[10px] font-black text-muted-foreground">{s.dist}</p>
                        <p className="text-xs font-mono font-bold text-accent">{s.time}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-none bg-primary/5"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Mile Splits</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2">
                    {standardResult.mileSplits.map((s, i) => (
                      <div key={i} className="bg-white p-2 rounded-lg border text-center">
                        <p className="text-[10px] font-black text-muted-foreground">{s.dist}</p>
                        <p className="text-xs font-mono font-bold text-primary">{s.time}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </section>

        <Separator />

        {/* 2. Multipoint Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Activity size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Multipoint Pace Calculator</h3>
              <p className="text-sm text-muted-foreground">Calculate incremental splits and pace trends from cumulative markers.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8">
              <CardHeader className="flex justify-between flex-row items-center border-b bg-muted/10">
                <CardTitle className="text-sm uppercase font-black text-muted-foreground">Markers Log</CardTitle>
                <div className="flex gap-2">
                  <Select value={multiUnit} onValueChange={setMultiUnit}>
                    <SelectTrigger className="w-28 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers</SelectItem>
                      <SelectItem value="miles">Miles</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="yards">Yards</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => setMultiSplits([...multiSplits, { id: Math.random().toString(), dist: (multiSplits.length > 0 ? multiSplits[multiSplits.length - 1].dist + 1 : 1), time: { h: 0, m: 0, s: 0 } }])}>
                    <Plus size={14} className="mr-1" /> Add Marker
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Marker Distance ({multiUnit})</TableHead>
                      <TableHead>Cumulative Time (hh:mm:ss)</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {multiSplits.map((s, i) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-bold text-muted-foreground">{i + 1}</TableCell>
                        <TableCell>
                          <Input type="number" className="h-9" value={s.dist} onChange={e => setMultiSplits(multiSplits.map(x => x.id === s.id ? {...x, dist: Number(e.target.value)} : x))} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Input className="h-9 w-full text-center" placeholder="H" value={s.time.h} onChange={e => setMultiSplits(multiSplits.map(x => x.id === s.id ? {...x, time: {...x.time, h: Number(e.target.value)}} : x))} />
                            <Input className="h-9 w-full text-center" placeholder="M" value={s.time.m} onChange={e => setMultiSplits(multiSplits.map(x => x.id === s.id ? {...x, time: {...x.time, m: Number(e.target.value)}} : x))} />
                            <Input className="h-9 w-full text-center" placeholder="S" value={s.time.s} onChange={e => setMultiSplits(multiSplits.map(x => x.id === s.id ? {...x, time: {...x.time, s: Number(e.target.value)}} : x))} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => setMultiSplits(multiSplits.filter(x => x.id !== s.id))}>
                            <Trash2 size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Preferred Pace Unit</Label>
                  <Select value={preferredResultUnit} onValueChange={setPreferredResultUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                </CardHeader>
                <CardContent className="pt-4">
                   <div className="bg-primary text-white p-6 rounded-2xl text-center space-y-1 shadow-lg">
                      <p className="text-[10px] uppercase font-bold opacity-70">Average Pace</p>
                      <div className="text-3xl font-black font-headline">{multipointResult?.averagePace}</div>
                      <p className="text-[10px] opacity-70">{preferredResultUnit}</p>
                   </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  Enter cumulative markers (e.g., Mile 1 time, Mile 2 time). We automatically calculate the speed for each specific interval.
                </p>
              </div>
            </div>
          </div>

          {multipointResult && (
            <div className="space-y-8 pt-4">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/10 border-b">
                  <CardTitle className="text-sm font-bold text-primary uppercase">Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Marker</TableHead>
                        <TableHead>Distance ({multiUnit})</TableHead>
                        <TableHead>Section Time</TableHead>
                        <TableHead>Section Pace ({preferredResultUnit})</TableHead>
                        <TableHead className="text-right">Accumulated Pace</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {multipointResult.tableData.map((row) => (
                        <TableRow key={row.marker}>
                          <TableCell className="font-bold">{row.marker}.</TableCell>
                          <TableCell>{row.sectionDist.toFixed(2)}</TableCell>
                          <TableCell className="font-mono">{row.sectionTime}</TableCell>
                          <TableCell className="font-bold text-accent">{row.sectionPace}</TableCell>
                          <TableCell className="text-right font-bold text-primary">{row.accumulatedPace}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <LineChartIcon className="text-primary w-5 h-5" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">Pace Trends for Sections</CardTitle>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={multipointResult.tableData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="marker" label={{ value: 'Section #', position: 'insideBottomRight', offset: -5 }} fontSize={12} />
                      <YAxis label={{ value: preferredResultUnit, angle: -90, position: 'insideLeft' }} fontSize={12} />
                      <ChartTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(val: number) => [val, 'Section Pace']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="chartVal" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}
        </section>

        <Separator />

        {/* 3. Converter Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><RefreshCw size={24} /></div>
            <div><h3 className="text-2xl font-bold text-primary">Pace Converter</h3><p className="text-sm text-muted-foreground">Convert between pace and speed standards instantly.</p></div>
          </div>
          <Card><CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase text-muted-foreground">Input Pace / Speed</Label>
                  {(!isSpeedUnit(convUnit)) ? (
                    <div className="grid grid-cols-3 gap-2">
                      <Input type="number" placeholder="H" value={convPace.h} onChange={e => setConvPace({...convPace, h: Number(e.target.value)})} />
                      <Input type="number" placeholder="M" value={convPace.m} onChange={e => setConvPace({...convPace, m: Number(e.target.value)})} />
                      <Input type="number" placeholder="S" value={convPace.s} onChange={e => setConvPace({...convPace, s: Number(e.target.value)})} />
                    </div>
                  ) : (<Input type="number" value={convSpeed} onChange={e => setConvSpeed(e.target.value)} />)}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Standard</Label>
                  <Select value={convUnit} onValueChange={setConvUnit}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
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
              <div className="grid grid-cols-2 gap-4">
                {convResults?.map(r => (
                  <div key={r.label} className="bg-muted/30 p-3 rounded-lg text-center flex flex-col justify-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{r.label}</p>
                    <p className="text-sm font-bold text-primary leading-tight">{r.value}</p>
                  </div>
                ))}
              </div>
          </CardContent></Card>
        </section>

        <Separator />

        {/* 4. Predictor Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Trophy size={24} /></div>
            <div><h3 className="text-2xl font-bold text-primary">Finish Time Predictor</h3><p className="text-sm text-muted-foreground">Project race results based on split performance.</p></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card><CardContent className="pt-6 space-y-6">
                <div className="space-y-3"><Label className="text-xs font-black uppercase text-muted-foreground">Current Distance Traveled</Label>
                  <div className="grid grid-cols-2 gap-3"><Input type="number" value={predCurrentDist} onChange={e => setPredCurrentDist(Number(e.target.value))} />
                    <Select value={predCurrentUnit} onValueChange={setPredCurrentUnit}><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="km">Kilometers</SelectItem><SelectItem value="miles">Miles</SelectItem><SelectItem value="meters">Meters</SelectItem><SelectItem value="yards">Yards</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3"><Label className="text-xs font-black uppercase text-muted-foreground">Elapsed Time (hh:mm:ss)</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Input type="number" placeholder="Hr" value={predElapsedTime.h} onChange={e => setPredElapsedTime({...predElapsedTime, h: Number(e.target.value)})} />
                    <Input type="number" placeholder="Min" value={predElapsedTime.m} onChange={e => setPredElapsedTime({...predElapsedTime, m: Number(e.target.value)})} />
                    <Input type="number" placeholder="Sec" value={predElapsedTime.s} onChange={e => setPredElapsedTime({...predElapsedTime, s: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-3"><Label className="text-xs font-black uppercase text-muted-foreground">Full Distance</Label>
                  <div className="grid grid-cols-2 gap-3"><Input type="number" value={predFullDist} onChange={e => setPredFullDist(Number(e.target.value))} />
                    <Select value={predFullUnit} onValueChange={setPredFullUnit}><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="km">Kilometers</SelectItem><SelectItem value="miles">Miles</SelectItem><SelectItem value="meters">Meters</SelectItem><SelectItem value="yards">Yards</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
            </CardContent></Card>
            <div className="space-y-6">
              <Card className="bg-primary text-white border-none shadow-xl"><CardContent className="pt-8 pb-10 text-center space-y-4"><p className="text-xs uppercase tracking-widest opacity-80 font-bold">Prediction Result</p>
                  {!finishResults ? (<p className="italic opacity-60">Enter valid performance data to see your projection.</p>) : (
                    <div className="space-y-4"><p className="text-xl font-medium leading-relaxed">At current pace, it will take <span className="font-black text-white">{finishResults.finishTime}</span> to finish {predFullDist} {predFullUnit.charAt(0).toUpperCase() + predFullUnit.slice(1)}</p></div>
                  )}
              </CardContent></Card>
              {finishResults && (
                <Card className="border-none bg-muted/20"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Your pace so far are:</CardTitle></CardHeader>
                  <CardContent className="p-0 px-6 pb-6"><ul className="space-y-2 text-sm">
                      {finishResults.units.map((u, i) => (
                        <li key={u.label} className="flex gap-2">
                          <span className="text-muted-foreground">{i === 0 ? '' : 'or'}</span>
                          <span className="font-bold text-foreground">{u.value}</span>
                          <span className="text-primary font-medium">{u.label}</span>
                        </li>
                      ))}
                  </ul></CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>
    </CalculatorWrapper>
  );
}
