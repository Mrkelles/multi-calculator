"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    </CalculatorWrapper>
  );
}
