import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ShimmerButton from "@/components/ui/shimmer-button";
import RetroGrid from "@/components/ui/retro-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { 
  Sparkles, 
  FileText, 
  Zap, 
  Shield, 
  Download, 
  Palette, 
  CheckCircle2,
  ArrowRight,
  Check,
  Brain,
  Wand2,
  Rocket
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-xl font-bold">ResumeAI</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <ShimmerButton className="h-9 px-4 text-sm">
                  Get Started
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <RetroGrid className="opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <AnimatedGradientText className="mb-6">
              <Sparkles className="h-3 w-3 mr-2" />
              <span>AI-Powered Resume Builder</span>
            </AnimatedGradientText>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              Create Your{" "}
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Perfect Resume
              </span>
              {" "}in Minutes
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Leverage the power of AI to craft professional, ATS-friendly resumes that get you noticed. 
              Stand out from the crowd with intelligent suggestions and beautiful templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup">
                <ShimmerButton className="h-12 px-8 text-base">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Button size="lg" variant="outline" className="text-base border-white/20 hover:bg-white/5">
                View Examples
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4 bg-white/10 border-white/20">Features</Badge>
            <h2 className="text-5xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you create the perfect resume
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all group">
              <BorderBeam size={250} duration={12} delay={0} />
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">AI-Powered Suggestions</CardTitle>
                <CardDescription className="text-base">
                  Get intelligent content recommendations tailored to your industry and role
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all group">
              <BorderBeam size={250} duration={12} delay={2} />
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Beautiful Templates</CardTitle>
                <CardDescription className="text-base">
                  Choose from dozens of professionally designed templates that make you stand out
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all group">
              <BorderBeam size={250} duration={12} delay={4} />
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">ATS Optimization</CardTitle>
                <CardDescription className="text-base">
                  Ensure your resume passes Applicant Tracking Systems with our optimization tools
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all group">
              <BorderBeam size={250} duration={12} delay={1} />
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Download className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Multiple Export Formats</CardTitle>
                <CardDescription className="text-base">
                  Download your resume as PDF, Word, or plain text - whatever you need
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all group">
              <BorderBeam size={250} duration={12} delay={3} />
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Privacy First</CardTitle>
                <CardDescription className="text-base">
                  Your data is encrypted and secure. We never share your information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all group">
              <BorderBeam size={250} duration={12} delay={5} />
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wand2 className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Real-Time Editor</CardTitle>
                <CardDescription className="text-base">
                  See your changes instantly with our live preview editor
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4 bg-white/10 border-white/20">Pricing</Badge>
            <h2 className="text-5xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>1 Resume</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>5 Templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Basic AI Suggestions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>PDF Export</span>
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full" variant="outline">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-white/20 bg-gradient-to-b from-white/10 to-black/40 backdrop-blur-sm scale-105 shadow-2xl">
              <BorderBeam size={300} duration={15} delay={0} />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 border-0">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">For serious job seekers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Unlimited Resumes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>50+ Premium Templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Advanced AI Suggestions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>ATS Optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>All Export Formats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Priority Support</span>
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <ShimmerButton className="w-full h-11">Start Pro Trial</ShimmerButton>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <CardDescription className="mt-2">For teams and organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Team Collaboration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Custom Branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>API Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Dedicated Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>SLA Guarantee</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="relative border-white/10 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm overflow-hidden">
            <BorderBeam size={400} duration={20} delay={0} />
            <CardContent className="p-12 text-center relative z-10">
              <div className="flex justify-center mb-6">
                <Rocket className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have successfully created winning resumes with ResumeAI
              </p>
              <Link href="/signup">
                <ShimmerButton className="h-14 px-10 text-lg">
                  Create Your Resume Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </ShimmerButton>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5" />
                <span className="font-bold">ResumeAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered resume builder for modern professionals
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 ResumeAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
