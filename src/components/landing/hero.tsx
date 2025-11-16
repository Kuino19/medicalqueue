'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const fullText = "Shorter Queues, Happier Patients";

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const heroImage = PlaceHolderImages.find(p => p.key === 'hero');

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        // Keep cursor blinking after typing is done
        const cursorInterval = setInterval(() => {
          setShowCursor(show => !show);
        }, 500);
        return () => clearInterval(cursorInterval);
      }
    }, 100); // Adjust speed of typing here

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white">
       {heroImage && <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        className="object-cover"
        priority
        data-ai-hint={heroImage.hint}
      />}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {displayText}
            <span className="inline-block w-1">{showCursor ? '|' : ''}</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200 md:text-xl">
            MediQ leverages cutting-edge AI to optimize patient flow, reduce wait times, and enhance hospital efficiency. Welcome to the future of healthcare management.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/chat">Try the Assistant</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
