import { calculators } from '@/app/lib/calculators-data';
import Link from 'next/link';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { ChevronRight } from 'lucide-react';

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
        <main className="flex-1 p-6 md:p-12 lg:p-20 bg-background">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-4xl font-extrabold font-headline tracking-tight text-primary">Calculator Directory</h2>
              <p className="text-muted-foreground text-xl">Select a tool from the categories below to get started.</p>
            </div>

            <div className="grid gap-12">
              {categories.map((cat) => (
                <section key={cat.id} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-primary uppercase tracking-widest text-sm">{cat.name}</h3>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {calculators
                      .filter((calc) => calc.category === cat.id)
                      .map((calc) => (
                        <li key={calc.id}>
                          <Link 
                            href={calc.path}
                            className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent hover:text-accent-foreground transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/20 transition-colors">
                                <calc.icon className="w-5 h-5 text-primary" />
                              </div>
                              <span className="font-semibold">{calc.name}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          </Link>
                        </li>
                      ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="pt-12 text-center">
              <Link 
                href="/all-calculators" 
                className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-2"
              >
                View full dashboard layout →
              </Link>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
