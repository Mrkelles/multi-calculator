"use client"

import { useState, useMemo } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  ArrowLeftRight, 
  Ruler, 
  Thermometer, 
  Maximize, 
  Box, 
  Weight as WeightIcon,
  Info,
  History,
  Calculator
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type ConversionMode = 'length' | 'temperature' | 'area' | 'volume' | 'weight';

const UNITS: Record<ConversionMode, { label: string; factor: number }[]> = {
  length: [
    { label: 'Millimeter (mm)', factor: 0.001 },
    { label: 'Centimeter (cm)', factor: 0.01 },
    { label: 'Meter (m)', factor: 1 },
    { label: 'Kilometer (km)', factor: 1000 },
    { label: 'Inch (in)', factor: 0.0254 },
    { label: 'Foot (ft)', factor: 0.3048 },
    { label: 'Yard (yd)', factor: 0.9144 },
    { label: 'Mile (mi)', factor: 1609.344 },
    { label: 'Nautical Mile (nmi)', factor: 1852 },
  ],
  area: [
    { label: 'Sq Millimeter (mm²)', factor: 0.000001 },
    { label: 'Sq Centimeter (cm²)', factor: 0.0001 },
    { label: 'Sq Meter (m²)', factor: 1 },
    { label: 'Sq Kilometer (km²)', factor: 1000000 },
    { label: 'Sq Inch (in²)', factor: 0.00064516 },
    { label: 'Sq Foot (ft²)', factor: 0.09290304 },
    { label: 'Sq Yard (yd²)', factor: 0.83612736 },
    { label: 'Sq Mile (mi²)', factor: 2589988.11 },
    { label: 'Acre (ac)', factor: 4046.85642 },
    { label: 'Hectare (ha)', factor: 10000 },
  ],
  volume: [
    { label: 'Milliliter (ml)', factor: 0.001 },
    { label: 'Liter (l)', factor: 1 },
    { label: 'Cubic Meter (m³)', factor: 1000 },
    { label: 'Teaspoon (tsp metric)', factor: 0.005 },
    { label: 'Tablespoon (tbsp metric)', factor: 0.015 },
    { label: 'Cup (cup metric)', factor: 0.25 },
    { label: 'Fluid Ounce (fl oz US)', factor: 0.0295735 },
    { label: 'Pint (pt US)', factor: 0.473176 },
    { label: 'Quart (qt US)', factor: 0.946353 },
    { label: 'Gallon (gal US)', factor: 3.78541 },
    { label: 'Cubic Inch (in³)', factor: 0.0163871 },
    { label: 'Cubic Foot (ft³)', factor: 28.3168 },
  ],
  weight: [
    { label: 'Milligram (mg)', factor: 0.000001 },
    { label: 'Gram (g)', factor: 0.001 },
    { label: 'Kilogram (kg)', factor: 1 },
    { label: 'Metric Ton (t)', factor: 1000 },
    { label: 'Ounce (oz)', factor: 0.0283495 },
    { label: 'Pound (lb)', factor: 0.453592 },
    { label: 'Stone (st)', factor: 6.35029 },
    { label: 'US Ton (short)', factor: 907.185 },
    { label: 'Imperial Ton (long)', factor: 1016.05 },
  ],
  temperature: [
    { label: 'Celsius (°C)', factor: 0 },
    { label: 'Fahrenheit (°F)', factor: 0 },
    { label: 'Kelvin (K)', factor: 0 },
    { label: 'Rankine (°R)', factor: 0 },
  ]
};

