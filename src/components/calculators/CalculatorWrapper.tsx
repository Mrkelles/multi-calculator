"use client"

import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { LucideIcon, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CalculatorWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function CalculatorWrapper({ children, title, description, icon: Icon }: CalculatorWrapperProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "The calculator URL has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <div className="bg-primary/10 p-1.5 rounded-md text-primary shrink-0">
              <Icon size={18} />
            </div>
            <h1 className="text-lg font-bold font-headline text-primary truncate">{title}</h1>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="default" 
                size="icon" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-md"
              >
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share Calculator</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share this Calculator</DialogTitle>
                <DialogDescription>
                  Copy the link below to share "{title}" with your friends or colleagues.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 pt-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    defaultValue={shareUrl}
                    readOnly
                    className="h-10"
                  />
                </div>
                <Button size="sm" className="px-3 h-10" onClick={handleCopy}>
                  <span className="sr-only">Copy</span>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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