"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { User, History, Calculator, Info, TrendingUp, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Free BMI Calculator | Live Body Weight Index Calculator',
  description: 'Calculate your body mass index instantly with our free online BMI calculator. Check your health metrics using the official BMI index chart and standard weight-to-height formula.',
  keywords: [
    'bmi calculator',
    'bmi',
    'body weight index calculator',
    'body mass ratio',
    'bmi index chart',
    'bmi formula',
    'MyApexCalc',
    'health calculator',
    'ideal body weight'
  ],
  
  // Open Graph for social sharing platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Accurate BMI Calculator & Chart | MyApexCalc',
    description: 'Track your body metrics quickly. Input your height and weight to calculate your BMI and evaluate your health score via the standard BMI index chart.',
    url: 'https://www.myapexcalc.com/calculators/bmi',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/V0rdhfTT/bmi-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc BMI Calculator Dashboard and Category Layout',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Online Body Weight Index Calculator | MyApexCalc',
    description: 'Instantly measure your body mass ratio using the standard scientific BMI formula.',
    images: ['https://i.ibb.co/V0rdhfTT/bmi-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index dilution
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/bmi',
  },
};

export default function BMIPage() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [bmi, setBmi] = useState(0);
  const [category, setCategory] = useState('');
  const [categoryColor, setCategoryColor] = useState('');

  useEffect(() => {
    if (weight > 0 && height > 0) {
      const hMeters = height / 100;
      const val = weight / (hMeters * hMeters);
      setBmi(val);

      if (val < 18.5) {
        setCategory('Underweight');
        setCategoryColor('text-blue-500');
      } else if (val < 25) {
        setCategory('Normal Weight');
        setCategoryColor('text-green-500');
      } else if (val < 30) {
        setCategory('Overweight');
        setCategoryColor('text-yellow-500');
      } else {
        setCategory('Obese');
        setCategoryColor('text-red-500');
      }
    }
  }, [weight, height]);

  return (
    <CalculatorWrapper
      title="BMI Calculator"
      description="Quickly calculate your Body Mass Index (BMI) to check your health status based on height and weight."
      icon={User}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Body Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="text-sm uppercase tracking-wider font-semibold opacity-80">Your Result</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-10 text-center space-y-4">
              <div className="text-6xl font-bold text-primary font-headline">
                {bmi.toFixed(1)}
              </div>
              <div className={`text-xl font-bold ${categoryColor}`}>
                {category}
              </div>
              <div className="px-6 space-y-2">
                <Progress value={Math.min(100, (bmi / 40) * 100)} className="h-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                  <span>UNDER</span>
                  <span>NORMAL</span>
                  <span>OVER</span>
                  <span>OBESE</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Classification Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 rounded bg-blue-50 text-blue-700">
                  <span>Underweight</span>
                  <span>&lt; 18.5</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-green-50 text-green-700 font-semibold">
                  <span>Normal Weight</span>
                  <span>18.5 – 24.9</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-yellow-50 text-yellow-700">
                  <span>Overweight</span>
                  <span>25.0 – 29.9</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-red-50 text-red-700">
                  <span>Obesity</span>
                  <span>&ge; 30.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Prioritize Your Wellness Journey with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Understanding your personal body metrics is a crucial starting point for any health, fitness, or weight management goal. Our accurate online bmi calculator provides a fast, reliable evaluation of your current body composition based on global health standards. Often referred to as a body weight index calculator, this tool acts as an easy-to-use screening dashboard to help you assess whether your weight falls into a healthy proportion relative to your height.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Math Behind the Metrics: The BMI Formula
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Your Body Mass Index is evaluated using a universal mathematical equation that measures your overall body mass ratio. Depending on whether you prefer imperial values (pounds and inches) or metric units (kilograms and meters), the tool executes the official standard bmi formula:
              </p>
              <div className="space-y-4">
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border">
                  <p className="font-bold text-xs uppercase text-muted-foreground mb-2">Metric System</p>
                  BMI = Weight (kg) / Height (m)²
                </div>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border">
                  <p className="font-bold text-xs uppercase text-muted-foreground mb-2">Imperial System</p>
                  BMI = (Weight (lbs) / Height (in)²) × 703
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                By dividing your physical mass by the square of your height, the calculation yields a baseline score that health professionals use to identify potential weight-related risk factors without requiring costly clinical body fat scans.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Reading the Official BMI Index Chart
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once our system processes your metrics, your final numerical score corresponds to specific zones outlined by the World Health Organization (WHO) and the Centers for Disease Control (CDC). You can cross-reference your results directly against the standard bmi index chart thresholds below:
              </p>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold">BMI Score Range</TableHead>
                      <TableHead className="text-right font-bold">Classification Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs">Below 18.5</TableCell>
                      <TableCell className="text-right text-xs font-bold text-blue-500">Underweight</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs">18.5 – 24.9</TableCell>
                      <TableCell className="text-right text-xs font-bold text-green-600">Normal / Healthy Weight</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs">25.0 – 29.9</TableCell>
                      <TableCell className="text-right text-xs font-bold text-yellow-600">Overweight</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs">30.0 and Above</TableCell>
                      <TableCell className="text-right text-xs font-bold text-red-500">Obese</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Why Track Your BMI with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                While your specific bmi score does not directly isolate lean muscle tissue from body fat mass, it remains an excellent, universally accepted indicator for tracking macro fitness progress. Using our responsive dashboard helps you stay informed, analyze physical adjustments over time, and establish practical benchmarks for your diet, gym performance, and lifestyle routines.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex gap-3 text-xs text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>Analyze physical adjustments over time</span>
                </li>
                <li className="flex gap-3 text-xs text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>Establish practical benchmarks for diet and exercise</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
