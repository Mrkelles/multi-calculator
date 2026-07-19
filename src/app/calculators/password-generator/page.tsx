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
  Key,
  TrendingUp,
  Calculator,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { Metadata } from 'next';

// Note: Metadata is defined here for reference. In a production Next.js environment, 
// this would typically be exported from a Server Component (page.tsx) that wraps 
// this Client Component.
const metadata: Metadata = {
  title: 'Strong Password Generator | Free Random Password Creator',
  description: 'Generate secure, randomized passwords instantly with our free strong password generator. Customize length, symbols, and numbers to protect your digital accounts.',
  keywords: [
    'Password Generator',
    'password password generator',
    'make random password',
    'random password creator/maker',
    'strong password generator',
    'MyApexCalc',
    'secure password maker',
    'client-side password generator'
  ],
  
  // Open Graph for social platforms (LinkedIn, Facebook, Discord, X)
  openGraph: {
    title: 'Instant Strong Password Generator & Randomizer | MyApexCalc',
    description: 'Keep your online credentials secure. Create cryptographically strong, custom random passwords locally on your device with our zero-trust generator.',
    url: 'https://www.myapexcalc.com/calculators/password-generator',
    siteName: 'MyApexCalc',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://i.ibb.co/sJmgs3p4/password-generator.png',
        width: 1200,
        height: 630,
        alt: 'MyApexCalc Strong Password Generator and Custom Security Dashboard',
      },
    ],
  },

  // Twitter visual preview specs
  twitter: {
    card: 'summary_large_image',
    title: 'Free Random Password Creator & Security Tool | MyApexCalc',
    description: 'Instantly build uncrackable, randomized passwords with custom length and character specifications.',
    images: ['https://i.ibb.co/sJmgs3p4/password-generator.png'],
  },

  // Direct search spiders to canonical paths to prevent index duplicate penalties
  alternates: {
    canonical: 'https://www.myapexcalc.com/calculators/password-generator',
  },
};

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
    const array = new Uint32Array(length * quantity);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < quantity; i++) {
      let pwd = '';
      for (let j = 0; j < length; j++) {
        const randomIndex = array[i * length + j] % charset.length;
        pwd += charset.charAt(randomIndex);
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
      title="Strong Password Generator"
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
      </div>

      {/* Informational Text Section */}
      <div className="py-10 space-y-12">
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Lock Down Your Digital Identity with MyApexCalc
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              In an era where data breaches, credential stuffing, and phishing attacks are increasingly common, relying on basic, easily guessable passwords is a major risk. Using your pet's name, sequential numbers, or standard phrases makes your digital accounts low-hanging fruit for automated brute-force scripts. To protect your finances, private communications, and online accounts, you need completely randomized, complex keys. Our free online Password Generator serves as a secure, local random password creator/maker designed to build uncrackable security keys in a single click.
            </p>
            
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2 pt-4">
              <Calculator className="w-6 h-6" />
              The Mathematics of Defense: Understanding Password Entropy
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                A truly secure code doesn't just look random—it possesses high thermodynamic mathematical complexity, known in cybersecurity as information entropy. Entropy measures how difficult a password is to guess or brute-force, calculated in bits (E).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To evaluate a key, our strong password generator maps your customized choices to the standard Shannon entropy equation:
              </p>
              
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-sm text-center border overflow-x-auto">
                E = L × log₂ (R)
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">L</span> represents the physical length of your password (number of characters).</p>
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">R</span> represents the size of the character pool (the range of characters selected).</p>
              </div>

              <div className="rounded-xl border bg-white overflow-hidden shadow-sm mt-4">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold text-[10px] uppercase">Character Pool Options</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase">Pool Size (R)</TableHead>
                      <TableHead className="text-right font-bold text-[10px] uppercase">Example Characters</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs font-medium">Lowercase Letters Only</TableCell>
                      <TableCell className="text-xs">26</TableCell>
                      <TableCell className="text-right text-xs">a, b, c...</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs font-medium">Mixed Case Letters</TableCell>
                      <TableCell className="text-xs">52</TableCell>
                      <TableCell className="text-right text-xs">a, B, c, D...</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs font-medium">Alphanumeric</TableCell>
                      <TableCell className="text-xs">62</TableCell>
                      <TableCell className="text-right text-xs">a, B, 1, 2, 3...</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs font-medium">Full Set (inc. Symbols)</TableCell>
                      <TableCell className="text-xs">94</TableCell>
                      <TableCell className="text-right text-xs">a, B, 1, !, @, #, $...</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <p className="text-muted-foreground leading-relaxed pt-2">
                When you make random password variations with a length (L) of 16 characters using our full 94-character pool, your password boasts approximately 105 bits of entropy. A computer attempting to brute-force this configuration would have to run through 94¹⁶ possibilities—a task that would take current supercomputers trillions of years to crack.
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                Key Principles of Safe Credential Management
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When utilizing a password password generator, generating a great key is only half the battle. Implement these expert habits to ensure your digital footprint remains secure:
              </p>
              <ul className="space-y-6 pt-2">
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Never Reuse Passwords</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Each online account should have its own unique key. If a service you use is breached, hackers will test that leaked email-password combination across dozens of other popular platforms.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Key className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Leverage a Password Manager</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Human brains aren't built to memorize dozens of random 16-character string combinations. Use a local or cloud-based password manager to encrypt and autofill your generated credentials.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Always Enable Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Treat your password as your primary barrier and 2FA as your secondary safety lock. Even if an attacker uncovers your password, they won't be able to bypass physical authenticator codes.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
              <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Why Generate Your Credentials with MyApexCalc?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generating secure keys online requires absolute trust. MyApexCalc is engineered with a strict security-first philosophy:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>100% Client-Side Processing:</strong> Unlike other sites that process inputs on a remote server, our script runs exclusively in your local browser window. Your newly generated credentials never travel over the internet.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Cryptographically Secure Randomization:</strong> We don't rely on basic, predictable computer randomizers. Our tool hooks directly into your browser's native, high-entropy cryptographic API for pure, unpredictable randomization.</span>
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span><strong>Instant Dynamic Settings:</strong> Effortlessly adjust length sliders and watch your security parameters adapt in real-time.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}
