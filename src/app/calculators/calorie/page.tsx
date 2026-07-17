
"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Zap, Calculator, TrendingUp, ChevronRight, History, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate Calorie Calculator | Free Daily TDEE & Deficit Tracker',
  description: 'Estimate your daily caloric needs using our free calorie calculator. Calculate your maintenance baseline, plan a custom calorie deficit, and track your weight loss progress instantly.',
  keywords: [
    'calorie calculator',
    'calorie deficit calculator',
    'calorie and weight loss calculator',
    'kcal counter',
    'calorie counter',
    'MyApexCalc',
    'TDEE calculator',
    'BMR calculator'
  ],
  
  // Open Graph for social sharing platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Daily Calorie & Deficit Calculator | MyApexCalc',
    description: 'Calculate your daily energy expenditure instantly. Use our scientific kcal counter and weight loss calculator to map out your nutrition benchmarks.',
    url: 'https://www.myapexcalc.com/calculators/calorie',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/tMhtk144/calorie-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Calorie Calculator and Weight Goals Dashboard Layout',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Daily Calorie & Kcal Counter | MyApexCalc',
    description: 'Find your precise daily calorie goals and build a safe, manageable calorie deficit plan based on your active lifestyle.',
    images: ['https://i.ibb.co/tMhtk144/calorie-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent duplicate indexing
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/calorie',
  },
};

export default function CaloriePage() {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [activity, setActivity] = useState('1.375');
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    
    setCalories(bmr * Number(activity));
  }, [age, gender, weight, height, activity]);

  return (
    <CalculatorWrapper
      title="Calorie Calculator"
      description="Estimate your daily caloric needs based on your physical metrics and lifestyle activity levels."
      icon={Zap}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Label>Gender</Label>
              <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
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
                <Label>Age (years)</Label>
                <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.2">Sedentary (Little/no exercise)</SelectItem>
                  <SelectItem value="1.375">Light (1-3 days/week)</SelectItem>
                  <SelectItem value="1.55">Moderate (3-5 days/week)</SelectItem>
                  <SelectItem value="1.725">Active (6-7 days/week)</SelectItem>
                  <SelectItem value="1.9">Very Active (Twice a day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-white">
            <CardHeader className="pb-0 pt-8 text-center">
              <CardTitle className="text-xs uppercase tracking-widest opacity-80">Daily Maintenance Calories</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-10">
              <div className="text-6xl font-bold font-headline">
                {Math.round(calories)}
              </div>
              <p className="mt-2 text-primary-foreground/70 font-medium">Calories/Day (TDEE)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weight Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Mild Weight Loss (0.25kg/wk)</span>
                <span className="font-semibold text-accent">{Math.round(calories - 250)} kcal</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground font-bold">Weight Loss (0.5kg/wk)</span>
                <span className="font-bold text-accent">{Math.round(calories - 500)} kcal</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Extreme Weight Loss (1kg/wk)</span>
                <span className="font-semibold text-red-500">{Math.round(calories - 1000)} kcal</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Mild Weight Gain (0.25kg/wk)</span>
                <span className="font-semibold text-green-600">{Math.round(calories + 250)} kcal</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic mt-4 leading-relaxed">
                * Extreme weight loss targets should be monitored by a professional. Caloric needs depend on metabolism, body composition, and exact daily activity level.
              </p>
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
              Take Charge of Your Nutrition with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are looking to trim body fat, build lean muscle mass, or simply maintain your current physique, managing your energy balance is the absolute foundation of physical change. Our accurate online calorie calculator takes the guesswork out of meal planning and nutrition. By processing your unique physical metrics, this responsive kcal counter acts as an all-in-one daily dashboard to help you align your dietary habits with your personal wellness benchmarks.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              Calculating Your Maintenance (TDEE) and Deficit
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                To lose, gain, or maintain weight, your body relies on the laws of thermodynamics. Our platform utilizes the scientifically validated Mifflin-St Jeor equation to find your Basal Metabolic Rate (BMR)—the baseline energy your body burns at absolute rest—and multiplies it by your activity level to establish your Total Daily Energy Expenditure (TDEE).
              </p>
              <p className="text-muted-foreground leading-relaxed font-medium">
                If your goal is shedding fat, our calorie deficit calculator simplifies the process by computing safe, sustainable pacing structures relative to your TDEE:
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border">
                  <p className="font-bold text-xs uppercase text-muted-foreground mb-2">The Energy Balance Formula</p>
                  TDEE (Maintenance) = BMR × Activity Multiplier
                </div>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border">
                  <p className="font-bold text-xs uppercase text-muted-foreground mb-2">The Deficit Formula for Fat Loss</p>
                  Daily Caloric Target = TDEE - Target Deficit (e.g., 500 kcal)
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                For example, if your daily maintenance baseline is 2,300 kcal, subtracting a standard 500 kcal daily deficit establishes a target of 1,800 kcal. Over a week, this cumulative energy deficit of 3,500 kcal corresponds to roughly 0.5 kg (1 lb) of fat loss.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Choose MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tracking your macro goals doesn't require complex pen-and-paper math. Our advanced calorie and weight loss calculator provides:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Custom Activity Scaling</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">From sedentary desk lifestyles to highly active athletic routines, scale your output to match your true daily movement.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Streamlined Weight Milestones</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">View calculated intake adjustments for mild weight loss, aggressive fat loss, or structured clean bulking.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Instant Dynamic Updates</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Slide or adjust your age, weight, and height to see your calculated daily kcal requirements change in real-time.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-3">
              <h4 className="text-sm font-black uppercase tracking-widest text-primary">Nutrition Tip</h4>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "Consistency over intensity. Small, sustainable calorie deficits are statistically more likely to result in long-term weight maintenance than crash diets."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
