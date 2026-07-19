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
  FileText,
  Calculator
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
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'Accurate Ideal Weight Calculator | Healthy Body Mass Tracker',
  description: 'Find your target weight range instantly. Use our free ideal weight calculator to compare formulas, check body mass index values, and discover your healthy range.',
  keywords: [
    'body mass chart male',
    'body bmi calculator male',
    'normal body weight index',
    'ideal weight calculator',
    'healthy body weight index',
    'MyApexCalc',
    'ideal body weight formula',
    'Devine formula calculator'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Ideal Weight Calculator & BMI Tracker | MyApexCalc',
    description: 'Calculate your healthy target weight range based on height, gender, and frame size using recognized medical formulas.',
    url: 'https://www.myapexcalc.com/calculators/ideal-weight',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/qY3cSmJQ/ideal-weight-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Ideal Weight Calculator and Healthy BMI Range Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Ideal Weight & BMI Estimator | MyApexCalc',
    description: 'Quickly find your ideal body weight and explore healthy body mass index charts online.',
    images: ['https://i.ibb.co/qY3cSmJQ/ideal-weight-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/ideal-weight',
  },
};

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

        {/* Informational Text Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Find Your Healthy Balance with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are designing a new fitness regimen, recovering from an illness, training as an athlete, or simply aiming to improve your general well-being, understanding your target weight zone is a vital baseline. A healthy weight isn't a single, rigid number—it is a supportive range that aligns with your height, age, biological sex, and frame structure. Our free online ideal weight calculator is designed to demystify these physical standards, giving you a comprehensive, instant view of your healthy target zones.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                The Science of Weight Tracking: Recognized Formulas
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  To calculate an optimal weight range, our tool processes your height and sex using historically validated medical equations, while also mapping your results against standard body mass index standards.
                </p>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">1. The Devine Formula (The Clinical Standard)</p>
                  <p className="text-sm text-muted-foreground">Originally designed in 1974 to calculate medication dosages, the Devine formula remains the most widely used metric in medical settings to estimate base weight values. It calculates a baseline weight for a height of 5 feet (60 inches) and adds a set multiplier for every additional inch (h):</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm space-y-2 border">
                    <p className="text-primary font-bold">For Men:</p>
                    <p>Ideal Weight (kg) = 50.0 + 2.3 × (h - 60)</p>
                    <Separator className="my-2" />
                    <p className="text-primary font-bold">For Women:</p>
                    <p>Ideal Weight (kg) = 45.5 + 2.3 × (h - 60)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">2. The Body Mass Index (BMI) Range</p>
                  <p className="text-sm text-muted-foreground">While formulas like Devine offer a specific starting estimate, global health organizations like the World Health Organization (WHO) prefer using the normal body weight index range. This establishes a healthy upper and lower weight boundary based on a target BMI of 18.5 to 24.9:</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Healthy Weight (kg) = Target BMI × (Height in Meters)²
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">
                    By utilizing our integrated body bmi calculator male and female options, you can immediately identify where your physical measurements sit on the official scale, helping you stay within a safe and realistic zone.
                  </p>
                </div>
              </div>
            </section>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  Why Check Your Goals with MyApexCalc?
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Evaluating your optimal body mass targets on static graphs or confusing tables can be tricky. MyApexCalc simplifies your health tracking by offering:
                </p>
                <ul className="space-y-6 pt-2">
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <LayoutGrid className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Multiple Metric Integrations</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">View your metrics plotted across four distinct clinical formulas (Devine, Robinson, Miller, and Hamwi) alongside a custom body mass chart layout.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                      <ChevronRight className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Responsive Height Adjustments</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Seamlessly switch between feet/inches and centimeters to watch your target metrics recalculate instantly.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Scale className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Framing Beyond the Scale</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Our tool places your calculation results in context, reminding you that factors like muscle mass and bone density are just as important as the number on the scale.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
                <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-tight italic">
                  "A healthy weight is a tool for a more active life, not a destination in itself. Focus on sustainable habits that support your long-term vitality."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
