"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Home, ArrowLeft } from "lucide-react";
import { APP_ROUTES } from "@/lib/routes";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Logo */}
        <div className="inline-flex items-center justify-center p-4 bg-primary rounded-2xl shadow-lg">
          <Building2 className="h-8 w-8 text-white" />
        </div>

        {/* Main Card */}
        <Card className="border shadow-xl">
          <CardContent className="p-12 space-y-8">
            {/* 404 Number */}
            <div>
              <h1 className="text-9xl font-black text-primary/20">404</h1>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[180px]"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate(APP_ROUTES.ACCOUNT.DASHBOARD)}
                size="lg"
                className="w-full sm:w-auto min-w-[180px]"
              >
                <Home className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Error 404 • Page Not Found
        </p>
      </div>
    </div>
  );
}
