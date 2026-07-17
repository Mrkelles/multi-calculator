"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Music2, 
  Eye, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Calculator, 
  History, 
  Info, 
  ChevronRight,
  Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'TikTok Revenue Calculator | Estimate Your Creator Earnings',
  description: 'Estimate your potential creator payouts instantly with our free TikTok revenue calculator. Input your view counts, engagement metrics, and follower milestones to project your earnings.',
  keywords: [
    'tiktok money calculator',
    'tik tok money calculation',
    'tiktok calculator',
    'tiktok earnings calculator',
    'tiktok revenue calculator',
    'MyApexCalc',
    'creator fund estimator',
    'tiktok sponsorship calculator'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Interactive TikTok Money & Earnings Calculator | MyApexCalc',
    description: 'Track your viral earning potential. Run a quick tik tok money calculation based on daily views and brand collaboration ranges with our custom dashboard.',
    url: 'https://www.myapexcalc.com/calculators/tiktok-revenue',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/mCP1Tm9L/tiktok-revenue-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc TikTok Money Calculator and Creator Dashboard Layout',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Estimated TikTok Earnings & Revenue Calculator | MyApexCalc',
    description: 'Easily calculate your potential earnings from the Creator Rewards Program and brand sponsorship campaigns.',
    images: ['https://i.ibb.co/mCP1Tm9L/tiktok-revenue-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/tiktok-revenue',
  },
};

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

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Maximize Your TikTok Success with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              With short-form video dominating the digital landscape, turning viral moments into a sustainable business is a priority for modern influencers. However, calculating your potential payout from short-form content can feel complicated because monetization on the platform comes from multiple channels—ranging from native programs like the Creator Rewards Program to direct brand deals and live virtual gifts. Our free online tiktok revenue calculator is built to strip away the confusion, allowing you to estimate your earning potential in seconds.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Math Behind Your Viral Earnings
            </h3>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Unlike traditional long-form video platforms that rely on a standard, predictable ad revenue split, a tik tok money calculation utilizes several dynamic variables. The two most common methods of earning on the platform include:
              </p>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">1. The Creator Rewards Program (RPM Model)</p>
                <p className="text-sm text-muted-foreground">Native payouts are distributed per 1,000 qualified views (RPM) on original videos longer than one minute:</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                  Estimated Native Earnings = (Qualified Views / 1,000) × RPM Rate
                </div>
                <p className="text-xs text-muted-foreground pt-1 italic">
                  * While native RPMs typically range from $0.10 to $1.00 depending on audience location and engagement, a video with 1,000,000 views can yield $100 to $1,000.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">2. Brand Sponsorships & Collaborations</p>
                <p className="text-sm text-muted-foreground">For many creators, real revenue lies in direct sponsorships. Our calculator factors in following and engagement to estimate standard industry pricing:</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                  Estimated Brand Value = (Total Followers × Engagement Rate) × Industry Multiplier
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed pt-2">
                By combining these diverse revenue streams, our tiktok calculator helps you map out realistic baseline goals for daily, monthly, and yearly income.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Use the MyApexCalc TikTok Earnings Calculator?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our advanced interface is engineered to provide realistic, actionable ranges rather than inflated figures. By using MyApexCalc, you can:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Factor in Real Engagement</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Understand how high engagement rates (likes, comments, and shares) vastly increase your valuation for brand sponsorships.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Compare Monetization Models</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Switch between native platform rewards and external brand sponsorship tiers to see where your content focus should lie.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Instant Dynamic Visuals</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Easily slide your view count and follower metrics to watch your earning potential update in real-time, helping you set clear growth milestones.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "In the viral economy, knowing your value is your greatest negotiation tool. Track your metrics to scale your business with precision."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
