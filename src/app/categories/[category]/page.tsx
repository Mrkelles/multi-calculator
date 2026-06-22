"use client"

import { useParams } from 'next/navigation';
import { calculators } from '@/app/lib/calculators-data';
import Link from 'next/link';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const categoryNames: Record<string, string> = {
    finance: 'Finance',
    health: 'Health',
    content: 'Content & Tools',
  };

  const categoryName = categoryNames[categorySlug] || 'Category';
  const filteredCalculators = calculators.filter((calc) => calc.category === categorySlug);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-bold font-headline text-primary">My Apex Calc</h1>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-12 lg:p-20 bg-background">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold font-headline tracking-tight text-primary">{categoryName} Tools</h2>
              <p className="text-muted-foreground text-xl">A specialized collection of calculators for {categoryName.toLowerCase()} planning and analysis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {filteredCalculators.map((calc) => (
                <Link key={calc.id} href={calc.path} className="group transition-transform hover:-translate-y-1 duration-200">
                  <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border group-hover:ring-primary/20">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                        <calc.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="font-headline text-xl text-primary">{calc.name}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">{calc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs font-medium text-accent uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Open Calculator <ChevronRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredCalculators.length === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                <p className="text-muted-foreground">No calculators found in this category.</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
