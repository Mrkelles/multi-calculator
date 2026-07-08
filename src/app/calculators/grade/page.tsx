"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  GraduationCap, 
  BookOpen, 
  Target, 
  Plus, 
  Trash2, 
  Info, 
  Calculator,
  History,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface Assignment {
  id: string;
  name: string;
  grade: string; 
  weight: number;
}

const LETTER_GRADE_MAP: Record<string, number> = {
  'A+': 98.5, 'A': 94.5, 'A-': 91,
  'B+': 88, 'B': 84.5, 'B-': 81,
  'C+': 78, 'C': 74.5, 'C-': 71,
  'D+': 68, 'D': 64.5, 'D-': 61,
  'F': 30
};

export default function GradeCalculatorPage() {
  const [mode, setMode] = useState<'current' | 'final'>('current');

  // Mode: Current Grade
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: '1', name: 'Homework', grade: '90', weight: 20 },
    { id: '2', name: 'Quiz', grade: 'B+', weight: 20 },
    { id: '3', name: 'Midterm', grade: '88', weight: 30 },
  ]);

  // Mode: Final Grade
  const [currentGrade, setCurrentGrade] = useState(85);
  const [targetGrade, setTargetGrade] = useState(90);
  const [finalWeight, setFinalWeight] = useState(20);

  const addAssignment = () => {
    setAssignments([...assignments, { id: Math.random().toString(), name: `Item ${assignments.length + 1}`, grade: '', weight: 0 }]);
  };

  const removeAssignment = (id: string) => {
    if (assignments.length > 1) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  const updateAssignment = (id: string, field: keyof Assignment, value: any) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const currentResult = useMemo(() => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    assignments.forEach(a => {
      const inputGrade = a.grade.trim().toUpperCase();
      let score = 0;

      if (LETTER_GRADE_MAP[inputGrade] !== undefined) {
        score = LETTER_GRADE_MAP[inputGrade];
      } else {
        score = parseFloat(inputGrade);
      }

      if (!isNaN(score) && a.weight > 0) {
        totalWeightedScore += (score * (a.weight / 100));
        totalWeight += a.weight;
      }
    });

    const average = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;
    return { average, totalWeight };
  }, [assignments]);

  const finalResult = useMemo(() => {
    const wRemaining = 100 - finalWeight;
    const required = (targetGrade - (currentGrade * (wRemaining / 100))) / (finalWeight / 100);
    return required;
  }, [currentGrade, targetGrade, finalWeight]);

  const gradeScale = [
    { grade: 'A+', range: '97-100%', gpa: '4.0' },
    { grade: 'A', range: '93-96%', gpa: '4.0' },
    { grade: 'A-', range: '90-92%', gpa: '3.7' },
    { grade: 'B+', range: '87-89%', gpa: '3.3' },
    { grade: 'B', range: '83-86%', gpa: '3.0' },
    { grade: 'B-', range: '80-82%', gpa: '2.7' },
    { grade: 'C+', range: '77-79%', gpa: '2.3' },
    { grade: 'C', range: '73-76%', gpa: '2.0' },
    { grade: 'C-', range: '70-72%', gpa: '1.7' },
    { grade: 'D+', range: '67-69%', gpa: '1.3' },
    { grade: 'D', range: '63-66%', gpa: '1.0' },
    { grade: 'D-', range: '60-62%', gpa: '0.7' },
    { grade: 'F', range: '0-59%', gpa: '0.0' },
  ];

  return (
    <CalculatorWrapper
      title="Grade Calculator"
      description="Calculate weighted average grades for your courses or determine the score you need on a final exam to reach your goal."
      icon={BookOpen}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="current" className="text-xs font-bold">Weighted Grade</TabsTrigger>
                  <TabsTrigger value="final" className="text-xs font-bold">Final Grade Goal</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === 'current' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Assessment Log</h3>
                    <Button variant="outline" size="sm" onClick={addAssignment} className="gap-2 h-8">
                      <Plus size={14} /> Add Row
                    </Button>
                  </div>
                  
                  {/* Column Headers */}
                  <div className="grid grid-cols-12 gap-3 px-1 mb-2">
                    <div className="col-span-5"><Label className="text-[10px] uppercase font-black text-muted-foreground/60">Category / Name</Label></div>
                    <div className="col-span-3"><Label className="text-[10px] uppercase font-black text-muted-foreground/60">Grade (% or Letter)</Label></div>
                    <div className="col-span-3"><Label className="text-[10px] uppercase font-black text-muted-foreground/60">Weight (%)</Label></div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="space-y-3">
                    {assignments.map((a) => (
                      <div key={a.id} className="grid grid-cols-12 gap-3 items-center group">
                        <div className="col-span-5">
                          <Input 
                            placeholder="e.g. Midterm" 
                            className="h-9 text-xs" 
                            value={a.name} 
                            onChange={(e) => updateAssignment(a.id, 'name', e.target.value)} 
                          />
                        </div>
                        <div className="col-span-3">
                          <Input 
                            placeholder="e.g. A or 95" 
                            className="h-9 text-xs" 
                            value={a.grade} 
                            onChange={(e) => updateAssignment(a.id, 'grade', e.target.value)} 
                          />
                        </div>
                        <div className="col-span-3 relative">
                          <Input 
                            placeholder="e.g. 25" 
                            type="number" 
                            className="h-9 text-xs pr-7" 
                            value={a.weight || ''} 
                            onChange={(e) => updateAssignment(a.id, 'weight', Number(e.target.value))} 
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">%</span>
                        </div>
                        <div className="col-span-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => removeAssignment(a.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentResult.totalWeight > 100 && (
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-3 text-amber-800">
                      <Info size={16} className="shrink-0 mt-0.5" />
                      <p className="text-[10px] leading-relaxed">
                        <strong>Warning:</strong> Your total weight is {currentResult.totalWeight}%. Usually, weights sum to 100%. The current calculation shows the relative average of logged weights.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Current Overall Grade (%)</Label>
                    <div className="relative">
                      <Input type="number" value={currentGrade} onChange={(e) => setCurrentGrade(Number(e.target.value))} className="pr-8" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Target Course Grade (%)</Label>
                    <div className="relative">
                      <Input type="number" value={targetGrade} onChange={(e) => setTargetGrade(Number(e.target.value))} className="pr-8" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Final Exam Weight (%)</Label>
                    <div className="relative">
                      <Input type="number" value={finalWeight} onChange={(e) => setFinalWeight(Number(e.target.value))} className="pr-8" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-4">
            <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-primary font-bold">Input Flexibility</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You can enter numbers (e.g., "85") or letter grades (e.g., "A-") in the grade column. Letters are automatically converted to their standard percentage midpoint according to the scale below.
              </p>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <GraduationCap className="w-20 h-20" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-xs uppercase tracking-widest opacity-70 font-bold text-center">
                {mode === 'current' ? 'Current Standing' : 'Required Final Score'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2 pb-10 relative z-10">
              <div className="text-7xl font-black font-headline tracking-tighter">
                {mode === 'current' ? Math.round(currentResult.average) : Math.max(0, Math.round(finalResult))}
                <span className="text-3xl opacity-60 ml-1">%</span>
              </div>
              <Separator className="bg-white/20 my-4" />
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold opacity-60">Estimation</p>
                <p className="text-xl font-bold">
                  {mode === 'current' 
                    ? (currentResult.average >= 90 ? 'Excellent' : currentResult.average >= 80 ? 'Good' : currentResult.average >= 70 ? 'Fair' : 'Low')
                    : (finalResult > 100 ? 'Needs Extra Credit' : finalResult > 90 ? 'Challenging' : 'Achievable')}
                </p>
              </div>
            </CardContent>
          </Card>

          {mode === 'final' && finalResult > 100 && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-xs font-medium leading-relaxed italic">
              * Based on your current grade and target, you would need more than 100% on the final exam. Consider Talking to your instructor about bonus work.
            </div>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Syllabus Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Logged Weight</span>
                <span className="font-bold">{mode === 'current' ? currentResult.totalWeight : (100 - finalWeight)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Course Remaining</span>
                <span className="font-bold">{mode === 'current' ? Math.max(0, 100 - currentResult.totalWeight) : finalWeight}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grade Table Reference */}
        <div className="lg:col-span-12 py-10 space-y-8">
          <Separator />
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-primary">Standard Grade Scale Reference</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use this table to understand how percentage ranges map to letter grades and GPA points. This is the logic used by our auto-parsing engine.
            </p>
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">Letter Grade</TableHead>
                    <TableHead className="font-bold">Percentage Range</TableHead>
                    <TableHead className="text-right font-bold">GPA Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradeScale.map((item) => (
                    <TableRow key={item.grade} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-bold text-primary">{item.grade}</TableCell>
                      <TableCell className="font-medium text-xs">{item.range}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-xs">{item.gpa}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Educational Text Section */}
        <div className="lg:col-span-12 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Understanding Your Grades
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Calculating your current standing in a class is vital for academic success. Most modern courses use a <strong>weighted system</strong>, where different types of work (like exams, homework, and participation) contribute differently to your final mark.
              </p>
              <h4 className="font-bold text-foreground">How the Final Grade Calculator Works</h4>
              <p className="text-muted-foreground leading-relaxed">
                The final grade tool is designed for "end-of-semester" planning. It answers the question: <em>"What do I need on the final to get an A?"</em> It assumes your final exam is the only remaining piece of work and calculates the necessary score based on your current cumulative average.
              </p>
            </section>

            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Features & Accuracy</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Target className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Goal Setting</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Use the <strong>Final Grade Mode</strong> to reverse-engineer your required exam performance. This helps reduce test anxiety by providing a concrete target.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Dynamic Categories</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Add as many assignment categories as you need. Whether your syllabus has 3 items or 20, our engine scales to fit your course structure.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Percent className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Weight Validation</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Our calculator alerts you if your weights don't sum to 100%, ensuring you don't miscalculate due to a missing syllabus item.</p>
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
