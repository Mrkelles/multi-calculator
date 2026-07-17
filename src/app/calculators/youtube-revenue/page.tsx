"use client"

import { useState, useEffect } from 'react';
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
  Calculator 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component to ensure it is picked up by SEO crawlers.
const metadata: Metadata = {
  title: 'YouTube Revenue Calculator | Estimate Your Channel Earnings',
  description: 'Estimate your video earnings instantly with our free YouTube revenue calculator. Input your daily views and CPM bounds to project your monthly and yearly creator payout.',
  keywords: [
    'youtube money views calculator',
    'youtube revenue calculator',
    'youtube earnings calculator',
    'estimated youtube earnings',
    'MyApexCalc',
    'creator earnings estimator',
    'CPM calculator'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Interactive YouTube Money & Revenue Calculator | MyApexCalc',
    description: 'Track your potential channel payout. Analyze your estimated youtube earnings based on custom view metrics and CPM variables.',
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

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Estimated YouTube Earnings Calculator | MyApexCalc',
    description: 'Quickly calculate your potential ad revenue utilizing daily views and customizable CPM bounds.',
    images: ['https://i.ibb.co/b5cf2xS0/youtube-revenue-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/youtube-revenue',
  },
};

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

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Maximize Your Creator Earnings with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              With the creator economy expanding rapidly, understanding how views translate into revenue is essential for channels of all sizes. Whether you are a micro-creator looking to go full-time or an established influencer projecting your next quarter's payout, estimating your platform earnings can feel like a guessing game. Our free online youtube revenue calculator removes the mystery from creator finances, giving you an immediate, highly accurate breakdown of your potential ad income.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              How Ad Revenue is Calculated: The CPM Model
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                YouTube distributes ad payouts based on a metric called CPM (Cost Per Mille), which represents the price advertisers pay for every 1,000 views on a video. However, because not all views serve ads and YouTube takes a platform revenue split (typically 45%), calculating your real income requires checking your estimated youtube earnings across low-end and high-end CPM ranges. Our responsive youtube money views calculator processes your parameters utilizing a precise chronological formula to map out daily, monthly, and yearly ranges:
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border">
                  <p className="font-bold text-xs uppercase text-muted-foreground mb-2">Daily Revenue Formula</p>
                  Daily Income = (Daily Video Views / 1,000) × CPM Rate
                </div>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border">
                  <p className="font-bold text-xs uppercase text-muted-foreground mb-2">Yearly Revenue Formula</p>
                  Yearly Income = Daily Income × 365
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                For example, if your channel averages 50,000 views a day with an ad-yield rate fluctuating between a conservative $0.25 CPM and a moderate $4.00 CPM, your daily earnings will range between $12.50 and $200.00. Over a full calendar year, this compiles into an estimated annual payout of $4,562.50 to $73,000.00.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Use the MyApexCalc YouTube Earnings Calculator?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlike legacy platforms that rely on outdated mathematical scales or flat monthly multiplier approximations, our advanced calculator is designed to provide clean, pinpoint estimates. Our dashboard features:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Customizable CPM Boundaries</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Take complete control over your earnings projections by sliding the minimum and maximum CPM thresholds to match your specific content niche, target audience, and geographic location.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Instant Dynamic Milestone Tables</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Scroll through our pre-calculated milestone guides to see how your monthly and yearly revenue scales as your channel grows from 1,000 daily views to viral sensation status.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Ad-Free, Real-Time Computations</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Adjust your daily view targets and watch your dashboard update instantly without being interrupted by complex formulas or distracting page refreshes.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <Youtube className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "In the creator economy, data is the foundation of growth. Understanding your revenue metrics allows you to scale your content business with confidence."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
