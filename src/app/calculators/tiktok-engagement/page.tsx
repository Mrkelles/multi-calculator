"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Info, 
  History, 
  Calculator, 
  ChevronRight, 
  BarChart 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'TikTok Engagement Rate Calculator | Free Analytics Tool',
  description: 'Calculate your TikTok engagement rate instantly. Check your video metrics, likes, comments, and shares to measure your true audience interaction level.',
  keywords: [
    'tiktok engagement rate calculator',
    'tiktok engagement calculator',
    'tiktok engagement rate',
    'calculate tiktok engagement rate',
    'MyApexCalc',
    'social media metrics',
    'influencer analytics',
    'profile audit tool'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'TikTok Engagement Rate Calculator | MyApexCalc',
    description: 'Analyze your social performance in seconds. Discover how your profile stacks up by measuring your true tiktok engagement rate.',
    url: 'https://www.myapexcalc.com/calculators/tiktok-engagement',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/F42Sytpz/tiktok-engagement-calculator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc TikTok Engagement Rate Calculator Analytics Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free TikTok Engagement Calculator | MyApexCalc',
    description: 'Track your content performance, audit creator accounts, and verify real audience interaction metrics instantly.',
    images: ['https://i.ibb.co/F42Sytpz/tiktok-engagement-calculator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/tiktok-engagement',
  },
};

export default function TikTokEngagementPage() {
  const [followers, setFollowers] = useState(10000);
  const [likes, setLikes] = useState(500);
  const [comments, setComments] = useState(50);
  const [shares, setShares] = useState(20);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    if (followers > 0) {
      const totalEngagement = likes + comments + shares;
      setRate((totalEngagement / followers) * 100);
    }
  }, [followers, likes, comments, shares]);

  const getHealth = () => {
    if (rate < 1) return { label: 'Low', color: 'text-red-500', bg: 'bg-red-500' };
    if (rate < 3) return { label: 'Average', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    if (rate < 6) return { label: 'Good', color: 'text-green-500', bg: 'bg-green-500' };
    return { label: 'Excellent', color: 'text-primary', bg: 'bg-primary' };
  };

  const health = getHealth();

  return (
    <CalculatorWrapper
      title="TikTok Engagement Rate"
      description="Calculate your engagement health based on your average video performance relative to your follower count."
      icon={TrendingUp}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle className="text-lg">Account Stats (Avg per video)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Users className="w-4 h-4" /> Follower Count</Label>
              <Input type="number" value={followers} onChange={(e) => setFollowers(Number(e.target.value))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px]"><Heart className="w-3 h-3" /> Likes</Label>
                <Input type="number" value={likes} onChange={(e) => setLikes(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px]"><MessageCircle className="w-3 h-3" /> Comments</Label>
                <Input type="number" value={comments} onChange={(e) => setComments(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px]"><Share2 className="w-3 h-3" /> Shares</Label>
                <Input type="number" value={shares} onChange={(e) => setShares(Number(e.target.value))} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="text-center py-10 overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${health.bg}`} />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className={`text-7xl font-bold font-headline ${health.color}`}>
                {rate.toFixed(2)}%
              </div>
              <div className="text-xl font-bold uppercase tracking-tight">{health.label}</div>
              <div className="px-10 pt-4">
                <Progress value={Math.min(100, rate * 10)} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Why it matters?</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              TikTok's algorithm favors videos with high engagement. A healthy rate (3%+) indicates your content resonates well with your audience and is more likely to be pushed to the "For You" page.
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
              Optimize Your Social Performance with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              In the fast-paced world of social media, follower counts no longer tell the whole story. Brands, agencies, and creators alike have shifted their focus to a much more critical metric: interactive resonance. Our free online tiktok engagement rate calculator is designed to slice through the vanity metrics, giving you an immediate and transparent view of how actively your audience interacts with your content.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              How to Calculate TikTok Engagement Rate
            </h3>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Audience interaction is measured by comparing the active responses your videos receive against either your baseline reach or your overall following. Because different social marketing campaigns prioritize different data sets, our tiktok engagement calculator supports the two primary industry-standard formulas:
              </p>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">1. Follower-Based Engagement (Industry Standard)</p>
                <p className="text-sm text-muted-foreground">This formula evaluates how well you activate your existing subscriber base:</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                  Engagement Rate (by Followers) = ( (Likes + Comments + Shares) / Total Followers ) × 100
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">2. View-Based Engagement (Algorithm Performance)</p>
                <p className="text-sm text-muted-foreground">This calculation isolates how well your content performs when served to new feeds (such as the For You Page):</p>
                <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                  Engagement Rate (by Views) = ( (Likes + Comments + Shares) / Total Views ) × 100
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed pt-2">
                By aggregating your likes, comments, and shares, the tool reveals your actual tiktok engagement rate as a clean percentage. This number tells you exactly how compelling your content is to the real people watching it.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Why Audit Your Metrics with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Evaluating your accounts manually is time-consuming and prone to computational errors. MyApexCalc provides a seamless, real-time dashboard that helps you:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Verify Influencer Value</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">If you are a business looking to partner with creators, use our dashboard to ensure their audience is highly engaged and not padded with inactive followers.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Refine Your Content Strategy</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Track how your percentage drops or climbs week-over-week to identify which video formats, hooks, or audio tracks drive real interactions.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <BarChart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Export Professional Reports</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Quickly calculate tiktok engagement rate parameters to present directly to potential brand sponsors, proving your content holds authentic commercial value.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Followers show reach, but engagement shows influence. Measure the resonance of your brand with precision."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
