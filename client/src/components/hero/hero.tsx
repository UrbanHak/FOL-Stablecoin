import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PayPalUSDLogo } from "@/components/ui/paypal-usd-logo";

export function Hero() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Future of Labor
          <span className="block text-primary">FOL Stablecoin</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          A USD-pegged stablecoin powered by PayPal USD, designed to be a
          support system for workforce development, unemployed workers and
          opportunities during job displacement from AI and economic changes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg px-8">
            Learn More
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            View Documentation
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Card className="max-w-md bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                1:1 USD
              </div>
              <p className="text-muted-foreground">
                Stable value pegged to the US Dollar
              </p>
            </CardContent>
          </Card>

          <Card className="max-w-md bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">
                Powered by
              </div>
              <PayPalUSDLogo size="md" className="mb-2" />
              <p className="text-muted-foreground text-sm text-center">
                Built on proven, regulated stablecoin infrastructure
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">Backed by trusted technology</p>
            <div className="flex items-center space-x-4 opacity-70">
              <PayPalUSDLogo size="sm" />
              <span className="text-xs text-muted-foreground">|</span>
              <span className="text-sm font-medium text-muted-foreground">Regulatory Compliant</span>
              <span className="text-xs text-muted-foreground">|</span>
              <span className="text-sm font-medium text-muted-foreground">Institutional Grade</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
