import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ShimmerButton from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
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

export default async function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-300">Features</Badge>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Everything You Need to Succeed</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Powerful features designed to help you create the perfect resume
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-500 shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]">
              <BorderBeam size={250} duration={12} delay={0} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative">
                <div className="relative h-14 w-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/50">
                  <Brain className="h-7 w-7 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <CardTitle className="text-xl font-bold text-white">AI-Powered Suggestions</CardTitle>
                <CardDescription className="text-base text-zinc-400">
                  Get intelligent content recommendations tailored to your industry and role
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-500 shadow-xl shadow-cyan-500/10 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]">
              <BorderBeam size={250} duration={12} delay={2} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative">
                <div className="relative h-14 w-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-cyan-500/40">
                  <Palette className="h-7 w-7 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300 to-cyan-300 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Beautiful Templates</CardTitle>
                <CardDescription className="text-base text-zinc-400">
                  Choose from dozens of professionally designed templates that make you stand out
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-500 shadow-xl shadow-cyan-500/10 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]">
              <BorderBeam size={250} duration={12} delay={4} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative">
                <div className="relative h-14 w-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-orange-500/40">
                  <Zap className="h-7 w-7 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-300 to-red-300 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <CardTitle className="text-xl font-bold text-white">ATS Optimization</CardTitle>
                <CardDescription className="text-base text-zinc-400">
                  Ensure your resume passes Applicant Tracking Systems with our optimization tools
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-500 shadow-xl shadow-cyan-500/10 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]">
              <BorderBeam size={250} duration={12} delay={1} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative">
                <div className="relative h-14 w-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-emerald-500/40">
                  <Download className="h-7 w-7 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-300 to-emerald-300 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Multiple Export Formats</CardTitle>
                <CardDescription className="text-base text-zinc-400">
                  Download your resume as PDF, Word, or plain text - whatever you need
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-500 shadow-xl shadow-cyan-500/10 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]">
              <BorderBeam size={250} duration={12} delay={3} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative">
                <div className="relative h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/40">
                  <Shield className="h-7 w-7 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-300 to-purple-300 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Privacy First</CardTitle>
                <CardDescription className="text-base text-zinc-400">
                  Your data is encrypted and secure. We never share your information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-500 shadow-xl shadow-cyan-500/10 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]">
              <BorderBeam size={250} duration={12} delay={5} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative">
                <div className="relative h-14 w-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-orange-400/40">
                  <Wand2 className="h-7 w-7 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-300 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Real-Time Editor</CardTitle>
                <CardDescription className="text-base text-zinc-400">
                  See your changes instantly with our live preview editor
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-300">Pricing</Badge>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Choose Your Plan</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Start free and upgrade as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-500 shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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
            <Card className="group relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/20 via-black/60 to-black/40 backdrop-blur-xl scale-105 shadow-2xl shadow-purple-500/30 hover:shadow-3xl hover:shadow-purple-500/40 transition-all duration-500">
              <BorderBeam size={300} duration={15} delay={0} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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
            <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-500 shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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
                <Link href="/signup" className="block">
                  <Button className="w-full" variant="outline">Contact Sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="group relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-black/40 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
            <BorderBeam size={400} duration={20} delay={0} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <CardContent className="p-12 text-center relative z-10">
              <div className="flex justify-center mb-6">
                <Rocket className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have successfully created winning resumes with ResumePersona
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
      <footer className="relative z-10 border-t border-cyan-500/20 py-12 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="ResumePersona" width={20} height={20} className="h-5 w-5" />
                <span className="font-bold">ResumePersona</span>
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
            © 2025 ResumePersona. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
