import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Users, MessageSquare, BriefcaseMedical, Landmark, Languages, Siren, Database, Activity } from "lucide-react";

const hospitalNeeds = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Overwhelmed Front Desks & Long Queues",
    description: "MediQ automates symptom collection and organizes queues, freeing up staff and reducing wait times before a doctor is even involved.",
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    title: "Inefficient Doctor-Patient Communication",
    description: "Provides a structured pre-consultation summary, so doctors understand the patient's likely issues from the start, saving time and improving diagnostic accuracy.",
  },
  {
    icon: <Activity className="h-8 w-8 text-primary" />,
    title: "Lack of Real-Time Visibility",
    description: "Our dashboard shows who is waiting, being attended to, and who needs urgent care, optimizing hospital workflow.",
  },
  {
    icon: <Siren className="h-8 w-8 text-primary" />,
    title: "No Early Triage System",
    description: "MediQ's AI identifies critical keywords (e.g., chest pain) and automatically prioritizes those patients, acting as a first line of triage.",
  },
  {
    icon: <Database className="h-8 w-8 text-primary" />,
    title: "Difficult Record Management & Analytics",
    description: "Every interaction is stored, allowing hospitals to track visit reasons, wait times, and staff efficiency for better long-term planning.",
  },
];

const nigeriaNeeds = [
    {
        icon: <BriefcaseMedical className="h-8 w-8 text-primary" />,
        title: "High Patient-to-Doctor Ratio",
        description: "With fewer than 5 doctors per 10,000 people, Nigerian clinics are overcrowded. MediQ helps doctors manage patient flow more efficiently.",
    },
    {
        icon: <ClipboardList className="h-8 w-8 text-primary" />,
        title: "Manual Hospital Processes",
        description: "Many hospitals still use paper. MediQ digitizes patient intake, offering a simple first step into electronic health records.",
    },
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Limited Access to Medical Staff",
        description: "In rural or understaffed areas, MediQ acts as a pre-consult assistant, ensuring symptoms are recorded correctly and critical cases are flagged.",
    },
    {
        icon: <Languages className="h-8 w-8 text-primary" />,
        title: "Language & Communication Barriers",
        description: "Our AI can be trained to understand local languages and dialects like Pidgin, Yoruba, or Igbo, reducing miscommunication.",
    },
    {
        icon: <Siren className="h-8 w-8 text-primary" />,
        title: "Healthcare Delays Can Be Fatal",
        description: "By providing instant pre-consultation summaries and queue alerts, MediQ ensures life-threatening cases are attended to first.",
    },
    {
        icon: <Landmark className="h-8 w-8 text-primary" />,
        title: "Aligns with Healthcare Reforms",
        description: "As Nigeria moves towards digital transformation (e.g., NHIA digitization), MediQ offers a modern, scalable, and low-cost solution for smart healthcare.",
    }
];


export default function WhyMediQ() {
  return (
    <section id="why-mediq" className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Why Your Healthcare Facility Needs MediQ
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            MediQ saves time, improves care, and bridges the gap between overcrowded systems and smart, accessible healthcare. In many places, it’s not just a convenience—it’s a necessity.
          </p>
        </div>
        <div className="mt-16 max-w-4xl mx-auto">
            <Tabs defaultValue="hospital" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="hospital">Why Hospitals Need It</TabsTrigger>
                    <TabsTrigger value="nigeria">Why It's Crucial for Nigeria</TabsTrigger>
                </TabsList>
                <TabsContent value="hospital">
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {hospitalNeeds.map((item) => (
                            <Card key={item.title} className="text-left border-t-4 border-transparent hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <CardHeader>
                                    {item.icon}
                                    <CardTitle className="mt-4 text-lg">{item.title}</CardTitle>
                                    <CardDescription className="mt-2 text-base">
                                    {item.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="nigeria">
                     <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {nigeriaNeeds.map((item) => (
                            <Card key={item.title} className="text-left border-t-4 border-transparent hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <CardHeader>
                                    {item.icon}
                                    <CardTitle className="mt-4 text-lg">{item.title}</CardTitle>
                                    <CardDescription className="mt-2 text-base">
                                    {item.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </section>
  );
}