export default function ConversionCalculatorPage() {
  const [mode, setMode] = useState<ConversionMode>('length');
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');

  // Set default units when mode changes
  useMemo(() => {
    if (mode === 'length') {
      setFromUnit('Meter (m)');
      setToUnit('Foot (ft)');
    } else if (mode === 'area') {
      setFromUnit('Sq Meter (m²)');
      setToUnit('Sq Foot (ft²)');
    } else if (mode === 'volume') {
      setFromUnit('Liter (l)');
      setToUnit('Gallon (gal US)');
    } else if (mode === 'weight') {
      setFromUnit('Kilogram (kg)');
      setToUnit('Pound (lb)');
    } else if (mode === 'temperature') {
      setFromUnit('Celsius (°C)');
      setToUnit('Fahrenheit (°F)');
    }
  }, [mode]);

  const result = useMemo(() => {
    const val = parseFloat(fromValue);
    if (isNaN(val)) return '0';

    if (mode === 'temperature') {
      let celsius = 0;
      // Convert to Celsius first
      if (fromUnit.includes('Celsius')) celsius = val;
      else if (fromUnit.includes('Fahrenheit')) celsius = (val - 32) * 5/9;
      else if (fromUnit.includes('Kelvin')) celsius = val - 273.15;
      else if (fromUnit.includes('Rankine')) celsius = (val - 491.67) * 5/9;

      // Convert from Celsius to Target
      if (toUnit.includes('Celsius')) return celsius.toFixed(4);
      if (toUnit.includes('Fahrenheit')) return (celsius * 9/5 + 32).toFixed(4);
      if (toUnit.includes('Kelvin')) return (celsius + 273.15).toFixed(4);
      if (toUnit.includes('Rankine')) return (celsius * 9/5 + 491.67).toFixed(4);
      return '0';
    } else {
      const units = UNITS[mode];
      const fromFactor = units.find(u => u.label === fromUnit)?.factor || 1;
      const toFactor = units.find(u => u.label === toUnit)?.factor || 1;
      
      // Convert to base unit then to target
      const baseVal = val * fromFactor;
      const targetVal = baseVal / toFactor;
      
      return targetVal.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }
  }, [mode, fromValue, fromUnit, toUnit]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <CalculatorWrapper
      title="Conversion Calculator"
      description="Quickly convert units of measurement for physical quantities including distance, area, weight, and volume."
      icon={ArrowLeftRight}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl overflow-x-auto">
              <TabsTrigger value="length" className="text-[10px] md:text-xs py-2"><Ruler className="w-3 h-3 mr-1 hidden sm:inline" /> Length</TabsTrigger>
              <TabsTrigger value="temperature" className="text-[10px] md:text-xs py-2"><Thermometer className="w-3 h-3 mr-1 hidden sm:inline" /> Temp</TabsTrigger>
              <TabsTrigger value="area" className="text-[10px] md:text-xs py-2"><Maximize className="w-3 h-3 mr-1 hidden sm:inline" /> Area</TabsTrigger>
              <TabsTrigger value="volume" className="text-[10px] md:text-xs py-2"><Box className="w-3 h-3 mr-1 hidden sm:inline" /> Volume</TabsTrigger>
              <TabsTrigger value="weight" className="text-[10px] md:text-xs py-2"><WeightIcon className="w-3 h-3 mr-1 hidden sm:inline" /> Weight</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <Card className="border-none shadow-md">
                <CardContent className="pt-8 space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">From</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        type="number" 
                        value={fromValue} 
                        onChange={(e) => setFromValue(e.target.value)} 
                        className="text-lg font-mono"
                      />
                      <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNITS[mode].map(u => (
                            <SelectItem key={u.label} value={u.label}>{u.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-center -my-4 relative z-10">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleSwap}
                      className="rounded-full shadow-sm bg-white hover:bg-primary hover:text-white transition-all w-10 h-10 border-2 border-primary/20"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">To</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="h-10 flex items-center px-3 rounded-md bg-muted/30 border border-input font-mono font-bold text-primary overflow-x-auto whitespace-nowrap">
                        {result}
                      </div>
                      <Select value={toUnit} onValueChange={setToUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNITS[mode].map(u => (
                            <SelectItem key={u.label} value={u.label}>{u.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-4">
            <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-primary font-bold">Standardized Units</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This calculator uses standard international conversion factors (SI units) as the base for all non-temperature calculations, ensuring scientific accuracy across all modes.
              </p>
            </div>
          </div>
        </div>

        {/* Results / Results Summary Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ArrowLeftRight className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-xs uppercase tracking-widest opacity-70 font-bold text-center">Converted Value</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 pb-10 relative z-10">
              <div className="text-5xl font-black font-headline tracking-tighter break-all">
                {result}
              </div>
              <p className="text-sm opacity-60 font-medium">{toUnit}</p>
              <Separator className="bg-white/20" />
              <div className="text-[10px] uppercase font-bold opacity-60 tracking-widest">
                {fromValue} {fromUnit} equals
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Conversion Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-xs text-muted-foreground leading-relaxed">
              {mode === 'temperature' ? (
                <p>Temperature conversions are unique as they often involve an offset (like 32°F) rather than just a simple multiplier. We use the Celsius scale as the central pivot for all temperature arithmetic.</p>
              ) : (
                <p>For {mode} conversions, we calculate the ratio between the source unit and the target unit using a central base unit (Meter for length, Kilogram for weight, etc.). This ensures that multi-step conversions maintain precision.</p>
              )}
              <div className="bg-blue-50 p-4 rounded-xl text-blue-700 italic border border-blue-100">
                "Numerical precision is maintained up to 6 decimal places for specialized technical calculations."
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
                The Importance of Unit Conversion
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Unit conversion is a multi-step process that involves multiplication or division by a numerical factor, selection of the correct number of significant digits, and rounding. At <strong>My Apex Calc</strong>, we provide tools that handle both the <strong>International System of Units (SI)</strong> and the <strong>Imperial System</strong> used in the United States and UK.
              </p>
              <h4 className="font-bold text-foreground">Why Accuracy Matters</h4>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are a chef converting milliliters to fluid ounces, an engineer measuring square meters for a site plan, or a traveler checking the local temperature in Celsius, precise conversions prevent errors that can lead to wasted materials, incorrect dosages, or simply the wrong clothes for the weather.
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Calculation Modes</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Ruler className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Linear & Square Scaling</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">The calculator handles both 1D distance (Length) and 2D coverage (Area) with specific adjustments for units like Acres and Hectares.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Box className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">3D Volume & Liquid</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Converts between physical space (Cubic Meters) and liquid capacity (Gallons, Liters) seamlessly for laboratory or kitchen use.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <WeightIcon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Mass & Weight</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Supports fine units like Milligrams for pharmaceuticals and heavy units like US and Imperial Tons for industrial shipping.</p>
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
