"use client"

import { useState, useEffect, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Youtube, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Info, 
  Zap, 
  History, 
  ChevronRight,
  Calculator,
  Video,
  Play,
  Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference.
const metadata: Metadata = {
  title: 'YouTube Revenue Calculator | Estimate Shorts & Video Earnings',
  description: 'Estimate your video earnings instantly with our free YouTube revenue calculator. Compare Shorts and Long-form payouts using custom RPM and view metrics.',
  keywords: [
    'youtube money views calculator',
    'youtube revenue calculator',
    'youtube earnings calculator',
    'estimated youtube earnings',
    'youtube shorts money calculator',
    'MyApexCalc',
    'creator earnings estimator',
    'CPM calculator'
  ],
  
  openGraph: {
    title: 'Interactive YouTube Money & Revenue Calculator | MyApexCalc',
    description: 'Track your potential channel payout. Analyze your estimated youtube earnings for both Shorts and long-form videos with custom RPM variables.',
    url: 'https://www.myapexcalc.com/calculators/youtube-revenue',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/b5cf2xS0/youtube-revenue-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc YouTube Money Calculator and Milestone Projection Board',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Estimated YouTube Earnings Calculator | MyApexCalc',
    description: 'Quickly calculate your potential ad revenue utilizing daily views and customizable CPM bounds for all video formats.',
    images: ['https://i.ibb.co/b5cf2xS0/youtube-revenue-calculator.png'],
  },

  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/youtube-revenue',
  },
};

type ContentType = 'long-form' | 'shorts';

