"use client"

import { useState, useEffect, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  DollarSign, 
  ArrowLeftRight, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  Search, 
  Check, 
  History, 
  Landmark, 
  ChevronRight 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Access the API key from environment variables. 
const API_KEY = process.env.NEXT_PUBLIC_CURRENCY_KEY;
const API_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;

// Custom Searchable Select Component for Currencies
interface CurrencySearchSelectProps {
  value: string;
  onValueChange: (val: string) => void;
  options: string[];
  disabled?: boolean;
  label: string;
}

function CurrencySearchSelect({
  value,
  onValueChange,
  options,
  disabled,
  label
}: CurrencySearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    return options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-mono h-10 px-3 border-input"
          disabled={disabled}
        >
          <span className="truncate">{value || `Select ${label}...`}</span>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={`Search ${label}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <ScrollArea className="h-72">
          <div className="p-1">
            {filteredOptions.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">No currency found.</p>
            )}
            {filteredOptions.map((opt) => (
              <Button
                key={opt}
                variant="ghost"
                className={cn(
                  "w-full justify-start font-mono text-sm h-9 px-2 mb-1",
                  value === opt && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onValueChange(opt);
                  setOpen(false);
                  setSearch('');
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === opt ? "opacity-100" : "opacity-0"
                  )}
                />
                {opt}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

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
      if (!API_KEY) {
        throw new Error('API Key is missing from the configuration.');
      }
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch exchange rates. Please check your API key.');
      const data = await response.json();
      
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
    return (amount / rates[from]) * rates[to];
  };

  const result = getConvertedAmount();
  const sortedCurrencies = useMemo(() => Object.keys(rates).sort(), [rates]);

  return (
    <CalculatorWrapper
      title="Live Currency Converter"
      description="Real-time global currency conversion powered by CurrencyFreaks. Get the most accurate rates instantly."
      icon={DollarSign}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
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
                    <CurrencySearchSelect 
                      value={from} 
                      onValueChange={setFrom} 
                      options={sortedCurrencies} 
                      label="source" 
                    />
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
                    <CurrencySearchSelect 
                      value={to} 
                      onValueChange={setTo} 
                      options={sortedCurrencies} 
                      label="target" 
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
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

        {/* Informational Section */}
        <div className="lg:col-span-12 py-10 space-y-12">
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <History className="w-6 h-6" />
                Navigating the Global Market with SmartCalc Hub
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Whether you are managing international business payments, preparing for a vacation, or trading on the foreign exchange market, staying on top of the fluctuating financial landscape requires absolute precision. Our interactive currency converter is built to give you instantaneous, reliable, and up-to-the-minute market data so you can execute calculations with confidence.
                </p>
                <h4 className="font-bold text-foreground pt-4">Real-Time Tracking for Key Global Pairs</h4>
                <p>
                  Major global trading pairs dictate the rhythm of international commerce. With our tool, you can track highly sought-after corridors instantly:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                       <ChevronRight className="w-3 h-3 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Pound to Dollar (GBP to USD)</p>
                      <p>View up-to-the-second pricing for British Sterling transfers. Our live calculator monitors market momentum, displaying exactly what your pounds are worth in US Dollars down to the fractional cent.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                       <ChevronRight className="w-3 h-3 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Euro to Dollar (EUR to USD)</p>
                      <p>As the world’s most heavily traded pair, watching the euro to dollar pivot is crucial for global market analysis. Access clean, live conversion values the moment the interbank market updates.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Landmark className="w-5 h-5 text-accent" />
                How the Mid-Market Exchange Rate Works
              </h4>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  When you use our currency converter, you are viewing calculations based on the live mid-market exchange rate (also known as the real interbank rate).
                </p>
                <p>
                  Unlike commercial banks, airport kiosks, or standard transfer services—which often layer hidden markups and fees into their conversion margins—our dashboard displays the pure, unfiltered market rate. This transparency ensures you know exactly what your money is worth before negotiating transfers or making international purchases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
