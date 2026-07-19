"use client"

import { useState, useCallback, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Shuffle, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertCircle, 
  List, 
  Hash, 
  Trash2,
  Info,
  History,
  Zap,
  Binary,
  TrendingUp,
  Calculator,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'Free Random Number Generator | Instant Secure Randomizer',
  description: 'Generate single or multiple random numbers instantly with our free random number generator. Customize your range, set limits, and choose to allow or prevent duplicates.',
  keywords: [
    'Random Number Generator',
    'get a random number',
    'random number maker',
    'MyApexCalc',
    'random number picker',
    'integer generator',
    'secure randomizer online'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Instant Random Number Generator & Picker | MyApexCalc',
    description: 'Need to pick a winner, roll a die, or make an unbiased choice? Generate truly randomized numbers in any custom range instantly.',
    url: 'https://www.myapexcalc.com/calculators/random-number',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/9HQtZjPr/random-number-generator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Random Number Generator and Custom Number Range Picker UI',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Random Number Maker & Picker | MyApexCalc',
    description: 'Set your minimum and maximum parameters and get a random number instantly. Features custom list sorting and duplicate prevention.',
    images: ['https://i.ibb.co/9HQtZjPr/random-number-generator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/random-number',
  },
};

/**
 * Utility to generate a random BigInt within a range [min, max]
 * Uses Web Crypto API for high entropy and unbiased selection.
 */
function generateRandomBigInt(min: bigint, max: bigint) {
  const range = max - min + 1n;
  if (range <= 0n) return min;

  const hexRange = range.toString(16);
  const byteLength = Math.ceil(hexRange.length / 2);
  const buffer = new Uint8Array(byteLength);

  let randomValue = 0n;
  // We use a rejection sampling loop to ensure perfectly uniform distribution
  do {
    crypto.getRandomValues(buffer);
    randomValue = 0n;
    for (let i = 0; i < buffer.length; i++) {
      randomValue = (randomValue << 8n) + BigInt(buffer[i]);
    }
  } while (randomValue >= range);

  return min + randomValue;
}

/**
 * Parses a string input (integer or decimal) into a BigInt scaled by the desired precision.
 */
function stringToScaledBigInt(s: string, precision: number) {
  const parts = s.split('.');
  let integerPart = parts[0] || '0';
  let fractionalPart = parts[1] || '';

  if (fractionalPart.length > precision) {
    fractionalPart = fractionalPart.slice(0, precision);
  } else {
    fractionalPart = fractionalPart.padEnd(precision, '0');
  }

  try {
    return BigInt(integerPart + fractionalPart);
  } catch (e) {
    return 0n;
  }
}

/**
 * Formats a scaled BigInt back into a decimal string.
 */
function formatScaledBigInt(val: bigint, precision: number, isDecimal: boolean) {
  let s = val.toString();
  const isNegative = s.startsWith('-');
  if (isNegative) s = s.slice(1);

  if (!isDecimal || precision === 0) {
    return (isNegative ? '-' : '') + s;
  }

  if (s.length <= precision) {
    s = s.padStart(precision + 1, '0');
  }

  const decimalPos = s.length - precision;
  const result = s.slice(0, decimalPos) + '.' + s.slice(decimalPos);
  return (isNegative ? '-' : '') + result;
}

export default function RandomNumberGeneratorPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('numbers');

  // Simple Generator State
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  // Comprehensive Generator State
  const [cMin, setCMin] = useState('0.2');
  const [cMax, setCMax] = useState('112.5');
  const [cQty, setCQty] = useState(1);
  const [cType, setCType] = useState<'integer' | 'decimal'>('decimal');
  const [cPrecision, setCPrecision] = useState(50);
  const [cAllowDuplicates, setCAllowDuplicates] = useState(false);
  const [cSort, setCSort] = useState(false);
  const [cResults, setCResults] = useState<string[]>([]);
  const [cCopied, setCCopied] = useState(false);

  // Picker State
  const [listText, setListText] = useState("Choice 1\nChoice 2\nChoice 3\nChoice 4\nChoice 5");
  const [pickQuantity, setPickQuantity] = useState(1);
  const [pickDuplicates, setPickDuplicates] = useState(false);
  const [pickedResults, setPickedResults] = useState<string[]>([]);
  const [pickerCopied, setPickerCopied] = useState(false);

  const generateSimpleNumbers = useCallback(() => {
    if (min >= max) {
      toast({ variant: "destructive", title: "Invalid Range", description: "Lower bound must be less than the upper bound." });
      return;
    }
    const range = max - min + 1;
    if (!allowDuplicates && quantity > range) {
      toast({ variant: "destructive", title: "Range Too Small", description: `Cannot pick ${quantity} unique numbers from a range of ${range}.` });
      return;
    }
    const newResults: number[] = [];
    if (!allowDuplicates) {
      const pool = Array.from({ length: range }, (_, i) => min + i);
      for (let i = 0; i < quantity; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        newResults.push(pool.splice(idx, 1)[0]);
      }
    } else {
      for (let i = 0; i < quantity; i++) {
        newResults.push(Math.floor(Math.random() * range) + min);
      }
    }
    if (isSorted) newResults.sort((a, b) => a - b);
    setResults(newResults);
    setCopied(false);
  }, [min, max, quantity, allowDuplicates, isSorted, toast]);

  const generateComprehensiveNumbers = useCallback(() => {
    const prec = cType === 'integer' ? 0 : cPrecision;
    const minScaled = stringToScaledBigInt(cMin, prec);
    const maxScaled = stringToScaledBigInt(cMax, prec);

    if (minScaled >= maxScaled) {
      toast({ variant: "destructive", title: "Invalid Range", description: "Lower bound must be less than the upper bound." });
      return;
    }

    const rangeSize = maxScaled - minScaled + 1n;
    if (!cAllowDuplicates && BigInt(cQty) > rangeSize) {
      toast({ variant: "destructive", title: "Range Too Small", description: "Increase range or allow duplicates." });
      return;
    }

    const newResults: string[] = [];
    if (!cAllowDuplicates && rangeSize < 1000n) {
      // Small range unique pool
      const pool = [];
      for (let i = 0n; i < rangeSize; i++) pool.push(minScaled + i);
      for (let i = 0; i < cQty; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        newResults.push(formatScaledBigInt(pool.splice(idx, 1)[0], prec, cType === 'decimal'));
      }
    } else {
      // Large range or duplicates allowed
      const seen = new Set<bigint>();
      for (let i = 0; i < cQty; i++) {
        let val = generateRandomBigInt(minScaled, maxScaled);
        if (!cAllowDuplicates) {
          while (seen.has(val)) val = generateRandomBigInt(minScaled, maxScaled);
          seen.add(val);
        }
        newResults.push(formatScaledBigInt(val, prec, cType === 'decimal'));
      }
    }

    if (cSort) {
      newResults.sort((a, b) => parseFloat(a) - parseFloat(b));
    }

    setCResults(newResults);
    setCCopied(false);
  }, [cMin, cMax, cQty, cType, cPrecision, cAllowDuplicates, cSort, toast]);

  const pickFromList = useCallback(() => {
    const items = listText.split('\n').map(s => s.trim()).filter(s => s !== '');
    if (items.length === 0) {
      toast({ variant: "destructive", title: "Empty List", description: "Please enter some items to pick from." });
      return;
    }
    if (!pickDuplicates && pickQuantity > items.length) {
      toast({ variant: "destructive", title: "List Too Small", description: `Cannot pick ${pickQuantity} unique items from a list of ${items.length}.` });
      return;
    }
    const newResults: string[] = [];
    const pool = [...items];
    if (!pickDuplicates) {
      for (let i = 0; i < pickQuantity; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        newResults.push(pool.splice(idx, 1)[0]);
      }
    } else {
      for (let i = 0; i < pickQuantity; i++) {
        newResults.push(items[Math.floor(Math.random() * items.length)]);
      }
    }
    setPickedResults(newResults);
    setPickerCopied(false);
  }, [listText, pickQuantity, pickDuplicates, toast]);

  const copyToClipboard = (text: string, type: 'simple' | 'comp' | 'list') => {
    navigator.clipboard.writeText(text);
    if (type === 'simple') setCopied(true);
    if (type === 'comp') setCCopied(true);
    if (type === 'list') setPickerCopied(true);
    
    setTimeout(() => {
      if (type === 'simple') setCopied(false);
      if (type === 'comp') setCCopied(false);
      if (type === 'list') setPickerCopied(false);
    }, 2000);

    toast({ title: "Copied!", description: "Results have been copied to your clipboard." });
  };

  return (
    <CalculatorWrapper
      title="Random Generator Suite"
      description="A professional-grade toolkit for generating random numbers and picking items from custom lists."
      icon={Shuffle}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 mb-8">
          <TabsTrigger value="numbers" className="font-bold gap-2">
            <Hash size={16} /> Number Generator
          </TabsTrigger>
          <TabsTrigger value="list" className="font-bold gap-2">
            <List size={16} /> List Picker
          </TabsTrigger>
        </TabsList>

        <TabsContent value="numbers" className="space-y-12 animate-fade-in">
          {/* Simple Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle className="text-lg">Simple Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Lower Limit</Label>
                    <Input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Upper Limit</Label>
                    <Input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Quantity (1-100)</Label>
                  <Input type="number" min={1} max={100} value={quantity} onChange={(e) => setQuantity(Math.min(100, Math.max(1, Number(e.target.value))))} />
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Allow Duplicates</Label>
                    <Switch checked={allowDuplicates} onCheckedChange={setAllowDuplicates} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Sort Results</Label>
                    <Switch checked={isSorted} onCheckedChange={setIsSorted} />
                  </div>
                </div>
                <Button className="w-full h-11 gap-2" onClick={generateSimpleNumbers}>
                  <RefreshCw size={16} /> Generate Simple
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-7 bg-primary text-white border-none shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Hash size={120} /></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-xs uppercase tracking-widest opacity-70 font-bold text-center">Results</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center relative z-10 py-6">
                {results.length > 0 ? (
                  <div className="w-full space-y-6">
                    <div className="flex flex-wrap justify-center gap-2">
                      {results.map((n, i) => (
                        <div key={i} className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 font-mono text-xl font-black">{n}</div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <Button variant="secondary" size="sm" className="rounded-full font-bold" onClick={() => copyToClipboard(results.join(', '), 'simple')}>
                        {copied ? <Check size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />} Copy
                      </Button>
                    </div>
                  </div>
                ) : <p className="italic opacity-60">Generate to see numbers</p>}
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Comprehensive Version */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-xl text-accent"><Zap size={24} /></div>
              <div>
                <h3 className="text-2xl font-bold text-primary">Comprehensive Version</h3>
                <p className="text-sm text-muted-foreground">High-precision integers or decimals with up to 999 digits.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <Card className="lg:col-span-6">
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Lower Limit</Label>
                      <Input value={cMin} onChange={(e) => setCMin(e.target.value)} placeholder="0.2" />
                    </div>
                    <div className="space-y-2">
                      <Label>Upper Limit</Label>
                      <Input value={cMax} onChange={(e) => setCMax(e.target.value)} placeholder="112.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Generate Quantity</Label>
                      <Input type="number" value={cQty} onChange={(e) => setCQty(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Result Type</Label>
                      <Select value={cType} onValueChange={(v: any) => setCType(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="integer">Integer</SelectItem>
                          <SelectItem value="decimal">Decimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {cType === 'decimal' && (
                    <div className="space-y-2">
                      <Label>Precision (Digits)</Label>
                      <Input type="number" min={1} max={999} value={cPrecision} onChange={(e) => setCPrecision(Number(e.target.value))} />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center justify-between border p-3 rounded-lg">
                      <Label className="text-xs">Unique Only</Label>
                      <Switch checked={!cAllowDuplicates} onCheckedChange={(v) => setCAllowDuplicates(!v)} />
                    </div>
                    <div className="flex items-center justify-between border p-3 rounded-lg">
                      <Label className="text-xs">Sort Results</Label>
                      <Switch checked={cSort} onCheckedChange={setCSort} />
                    </div>
                  </div>

                  <Button className="w-full h-12 font-bold gap-2 bg-accent hover:bg-accent/90" onClick={generateComprehensiveNumbers}>
                    <RefreshCw size={18} /> Generate Comprehensive
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-6 bg-slate-50 border-2 border-dashed flex flex-col min-h-[300px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase font-black text-muted-foreground tracking-widest text-center">Comprehensive Results</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-6">
                  {cResults.length > 0 ? (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <ScrollArea className="flex-1 max-h-[350px]">
                        <div className="space-y-3 pr-4">
                          {cResults.map((val, idx) => (
                            <div key={idx} className="p-4 bg-white border rounded-xl font-mono text-xs break-all shadow-sm">
                              {val}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="flex justify-center">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(cResults.join('\n'), 'comp')}>
                          {cCopied ? <Check size={14} /> : <Copy size={14} />} Copy All
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                      <Binary size={48} className="mb-4 text-muted-foreground" />
                      <p className="italic text-sm text-center">Results will appear here with high-precision scaling.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Input Your List</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-destructive hover:bg-destructive/10" onClick={() => setListText('')}>
                  <Trash2 size={14} className="mr-1" /> Clear
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-black tracking-widest">Items (One per line)</Label>
                  <Textarea className="min-h-[250px] font-mono text-sm" placeholder="Enter names or choices..." value={listText} onChange={(e) => setListText(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs">Pick Quantity</Label>
                    <Input type="number" min={1} value={pickQuantity} onChange={(e) => setPickQuantity(Math.max(1, Number(e.target.value)))} />
                  </div>
                  <div className="flex items-center justify-between pt-8">
                    <Label className="text-xs">Allow Duplicates</Label>
                    <Switch checked={pickDuplicates} onCheckedChange={setPickDuplicates} />
                  </div>
                </div>
                <Button className="w-full h-12 text-md font-bold gap-2 bg-accent hover:bg-accent/90" onClick={pickFromList}>
                  <Shuffle size={18} /> Pick Random Items
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-6 border-none shadow-xl overflow-hidden h-full flex flex-col">
              <CardHeader className="bg-accent text-white py-4">
                <CardTitle className="text-xs uppercase tracking-widest font-black text-center">Selected Items</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-6">
                {pickedResults.length > 0 ? (
                  <div className="space-y-6 flex-1 flex flex-col justify-center">
                    <div className="space-y-2">
                      {pickedResults.map((item, i) => (
                        <div key={i} className="p-3 bg-accent/5 border border-accent/20 rounded-lg flex items-center gap-3 animate-in slide-in-from-right-2">
                          <div className="h-6 w-6 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs">{i + 1}</div>
                          <span className="text-sm font-bold text-accent truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 flex justify-center">
                      <Button variant="outline" size="sm" className="rounded-full border-accent/30 text-accent font-bold" onClick={() => copyToClipboard(pickedResults.join('\n'), 'list')}>
                        {pickerCopied ? <Check size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />} Copy List
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                    <History size={48} className="text-muted-foreground mb-4" />
                    <p className="italic text-sm">No items picked yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Make Completely Unbiased Decisions with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are hosting a promotional sweepstakes giveaway, assigning random groups for a project, rolling dice for a tabletop game, conducting statistical sampling, or just trying to settle a friendly debate, you need a result that is completely unbiased. Human brains are notoriously bad at producing true randomness; when asked to pick a number from 1 to 10, a disproportionate number of people will choose 7. Our free online Random Number Generator acts as a fair, digital random number maker, allowing you to generate any custom set of integers instantly.
            </p>

            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              How It Works: The Math Behind the Randomizer
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                To get a random number that is statistically unbiased, a computer must run an algorithm that distributes selection probabilities perfectly across your specified range. Our application runs a classic scaling formula to map random decimal values generated by your browser into a clean, targeted integer range defined by a Minimum (Min) and Maximum (Max) parameter:
              </p>
              
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                Random Integer = ⌊ R × (Max - Min + 1) ⌋ + Min
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">R</span> represents a cryptographically secure pseudo-random decimal value between 0 (inclusive) and 1 (exclusive).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">⌊ ... ⌋</span> represents the floor mathematical function, which rounds the value down to the nearest whole integer.</p>
              </div>

              <p className="text-muted-foreground leading-relaxed pt-2">
                For example, if you set your range from a Min of 1 to a Max of 100, and the system generates a random decimal R = 0.572, the calculation processes as:
              </p>
              <div className="bg-muted/50 p-4 rounded-xl font-mono text-sm text-center border">
                Random Integer = ⌊ 0.572 × (100 - 1 + 1) ⌋ + 1 = ⌊ 57.2 ⌋ + 1 = 57 + 1 = 58
              </div>
              <p className="text-muted-foreground leading-relaxed pt-2">
                Every single integer within your specified boundaries has an identical, mathematically equal chance of being selected on every click.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Versatile Features to Meet Your Needs
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our multi-functional generator is built to support a wide array of activities beyond basic number generation:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Custom Range Control</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Set your minimum and maximum values to anything you need—whether it is 1 to 6 for a virtual die roll, or 1 to 10,000 for a large raffle.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <List className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Generate Lists of Numbers</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Generate multiple random numbers at the same time, perfect for bulk distributions, class assignments, or sweepstakes draws.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Duplicate Prevention</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Toggle our "Unique Only" switch on. If enabled, the generator guarantees that every number in your generated list is entirely unique.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
              <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Why Generate Your Numbers with MyApexCalc?
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>High-Entropy Cryptographic Security:</strong> We do not rely on simple, predictable mathematical clocks. Our tool utilizes your browser's native cryptographic API for secure entropy.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Instant, Client-Side Action:</strong> Everything runs instantly inside your device's browser, meaning there are no page refreshes, lag, or server delays.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>100% Privacy Protection:</strong> We do not track, log, or store the numbers you generate. Your drawings are entirely private and visible only on your screen.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
