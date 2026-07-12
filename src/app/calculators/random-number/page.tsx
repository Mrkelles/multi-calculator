"use client"

import { useState, useCallback } from 'react';
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
  History
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function RandomNumberGeneratorPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('numbers');

  // Generator State
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  // Picker State
  const [listText, setListText] = useState("Choice 1\nChoice 2\nChoice 3\nChoice 4\nChoice 5");
  const [pickQuantity, setPickQuantity] = useState(1);
  const [pickDuplicates, setPickDuplicates] = useState(false);
  const [pickedResults, setPickedResults] = useState<string[]>([]);
  const [pickerCopied, setPickerCopied] = useState(false);

  const generateNumbers = useCallback(() => {
    if (min >= max) {
      toast({
        variant: "destructive",
        title: "Invalid Range",
        description: "Lower bound must be less than the upper bound.",
      });
      return;
    }

    const range = max - min + 1;
    if (!allowDuplicates && quantity > range) {
      toast({
        variant: "destructive",
        title: "Range Too Small",
        description: `Cannot pick ${quantity} unique numbers from a range of ${range}.`,
      });
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

    if (isSorted) {
      newResults.sort((a, b) => a - b);
    }

    setResults(newResults);
    setCopied(false);
  }, [min, max, quantity, allowDuplicates, isSorted, toast]);

  const pickFromList = useCallback(() => {
    const items = listText.split('\n').map(s => s.trim()).filter(s => s !== '');
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty List",
        description: "Please enter some items to pick from.",
      });
      return;
    }

    if (!pickDuplicates && pickQuantity > items.length) {
      toast({
        variant: "destructive",
        title: "List Too Small",
        description: `Cannot pick ${pickQuantity} unique items from a list of ${items.length}.`,
      });
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

  const copyToClipboard = (text: string, isPicker: boolean) => {
    navigator.clipboard.writeText(text);
    if (isPicker) setPickerCopied(true);
    else setCopied(true);
    setTimeout(() => {
      if (isPicker) setPickerCopied(false);
      else setCopied(false);
    }, 2000);
    toast({
      title: "Copied!",
      description: "Results have been copied to your clipboard.",
    });
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

        <TabsContent value="numbers" className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle className="text-lg">Range & Settings</CardTitle>
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
                  <Label>Quantity to Generate (Max 100)</Label>
                  <Input 
                    type="number" 
                    min={1} 
                    max={100} 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.min(100, Math.max(1, Number(e.target.value))))} 
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Duplicates</Label>
                      <p className="text-[10px] text-muted-foreground">Repeated numbers in results</p>
                    </div>
                    <Switch checked={allowDuplicates} onCheckedChange={setAllowDuplicates} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sort Results</Label>
                      <p className="text-[10px] text-muted-foreground">Order numbers from low to high</p>
                    </div>
                    <Switch checked={isSorted} onCheckedChange={setIsSorted} />
                  </div>
                </div>

                <Button className="w-full h-12 text-md font-bold gap-2" onClick={generateNumbers}>
                  <RefreshCw size={18} /> Generate Numbers
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-primary text-white border-none shadow-xl min-h-[200px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Hash size={120} />
                </div>
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-xs uppercase tracking-widest opacity-70 font-bold text-center">Generated Results</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center relative z-10 py-6">
                  {results.length > 0 ? (
                    <div className="w-full space-y-6">
                      <div className="flex flex-wrap justify-center gap-3">
                        {results.map((n, i) => (
                          <div key={i} className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 font-mono text-2xl font-black">
                            {n}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="rounded-full bg-white/20 hover:bg-white text-primary border-none font-bold"
                          onClick={() => copyToClipboard(results.join(', '), false)}
                        >
                          {copied ? <Check size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />}
                          Copy All Results
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="italic opacity-60">Click Generate to see numbers</p>
                  )}
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
                <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-blue-800 font-bold">Pseudo-Random Logic</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    This generator uses the high-entropy PRNG built into your browser. While suitable for games, choices, and general use, it should not be used for cryptographic security.
                  </p>
                </div>
              </div>
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
                  <Textarea 
                    className="min-h-[250px] font-mono text-sm leading-relaxed" 
                    placeholder="Enter names, items, or choices here..."
                    value={listText}
                    onChange={(e) => setListText(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs">Pick Quantity</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={pickQuantity} 
                      onChange={(e) => setPickQuantity(Math.max(1, Number(e.target.value)))} 
                    />
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

            <div className="lg:col-span-6 space-y-6">
              <Card className="border-none shadow-xl overflow-hidden h-full flex flex-col">
                <CardHeader className="bg-accent text-white py-4">
                  <CardTitle className="text-xs uppercase tracking-[0.2em] font-black text-center">Selected Items</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-6">
                  {pickedResults.length > 0 ? (
                    <div className="space-y-6 flex-1 flex flex-col justify-center">
                      <div className="space-y-3">
                        {pickedResults.map((item, i) => (
                          <div key={i} className="p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-center gap-4 animate-in slide-in-from-right-2" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="h-8 w-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
                              {i + 1}
                            </div>
                            <span className="text-lg font-bold text-accent truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 flex justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full border-accent/30 text-accent hover:bg-accent hover:text-white transition-all font-bold"
                          onClick={() => copyToClipboard(pickedResults.join('\n'), true)}
                        >
                          {pickerCopied ? <Check size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />}
                          Copy List
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                      <History size={48} className="text-muted-foreground" />
                      <p className="italic text-sm">No items picked yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Informational Text Section */}
      <div className="lg:col-span-12 space-y-12 py-10">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <History className="w-6 h-6" />
              Understanding Randomness
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                A **Random Number Generator (RNG)** is an algorithm used to generate a sequence of numbers that lack any pattern. This tool provides a truly random selection based on mathematical entropy, making it ideal for sweepstakes, research samples, or simply making a fair decision.
              </p>
              <h4 className="font-bold text-foreground">With vs. Without Replacement</h4>
              <p>
                In statistics, picking "without duplicates" is known as sampling without replacement. Once a number is picked, it is removed from the pool. Choosing "allow duplicates" means every pick is independent, and the same number could appear multiple times.
              </p>
            </div>
          </section>

          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
            <h4 className="text-xl font-bold text-primary flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-accent" />
              Calculation Features
            </h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Hash className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">Integer Precision</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">All numbers generated are discrete integers. Decimal generation is currently not supported to ensure standard utility for picking and games.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                  <List className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-sm">Multi-Winner Picking</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">The List Picker mode allows you to pick multiple distinct winners from a large list, perfect for giveaways or classroom assignments.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
