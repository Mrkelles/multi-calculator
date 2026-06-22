import { calculators } from '@/app/lib/calculators-data';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function AllCalculatorsPage() {
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
        <main className="flex-1 p-6 md:p-10 bg-background animate-fade-in">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Precision Tools at Your Fingertips</h2>
              <p className="text-muted-foreground text-lg">Choose from our suite of professional calculators designed for accuracy and ease of use.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculators.map((calc) => (
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
                        Get Started →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
