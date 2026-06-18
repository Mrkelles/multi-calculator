"use client"

import { useState, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { DollarSign, ArrowLeftRight, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const API_KEY = '9e70e2c8efb14a18bf27200c3833173c';
const API_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;

export default function CurrencyPage() {
  const [amount, setAmount] = useState<number>(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      const data = await response.json();
      
      // Parse rates to numbers
      const parsedRates: Record<string, number> = {};
      Object.keys(data.rates).forEach(key => {
        parsedRates[key] = parseFloat(data.rates[key]);
      });

      setRates(parsedRates);
      setLastUpdated(data.date);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const getConvertedAmount = () => {
    if (!rates[from] || !rates[to]) return 0;
    // Rates are base USD, so we convert from 'from' to USD then USD to 'to'
    return (amount / rates[from]) * rates[to];
  };

  const result = getConvertedAmount();
  const sortedCurrencies = Object.keys(rates).sort();

  return (
    <CalculatorWrapper
      title="Live Currency Converter"
      description="Real-time global currency conversion powered by CurrencyFreaks. Get the most accurate rates instantly."
      icon={DollarSign}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Conversion Details</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchRates} 
              disabled={loading}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                <Input
                  id="amount"
                  className="pl-7 text-lg font-medium"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full space-y-2">
                <Label>From</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedCurrencies.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 mt-6 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                onClick={handleSwap}
                disabled={loading}
              >
                <ArrowLeftRight size={16} />
              </Button>

              <div className="w-full space-y-2">
                <Label>To</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedCurrencies.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-white text-center py-10 shadow-xl border-none">
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-32 mx-auto bg-white/20" />
                  <Skeleton className="h-12 w-48 mx-auto bg-white/20" />
                </div>
              ) : (
                <>
                  <div className="text-sm opacity-80 font-bold tracking-widest uppercase font-mono">
                    {amount.toLocaleString()} {from} =
                  </div>
                  <div className="text-5xl md:text-6xl font-black font-headline tracking-tighter">
                    {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    <span className="text-2xl ml-2 opacity-80">{to}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Live Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Direct Rate:</span>
                    <span className="font-bold text-foreground font-mono">1 {from} = {(rates[to] / rates[from]).toFixed(6)} {to}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Inverse Rate:</span>
                    <span className="font-bold text-foreground font-mono">1 {to} = {(rates[from] / rates[to]).toFixed(6)} {from}</span>
                  </div>
                  {lastUpdated && (
                    <p className="text-[10px] mt-4 italic text-right opacity-70">
                      Market data last updated: {new Date(lastUpdated).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