export default function YouTubeRevenuePage() {
  const [mode, setMode] = useState<ContentType>('long-form');
  const [dailyViews, setDailyViews] = useState(50000);
  const [rpm, setRpm] = useState(4.50);

  // Defaults for mode switching
  useEffect(() => {
    if (mode === 'shorts') {
      setDailyViews(500000);
      setRpm(0.35);
    } else {
      setDailyViews(50000);
      setRpm(4.50);
    }
  }, [mode]);

  const earnings = useMemo(() => {
    // Formula from image: Revenue = (Views / 1000) * RPM
    const daily = (dailyViews / 1000) * rpm;
    return {
      daily,
      monthly: daily * 30,
      yearly: daily * 365
    };
  }, [dailyViews, rpm]);

  const milestoneViews = useMemo(() => {
    return mode === 'long-form' 
      ? [
          { label: 'Micro Creator', views: 1000 },
          { label: 'Growing Channel', views: 10000 },
          { label: 'Mid-Tier Partner', views: 50000 },
          { label: 'Full-Time YouTuber', views: 100000 },
          { label: 'Major Influencer', views: 500000 },
          { label: 'Viral Sensation', views: 1000000 },
        ]
      : [
          { label: 'Shorts Newcomer', views: 10000 },
          { label: 'Daily Poster', views: 100000 },
          { label: 'Trending Creator', views: 500000 },
          { label: 'Viral Shorts Star', views: 2000000 },
          { label: 'Top Tier Channel', views: 5000000 },
          { label: 'Global Sensation', views: 10000000 },
        ];
  }, [mode]);

  return (
    <CalculatorWrapper
      title="YouTube Money Calculator"
      description="Estimate potential channel earnings for both Long-form videos and YouTube Shorts based on daily view counts and format-specific RPM."
      icon={Youtube}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="long-form" className="gap-2">
                    <Video size={14} /> Long-form
                  </TabsTrigger>
                  <TabsTrigger value="shorts" className="gap-2">
                    <Play size={14} className="fill-current" /> Shorts
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="dailyViews" className="font-semibold">Daily Video Views</Label>
                  <Badge variant="secondary" className="text-sm px-3 font-mono">
                    {dailyViews.toLocaleString()}
                  </Badge>
                </div>
                <Slider
                  value={[dailyViews]}
                  min={100}
                  max={mode === 'shorts' ? 10000000 : 2000000}
                  step={mode === 'shorts' ? 10000 : 1000}
                  onValueChange={(val) => setDailyViews(val[0])}
                />
                <div className="relative">
                  <Eye className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="dailyViews"
                    type="number"
                    value={dailyViews}
                    onChange={(e) => setDailyViews(Math.max(0, Number(e.target.value)))}
                    className="pl-9 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="rpm" className="font-semibold">Estimated RPM ($ per 1k views)</Label>
                  <Badge className="bg-accent">${rpm.toFixed(2)}</Badge>
                </div>
                <Slider
                  value={[rpm]}
                  min={0.01}
                  max={mode === 'shorts' ? 2.00 : 20.00}
                  step={0.05}
                  onValueChange={(val) => setRpm(val[0])}
                />
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="rpm"
                    type="number"
                    step="0.01"
                    value={rpm}
                    onChange={(e) => setRpm(Math.max(0, Number(e.target.value)))}
                    className="pl-9 font-mono"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                  {mode === 'long-form' 
                    ? "Standard long-form RPM typically ranges from $1.00 to $10.00+, depending on niche and audience."
                    : "Shorts RPM is usually lower, typically between $0.05 and $0.50 per 1,000 engaged views."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Info className="w-4 h-4 text-primary" />
                Revenue Model
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[10px] text-muted-foreground leading-relaxed">
              Revenue is calculated using the standard creator formula: <strong>(Total Views / 1,000) × RPM</strong>. 
              Actual payouts may vary based on ad-skipping, premium views, and geographic location.
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-l-4 border-l-amber-500 shadow-sm">
              <CardHeader className="pb-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Daily Estimate</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline text-foreground font-mono">
                  ${earnings.daily.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-emerald-500 shadow-sm">
              <CardHeader className="pb-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Monthly Estimate</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline text-foreground font-mono">
                  ${Math.round(earnings.monthly).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-none shadow-md">
              <CardHeader className="pb-2">
                <span className="text-[10px] uppercase tracking-wider text-primary-foreground/80 font-bold">Yearly Estimate</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline font-mono">
                  ${Math.round(earnings.yearly).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                {mode === 'long-form' ? 'Video Milestone Projections' : 'Shorts Milestone Projections'}
              </CardTitle>
              <CardDescription>
                Estimated revenue generation for various view tiers based on your current <strong>${rpm.toFixed(2)} RPM</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Tier Status</TableHead>
                    <TableHead>Daily Views</TableHead>
                    <TableHead className="text-right">Monthly Range</TableHead>
                    <TableHead className="text-right">Yearly Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {milestoneViews.map((milestone) => {
                    const mVal = (milestone.views / 1000) * rpm * 30;
                    const yVal = (milestone.views / 1000) * rpm * 365;

                    return (
                      <TableRow key={milestone.label} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-medium text-primary text-xs">{milestone.label}</TableCell>
                        <TableCell className="font-mono text-[10px]">{milestone.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold">
                          ${Math.round(mVal).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-accent font-black">
                          ${Math.round(yVal).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Maximize Your Creator Strategy with MyApexCalc
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are producing high-energy Shorts or deep-dive long-form content, understanding how views translate into revenue is essential. Monetization varies wildly between these formats due to how ads are served and how the revenue pool is shared. Our free online YouTube revenue calculator provides a precise comparison, helping you estimate your channel earnings across both content types instantly.
              </p>
              
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
                <Calculator className="w-6 h-6" />
                Deciphering the Math: Shorts vs. Long-form
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  The primary difference in earnings comes down to the RPM (Revenue Per Mille), which represents the amount you earn per 1,000 views. Shorts typically have a much lower RPM because they share a combined ad pool, whereas long-form videos serve traditional ads.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-bold text-sm text-foreground">1. YouTube Shorts Calculation</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">For Shorts, revenue is calculated based on engaged views. Using the standard creator pool model shown in the reference data:</p>
                    <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                      Revenue = (Engaged Views / 1,000) × RPM
                    </div>
                    <p className="text-xs text-muted-foreground pt-2 italic">
                      Example: If you have 2,000,000 engaged views and an RPM of $0.35, your estimated payout is <strong>$700</strong>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-sm text-foreground">2. Long-form Video Calculation</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Long-form videos rely on direct ad placements on your specific content, yielding significantly higher RPMs:</p>
                    <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                      Revenue = (Views / 1,000) × RPM
                    </div>
                    <p className="text-xs text-muted-foreground pt-2 italic">
                      Example: With 2,000,000 views and a $4.50 RPM, your total earnings would be <strong>$9,000</strong>.
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed pt-2">
                  By comparing these results, you can see that while Shorts generate massive reach, long-form content remains the most efficient way to build high-yield revenue on the platform.
                </p>
              </div>
            </section>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  Why Plan Your Channel with MyApexCalc?
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vanity metrics like total views are exciting, but net revenue is what builds a real creative business. Our advanced calculator delivers:
                </p>
                <ul className="space-y-6 pt-2">
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Dual Format Modeling</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Switch between Shorts and Long-form modes to compare how different content formats impact your bottom line.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                      <Zap className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Customizable RPM Bounds</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Adjust your RPM thresholds to match your specific niche. Finance and Tech often have much higher rates than Gaming or Lifestyle.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Milestone Projections</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">View daily, monthly, and yearly estimates to set realistic growth targets for your creative career.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
                <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-tight italic">
                  "In the creator economy, data is the foundation of growth. Understanding your revenue potential allows you to scale your content business with confidence."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
