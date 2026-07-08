"use client"

import { useState, useCallback, useEffect } from 'react';
import { CalculatorWrapper } from '@/components/calculators/CalculatorWrapper';
import { 
  Lock, 
  Copy, 
  RefreshCw, 
  ShieldCheck, 
  Info, 
  Check,
  History,
  Shield,
  Eye,
  Key
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function PasswordGeneratorPage() {
  const { toast } = useToast();
  
  // Settings
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Results
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copyIndex, setCopyIndex] = useState<number | null>(null);

  const generatePasswords = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars = 'il1Lo0O';
    const ambiguousChars = '{}[]()/\'"`~,;:.<>';

    let charset = '';
    if (includeUpper) charset += uppercase;
    if (includeLower) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (excludeSimilar) {
      const re = new RegExp(`[${similarChars}]`, 'g');
      charset = charset.replace(re, '');
    }

    if (excludeAmbiguous) {
      // Escape special regex characters in ambiguous string for replacement
      const escaped = ambiguousChars.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const re = new RegExp(`[${escaped}]`, 'g');
      charset = charset.replace(re, '');
    }

    if (charset === '') {
      setPasswords(['Please select at least one character set.']);
      return;
    }

    const newPasswords = [];
    for (let i = 0; i < quantity; i++) {
      let pwd = '';
      for (let j = 0; j < length; j++) {
        pwd += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      newPasswords.push(pwd);
    }
    setPasswords(newPasswords);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeSimilar, excludeAmbiguous, quantity]);

  // Initial generation
  useEffect(() => {
    generatePasswords();
  }, [generatePasswords]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopyIndex(index);
    setTimeout(() => setCopyIndex(null), 2000);
    toast({
      title: "Copied!",
      description: "Password has been copied to your clipboard.",
    });
  };

  return (
    <CalculatorWrapper
      title="Random Password Generator"
      description="Create ultra-secure, random passwords instantly to protect your online accounts and digital identity."
      icon={Lock}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generator Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Password Length</Label>
                  <span className="font-bold text-primary text-lg">{length}</span>
                </div>
                <Slider 
                  value={[length]} 
                  min={4} 
                  max={50} 
                  step={1} 
                  onValueChange={(v) => setLength(v[0])} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="upper" checked={includeUpper} onCheckedChange={(v) => setIncludeUpper(!!v)} />
                  <Label htmlFor="upper" className="text-xs cursor-pointer">Uppercase (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lower" checked={includeLower} onCheckedChange={(v) => setIncludeLower(!!v)} />
                  <Label htmlFor="lower" className="text-xs cursor-pointer">Lowercase (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="nums" checked={includeNumbers} onCheckedChange={(v) => setIncludeNumbers(!!v)} />
                  <Label htmlFor="nums" className="text-xs cursor-pointer">Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="syms" checked={includeSymbols} onCheckedChange={(v) => setIncludeSymbols(!!v)} />
                  <Label htmlFor="syms" className="text-xs cursor-pointer">Symbols (!@#$)</Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="similar" checked={excludeSimilar} onCheckedChange={(v) => setExcludeSimilar(!!v)} />
                  <Label htmlFor="similar" className="text-xs cursor-pointer">Exclude Similar (i, l, 1, L, o, 0, O)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ambiguous" checked={excludeAmbiguous} onCheckedChange={(v) => setExcludeAmbiguous(!!v)} />
                  <Label htmlFor="ambiguous" className="text-xs cursor-pointer">Exclude Ambiguous ({"{ } [ ] ( ) / \\ ' \" ` ~ , ; : . < >"})</Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Quantity</Label>
                  <span className="font-bold text-muted-foreground">{quantity}</span>
                </div>
                <Slider 
                  value={[quantity]} 
                  min={1} 
                  max={20} 
                  step={1} 
                  onValueChange={(v) => setQuantity(v[0])} 
                />
              </div>

              <Button className="w-full gap-2 mt-4" onClick={generatePasswords}>
                <RefreshCw size={16} />
                Generate New Passwords
              </Button>
            </CardContent>
          </Card>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-4">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-primary font-bold">Privacy Guaranteed</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our generator works entirely in your browser. No passwords are ever sent to our servers or stored anywhere.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest opacity-70 font-bold text-center">Your Secure Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar p-6">
              {passwords.map((pwd, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <div className="flex-1 bg-white/10 p-4 rounded-xl border border-white/20 font-mono text-lg break-all select-all selection:bg-accent selection:text-white">
                    {pwd}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-14 w-14 shrink-0 rounded-xl hover:bg-white hover:text-primary transition-all"
                    onClick={() => copyToClipboard(pwd, idx)}
                  >
                    {copyIndex === idx ? <Check size={20} /> : <Copy size={20} />}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Password Strength Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground leading-relaxed">
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <p className="font-bold text-foreground">Length is King</p>
                  <p>A 16-character password is exponentially harder to crack than an 8-character one, even if only using letters.</p>
                </div>
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <p className="font-bold text-foreground">Mixing Sets</p>
                  <p>Always mix symbols and numbers to increase the entropy of your credentials.</p>
                </div>
              </div>
              <Separator />
              <p className="text-[10px] text-center italic text-muted-foreground">
                "Use a Password Manager like 1Password or Bitwarden to store these unique keys safely."
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Informational Text Section */}
        <div className="lg:col-span-12 space-y-12 py-10">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Key className="w-6 h-6" />
                Why use a Random Generator?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Human beings are notoriously bad at being random. We tend to use names, dates, or common keyboard patterns (like "qwerty") that are easily guessed by dictionary-based cracking software. A random generator removes human bias, ensuring every character is a roll of the digital dice.
              </p>
              <h4 className="font-bold text-foreground">Entropy and Security</h4>
              <p className="text-muted-foreground leading-relaxed">
                Password entropy is a measure of how unpredictable a password is. By including uppercase, lowercase, numbers, and symbols across 16 or more characters, you create billions of trillions of possible combinations, making brute-force attacks practically impossible within a human lifetime.
              </p>
            </section>

            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary">Advanced Features</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Similar Character Exclusion</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Avoid characters that look alike (like '1' and 'l') to prevent transcription errors when you need to type the password manually.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Eye className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Ambiguous Symbols</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Some systems or old apps have trouble with special characters like brackets or single quotes. Use the exclude option to ensure compatibility.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Info className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Multi-Pass Generation</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Generate up to 20 passwords at once so you can quickly set up different keys for multiple new accounts or services.</p>
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
