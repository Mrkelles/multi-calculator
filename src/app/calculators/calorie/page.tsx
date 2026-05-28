"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
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
              <p className="mt-2 text-primary-foreground/70">Calories/Day</p>
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
                <span className="text-muted-foreground">Weight Loss (0.5kg/wk)</span>
                <span className="font-semibold text-accent">{Math.round(calories - 500)} kcal</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Mild Weight Gain (0.25kg/wk)</span>
                <span className="font-semibold text-green-600">{Math.round(calories + 250)} kcal</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic mt-4">
                Caloric needs depend on metabolism, body composition, and exact daily activity level. Consult a professional before major diet changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorWrapper>
  );
}