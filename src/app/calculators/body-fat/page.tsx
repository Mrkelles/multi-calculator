"use client"

import { useState, useMemo, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Activity, 
  Info, 
  User, 
  History, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

type Gender = 'male' | 'female';
type UnitMode = 'us' | 'metric';

export default function BodyFatCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<UnitMode>('us');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState(25);

  // Measurements
  const [weight, setWeight] = useState(170);
  const [height, setHeight] = useState(70); // in inches for US, cm for Metric
  const [neck, setNeck] = useState(15.5);
  const [waist, setWaist] = useState(34);
  const [hip, setHip] = useState(38); // For female

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Conversion Helpers
  const toCm = (val: number) => mode === 'us' ? val * 2.54 : val;
  const toInch = (val: number) => mode === 'us' ? val : val / 2.54;
  const toKg = (val: number) => mode === 'us' ? val * 0.453592 : val;
  const toLbs = (val: number) => mode === 'us' ? val : val / 0.453592;

  const results = useMemo(() => {
    if (!isMounted) return null;

    try {
      const h_in = toInch(height);
      const w_in = toInch(waist);
      const n_in = toInch(neck);
      const hip_in = toInch(hip);
      const weight_lbs = toLbs(weight);

      let bodyFat = 0;
      if (gender === 'male') {
        // Navy Formula for Men
        bodyFat = 86.010 * Math.log10(w_in - n_in) - 70.041 * Math.log10(h_in) + 36.76;
      } else {
        // Navy Formula for Women
        bodyFat = 163.205 * Math.log10(w_in + hip_in - n_in) - 97.684 * Math.log10(h_in) - 78.387;
      }

      if (isNaN(bodyFat) || bodyFat < 0) return null;

      const bodyFatMass = weight * (bodyFat / 100);
      const leanBodyMass = weight - bodyFatMass;

      // Category Logic (ACE)
      let category = '';
      let categoryColor = '';
      if (gender === 'male') {
        if (bodyFat < 6) { category = 'Essential Fat'; categoryColor = 'text-blue-500'; }
        else if (bodyFat < 14) { category = 'Athlete'; categoryColor = 'text-green-500'; }
        else if (bodyFat < 18) { category = 'Fitness'; categoryColor = 'text-emerald-600'; }
        else if (bodyFat < 25) { category = 'Acceptable'; categoryColor = 'text-yellow-600'; }
        else { category = 'Obese'; categoryColor = 'text-red-500'; }
      } else {
        if (bodyFat < 14) { category = 'Essential Fat'; categoryColor = 'text-blue-500'; }
        else if (bodyFat < 21) { category = 'Athlete'; categoryColor = 'text-green-500'; }
        else if (bodyFat < 25) { category = 'Fitness'; categoryColor = 'text-emerald-600'; }
        else if (bodyFat < 32) { category = 'Acceptable'; categoryColor = 'text-yellow-600'; }
        else { category = 'Obese'; categoryColor = 'text-red-500'; }
      }

      return {
        bodyFat,
        category,
        categoryColor,
        bodyFatMass,
        leanBodyMass
      };
    } catch (e) {
      return null;
    }
  }, [isMounted, mode, gender, age, weight, height, neck, waist, hip]);

  const toggleMode = (newMode: UnitMode) => {
    if (newMode === mode) return;
    if (newMode === 'metric') {
      // US to Metric
      setHeight(Math.round(height * 2.54));
      setWeight(Math.round(weight * 0.453592));
      setNeck(Number((neck * 2.54).toFixed(1)));
      setWaist(Number((waist * 2.54).toFixed(1)));
      setHip(Number((hip * 2.54).toFixed(1)));
    } else {
      // Metric to US
      setHeight(Math.round(height / 2.54));
      setWeight(Math.round(weight / 0.453592));
      setNeck(Number((neck / 2.54).toFixed(1)));
      setWaist(Number((waist / 2.54).toFixed(1)));
      setHip(Number((hip / 2.54).toFixed(1)));
    }
    setMode(newMode);
  };

  const jacksonPollockData = [
    { age: 20, women: '17.7%', men: '8.5%' },
    { age: 25, women: '18.4%', men: '10.5%' },
    { age: 30, women: '19.3%', men: '12.7%' },
    { age: 35, women: '21.5%', men: '13.7%' },
    { age: 40, women: '22.2%', men: '15.3%' },
    { age: 45, women: '22.9%', men: '16.4%' },
    { age: 50, women: '25.2%', men: '18.9%' },
    { age: 55, women: '26.3%', men: '20.9%' },
  ];

  return (
    <CalculatorWrapper
      title="Body Fat Calculator"
      description="Estimate your body fat percentage using the U.S. Navy formula, which uses your height and body measurements."
      icon={Activity}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <Tabs value={mode} onValueChange={(v: any) => toggleMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="us">US Units</TabsTrigger>
                  <TabsTrigger value="metric">Metric Units</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gender</Label>
                  <RadioGroup value={gender} onValueChange={(v: any) => setGender(v)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age</Label>
                    <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Weight ({mode === 'us' ? 'lbs' : 'kg'})
                    </Label>
                    <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Height ({mode === 'us' ? 'in' : 'cm'})
                  </Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Neck ({mode === 'us' ? 'in' : 'cm'})
                  </Label>
                  <Input type="number" step="0.1" value={neck} onChange={(e) => setNeck(Number(e.target.value))} />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Waist ({mode === 'us' ? 'in' : 'cm'})
                  </Label>
                  <Input type="number" step="0.1" value={waist} onChange={(e) => setWaist(Number(e.target.value))} />
                </div>

                {gender === 'female' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Hip ({mode === 'us' ? 'in' : 'cm'})
                    </Label>
                    <Input type="number" step="0.1" value={hip} onChange={(e) => setHip(Number(e.target.value))} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                Measurement Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[10px] text-muted-foreground leading-relaxed">
              Measure your neck just below the larynx, your waist at the horizontal level of the navel for men, or the narrowest point for women. Ensure the tape is level and snug but not compressing the skin.
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic">
              Please enter your measurements to see results.
            </Card>
          ) : (
            <>
              <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-24 h-24" />
                </div>
                <CardContent className="pt-10 pb-10 text-center relative z-10 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-bold">Estimated Body Fat</p>
                    <h3 className="text-6xl md:text-7xl font-black font-headline tracking-tighter">
                      {results.bodyFat.toFixed(1)}%
                    </h3>
                  </div>
                  
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="bg-white/10 p-2 px-6 rounded-full inline-block border border-white/20">
                      <p className="text-xs font-bold uppercase tracking-widest">
                        Category: <span className="text-accent-foreground font-black">{results.category}</span>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                        <span>Body Fat Index</span>
                        <span>{results.category}</span>
                      </div>
                      <Progress value={results.bodyFat * 2} className="h-2 bg-white/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Composition
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Body Fat Mass</span>
                      <span className="font-bold">{results.bodyFatMass.toFixed(1)} {mode === 'us' ? 'lbs' : 'kg'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lean Body Mass</span>
                      <span className="font-bold">{results.leanBodyMass.toFixed(1)} {mode === 'us' ? 'lbs' : 'kg'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-accent">
                      <ShieldCheck className="w-4 h-4" />
                      Goal Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Ideal Range</span>
                      <span className="font-bold text-primary">{gender === 'male' ? '14% - 24%' : '21% - 31%'}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic leading-tight">
                      Consistent resistance training and high protein intake can help preserve lean mass while reducing fat.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Reference Tables */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-primary">Body Fat Classification</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The American Council on Exercise (ACE) provides standard categories for body fat percentages based on gender and fitness goals.
              </p>
              <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold">Description</TableHead>
                      <TableHead className="font-bold text-right">Women</TableHead>
                      <TableHead className="font-bold text-right">Men</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Essential fat</TableCell>
                      <TableCell className="text-right">10-13%</TableCell>
                      <TableCell className="text-right">2-5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Athletes</TableCell>
                      <TableCell className="text-right">14-20%</TableCell>
                      <TableCell className="text-right">6-13%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-emerald-600">Fitness</TableCell>
                      <TableCell className="text-right">21-24%</TableCell>
                      <TableCell className="text-right">14-17%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Average</TableCell>
                      <TableCell className="text-right">25-31%</TableCell>
                      <TableCell className="text-right">18-24%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-red-500">Obese</TableCell>
                      <TableCell className="text-right">32%+</TableCell>
                      <TableCell className="text-right">25%+</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Jackson & Pollock Method</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A popular age-based benchmark for understanding body fat composition targets.
              </p>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="text-[10px] font-bold">Age</TableHead>
                      <TableHead className="text-[10px] font-bold text-right">Women</TableHead>
                      <TableHead className="text-[10px] font-bold text-right">Men</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[11px]">
                    {jacksonPollockData.map((row) => (
                      <TableRow key={row.age}>
                        <TableCell>{row.age}</TableCell>
                        <TableCell className="text-right">{row.women}</TableCell>
                        <TableCell className="text-right">{row.men}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-8 pb-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Understanding Body Fat Percentage</h3>
              <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
                <p>
                  The scientific definition of body fat percentage is the total mass of fat divided by total body mass, multiplied by 100. Body fat includes essential body fat and storage body fat. Essential body fat is necessary to maintain life and reproductive functions. The percentage of essential fat is 2–5% in men, and 10–13% in women.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-accent" /> Essential Body Fat
                    </h4>
                    <p className="text-xs">Essential fat is the level below which physical and physiological health would be negatively affected. It is necessary for the proper functioning of the hormonal, reproductive, and immune systems.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-accent" /> Storage Body Fat
                    </h4>
                    <p className="text-xs">Storage body fat consists of fat accumulation in adipose tissue, part of which protects internal organs in the chest and abdomen. This is the fat that typically fluctuates based on diet and exercise.</p>
                  </div>
                </div>
                <p className="pt-4">
                  The **U.S. Navy method** implemented in this calculator provides a reliable estimate for the general population. While DEXA scans or hydrostatic weighing are more accurate "gold standards," the Navy method is highly accessible and requires only a measuring tape.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
