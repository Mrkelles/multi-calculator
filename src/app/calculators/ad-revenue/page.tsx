"use client"

import { useState, useEffect, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  DollarSign, 
  Eye, 
  Layout, 
  Globe, 
  TrendingUp, 
  Info, 
  History, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  Calculator,
  BarChart,
  Lightbulb
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Website Ad Revenue Calculator | Professional Earnings Estimator',
  description: 'Estimate your website ad revenue based on monthly pageviews, RPM, and ad density. Analyze traffic quality tiers to project annual income.',
  keywords: ['ad revenue calculator', 'website earnings estimator', 'RPM calculator', 'blog monetization', 'adsense earnings'],
};

export default function AdRevenuePage() {
  const [rpm, setRpm] = useState(0.65);
  const [pageviews, setPageviews] = useState(2000000);
  const [adUnits, setAdUnits] = useState(4);
  
  // Traffic Tiers (sum to 100%)
  const [tier1, setTier1] = useState(34);
  const [tier2, setTier2] = useState(33);
  const [tier3, setTier3] = useState(33);

  const results = useMemo(() => {
    // Basic Monthly Revenue = (Pageviews / 1000) * RPM * Ad Units
    const monthlyRevenue = (pageviews / 1000) * rpm * adUnits;
    const annualRevenue = monthlyRevenue * 12;

    // Traffic Quality Multiplier (Conceptual)
    // Tier 1 (US/UK/CA) pays 100%, Tier 2 pays 60%, Tier 3 pays 30%
    // This provides a range of potential growth
    const qualityScore = (tier1 * 1.0 + tier2 * 0.6 + tier3 * 0.3) / 100;
    
    return {
      monthly: monthlyRevenue,
      annual: annualRevenue,
      lowEstimate: annualRevenue * 0.8,
      highEstimate: annualRevenue * 1.5,
      qualityScore
    };
  }, [rpm, pageviews, adUnits, tier1, tier2, tier3]);

  return (
    <CalculatorWrapper
      title="Website Ad Revenue Calculator"
      description="Estimate your annual website revenue based on monthly traffic, RPM, and audience quality tiers."
      icon={DollarSign}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Metrics */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Metrics
              </CardTitle>
              <CardDescription>Input your actual site performance metrics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-bold">RPM ($ per 1k views)</Label>
                  <Badge variant="outline" className="font-mono text-primary">${rpm.toFixed(2)}</Badge>
                </div>
                <Slider value={[rpm]} min={0.01} max={5.00} step={0.01} onValueChange={(v) => setRpm(v[0])} />
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input type="number" step="0.01" className="pl-9" value={rpm} onChange={(e) => setRpm(Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-bold">Pageviews Per Month</Label>
                  <Badge variant="outline" className="font-mono text-primary">{pageviews.toLocaleString()}</Badge>
                </div>
                <Slider value={[pageviews]} min={1000} max={10000000} step={10000} onValueChange={(v) => setPageviews(v[0])} />
                <div className="relative">
                  <Eye className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input type="number" className="pl-9" value={pageviews} onChange={(e) => setPageviews(Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-bold">Avg. Ad Units per Page</Label>
                  <Badge variant="outline" className="font-mono text-primary">{adUnits}</Badge>
                </div>
                <Slider value={[adUnits]} min={1} max={10} step={1} onValueChange={(v) => setAdUnits(v[0])} />
                <div className="relative">
                  <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input type="number" className="pl-9" value={adUnits} onChange={(e) => setAdUnits(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" /> Traffic Quality
              </CardTitle>
              <CardDescription>Audience location affects your earning potential.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Tier 1 Countries</span>
                  <span>{tier1}%</span>
                </div>
                <Slider value={[tier1]} min={0} max={100} step={1} onValueChange={(v) => setTier1(v[0])} />
                <p className="text-[10px] text-muted-foreground italic">US, UK, Canada, Australia, Germany, etc.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Tier 2 Countries</span>
                  <span>{tier2}%</span>
                </div>
                <Slider value={[tier2]} min={0} max={100} step={1} onValueChange={(v) => setTier2(v[0])} />
                <p className="text-[10px] text-muted-foreground italic">Brazil, Mexico, India, Poland, etc.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Tier 3 Countries</span>
                  <span>{tier3}%</span>
                </div>
                <Slider value={[tier3]} min={0} max={100} step={1} onValueChange={(v) => setTier3(v[0])} />
                <p className="text-[10px] text-muted-foreground italic">Low CPC/CPM markets worldwide.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart size={120} /></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-xs uppercase tracking-[0.2em] font-black opacity-70 text-center">Annual Revenue Estimate</CardTitle>
            </CardHeader>
            <CardContent className="text-center relative z-10 pb-10 space-y-6">
              <div className="text-6xl md:text-7xl font-black font-headline tracking-tighter">
                ${results.annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-mono">
                  Monthly: ${results.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Potential Optimization Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-red-500">Low Optimization</span>
                  <span className="text-emerald-500">Full Optimization</span>
                </div>
                <Progress value={results.qualityScore * 100} className="h-2" />
                <div className="flex justify-between text-lg font-black font-headline">
                   <span>${results.lowEstimate.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                   <span>${results.highEstimate.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic mt-4">
                  Estimated 30-250% lift potential based on ad placements, bidding competition, and traffic tiers.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
            <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-blue-800 font-bold">Industry Benchmark</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Publishers with over 50% Tier 1 traffic typically command RPMs 3x-5x higher than Tier 3 dominant sites. Focus on premium content to attract high-value regions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />

        {/* Worked Examples Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2 rounded-xl text-accent"><Lightbulb size={24} /></div>
            <h3 className="text-2xl font-bold text-primary">Worked Examples</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 1: Niche Blog Growth</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>A small niche blog currently has <strong>50,000 monthly pageviews</strong> with an <strong>RPM of $2.00</strong> and 2 ad units per page. This yields <strong>$200/month</strong>.</p>
                <p>By optimizing the content for higher-paying keywords (increasing RPM to <strong>$5.00</strong>) and increasing ad density to 3 units, the monthly revenue jumps to <strong>$750/month</strong>, even with the same amount of traffic.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Scenario 2: Viral Site Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>A viral news site generates <strong>5,000,000 monthly views</strong> but primarily from low-CPC markets (Tier 3), resulting in a low <strong>$0.50 RPM</strong> and 4 ad units ($10,000/mo).</p>
                <p>By pivoting to more Tier 1 (US/UK) focused content, even if traffic drops to 3,000,000 views, a higher <strong>$1.50 RPM</strong> with the same ad units would result in <strong>$18,000/mo</strong>—an 80% increase in revenue with less traffic.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Take the Guesswork Out of Monetization with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              For digital publishers and website owners, turning traffic into a sustainable income stream requires a deep understanding of ad tech metrics. While many creators focus solely on "total views," the real revenue is driven by a combination of audience quality, ad density, and market-specific bidding competition. Our free online Website Ad Revenue Calculator is designed to demystify these variables, serving as a professional-grade ad revenue estimator to help you map your annual income potential in seconds.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Math of Ad Revenue: RPM, Pageviews, and Ad Units
            </h3>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Website monetization is calculated using a standard model that accounts for your total reach and the revenue generated for every thousand impressions. The core formula utilized by our calculator is:
              </p>
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                Monthly Revenue = (Monthly Pageviews / 1,000) × RPM × Ad Units
              </div>
              <p className="text-muted-foreground leading-relaxed pt-2">
                By taking your monthly pageviews and dividing them by 1,000 (the "M" in RPM stands for Mille, the Latin word for thousand), we find the number of "units" of traffic you have. Multiplying this by your RPM (Revenue Per Mille) and the average number of ads per page yields your total monthly gross.
              </p>
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="font-bold text-sm text-primary mb-2">Example Calculation:</p>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li><strong>Pageviews:</strong> 2,000,000</li>
                  <li><strong>RPM:</strong> $0.65</li>
                  <li><strong>Ad Units:</strong> 4</li>
                  <li className="pt-2 border-t font-bold text-foreground">Annual Revenue = (2,000,000 / 1000) × 0.65 × 4 × 12 = $62,400</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" />
                Understanding Traffic Tiers
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Traffic by country is divided into tiers to determine quality and potential revenue. Advertisers pay significantly more to reach users in high-income regions:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Tier 1: Premium Markets</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Highest purchasing power (US, UK, CA, AU). RPMs here are the benchmark for top-tier monetization.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Tier 2: Emerging Markets</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Moderate bidding competition (Brazil, Mexico, India). High volume but typically lower per-user value.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Tier 3: Low-Income Regions</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Lowest RPMs due to minimal advertiser demand. High volume is required to see significant revenue here.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4">
              <History className="w-10 h-10 text-primary opacity-40 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                "Digital real estate is built on traffic quality, not just quantity. Measure your site's true worth with professional-grade analysis."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
