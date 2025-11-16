import Contact from "@/components/landing/contact";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import WhyMediQ from "@/components/landing/why-mediq";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <WhyMediQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
