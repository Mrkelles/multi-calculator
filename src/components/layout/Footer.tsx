"use client"

import Link from 'next/link';
import { Calculator } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t py-12 px-6 bg-muted/20 mt-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <span className="font-headline font-bold text-primary">My Apex Calc</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            © {year || '2024'} My Apex Calc. Professional precision tools.
          </p>
          <div className="flex gap-6">
             <Link href="/all-calculators" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
             <Link href="/categories/finance" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Finance</Link>
             <Link href="/categories/health" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Health</Link>
             <Link href="/categories/content" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Content</Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 border-t pt-8">
          <Link href="/about-us" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">About Us</Link>
          <Link href="/contact-us" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Contact Us</Link>
          <Link href="/privacy-policy" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-use" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Terms of Use</Link>
          <Link href="/disclaimer" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
