"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { TrendingUp, Users, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
    </CalculatorWrapper>
  );
}
