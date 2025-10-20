"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Vortex } from "@/components/ui/vortex";
import { ArrowRight, CheckCircle, FileText, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden w-full h-screen">
      {/* Vortex Background */}
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={190}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        containerClassName="w-full h-full"
        baseSpeed={0.1}
        rangeSpeed={2}
      >
        <div className="container relative py-24 md:py-32 lg:py-40 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Content */}
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Sparkles className="h-3 w-3 mr-2" />
            AI-Powered Resume Builder
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
            Create Your <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Perfect Resume</span>
          </h1>

          <p className="text-lg text-zinc-300 md:text-xl max-w-2xl mx-auto">
            Stand out from the crowd with a professional, ATS-optimized resume created in minutes.
            Our AI helps you highlight your skills and experience effectively.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href={user ? "/dashboard" : "/signup"}>
                {user ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/templates">
                <FileText className="mr-2 h-4 w-4" />
                View Templates
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 pt-8 text-sm text-zinc-400">
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-black">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=128&h=128&q=80"
                  alt="User"
                />
                <AvatarFallback className="bg-cyan-500/20 text-cyan-300">U1</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-black">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=128&h=128&q=80"
                  alt="User"
                />
                <AvatarFallback className="bg-purple-500/20 text-purple-300">U2</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-black">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=facearea&w=128&h=128&q=80"
                  alt="User"
                />
                <AvatarFallback className="bg-blue-500/20 text-blue-300">U3</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-zinc-300">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span className="font-medium">10,000+</span>
              </div>
              <p className="text-zinc-400">Happy Users</p>
            </div>
            <Separator orientation="vertical" className="h-8 bg-zinc-700" />
            <div className="flex items-center gap-1 text-zinc-300">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
        </div>
      </Vortex>
    </section>
  );
}
