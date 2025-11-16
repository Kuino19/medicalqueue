'use client';

import { useEffect, useState } from 'react';
import { getSummaryDetails } from '../../actions';
import { useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowLeft, Bot, ShieldCheck, Siren, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type SummaryDetails = {
    summary: {
        id: number;
        patientId: number;
        conversationId: string;
        summaryText: string;
        triageCode: "red" | "yellow" | "green";
        suggestedNextSteps: string | null;
        status: "new" | "reviewed" | "follow-up";
        createdAt: number;
        patient: {
            fullName: string | null;
        };
    };
    conversation: {
        id: number;
        userId: number;
        message: string;
        sender: "user" | "bot";
        conversationId: string;
        createdAt: number;
    }[];
}

const TriageIcon = ({ code, className }: { code: string, className?: string }) => {
    switch (code) {
        case 'red':
            return <Siren className={cn("h-5 w-5 text-red-500", className)} />;
        case 'yellow':
            return <AlertTriangle className={cn("h-5 w-5 text-yellow-500", className)} />;
        case 'green':
            return <ShieldCheck className={cn("h-5 w-5 text-green-500", className)} />;
        default:
            return null;
    }
};

const TriageBadge = ({ code }: { code: string }) => {
    const variants = {
        red: 'destructive',
        yellow: 'secondary',
        green: 'default',
    } as const;
    const text = {
        red: 'Emergency',
        yellow: 'Urgent',
        green: 'Non-Urgent',
    };
    return (
        <Badge variant={variants[code as keyof typeof variants] || 'outline'}>
            {text[code as keyof typeof text] || 'Unknown'}
        </Badge>
    );
};


export default function SummaryDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const [details, setDetails] = useState<SummaryDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function loadDetails() {
            setLoading(true);
            try {
                const data = await getSummaryDetails({ summaryId: id });
                if (!data) {
                    notFound();
                }
                setDetails(data as SummaryDetails);
            } catch (error) {
                console.error("Failed to load summary details", error);
            } finally {
                setLoading(false);
            }
        }
        loadDetails();
    }, [id]);

    if (loading) {
        return (
             <div className="p-4 sm:px-6 md:gap-8">
                <div className="mb-4">
                     <Skeleton className="h-8 w-48 rounded-md" />
                </div>
                 <div className="grid gap-6">
                     <Card>
                         <CardHeader>
                             <Skeleton className="h-6 w-1/2" />
                             <Skeleton className="h-4 w-1/4 mt-2" />
                         </CardHeader>
                         <CardContent className="space-y-4">
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-3/4" />
                         </CardContent>
                     </Card>
                      <Card>
                         <CardHeader>
                             <Skeleton className="h-6 w-1/3" />
                         </CardHeader>
                         <CardContent className="space-y-6">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                         </CardContent>
                     </Card>
                 </div>
             </div>
        );
    }
    
    if (!details) {
        return notFound();
    }

    const { summary, conversation } = details;

    return (
        <div className="p-4 sm:px-6 md:gap-8">
            <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-semibold font-headline">Consultation Summary</h1>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Conversation Transcript</CardTitle>
                            <CardDescription>
                                The full conversation between the patient and the AI assistant.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-6">
                             {conversation.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                    "flex items-start gap-4",
                                    message.sender === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {message.sender === 'bot' && (
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={16} /></AvatarFallback>
                                    </Avatar>
                                    )}
                                    <div
                                    className={cn(
                                        "max-w-[75%] rounded-xl px-4 py-2.5 text-sm shadow-sm",
                                        message.sender === 'user'
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-background rounded-bl-none"
                                    )}
                                    >
                                    <p>{message.message}</p>
                                    </div>
                                    {message.sender === 'user' && (
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback className="bg-secondary text-secondary-foreground"><User size={16} /></AvatarFallback>
                                    </Avatar>
                                    )}
                                </div>
                                ))}
                           </div>
                        </CardContent>
                     </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>AI Summary</CardTitle>
                                <div className="flex items-center gap-2">
                                     <TriageIcon code={summary.triageCode} />
                                     <TriageBadge code={summary.triageCode} />
                                </div>
                            </div>
                            <CardDescription>
                                Generated on {format(new Date(summary.createdAt * 1000), 'PPP p')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-1">Patient</h4>
                                <p className="text-sm text-muted-foreground">{summary.patient.fullName || 'N/A'}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-sm mb-1">Clinical Summary</h4>
                                <p className="text-sm text-muted-foreground">{summary.summaryText}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-sm mb-1">Suggested Next Steps</h4>
                                <p className="text-sm text-muted-foreground">{summary.suggestedNextSteps || 'None'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}