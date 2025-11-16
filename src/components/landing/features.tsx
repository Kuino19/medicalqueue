import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Users, LineChart, ShieldCheck, Zap, Workflow } from "lucide-react";

const features = [
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: "AI-Powered Triage",
    description: "Our intelligent system analyzes patient data to prioritize cases, ensuring critical needs are met first.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Dynamic Queue Management",
    description: "Real-time adjustments to queues based on department load, staff availability, and patient acuity.",
  },
  {
    icon: <LineChart className="h-10 w-10 text-primary" />,
    title: "Predictive Analytics",
    description: "Forecast patient influx and resource needs with high accuracy to proactively manage hospital operations.",
  },
  {
    icon: <Workflow className="h-10 w-10 text-primary" />,
    title: "Seamless Workflow Integration",
    description: "MediQ integrates with your existing HIS and EMR systems for a smooth, unified operational view.",
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Reduced Wait Times",
    description: "Optimize every step of the patient journey, from check-in to discharge, significantly cutting down on wait times.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Enhanced Patient Safety",
    description: "By ensuring timely care and reducing overcrowding, MediQ contributes to a safer patient environment.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Everything Your Hospital Needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            MediQ is more than just a queueing system. It&apos;s a comprehensive platform for intelligent patient flow management.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center border-t-4 border-transparent hover:border-primary hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="items-center">
                <div className="bg-accent rounded-full p-4">
                  {feature.icon}
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription className="mt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
