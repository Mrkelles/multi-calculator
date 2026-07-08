"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Construction, 
  Info, 
  Layers, 
  Square, 
  Circle, 
  History, 
  Calculator,
  LayoutGrid,
  Hash,
  Pipette
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

type ConcreteMode = 'slab' | 'hole' | 'circular' | 'curb' | 'stairs';

export default function ConcreteCalculatorPage() {
  const [mode, setMode] = useState<ConcreteMode>('slab');

  // Density Constant: 133 lbs/ft3 or 2130 kg/m3
  const DENSITY_LBS_FT3 = 133;
  const DENSITY_KG_M3 = 2130;

  // Slabs, Square Footings, or Walls
  const [slabLength, setSlabLength] = useState(5);
  const [slabWidth, setSlabWidth] = useState(2.5);
  const [slabThickness, setSlabThickness] = useState(5);
  const [slabQty, setSlabQuantity] = useState(1);

  // Hole, Column, or Round Footings
  const [holeDiameter, setHoleDiameter] = useState(2.5);
  const [holeDepth, setHoleDepth] = useState(6);
  const [holeQty, setHoleQty] = useState(1);

  // Circular Slab or Tube
  const [circOuterDia, setCircOuterDia] = useState(5);
  const [circInnerDia, setCircInnerDia] = useState(4);
  const [circHeight, setCircHeight] = useState(6);
  const [circQty, setCircQty] = useState(1);

  // Curb and Gutter Barrier
  const [curbDepth, setCurbDepth] = useState(4);
  const [gutterWidth, setGutterWidth] = useState(10);
  const [curbHeight, setCurbHeight] = useState(4);
  const [flagThickness, setFlagThickness] = useState(5);
  const [curbLength, setCurbLength] = useState(10);
  const [curbQty, setCurbQty] = useState(1);

  // Stairs
  const [stairRun, setStairRun] = useState(12);
  const [stairRise, setStairRise] = useState(6);
  const [stairWidth, setStairWidth] = useState(50);
  const [stairPlatform, setStairPlatform] = useState(5);
  const [stairRisers, setStairRisers] = useState(5);

  const results = useMemo(() => {
    let volumeFt3 = 0;

    if (mode === 'slab') {
      volumeFt3 = slabLength * slabWidth * (slabThickness / 12) * slabQty;
    } else if (mode === 'hole') {
      const radius = holeDiameter / 2;
      volumeFt3 = Math.PI * Math.pow(radius, 2) * holeDepth * holeQty;
    } else if (mode === 'circular') {
      const r1 = circOuterDia / 2;
      const r2 = circInnerDia / 2;
      volumeFt3 = Math.PI * (Math.pow(r1, 2) - Math.pow(r2, 2)) * (circHeight / 12) * circQty;
    } else if (mode === 'curb') {
      const sectionAreaSqIn = (gutterWidth * flagThickness) + (curbDepth * (curbHeight + flagThickness));
      volumeFt3 = (sectionAreaSqIn / 144) * curbLength * curbQty;
    } else if (mode === 'stairs') {
      const sideAreaSqIn = (stairRun * stairRise * (stairRisers * (stairRisers - 1) / 2)) + (stairPlatform * stairRisers * stairRise);
      volumeFt3 = (sideAreaSqIn * stairWidth) / 1728;
    }

    const volumeYd3 = volumeFt3 / 27;
    const volumeM3 = volumeFt3 * 0.0283168;
    const weightLbs = volumeFt3 * DENSITY_LBS_FT3;
    const weightKg = volumeM3 * DENSITY_KG_M3;
    const bags60 = weightLbs / 60;
    const bags80 = weightLbs / 80;

    return { volumeFt3, volumeYd3, volumeM3, weightLbs, weightKg, bags60, bags80 };
  }, [
    mode, slabLength, slabWidth, slabThickness, slabQty,
    holeDiameter, holeDepth, holeQty,
    circOuterDia, circInnerDia, circHeight, circQty,
    curbDepth, gutterWidth, curbHeight, flagThickness, curbLength, curbQty,
    stairRun, stairRise, stairWidth, stairPlatform, stairRisers
  ]);

  return (
    <CalculatorWrapper
      title="Concrete Calculator"
      description="Estimate the volume and weight of concrete needed for your construction project. Supports slabs, walls, columns, curbs, and stairs."
      icon={Construction}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl overflow-x-auto">
              <TabsTrigger value="slab" className="text-[10px] md:text-xs py-2">Slab/Wall</TabsTrigger>
              <TabsTrigger value="hole" className="text-[10px] md:text-xs py-2">Hole/Col</TabsTrigger>
              <TabsTrigger value="circular" className="text-[10px] md:text-xs py-2">Circ/Tube</TabsTrigger>
              <TabsTrigger value="curb" className="text-[10px] md:text-xs py-2">Curb</TabsTrigger>
              <TabsTrigger value="stairs" className="text-[10px] md:text-xs py-2">Stairs</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <Card className="border-none shadow-md">
                <CardContent className="pt-6 space-y-6">
                  {mode === 'slab' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Length (feet)</Label>
                          <Input type="number" value={slabLength} onChange={(e) => setSlabLength(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Width (feet)</Label>
                          <Input type="number" value={slabWidth} onChange={(e) => setSlabWidth(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Thickness (inches)</Label>
                          <Input type="number" value={slabThickness} onChange={(e) => setSlabThickness(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input type="number" value={slabQty} onChange={(e) => setSlabQuantity(Number(e.target.value))} />
                        </div>
                      </div>
                      <div className="flex items-center justify-center bg-muted/20 rounded-2xl p-4">
                        <Image 
                          src="https://d26tpo4cm8sb6k.cloudfront.net/img/concrete/ret-shape.svg" 
                          width={300} 
                          height={200} 
                          alt="Slab Guide" 
                          className="rounded-lg"
                          data-ai-hint="concrete slab"
                        />
                      </div>
                    </div>
                  )}

                  {mode === 'hole' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Diameter (feet)</Label>
                          <Input type="number" value={holeDiameter} onChange={(e) => setHoleDiameter(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Depth / Height (feet)</Label>
                          <Input type="number" value={holeDepth} onChange={(e) => setHoleDepth(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input type="number" value={holeQty} onChange={(e) => setHoleQty(Number(e.target.value))} />
                        </div>
                      </div>
                      <div className="flex items-center justify-center bg-muted/20 rounded-2xl p-4">
                        <Image 
                          src="https://d26tpo4cm8sb6k.cloudfront.net/img/concrete/col-shape.svg" 
                          width={300} 
                          height={200} 
                          alt="Hole Guide" 
                          className="rounded-lg"
                          data-ai-hint="concrete column"
                        />
                      </div>
                    </div>
                  )}

                  {mode === 'circular' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Outer Diameter (feet)</Label>
                          <Input type="number" value={circOuterDia} onChange={(e) => setCircOuterDia(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Inner Diameter (feet)</Label>
                          <Input type="number" value={circInnerDia} onChange={(e) => setCircInnerDia(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Length / Height (inches)</Label>
                          <Input type="number" value={circHeight} onChange={(e) => setCircHeight(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input type="number" value={circQty} onChange={(e) => setCircQty(Number(e.target.value))} />
                        </div>
                      </div>
                      <div className="flex items-center justify-center bg-muted/20 rounded-2xl p-4">
                        <Image 
                          src="https://d26tpo4cm8sb6k.cloudfront.net/img/concrete/tube-shape.svg" 
                          width={300} 
                          height={200} 
                          alt="Circular Guide" 
                          className="rounded-lg"
                          data-ai-hint="concrete tube"
                        />
                      </div>
                    </div>
                  )}

                  {mode === 'curb' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Curb Depth (in)</Label>
                            <Input type="number" value={curbDepth} onChange={(e) => setCurbDepth(Number(e.target.value))} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Gutter Width (in)</Label>
                            <Input type="number" value={gutterWidth} onChange={(e) => setGutterWidth(Number(e.target.value))} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Curb Height (in)</Label>
                            <Input type="number" value={curbHeight} onChange={(e) => setCurbHeight(Number(e.target.value))} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Flag Thickness (in)</Label>
                            <Input type="number" value={flagThickness} onChange={(e) => setFlagThickness(Number(e.target.value))} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Length (feet)</Label>
                          <Input type="number" value={curbLength} onChange={(e) => setCurbLength(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input type="number" value={curbQty} onChange={(e) => setCurbQty(Number(e.target.value))} />
                        </div>
                      </div>
                      <div className="flex items-center justify-center bg-muted/20 rounded-2xl p-4">
                        <Image 
                          src="https://d26tpo4cm8sb6k.cloudfront.net/img/concrete/curb-shape.svg" 
                          width={300} 
                          height={200} 
                          alt="Curb Guide" 
                          className="rounded-lg"
                          data-ai-hint="concrete curb"
                        />
                      </div>
                    </div>
                  )}

                  {mode === 'stairs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Run (in)</Label>
                            <Input type="number" value={stairRun} onChange={(e) => setStairRun(Number(e.target.value))} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Rise (in)</Label>
                            <Input type="number" value={stairRise} onChange={(e) => setStairRise(Number(e.target.value))} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Width (inches)</Label>
                          <Input type="number" value={stairWidth} onChange={(e) => setStairWidth(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Platform Depth (inches)</Label>
                          <Input type="number" value={stairPlatform} onChange={(e) => setStairPlatform(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Number of Risers</Label>
                          <Input type="number" value={stairRisers} onChange={(e) => setStairRisers(Number(e.target.value))} />
                        </div>
                      </div>
                      <div className="flex items-center justify-center bg-muted/20 rounded-2xl p-4">
                        <Image 
                          src="https://d26tpo4cm8sb6k.cloudfront.net/img/concrete/stair-shape.svg" 
                          width={300} 
                          height={200} 
                          alt="Stairs Guide" 
                          className="rounded-lg"
                          data-ai-hint="concrete stairs"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-70 font-bold text-center">Calculated Volume</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 pb-10">
              <div className="text-5xl font-black font-headline tracking-tighter">
                {results.volumeYd3.toFixed(2)}
                <span className="text-xl opacity-60 ml-2">yd³</span>
              </div>
              <Separator className="bg-white/20" />
              <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                <div className="space-y-1">
                  <p className="opacity-60 text-[10px] uppercase">Cubic Feet</p>
                  <p className="text-lg">{results.volumeFt3.toFixed(2)} ft³</p>
                </div>
                <div className="space-y-1">
                  <p className="opacity-60 text-[10px] uppercase">Cubic Meters</p>
                  <p className="text-lg">{results.volumeM3.toFixed(2)} m³</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Material Estimates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/5 p-3 rounded-xl border border-accent/10">
                    <p className="text-[10px] uppercase font-bold text-accent mb-1">60-lb Bags</p>
                    <p className="text-2xl font-black text-primary">{Math.ceil(results.bags60)}</p>
                  </div>
                  <div className="bg-accent/5 p-3 rounded-xl border border-accent/10">
                    <p className="text-[10px] uppercase font-bold text-accent mb-1">80-lb Bags</p>
                    <p className="text-2xl font-black text-primary">{Math.ceil(results.bags80)}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Total Weight (Lbs)</span>
                    <span className="font-bold">{results.weightLbs.toLocaleString(undefined, { maximumFractionDigits: 1 })} lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Weight (Kg)</span>
                    <span className="font-bold">{results.weightKg.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 border-t border-blue-100 flex gap-3">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-700 leading-relaxed italic">
                  * Based on a standard pre-mixed density of 133 lbs/ft³. Actual yield may vary by concrete brand and water mix.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 space-y-12 py-10">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                Understanding Concrete Math
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Calculating the right amount of concrete is essential for any construction project, whether you're pouring a small garden walkway or a professional structural wall. Overestimating leads to waste and extra costs, while underestimating can halt your project mid-pour, compromising structural integrity.
              </p>
              <h4 className="font-bold text-foreground">Why Weight and Bags Matter</h4>
              <p className="text-muted-foreground leading-relaxed">
                Most DIY and small professional projects use pre-mixed concrete bags. Our calculator uses the standard density of <strong>133 lbs/ft³</strong> to estimate exactly how many 60-lb or 80-lb bags you need to purchase from your local supplier.
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Calculation Features</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <LayoutGrid className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Complex Shapes</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Choose from five specialized geometric modes including curbs and stairs to avoid manual multi-part volume calculations.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Pipette className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Precision Unit Scaling</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Automatically handles the conversion between inches and feet, ensuring your thickness and length inputs align perfectly in the final volume.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Layers className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Quantity Support</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Calculate concrete for multiple identical footings or columns simultaneously by adjusting the quantity field in each mode.</p>
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
