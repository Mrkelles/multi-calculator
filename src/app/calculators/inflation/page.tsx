"use client"

import { useState, useEffect, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { TrendingDown, Info, DollarSign, History, Calendar, Calculator, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// U.S. Annual CPI Averages (1913-2024)
// Source: Bureau of Labor Statistics (BLS)
const CPI_DATA: Record<number, number> = {
  1913: 9.9, 1914: 10.0, 1915: 10.1, 1916: 10.9, 1917: 12.8, 1918: 15.1, 1919: 17.3,
  1920: 20.0, 1921: 17.9, 1922: 16.8, 1923: 17.1, 1924: 17.1, 1925: 17.5, 1926: 17.7, 1927: 17.4, 1928: 17.1, 1929: 17.1,
  1930: 16.7, 1931: 15.2, 1932: 13.7, 1933: 13.0, 1934: 13.4, 1935: 13.7, 1936: 13.9, 1937: 14.4, 1938: 14.1, 1939: 13.9,
  1940: 14.0, 1941: 14.7, 1942: 16.3, 1943: 17.3, 1944: 17.6, 1945: 18.0, 1946: 19.5, 1947: 22.3, 1948: 24.1, 1949: 23.8,
  1950: 24.1, 1951: 26.0, 1952: 26.5, 1953: 26.7, 1954: 26.9, 1955: 26.8, 1956: 27.2, 1957: 28.1, 1958: 28.9, 1959: 29.1,
  1960: 29.6, 1961: 29.9, 1962: 30.2, 1963: 30.6, 1964: 31.0, 1965: 31.5, 1966: 32.4, 1967: 33.4, 1968: 34.8, 1969: 36.7,
  1970: 38.8, 1971: 40.5, 1972: 41.8, 1973: 44.4, 1974: 49.3, 1975: 53.8, 1976: 56.9, 1977: 60.6, 1978: 65.2, 1979: 72.6,
  1980: 82.4, 1981: 90.9, 1982: 96.5, 1983: 99.6, 1984: 103.9, 1985: 107.6, 1986: 109.6, 1987: 113.6, 1988: 118.3, 1989: 124.0,
  1990: 130.7, 1991: 136.2, 1992: 140.3, 1993: 144.5, 1994: 148.2, 1995: 152.4, 1996: 156.9, 1997: 160.5, 1998: 163.0, 1999: 166.6,
  2000: 172.2, 2001: 177.1, 2002: 179.9, 2003: 184.0, 2004: 188.9, 2005: 195.3, 2006: 201.6, 2007: 207.342, 2008: 215.303, 2009: 214.537,
  2010: 218.056, 2011: 224.939, 2012: 229.594, 2013: 232.957, 2014: 236.736, 2015: 237.017, 2016: 240.007, 2017: 245.120, 2018: 251.107, 2019: 255.657,
  2020: 258.811, 2021: 270.970, 2022: 292.655, 2023: 304.702, 2024: 313.200 // Estimated for 2024
};

export default function InflationCalculatorPage() {
  const [mode, setMode] = useState<'historical' | 'forward' | 'backward'>('historical');
  
  // Historical Mode Inputs
  const [hAmount, setHAmount] = useState(100);
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2024);

  // Forward Mode Inputs (Flat Rate)
  const [fAmount, setFAmount] = useState(1000);
  const [fRate, setFRate] = useState(3.0);
  const [fYears, setFYears] = useState(10);

  // Backward Mode Inputs (Flat Rate)
  const [bAmount, setBAmount] = useState(1000);
  const [bRate, setBRate] = useState(3.0);
  const [bYears, setBYears] = useState(10);

  const results = useMemo(() => {
    if (mode === 'historical') {
      const cpiStart = CPI_DATA[startYear];
      const cpiEnd = CPI_DATA[endYear];
      if (!cpiStart || !cpiEnd) return null;
      
      const multiplier = cpiEnd / cpiStart;
      const finalValue = hAmount * multiplier;
      const totalInflation = (multiplier - 1) * 100;
      
      return { finalValue, totalInflation, label: `In ${endYear}, it has the same buying power as` };
    } else if (mode === 'forward') {
      // Future Value = P * (1 + i)^n
      const rate = fRate / 100;
      const finalValue = fAmount * Math.pow(1 + rate, fYears);
      const totalIncrease = ((finalValue / fAmount) - 1) * 100;
      
      return { finalValue, totalInflation: totalIncrease, label: `After ${fYears} years, the value will be` };
    } else {
      // Present Value = FV / (1 + i)^n
      const rate = bRate / 100;
      const finalValue = bAmount / Math.pow(1 + rate, bYears);
      const totalDecrease = (1 - (finalValue / bAmount)) * 100;
      
      return { finalValue, totalInflation: totalDecrease, label: `${bYears} years ago, the value was` };
    }
  }, [mode, hAmount, startYear, endYear, fAmount, fRate, fYears, bAmount, bRate, bYears]);

  const yearsOptions = Object.keys(CPI_DATA).map(Number).sort((a, b) => b - a);

  return (
    <CalculatorWrapper
      title="Inflation Calculator"
      description="Measure the impact of inflation on your money using historical data or project future costs with custom rates."
      icon={TrendingDown}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto py-1 px-1">
                  <TabsTrigger value="historical" className="text-[10px] md:text-xs">U.S. CPI</TabsTrigger>
                  <TabsTrigger value="forward" className="text-[10px] md:text-xs">Forward</TabsTrigger>
                  <TabsTrigger value="backward" className="text-[10px] md:text-xs">Backward</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === 'historical' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hAmount">Initial Amount ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="hAmount"
                        type="number"
                        className="pl-9"
                        value={hAmount}
                        onChange={(e) => setHAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Year</Label>
                      <Select value={String(startYear)} onValueChange={(v) => setStartYear(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {yearsOptions.map(y => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>End Year</Label>
                      <Select value={String(endYear)} onValueChange={(v) => setEndYear(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {yearsOptions.map(y => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'forward' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fAmount">Current Amount ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="fAmount"
                        type="number"
                        className="pl-9"
                        value={fAmount}
                        onChange={(e) => setFAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Inflation Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={fRate}
                        onChange={(e) => setFRate(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Years</Label>
                      <Input
                        type="number"
                        value={fYears}
                        onChange={(e) => setFYears(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {mode === 'backward' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bAmount">Future Amount ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="bAmount"
                        type="number"
                        className="pl-9"
                        value={bAmount}
                        onChange={(e) => setBAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Inflation Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={bRate}
                        onChange={(e) => setBRate(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Years Back</Label>
                      <Input
                        type="number"
                        value={bYears}
                        onChange={(e) => setBYears(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                Mode Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
              {mode === 'historical' ? (
                <p>This mode uses official <strong>U.S. CPI (Consumer Price Index)</strong> data to show how the value of the dollar has changed since 1913.</p>
              ) : mode === 'forward' ? (
                <p>Estimate how much a set amount of money will be worth in the future assuming a constant annual inflation rate.</p>
              ) : (
                <p>Determine the equivalent value of a future sum in today's (or past) dollars by applying a constant discount rate.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardContent className="pt-10 pb-10 text-center">
              <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-bold">{results?.label}</p>
              <h3 className="text-5xl md:text-6xl font-black font-headline tracking-tighter">
                ${results?.finalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </h3>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={mode === 'backward' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}>
              <CardContent className="pt-6">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">Total {mode === 'backward' ? 'Value Loss' : 'Price Increase'}</p>
                <h3 className={`text-3xl font-bold font-headline ${mode === 'backward' ? 'text-red-600' : 'text-green-600'}`}>
                  {results?.totalInflation.toFixed(1)}%
                </h3>
              </CardContent>
            </Card>
            <Card className="bg-accent text-white border-none shadow-lg">
              <CardContent className="pt-6">
                <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1 font-bold">Average Annual Rate</p>
                <h3 className="text-3xl font-bold font-headline">
                  {mode === 'historical' 
                    ? (Math.pow(results?.finalValue / hAmount, 1 / Math.abs(endYear - startYear)) - 1 * 100).toFixed(2)
                    : mode === 'forward' ? fRate.toFixed(2) : bRate.toFixed(2)}%
                </h3>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
            <History className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-blue-800 font-bold">Purchasing Power Note</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Inflation reduces the **purchasing power** of each unit of currency. As prices rise, a single dollar buys fewer goods and services than it did in the past. This calculator helps you adjust for those changes to understand the "real" value of money across time.
              </p>
            </div>
          </div>
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 space-y-12 py-10">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                How Inflation Works
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Inflation is the rate at which the general level of prices for goods and services is rising. As inflation grows, every dollar you own buys a smaller percentage of a good or service. At <strong>My Apex Calc</strong>, we use the Consumer Price Index (CPI) as the primary metric for our historical calculations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The <strong>Consumer Price Index (CPI)</strong> measures the average change over time in the prices paid by urban consumers for a market basket of consumer goods and services. When the CPI increases, it indicates that the cost of living is rising.
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Calculation Methods</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Historical (CPI) Mode</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Calculates value based on actual U.S. government data from 1913 to today. It is the most accurate way to see what $100 in 1950 is worth today.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Forward/Backward Flat Rates</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Uses a fixed percentage to project future costs or discount future sums. This is ideal for long-term financial planning and retirement estimates.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
