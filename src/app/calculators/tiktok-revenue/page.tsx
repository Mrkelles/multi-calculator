"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Music2, Eye, DollarSign, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

export default function TikTokRevenuePage() {
  const [views, setViews] = useState(50000);
  const [rpm, setRpm] = useState(0.80); // Typical TikTok Creativity Program RPM
  const [earnings, setEarnings] = useState({ daily: 0, monthly: 0, yearly: 0 });

  useEffect(() => {
    const daily = (views / 1000) * rpm;
    setEarnings({
      daily,
      monthly: daily * 30,
      yearly: daily * 365
    });
  }, [views, rpm]);

  return (
    <CalculatorWrapper
      title="TikTok Money Calculator"
      description="Estimate potential earnings from the TikTok Creativity Program or Brand Deals based on your video views."
      icon={Music2}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">View Metrics</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Daily Video Views</Label>
                  <Badge variant="secondary" className="font-mono">{views.toLocaleString()}</Badge>
                </div>
                <Slider value={[views]} min={1000} max={10000000} step={1000} onValueChange={(v) => setViews(v[0])} />
                <Input type="number" value={views} onChange={(e) => setViews(Number(e.target.value))} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Estimated RPM ($ per 1k views)</Label>
                  <Badge className="bg-accent">{rpm.toFixed(2)}</Badge>
                </div>
                <Slider value={[rpm]} min={0.01} max={5.00} step={0.05} onValueChange={(v) => setRpm(v[0])} />
                <p className="text-[10px] text-muted-foreground italic">Creator Fund is usually $0.02 - $0.04. Creativity Program (Longer videos) is $0.50 - $1.20.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-b-4 border-b-primary shadow-sm">
              <CardHeader className="pb-1"><span className="text-[10px] uppercase font-bold text-muted-foreground">Daily</span></CardHeader>
              <CardContent><div className="text-2xl font-bold font-mono text-primary">${earnings.daily.toFixed(2)}</div></CardContent>
            </Card>
            <Card className="bg-white border-b-4 border-b-accent shadow-sm">
              <CardHeader className="pb-1"><span className="text-[10px] uppercase font-bold text-muted-foreground">Monthly</span></CardHeader>
              <CardContent><div className="text-2xl font-bold font-mono text-accent">${Math.round(earnings.monthly).toLocaleString()}</div></CardContent>
            </Card>
            <Card className="bg-primary text-white shadow-md">
              <CardHeader className="pb-1"><span className="text-[10px] uppercase font-bold text-white/70">Yearly</span></CardHeader>
              <CardContent><div className="text-2xl font-bold font-mono">${Math.round(earnings.yearly).toLocaleString()}</div></CardContent>
            </Card>
          </div>

          <Card className="bg-muted/20">
            <CardHeader><CardTitle className="text-sm">Brand Deal Estimates</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border">
                <span className="text-xs font-medium">Estimated Brand Pay / Video</span>
                <span className="font-bold text-primary">${(views * 0.01).toLocaleString()} - ${(views * 0.025).toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Brand deals typically pay $10 - $25 per 1,000 views depending on niche and engagement.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
