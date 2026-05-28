"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export default function YouTubeRevenuePage() {
  const [views, setViews] = useState(100000);
  const [cpm, setCpm] = useState(4);
  const [earnings, setEarnings] = useState({ daily: 0, monthly: 0, yearly: 0 });

  useEffect(() => {
    const dailyViews = views;
    const revenue = (dailyViews / 1000) * cpm;
    setEarnings({
      daily: revenue,
      monthly: revenue * 30,
      yearly: revenue * 365,
    });
  }, [views, cpm]);

  return (
    <CalculatorWrapper
      title="YouTube Revenue Estimator"
      description="Estimate potential earnings for your YouTube channel based on daily video views and average CPM rates."
      icon={Youtube}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Channel Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="views">Daily Video Views</Label>
                <span className="text-lg font-bold text-primary">{views.toLocaleString()}</span>
              </div>
              <Slider
                value={[views]}
                min={1000}
                max={5000000}
                step={1000}
                onValueChange={(val) => setViews(val[0])}
              />
              <div className="pt-2">
                <Input
                  type="number"
                  value={views}
                  onChange={(e) => setViews(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="cpm">Estimated CPM ($)</Label>
                <span className="text-lg font-bold text-accent">${cpm.toFixed(2)}</span>
              </div>
              <Slider
                value={[cpm]}
                min={0.25}
                max={20}
                step={0.25}
                onValueChange={(val) => setCpm(val[0])}
              />
              <p className="text-xs text-muted-foreground italic">CPM varies by niche, audience location, and season.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-primary text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-widest opacity-70">Daily Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-headline">${earnings.daily.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-accent text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-widest opacity-70">Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-headline">${earnings.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-widest text-primary">Yearly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold font-headline text-primary">${earnings.yearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Important Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Actual earnings are significantly affected by the percentage of monetized views (playback-based), ad types, audience demographics, and the YouTube revenue split (YouTube usually takes 45%).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorWrapper>
  );
}