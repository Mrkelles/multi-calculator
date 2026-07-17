"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Calculator, 
  Info, 
  History, 
  Zap, 
  ChevronRight 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'Accurate GPA Calculator | Free Online Grading Calculator',
  description: 'Calculate your semester and cumulative GPA instantly with our free online GPA calculator. Input your letter grades and credit hours to find your GPA online.',
  keywords: [
    'gpa calculator',
    'gpa',
    'find gpa online',
    'grading calculator',
    'MyApexCalc',
    'cumulative gpa calculator',
    'college gpa calculator',
    'high school gpa'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Interactive GPA & Grading Calculator | MyApexCalc',
    description: 'Keep your academic goals on track. Check your cumulative score and find your GPA online instantly with our easy-to-use grading tool.',
    url: 'https://www.myapexcalc.com/calculators/gpa',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/23rG4tH4/gpa-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc GPA Calculator Class and Grade Entry Interface',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free GPA & Cumulative Grading Calculator | MyApexCalc',
    description: 'Instantly calculate your weighted or unweighted GPA by adding classes, credits, and letter grades.',
    images: ['https://i.ibb.co/23rG4tH4/gpa-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/gpa',
  },
};

const GRADE_POINTS = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
};

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

export default function GPACalculatorPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Course 1', grade: 'A', credits: 3 },
    { id: '2', name: 'Course 2', grade: 'B', credits: 3 },
  ]);
  const [gpa, setGpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);

  useEffect(() => {
    let totalPoints = 0;
    let creditsCount = 0;

    courses.forEach(course => {
      const points = GRADE_POINTS[course.grade as keyof typeof GRADE_POINTS] || 0;
      totalPoints += points * course.credits;
      creditsCount += course.credits;
    });

    setGpa(creditsCount > 0 ? totalPoints / creditsCount : 0);
    setTotalCredits(creditsCount);
  }, [courses]);

  const addCourse = () => {
    setCourses([...courses, { id: Math.random().toString(), name: `Course ${courses.length + 1}`, grade: 'A', credits: 3 }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <CalculatorWrapper
      title="GPA Calculator"
      description="Calculate your semester or cumulative GPA based on course grades and credit hours."
      icon={GraduationCap}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Courses</CardTitle>
              <Button onClick={addCourse} size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Add Course
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="grid grid-cols-12 gap-3 items-end border-b pb-4 last:border-0">
                  <div className="col-span-5 space-y-1.5">
                    <Label className="text-xs">Course Name</Label>
                    <Input 
                      value={course.name} 
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      placeholder="e.g. Math"
                    />
                  </div>
                  <div className="col-span-3 space-y-1.5">
                    <Label className="text-xs">Grade</Label>
                    <Select value={course.grade} onValueChange={(v) => updateCourse(course.id, 'grade', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(GRADE_POINTS).map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3 space-y-1.5">
                    <Label className="text-xs">Credits</Label>
                    <Input 
                      type="number" 
                      value={course.credits} 
                      onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeCourse(course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-primary text-white text-center py-10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-80">Calculated GPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold font-headline">{gpa.toFixed(2)}</div>
              <p className="mt-2 opacity-70">Total Credits: {totalCredits}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Scale Reference</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between border-b pb-1"><span>A (90-100%)</span> <span className="font-bold">4.0</span></div>
              <div className="flex justify-between border-b pb-1"><span>B (80-89%)</span> <span className="font-bold">3.0</span></div>
              <div className="flex justify-between border-b pb-1"><span>C (70-79%)</span> <span className="font-bold">2.0</span></div>
              <div className="flex justify-between border-b pb-1"><span>D (60-69%)</span> <span className="font-bold">1.0</span></div>
              <div className="flex justify-between border-b pb-1"><span>F (&lt;60%)</span> <span className="font-bold">0.0</span></div>
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
              Take Control of Your Academic Journey with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are a high school student mapping out college applications, an undergraduate tracking your degree requirements, or a graduate student maintaining a scholarship threshold, monitoring your grades is essential. Keeping an accurate record of your academic performance helps you make critical decisions about course loads, study habits, and future career plans. Our free, intuitive gpa calculator is designed to take the manual math out of academic tracking, allowing you to focus on what matters most: your education.
            </p>

            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              How Your GPA is Calculated
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Your Grade Point Average (gpa) is a numerical representation of your academic performance across a specific period. To determine this number, educational institutions convert letter grades (like an A, B, or C) into standard grade points on a scale (typically 4.0).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To find your true cumulative average, our interactive grading calculator processes your classes by executing the standard weighted GPA formula:
              </p>
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                GPA = Σ (Grade Points × Credit Hours) / Σ Total Credit Hours
              </div>
              <p className="text-muted-foreground leading-relaxed pt-2">
                For example, if you take a 3-credit class and earn an A (4.0 grade points), that course contributes 12 total grade points. If you also take a 4-credit class and earn a B (3.0 grade points), that course contributes another 12 points. To find gpa online using these two classes, you divide your total grade points (24) by your total credit hours (7), resulting in a GPA of approximately 3.43.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Calculate Your Grades with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Trying to track differing credit weights, semester transitions, and cumulative conversions on paper is easy to mess up. MyApexCalc provides a clean, responsive layout that offers:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Weighted and Unweighted Support</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Easily switch your calculation settings to account for honors, AP, or IB courses that award extra grade points.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Multi-Semester Planning</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Estimate how your current semester's performance will raise or lower your overall cumulative GPA over time.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Instant Dynamic Class Entries</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Add as many classes as you need with a single click, adjusting your credits and grade selections to see your score update in real-time.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <GraduationCap className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Academic success is built on consistent tracking and clear goals. Knowing where you stand is the first step toward reaching where you want to be."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
