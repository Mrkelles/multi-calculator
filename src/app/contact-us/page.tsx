import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 md:px-8 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-xl font-bold font-headline text-primary">My Apex Calc</h1>
      </header>

      <main className="flex-1 p-6 md:p-12 lg:p-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-primary">Get in Touch</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Have questions or feedback about our calculators? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Email Support</h4>
                    <p className="text-sm text-muted-foreground">support@myapexcalc.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-3 rounded-xl text-accent">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Feedback</h4>
                    <p className="text-sm text-muted-foreground">We typically respond within 24-48 hours.</p>
                  </div>
                </div>
              </div>

              <Card className="border-none bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Our Promise</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We read every piece of feedback we receive. Whether it's a bug report, a feature request, or just a hello, your input helps us build a better My Apex Calc.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-xl">Send a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Calculator Suggestion" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" />
                </div>
                <Button className="w-full h-12 text-md font-bold">Send Message</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
