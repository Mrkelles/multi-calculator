"use client"

import { calculators } from '@/app/lib/calculators-data';
import Link from 'next/link';
import { 
  ChevronRight, 
  Sparkles, 
  Menu, 
  Calculator, 
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const categories = [
    { id: 'finance', name: 'Finance' },
    { id: 'health', name: 'Health' },
    { id: 'content', name: 'Content' },
    { id: 'education', name: 'Education' },
    { id: 'tools', name: 'Utility Tools' },
  ];

  const categoryGroups = categories.map(cat => ({
    ...cat,
    tools: calculators.filter(c => c.category === cat.id)
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Home Navigation */}
      <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 md:px-8 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-primary/5">
              <Menu className="h-6 w-6 text-primary" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r border-border">
            <SheetHeader className="p-6 border-b bg-primary/5">
              <SheetTitle className="flex items-center gap-2 text-primary">
                <Calculator className="h-6 w-6" />
                <span className="font-headline font-bold text-xl tracking-tight">My Apex Calc</span>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-85px)]">
              <div className="p-6 space-y-8 flex flex-col min-h-full">
                <div className="flex-1 space-y-8">
                  {categoryGroups.map((group) => (
                    <div key={group.id} className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">
                        {group.name}
                      </h3>
                      <nav className="grid gap-1">
                        {group.tools.map((tool) => (
                          <Link
                            key={tool.id}
                            href={tool.path}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-primary/5 hover:text-primary transition-all group"
                          >
                            <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <tool.icon className="h-4 w-4" />
                            </div>
                            {tool.name}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  ))}
                  
                  <Separator className="opacity-50" />
                  
                  <div className="pt-2">
                    <Button asChild className="w-full justify-start gap-3 rounded-xl h-12" variant="default">
                      <Link href="/all-calculators">
                        <LayoutDashboard className="h-5 w-5" />
                        Full Dashboard View
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-auto pt-8 pb-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 px-2">
                    <Link href="/about-us" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors">About Us</Link>
                    <Link href="/contact-us" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors">Contact</Link>
                    <Link href="/privacy-policy" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors">Privacy</Link>
                    <Link href="/terms-of-use" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors">Terms</Link>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <Calculator className="h-6 w-6 text-primary shrink-0" />
          <h2 className="text-xl font-bold font-headline text-primary tracking-tight truncate">My Apex Calc</h2>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/all-calculators" className="text-sm font-bold text-primary hover:text-accent transition-colors flex items-center gap-2">
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 bg-background animate-fade-in">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/10 p-8 md:p-12 lg:p-16">
            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.15em]">
                <Sparkles className="w-3 h-3" />
                Free Professional Tools
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter text-primary leading-[1.05]">
                Precision Tools for <br/>
                <span className="text-accent">Smarter Decisions.</span>
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl font-medium opacity-90">
                Whether you're managing personal finances, tracking health metrics, or optimizing content revenue, My Apex Calc provides accurate data when it matters most.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  href="/all-calculators" 
                  className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Explore Dashboard
                </Link>
                <Link 
                  href="#finance" 
                  className="px-8 py-4 rounded-2xl bg-white border border-border text-foreground font-bold hover:bg-muted transition-all"
                >
                  Finance Tools
                </Link>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[80px] pointer-events-none opacity-50"></div>
          </section>

          {/* Categorized Tools */}
          <div className="grid gap-16">
            {categories.map((cat) => (
              <section key={cat.id} id={cat.id} className="space-y-8">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <Link 
                      href={`/categories/${cat.id}`}
                      className="text-2xl md:text-3xl font-bold text-primary hover:text-accent transition-colors flex items-center gap-2 group"
                    >
                      {cat.name}
                      <ChevronRight className="w-6 h-6 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                    <p className="text-sm text-muted-foreground font-medium">Specialized tools for {cat.name.toLowerCase()} analysis and planning.</p>
                  </div>
                  <Link 
                    href={`/categories/${cat.id}`}
                    className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all bg-muted px-4 py-2 rounded-full"
                  >
                    View All
                  </Link>
                </div>
                
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {calculators
                    .filter((calc) => calc.category === cat.id)
                    .map((calc) => (
                      <li key={calc.id}>
                        <Link 
                          href={calc.path}
                          className="flex items-center justify-between p-6 rounded-[1.5rem] border bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 rounded-2xl bg-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                              <calc.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <span className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">{calc.name}</span>
                              <p className="text-xs text-muted-foreground line-clamp-1 group-hover:text-muted-foreground/80 transition-colors">{calc.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-primary relative z-10" />
                          
                          {/* Subtle background highlight on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="pt-12 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-8 bg-muted/30 rounded-[2rem] border border-dashed border-muted-foreground/20 w-full">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">Can't find what you're looking for?</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">Access our full list of over 10+ professional-grade calculators in the centralized dashboard.</p>
              </div>
              <Link 
                href="/all-calculators" 
                className="text-sm font-bold text-white bg-accent px-6 py-3 rounded-xl hover:bg-primary transition-all inline-flex items-center gap-2 shadow-lg shadow-accent/20"
              >
                Open Full Dashboard <ChevronRight size={16} />
              </Link>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-60">My Apex Calc v1.0</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-12 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <span className="font-headline font-bold text-primary">My Apex Calc</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">© {new Date().getFullYear()} My Apex Calc. Professional precision tools.</p>
            <div className="flex gap-6">
               <Link href="/all-calculators" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
               {categories.map(c => (
                 <Link key={c.id} href={`/categories/${c.id}`} className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">{c.name}</Link>
               ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 border-t pt-8">
            <Link href="/about-us" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact-us" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Contact Us</Link>
            <Link href="/privacy-policy" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-use" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
