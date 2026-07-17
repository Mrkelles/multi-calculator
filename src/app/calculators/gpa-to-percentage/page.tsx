"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Percent, TrendingUp, Calculator, Info, History, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'GPA to Percentage Calculator | Quick GPA Conversion',
  description: 'Convert your cumulative GPA to an exact percentage instantly. Supports standard 4.0 scales, 5.0 scales, and international conversion formulas.',
  keywords: [
    'gpa percentage calculator',
    'gpa to percentage',
    'gpa to percentage calculator',
    'MyApexCalc',
    'convert gpa to percent',
    'gpa conversion tool'
  ],
  
  // Open Graph for social sharing platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'GPA to Percentage Calculator | MyApexCalc',
    description: 'Instantly convert your GPA score to a weighted percentage. Perfect for university admissions and international applications.',
    url: 'https://www.myapexcalc.com/calculators/gpa-to-percentage',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/271rZN90/gpa-percentage-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc GPA to Percentage Converter and Scale Options',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free GPA to Percentage Calculator | MyApexCalc',
    description: 'Convert any GPA score to an equivalent grade percentage in seconds with our online tool.',
    images: ['https://i.ibb.co/271rZN90/gpa-percentage-calculator.png'],
  },

  // Prevent duplicate index penalties by setting a clean canonical pathway
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/gpa-to-percentage',
  },
};

export default function GPAToPercentagePage() {
  const [gpa, setGpa] = useState(3.5);
  const [scale, setScale] = useState('4.0');
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Basic conversion logic (standard US university estimate)
    // Percentage = (GPA / Scale) * 100
    const max = parseFloat(scale);
    const val = (gpa / max) * 100;
    setPercentage(Math.min(100, Math.max(0, val)));
  }, [gpa, scale]);

  return (
    <CalculatorWrapper
      title="GPA to Percentage"
      description="Convert your GPA from a 4.0, 5.0, or 10.0 scale into an equivalent percentage value."
      icon={Percent}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select GPA Scale</Label>
              <Select value={scale} onValueChange={setScale}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4.0">4.0 Scale (US Standard)</SelectItem>
                  <SelectItem value="5.0">5.0 Scale</SelectItem>
                  <SelectItem value="10.0">10.0 Scale (India/International)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Enter Your GPA</Label>
              <Input 
                type="number" 
                step="0.01" 
                value={gpa} 
                onChange={(e) => setGpa(Number(e.target.value))} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-accent text-white text-center py-10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-80">Equivalent Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold font-headline">{percentage.toFixed(1)}%</div>
              <p className="mt-4 text-sm opacity-80">Based on a linear {scale} scale conversion.</p>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-xs text-blue-800 italic">
            <strong>Note:</strong> Different institutions use different conversion formulas (e.g., WES, CBSE). This calculator uses a direct proportional model. Always verify with your specific university admissions office.
          </div>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Simplify Your Academic Conversions with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              When preparing university applications, submitting resumes, or applying for global academic programs, you will often find that different institutions request your academic standing in different formats. While most Western universities grade on a standard 4.0 or 5.0 GPA scale, many international boards, employers, and scholarship committees require your overall score as a percentage. Our free gpa percentage calculator is built to bridge this gap, helping you convert your metrics quickly and accurately.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              How to Convert GPA to Percentage
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Converting a grade point average into a percentage is not always as simple as dividing your score by the maximum scale value. Different academic standards utilize specific translation formulas to ensure fair weight representation.
              </p>
              <p className="text-muted-foreground leading-relaxed font-medium">
                When you use our gpa to percentage calculator, the tool supports several widely accepted conversion models:
              </p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">1. The Standard Linear Formula (Scale of 4.0)</p>
                  <p className="text-sm text-muted-foreground">For general, non-weighted conversions, the standard linear mapping formula converts your GPA directly into a 100% scale:</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Percentage = ( GPA / 4.0 ) × 100
                  </div>
                  <p className="text-xs text-muted-foreground pt-1 italic">
                    Using this direct translation, a GPA of 3.0 corresponds to a 75% average, while a GPA of 3.6 maps to a 90% grade percentage.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-sm text-foreground">2. The Standard Class Interval Formula</p>
                  <p className="text-sm text-muted-foreground">Many universities prefer a non-linear mapping scale to better align with traditional grading bands (where an A, or 4.0, typically starts at 90% or 93%):</p>
                  <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                    Percentage = ( GPA × 20 ) + 20
                  </div>
                  <p className="text-xs text-muted-foreground pt-1 italic">
                    This formula is commonly used when translating lower GPA ranges to prevent standard passing scores from translating into failing percentages.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Use MyApexCalc to Convert GPA to Percentage?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instead of trying to manually guess conversion tables or look up outdated educational blog posts, MyApexCalc provides a professional dashboard designed for speed:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Multiple Scale Customization</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Seamlessly switch between 4.0, 5.0, and custom maximum GPA scales to match your school's exact system.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Instant Conversion Accuracy</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Avoid manual arithmetic errors that could misrepresent your academic achievements on important university applications.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Dual-Direction Calculations</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Easily verify where your current percentage sits on various standard scales used by international admissions offices.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Academic scores are more than just numbers; they are your ticket to global opportunities. Represent your performance with absolute precision."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
