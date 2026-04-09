"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Log 404 events for analytics
    console.log("404 - Page not found");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Dynamic background elements matching login page */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/20 blur-[120px] rounded-full animate-blob pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-destructive/10 blur-[120px] rounded-full animate-blob [animation-delay:2s] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-warning/10 blur-[100px] rounded-full animate-blob [animation-delay:4s] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 animate-fade-in">
        <div className="text-center mb-10 space-y-6">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center p-6 bg-destructive/10 rounded-3xl shadow-lg animate-bounce-subtle">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>

          {/* 404 Text */}
          <div>
            <h1 className="text-8xl font-black tracking-tighter text-foreground mb-2 bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Page Not Found
            </h2>
            <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">
              Oops! The page you&apos;re looking for seems to have wandered off
              into the digital void.
            </p>
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-surface/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-destructive to-primary opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="space-y-2 pb-6 text-center">
            <CardTitle className="text-xl font-bold">
              Let&apos;s Get You Back on Track
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Choose one of the options below to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Navigation Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/account/dashboard" className="block">
                <Button
                  className="w-full h-14 bg-gradient-primary hover:opacity-90 shadow-fintech font-bold rounded-xl transition-all active:scale-[0.98] group"
                  size="lg"
                >
                  <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Go to Dashboard
                </Button>
              </Link>

              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full h-14 border-2 border-border/40 hover:border-primary/50 font-bold rounded-xl transition-all active:scale-[0.98] group"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Go Back
              </Button>
            </div>

            {/* Additional Help */}
            <div className="pt-6 border-t border-border/40">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <span className="font-medium">
                  Lost? Try searching from the{" "}
                  <Link
                    to="/account/dashboard"
                    className="text-primary hover:underline font-bold"
                  >
                    dashboard
                  </Link>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">
            Error Code: 404 • Page Not Found
          </p>
        </div>
      </div>
    </div>
  );
}
