"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
    </CalculatorWrapper>
  );
}