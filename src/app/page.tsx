import { calculators } from '@/app/lib/calculators-data';
import Link from 'next/link';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const categories = [
    { id: 'finance', name: 'Finance' },
    { id: 'health', name: 'Health' },
    { id: 'content', name: 'Content & Tools' },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-bold font-headline text-primary">SmartCalc Hub</h1>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-12 lg:p-16 bg-background">
          <div className="max-w-5xl mx-auto space-y-16">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-primary/5 border border-primary/10 p-8 md:p-12 lg:p-16">
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Free Professional Tools
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-headline tracking-tight text-primary leading-[1.1]">
                  Precision Tools for <br/>
                  <span className="text-accent">Smarter Decisions.</span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl">
                  Whether you're managing personal finances, tracking health metrics, or optimizing content revenue, SmartCalc Hub provides accurate data when it matters most.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link 
                    href="/all-calculators" 
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                  >
                    Explore All Tools
                  </Link>
                  <Link 
                    href="#finance" 
                    className="px-6 py-3 rounded-xl bg-white border border-border text-foreground font-semibold hover:bg-muted transition-all"
                  >
                    Finance Tools
                  </Link>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            </section>

            <div className="grid gap-16">
              {categories.map((cat) => (
                <section key={cat.id} id={cat.id} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Link 
                        href={`/categories/${cat.id}`}
                        className="text-2xl font-bold text-primary hover:text-accent transition-colors flex items-center gap-2 group"
                      >
                        {cat.name}
                        <ChevronRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <p className="text-sm text-muted-foreground">Specialized tools for {cat.name.toLowerCase()} analysis.</p>
                    </div>
                    <Link 
                      href={`/categories/${cat.id}`}
                      className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary border-b border-transparent hover:border-primary transition-all pb-1"
                    >
                      View Category
                    </Link>
                  </div>
                  
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {calculators
                      .filter((calc) => calc.category === cat.id)
                      .map((calc) => (
                        <li key={calc.id}>
                          <Link 
                            href={calc.path}
                            className="flex items-center justify-between p-5 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-md transition-all group relative overflow-hidden"
                          >
                            <div className="flex items-center gap-4 relative z-10">
                              <div className="p-2.5 rounded-xl bg-primary/5 group-hover:bg-primary group-hover:text-white transition-colors">
                                <calc.icon className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5">
                                <span className="font-bold text-foreground group-hover:text-primary transition-colors">{calc.name}</span>
                                <p className="text-[11px] text-muted-foreground line-clamp-1">{calc.description}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary relative z-10" />
                          </Link>
                        </li>
                      ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="pt-8 text-center">
              <div className="inline-flex flex-col items-center gap-2">
                <Link 
                  href="/all-calculators" 
                  className="text-sm font-bold text-accent hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  Switch to Dashboard View <ChevronRight size={14} />
                </Link>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Over 10+ professional tools available</p>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
