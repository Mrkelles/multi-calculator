"use client"

import { useState, useMemo, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Scale, 
  Info, 
  User, 
  History, 
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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

export default function IdealWeightCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<UnitMode>('us');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState(25);

  // US Mode (Feet + Inches)
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(10);

  // Metric Mode (Single CM value)
  const [heightCm, setHeightCm] = useState(177.8);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const results = useMemo(() => {
    if (!isMounted) return null;

    let h_cm = 0;
    if (mode === 'us') {
      h_cm = ((heightFt * 12) + heightIn) * 2.54;
    } else {
      h_cm = heightCm;
    }

    const totalHeightInches = h_cm / 2.54;
    const inchesOver5ft = Math.max(0, totalHeightInches - 60);
    const lbsPerKg = 2.20462;

    // Formulas (Base weights are in KG)
    let robinson, miller, devine, hamwi;

    if (gender === 'male') {
      robinson = 52 + (1.9 * inchesOver5ft);
      miller = 56.2 + (1.41 * inchesOver5ft);
      devine = 50.0 + (2.3 * inchesOver5ft);
      hamwi = 48.0 + (2.7 * inchesOver5ft);
    } else {
      robinson = 49 + (1.7 * inchesOver5ft);
      miller = 53.1 + (1.36 * inchesOver5ft);
      devine = 45.5 + (2.3 * inchesOver5ft);
      hamwi = 45.5 + (2.2 * inchesOver5ft);
    }

    // Healthy BMI Range (18.5 - 25.0)
    const h_m = h_cm / 100;
    const bmiMinKg = 18.5 * (h_m * h_m);
    const bmiMaxKg = 25.0 * (h_m * h_m);

    const format = (kg: number) => {
      if (mode === 'us') return (kg * lbsPerKg).toFixed(1) + ' lbs';
      return kg.toFixed(1) + ' kg';
    };

    return [
      { formula: 'Robinson (1983)', value: format(robinson) },
      { formula: 'Miller (1983)', value: format(miller) },
      { formula: 'Devine (1974)', value: format(devine) },
      { formula: 'Hamwi (1964)', value: format(hamwi) },
      { formula: 'Healthy BMI Range', value: `${format(bmiMinKg)} - ${format(bmiMaxKg)}` },
    ];
  }, [isMounted, mode, gender, age, heightFt, heightIn, heightCm]);

  const toggleMode = (newMode: UnitMode) => {
    if (newMode === mode) return;
    if (newMode === 'metric') {
      setHeightCm(Number(((heightFt * 12 + heightIn) * 2.54).toFixed(1)));
    } else {
      const totalHIn = heightCm / 2.54;
      setHeightFt(Math.floor(totalHIn / 12));
      setHeightIn(Number((totalHIn % 12).toFixed(1)));
    }
    setMode(newMode);
  };

  return (
    <CalculatorWrapper
      title="Ideal Weight Calculator"
      description="Estimate your ideal body weight based on your height, gender, and age using the most popular medical formulas."
      icon={Scale}
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

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age (2-80)</Label>
                  <Input 
                    type="number" 
                    value={age} 
                    min={2} 
                    max={80} 
                    onChange={(e) => setAge(Number(e.target.value))} 
                  />
                </div>

                {mode === 'us' ? (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Height</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <Input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} className="pr-7" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ft</span>
                      </div>
                      <div className="relative">
                        <Input type="number" step="0.1" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} className="pr-7" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">in</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Height (cm)</Label>
                    <Input type="number" step="0.1" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                Note on Formulas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[10px] text-muted-foreground leading-relaxed">
              Ideal weight formulas are estimates based on height and gender. They do not account for muscle mass or body fat distribution. Consult a physician for personalized health goals.
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic">
              Please enter your details to see results.
            </Card>
          ) : (
            <>
              <Card className="overflow-hidden border-none shadow-xl">
                <CardHeader className="bg-primary text-white pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">Ideal Weight Projections</CardTitle>
                    <Scale className="w-5 h-5 opacity-50" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-bold">Formula</TableHead>
                        <TableHead className="text-right font-bold">Ideal Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((item, idx) => (
                        <TableRow key={idx} className={item.formula === 'Healthy BMI Range' ? "bg-accent/5" : ""}>
                          <TableCell className="font-medium text-xs py-4">{item.formula}</TableCell>
                          <TableCell className={`text-right font-mono font-bold ${item.formula === 'Healthy BMI Range' ? 'text-accent' : 'text-primary'}`}>
                            {item.value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
                <TrendingUp className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-blue-800 font-bold">What is "Ideal"?</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Most formulas target the weight that correlates with the lowest mortality risk for a given height. The **Healthy BMI Range** is often considered the most flexible and widely accepted baseline for healthy weight management.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Reference Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Formula Origins
              </h3>
              <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">The Devine Formula (1974)</h4>
                  <p>Originally developed by Dr. B.J. Devine in 1974 for medical use in drug dosing. It has since become the most commonly used formula in the world for determining ideal body weight.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">The Robinson Formula (1983)</h4>
                  <p>A modification of the Devine formula intended to be more accurate, particularly for males. It was introduced by Robinson et al. based on statistical analysis of health data.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">The Hamwi Formula (1964)</h4>
                  <p>Introduced by G.J. Hamwi, this is often used for quick clinical estimates. It assumes a base weight for a person of 5 feet tall and adds a set amount for every inch thereafter.</p>
                </div>
              </div>
            </section>

            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Term Definitions
              </h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Ideal Body Weight (IBW)</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">A standard weight for a given height, typically associated with the lowest health risks and longest life expectancy in population studies.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <LayoutGrid className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Healthy BMI Range</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">The Body Mass Index (BMI) range between 18.5 and 25.0 kg/m². This is the standard World Health Organization (WHO) benchmark for healthy weight classification.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-8 pb-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Is these results accurate?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                While these formulas provide a mathematical baseline, it is important to remember that "ideal weight" is a complex concept. Factors such as bone density, muscle mass, and body fat percentage play a critical role in overall health. For example, a highly muscular athlete might be classified as "overweight" by these formulas despite having a very low body fat percentage and being in excellent physical condition.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                We recommend using these tools as a starting point for discussion with your healthcare provider rather than a definitive goal for your fitness journey.
              </p>
            </section>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
