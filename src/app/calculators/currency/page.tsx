"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { DollarSign, ArrowLeftRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const rates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.94,
  GBP: 0.82,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.57,
  INR: 83.2,
  CNY: 7.29,
};

export default function CurrencyPage() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState(0);

  useEffect(() => {
    const fromRate = rates[from];
    const toRate = rates[to];
    const converted = (amount / fromRate) * toRate;
    setResult(converted);
  }, [amount, from, to]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <CalculatorWrapper
      title="Currency Converter"
      description="Quickly convert amounts between major global currencies with precision."
      icon={DollarSign}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  className="pl-7"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full space-y-2">
                <Label>From</Label>
                <Select value={from} onValueChange={setFrom}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(rates).map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 mt-6 rounded-full hover:bg-primary hover:text-white transition-all"
                onClick={handleSwap}
              >
                <ArrowLeftRight size={16} />
              </Button>

              <div className="w-full space-y-2">
                <Label>To</Label>
                <Select value={to} onValueChange={setTo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(rates).map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-white text-center py-10">
            <CardContent className="space-y-4">
              <div className="text-sm opacity-70 font-semibold tracking-widest uppercase">
                {amount.toLocaleString()} {from} =
              </div>
              <div className="text-5xl font-bold font-headline">
                {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Exchange Rate Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>Current rate:</span>
                  <span className="font-medium text-foreground">1 {from} = {(rates[to] / rates[from]).toFixed(4)} {to}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inverse rate:</span>
                  <span className="font-medium text-foreground">1 {to} = {(rates[from] / rates[to]).toFixed(4)} {from}</span>
                </div>
                <p className="text-[10px] mt-4 italic">Rates are for demonstration purposes and may not reflect real-time market fluctuations.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorWrapper>
  );
}