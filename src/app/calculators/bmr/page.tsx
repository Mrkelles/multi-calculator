"use client"

import { useState, useMemo, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Flame, 
  Info, 
  User, 
  Activity, 
  History, 
  ChevronRight,
  TrendingUp,
  Zap,
  Dumbbell,
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

const metadata: Metadata = {
  title: 'Accurate BMR Calculator | Free Basal Metabolic Rate Tracker',
  description: 'Calculate your Basal Metabolic Rate instantly with our free online BMR calculator. Discover your baseline daily calorie burn based on your age, sex, height, and weight.',
  keywords: [
    'bmr calculator',
    'basal metabolic rate calculator',
    'metabolic rate calculator',
    'calculator for metabolic rate',
    'MyApexCalc',
    'daily calorie burn estimator',
    'Harris-Benedict formula'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Precision Basal Metabolic Rate Calculator | MyApexCalc',
    description: 'Find your baseline energy requirements. Calculate your BMR instantly and build a smarter nutrition or weight management plan with our interactive tool.',
    url: 'https://www.myapexcalc.com/calculators/bmr',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/PGGDjy1g/bmr-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Basal Metabolic Rate Calculator and Daily Calorie Breakdown Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Basal Metabolic Rate Calculator | MyApexCalc',
    description: 'Calculate your exact baseline daily energy expenditure in seconds with our free online fitness tool.',
    images: ['https://i.ibb.co/PGGDjy1g/bmr-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/bmr',
  },
};

type Gender = 'male' | 'female';
type UnitMode = 'us' | 'metric';

const activityLevels = [
  { label: 'Sedentary: little or no exercise', multiplier: 1.2 },
  { label: 'Exercise 1-3 times/week', multiplier: 1.375 },
  { label: 'Exercise 4-5 times/week', multiplier: 1.465 },
  { label: 'Daily exercise or intense exercise 3-4 times/week', multiplier: 1.55 },
  { label: 'Intense exercise 6-7 times/week', multiplier: 1.725 },
  { label: 'Very intense exercise daily, or physical job', multiplier: 1.9 },
];

export default function BMRCalculatorPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<UnitMode>('us');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState(33);
  
  // Weights (Lbs or KG)
  const [weight, setWeight] = useState(160);

  // US Mode (Feet + Inches)
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(11);

  // Metric Mode (Single CM value)
  const [heightCm, setHeightCm] = useState(180.3);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const results = useMemo(() => {
    if (!isMounted) return null;

    let h_cm = 0;
    let w_kg = 0;

    if (mode === 'us') {
      h_cm = ((heightFt * 12) + heightIn) * 2.54;
      w_kg = weight * 0.45359237;
    } else {
      h_cm = heightCm;
      w_kg = weight;
    }

    // Mifflin-St Jeor Equation
    let bmr = (10 * w_kg) + (6.25 * h_cm) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const activityNeeds = activityLevels.map(lvl => ({
      level: lvl.label,
      calories: Math.round(bmr * lvl.multiplier)
    }));

    return {
      bmr: Math.round(bmr),
      activityNeeds
    };
  }, [isMounted, mode, gender, age, weight, heightFt, heightIn, heightCm]);

  const toggleMode = (newMode: UnitMode) => {
    if (newMode === mode) return;
    if (newMode === 'metric') {
      setHeightCm(Number(((heightFt * 12 + heightIn) * 2.54).toFixed(1)));
      setWeight(Number((weight * 0.45359237).toFixed(1)));
    } else {
      const totalHIn = heightCm / 2.54;
      setHeightFt(Math.floor(totalHIn / 12));
      setHeightIn(Number((totalHIn % 12).toFixed(1)));
      setWeight(Number((weight / 0.45359237).toFixed(1)));
    }
    setMode(newMode);
  };

  return (
    <CalculatorWrapper
      title="BMR Calculator"
      description="Estimate your Basal Metabolic Rate (BMR)—the number of calories your body burns at rest—using the Mifflin-St Jeor Equation."
      icon={Flame}
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
                Medical Standard
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[10px] text-muted-foreground leading-relaxed">
              Our calculator uses the <strong>Mifflin-St Jeor Equation</strong>, which is the current gold standard for estimating calorie needs in healthy adults without specialized medical equipment.
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex items-center justify-center text-muted-foreground italic">
              Please enter your details to see your results.
            </Card>
          ) : (
            <>
              <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap className="w-24 h-24" />
                </div>
                <CardContent className="pt-10 pb-10 text-center relative z-10 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-bold">Your Basal Metabolic Rate (BMR)</p>
                    <h3 className="text-6xl md:text-7xl font-black font-headline tracking-tighter">
                      {results.bmr.toLocaleString()}
                    </h3>
                    <p className="text-lg opacity-80 mt-2">Calories/Day</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="bg-muted/50 border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Daily Needs Based on Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-bold">Activity Level</TableHead>
                        <TableHead className="text-right font-bold">Daily Calories</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.activityNeeds.map((item, idx) => (
                        <TableRow key={idx} className="hover:bg-primary/5 transition-colors">
                          <TableCell className="text-xs font-medium">{item.level}</TableCell>
                          <TableCell className="text-right font-mono font-bold text-primary">{item.calories.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="bg-blue-50 p-4 border-t border-blue-100 space-y-3">
                    <div className="flex gap-3">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Exercise definitions:</p>
                        <ul className="text-[10px] text-blue-600 list-disc pl-4 space-y-0.5">
                          <li><strong>Exercise:</strong> 15-30 minutes of elevated heart rate activity.</li>
                          <li><strong>Intense exercise:</strong> 45-120 minutes of elevated heart rate activity.</li>
                          <li><strong>Very intense exercise:</strong> 2+ hours of elevated heart rate activity.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Reference Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Master Your Metabolism with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are aiming to lose weight, build lean muscle, or simply maintain your current physique, understanding your body’s daily energy requirements is the ultimate starting point. Every day, your body burns a significant number of calories simply keeping your organs functioning, circulating blood, and maintaining body temperature—even if you stay in bed all day. Our free online bmr calculator removes the guesswork by establishing your baseline energy needs in seconds.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                The Science of Metabolism: How Your BMR is Calculated
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Your Basal Metabolic Rate (BMR) represents the absolute minimum number of calories your body needs to survive at rest. Our basal metabolic rate calculator utilizes the most accurate, medically recognized formulas to determine this baseline.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our metabolic rate calculator supports both the <strong>Mifflin-St Jeor Equation</strong> (widely considered the most accurate for modern lifestyles) and the classic Harris-Benedict Equation.
                </p>
                
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm space-y-4 border">
                  <p className="font-bold text-xs uppercase text-muted-foreground mb-2">The Mifflin-St Jeor Equation</p>
                  <div className="space-y-2">
                    <p className="text-primary font-bold">For Men:</p>
                    <p className="text-foreground">BMR = (10 × W) + (6.25 × H) - (5 × A) + 5</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-primary font-bold">For Women:</p>
                    <p className="text-foreground">BMR = (10 × W) + (6.25 × H) - (5 × A) - 161</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed pt-2 text-xs italic">
                  * W = weight in kilograms, H = height in centimeters, A = age in years.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  Once this baseline is established, you can multiply your BMR by an activity factor to determine your Total Daily Energy Expenditure (TDEE). This tells you exactly how many calories you need to consume to hit your target fitness goals.
                </p>
              </div>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Use the MyApexCalc Calculator for Metabolic Rate?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instead of guessing your calorie needs or relying on complex manual formulas, MyApexCalc provides a seamless, secure, and instant health dashboard:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Dumbbell className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Dual Formula Support</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Toggle between the modern Mifflin-St Jeor and revised Harris-Benedict formulas to compare baseline estimates across different clinical standards.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Metric and Imperial Inputs</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Easily enter your stats in pounds and feet/inches or kilograms and centimeters without needing external conversion tools.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Instant TDEE Projections</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">View a clear breakdown showing how your baseline calorie burn scales up based on your daily physical activity levels.</p>
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
