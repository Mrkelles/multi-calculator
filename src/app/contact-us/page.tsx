import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Footer } from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';

export default function ContactUsPage() {
  const contactReasons = [
    {
      title: "Calculation Issues",
      description: "Report a result that appears incorrect or a formula that may need reviewing.",
      icon: Calculator
    },
    {
      title: "Technical Problems",
      description: "Let us know if a calculator, page, button or feature is not working properly.",
      icon: AlertCircle
    },
    {
      title: "Suggestions and Requests",
      description: "Recommend a new calculator or suggest improvements to an existing one.",
      icon: MessageSquare
    },
    {
      title: "General Questions",
      description: "Ask us about using the website or understanding a calculator's features.",
      icon: Info
    },
    {
      title: "Privacy and Data Requests",
      description: "Contact us with questions about our Privacy Policy or the information submitted through our website.",
      icon: ShieldAlert
    }
  ];

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
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-primary">Get in Touch</h2>
            <div className="space-y-4 max-w-3xl">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Have a question about one of our calculators? Found a possible calculation error? Have an idea for a new tool or an improvement to an existing feature?
              </p>
              <p className="text-foreground font-bold text-xl">We welcome your feedback.</p>
              <p className="text-muted-foreground leading-relaxed">
                Our goal is to make My Apex Calc more useful, accurate and easier to understand. Your messages help us identify problems and improve the experience for everyone.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Info */}
            <div className="lg:col-span-7 space-y-10">
              <section className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">You can contact us about:</h3>
                <div className="grid gap-4">
                  {contactReasons.map((reason, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border shadow-sm items-start">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                        <reason.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{reason.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4 p-8 rounded-[2rem] bg-primary/5 border border-primary/10">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Support
                </h3>
                <p className="text-sm text-muted-foreground">For general enquiries and support, email:</p>
                <a href="mailto:Myapexcalc@gmail.com" className="text-xl font-bold text-primary hover:underline block">
                  Myapexcalc@gmail.com
                </a>
                <Separator className="bg-primary/10" />
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    Please include the name or web address of the calculator you are contacting us about. If you are reporting a calculation issue, describe the values you entered and the result you expected.
                  </p>
                  <div className="flex gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 items-start">
                    <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
                    <p className="text-[10px] text-destructive leading-tight font-medium">
                      Please do not include passwords, payment card details, government identification numbers or other sensitive personal information in your message.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-5">
              <Card className="shadow-2xl border-none ring-1 ring-border sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Send a Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You can also use the contact form on this page. Please provide your name, a valid email address, a subject and a clear description of your enquiry.
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Full Name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="email@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What is this about?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Describe your enquiry here..." className="min-h-[160px]" />
                    </div>
                    <Button className="w-full h-12 text-md font-bold rounded-xl shadow-lg shadow-primary/20">
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Footer Note */}
          <section className="text-center space-y-6 max-w-2xl mx-auto py-8">
            <p className="text-muted-foreground leading-relaxed">
              We aim to review and respond to messages as soon as reasonably possible. Response times may vary depending on the nature and volume of enquiries. We appreciate your interest in My Apex Calc and the time you take to share your feedback.
            </p>
            <div className="space-y-1">
              <p className="text-xl font-bold text-primary font-headline">My Apex Calc</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Practical tools for everyday calculations.</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Icons for the list
function Calculator(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  )
}

function Info(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}
