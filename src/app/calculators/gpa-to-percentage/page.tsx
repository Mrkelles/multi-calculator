"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GPAToPercentagePage() {
  const [gpa, setGpa] = useState(3.5);
  const [scale, setScale] = useState('4.0');
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Basic conversion logic (standard US university estimate)
    // Percentage = (GPA / Scale) * 100
    // Note: In some regions like India, the formula is different (e.g. (GPA-0.5)*10 for 10-point scale)
    // We will stick to the proportional scale for this standard tool.
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
    </CalculatorWrapper>
  );
}
