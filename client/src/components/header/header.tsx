import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PayPalUSDLogo } from "@/components/ui/paypal-usd-logo";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm"></span>
          </div>
          <span className="font-bold text-xl">FOL</span>
          <div className="hidden sm:flex items-center space-x-2 ml-4 pl-4 border-l border-border">
            <span className="text-xs text-muted-foreground">powered by</span>
            <PayPalUSDLogo size="sm" />
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#about"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            About
          </a>
          <a
            href="#features"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            How It Works
          </a>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
