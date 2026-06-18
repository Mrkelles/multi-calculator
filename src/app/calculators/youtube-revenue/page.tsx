"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { Youtube, Eye, DollarSign, TrendingUp, Calendar, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function YouTubeRevenuePage() {
  const [dailyViews, setDailyViews] = useState(5000);
  const [minCpm, setMinCpm] = useState(0.25);
  const [maxCpm, setMaxCpm] = useState(4.00);

  const [earnings, setEarnings] = useState({
    dailyMin: 0,
    dailyMax: 0,
    monthlyMin: 0,
    monthlyMax: 0,
    yearlyMin: 0,
    yearlyMax: 0,
  });

  useEffect(() => {
    const dMin = (dailyViews / 1000) * minCpm;
    const dMax = (dailyViews / 1000) * maxCpm;

    setEarnings({
      dailyMin: dMin,
      dailyMax: dMax,
      monthlyMin: dMin * 30,
      monthlyMax: dMax * 30,
      yearlyMin: dMin * 365,
      yearlyMax: dMax * 365,
    });
  }, [dailyViews, minCpm, maxCpm]);

  const milestoneViews = [
    { label: 'Micro Creator', views: 1000 },
    { label: 'Growing Channel', views: 10000 },
    { label: 'Mid-Tier Partner', views: 50000 },
    { label: 'Full-Time YouTuber', views: 100000 },
    { label: 'Major Influencer', views: 500000 },
    { label: 'Viral Sensation', views: 1000000 },
  ];

  return (
    <CalculatorWrapper
      title="YouTube Money Calculator"
      description="Estimate your companion channel earnings or projected revenue based on daily view count benchmarks modeled after Social Blade."
      icon={Youtube}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <Eye className="w-5 h-5" />
                View Count Metrics
              </CardTitle>
              <CardDescription>Drag the slider or insert your estimated daily video views.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="dailyViews" className="font-semibold">Estimated Daily Views</Label>
                  <Badge variant="secondary" className="text-sm px-3 font-mono">
                    {dailyViews.toLocaleString()}
                  </Badge>
                </div>
                <Slider
                  value={[dailyViews]}
                  min={100}
                  max={2000000}
                  step={500}
                  onValueChange={(val) => setDailyViews(val[0])}
                />
                <Input
                  id="dailyViews"
                  type="number"
                  value={dailyViews}
                  onChange={(e) => setDailyViews(Math.max(0, Number(e.target.value)))}
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <DollarSign className="w-5 h-5" />
                CPM Bounds (Earnings per 1K Views)
              </CardTitle>
              <CardDescription>Social Blade standard bounds range from $0.25 to $4.00 default.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="minCpm">Minimum Estimated CPM</Label>
                  <span className="font-mono font-bold text-sm text-muted-foreground">${minCpm.toFixed(2)}</span>
                </div>
                <Slider
                  value={[minCpm]}
                  min={0.10}
                  max={5.00}
                  step={0.05}
                  onValueChange={(val) => setMinCpm(val[0])}
                />
                <Input
                  id="minCpm"
                  type="number"
                  step="0.01"
                  value={minCpm}
                  onChange={(e) => setMinCpm(Math.max(0, Number(e.target.value)))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="maxCpm">Maximum Estimated CPM</Label>
                  <span className="font-mono font-bold text-sm text-primary">${maxCpm.toFixed(2)}</span>
                </div>
                <Slider
                  value={[maxCpm]}
                  min={1.00}
                  max={25.00}
                  step={0.25}
                  onValueChange={(val) => setMaxCpm(val[0])}
                />
                <Input
                  id="maxCpm"
                  type="number"
                  step="0.01"
                  value={maxCpm}
                  onChange={(e) => setMaxCpm(Math.max(0, Number(e.target.value)))}
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-l-4 border-l-amber-500 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Estimated Daily</span>
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold font-headline text-foreground font-mono">
                  ${earnings.dailyMin.toFixed(2)} - ${earnings.dailyMax.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-emerald-500 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Estimated Monthly</span>
                  <Calendar className="w-4 h-4 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold font-headline text-foreground font-mono">
                  ${Math.round(earnings.monthlyMin).toLocaleString()} - ${Math.round(earnings.monthlyMax).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-primary-foreground/80 font-bold">Estimated Yearly</span>
                  <Youtube className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold font-headline font-mono">
                  ${Math.round(earnings.yearlyMin).toLocaleString()} - ${Math.round(earnings.yearlyMax).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Milestone Projection Table</CardTitle>
              <CardDescription>Estimated revenue generation scales for various levels of creator views based on your current CPM configuration.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier Status</TableHead>
                    <TableHead>Daily Views</TableHead>
                    <TableHead className="text-right">Monthly Range</TableHead>
                    <TableHead className="text-right">Yearly Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {milestoneViews.map((milestone) => {
                    const mMin = (milestone.views / 1000) * minCpm * 30;
                    const mMax = (milestone.views / 1000) * maxCpm * 30;
                    const yMin = (milestone.views / 1000) * minCpm * 365;
                    const yMax = (milestone.views / 1000) * maxCpm * 365;

                    return (
                      <TableRow key={milestone.label}>
                        <TableCell className="font-medium text-primary">{milestone.label}</TableCell>
                        <TableCell className="font-mono text-xs">{milestone.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          ${Math.round(mMin).toLocaleString()} - ${Math.round(mMax).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-accent font-semibold">
                          ${Math.round(yMin).toLocaleString()} - ${Math.round(yMax).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>About the Estimate:</strong> This cash projections model calculates earnings possibilities before YouTube split fees, country taxes, or production overheads. Standard CPM rates oscillate heavily depending on view retention metrics, audience geography, age brackets, and content vertical premium levels.
            </p>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
