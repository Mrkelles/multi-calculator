"use client"

import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { LucideIcon } from 'lucide-react';

interface CalculatorWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function CalculatorWrapper({ children, title, description, icon: Icon }: CalculatorWrapperProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="bg-primary/10 p-1.5 rounded-md text-primary shrink-0">
              <Icon size={18} />
            </div>
            <h1 className="text-lg font-bold font-headline text-primary truncate">{title}</h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 lg:p-12 bg-background animate-fade-in">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">{title}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>
            </div>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}