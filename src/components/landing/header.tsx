'use client';

import { useState, useEffect } from 'react';
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from 'next/link';

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#why-mediq", label: "Why MediQ?" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a href="#">
          <Logo />
          <span className="sr-only">MediQ Home</span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
           <Link href="/chat" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Chat
            </Link>
           <Link href="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Dashboard
            </Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
          <Button asChild><Link href="/register">Register</Link></Button>
        </div>
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="p-4">
                     <a href="#" onClick={() => setIsMenuOpen(false)}>
                        <Logo />
                        <span className="sr-only">MediQ Home</span>
                    </a>
                    <nav className="mt-8 flex flex-col gap-6">
                    {navLinks.map((link) => (
                        <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
                        >
                        {link.label}
                        </a>
                    ))}
                     <Link href="/chat" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors">
                        Chat
                    </Link>
                     <Link href="/dashboard"  onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors">
                        Dashboard
                    </Link>
                    </nav>
                    <div className="mt-8 flex flex-col gap-2">
                        <Button variant="ghost" className="w-full justify-start" asChild><Link href="/login">Login</Link></Button>
                        <Button className="w-full justify-start" asChild><Link href="/register">Register</Link></Button>
                    </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
