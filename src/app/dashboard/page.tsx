
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPatientQueue, updateQueueStatus } from "./actions";
import { useEffect, useMemo, useState, useCallback, useTransition } from "react";
import { AlertTriangle, ShieldCheck, Siren, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type QueueItem = {
  id: string;
  patientName: string;
  date: string;
  status: 'waiting' | 'in-progress' | 'completed';
  summaryId: number | null;
  triageCode: 'red' | 'yellow' | 'green' | null;
};

const TriageIcon = ({ code }: { code: string | null }) => {
    switch (code) {
        case 'red':
            return <Siren className="h-5 w-5 text-red-500" />;
        case 'yellow':
            return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case 'green':
            return <ShieldCheck className="h-5 w-5 text-green-500" />;
        default:
            return null;
    }
};

const TriageBadge = ({ code }: { code: string | null }) => {
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

const StatusSelect = ({ queueId, currentStatus }: { queueId: number, currentStatus: QueueItem['status']}) => {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (newStatus: QueueItem['status']) => {
        startTransition(async () => {
            const result = await updateQueueStatus({ queueId, status: newStatus });
            if (!result.success) {
                toast({
                    title: "Update Failed",
                    description: result.message,
                    variant: "destructive",
                });
            }
        });
    };
    
    return (
        <Select onValueChange={handleStatusChange} defaultValue={currentStatus} disabled={isPending}>
            <SelectTrigger className="w-[120px] h-8 text-xs focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="in-progress">In-Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
        </Select>
    );
};


export default function DoctorDashboard() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = useCallback(async () => {
    if (queue.length === 0) {
        setLoading(true);
    }
    try {
      const fetchedQueue = await getPatientQueue({ hospitalId: 1 });
      setQueue(fetchedQueue);
    } catch (error) {
      console.error("Failed to load queue", error);
    } finally {
      setLoading(false);
    }
  }, [queue.length]);

  useEffect(() => {
    loadQueue();
    const intervalId = setInterval(loadQueue, 5000);
    return () => clearInterval(intervalId);
  }, [loadQueue]);

  const analyticsData = useMemo(() => {
    const activePatients = queue.filter(p => p.status !== 'completed');
    const counts = activePatients.reduce((acc, item) => {
        if (item.triageCode) {
          if (!acc[item.triageCode]) {
              acc[item.triageCode] = 0;
          }
          acc[item.triageCode]++;
        }
        return acc;
    }, {} as Record<string, number>);

    return {
        total: activePatients.length,
        red: counts.red || 0,
        yellow: counts.yellow || 0,
        green: counts.green || 0,
    };
  }, [queue]);

  const chartData = [
    { name: "Non-Urgent", count: analyticsData.green, fill: "var(--color-green)" },
    { name: "Urgent", count: analyticsData.yellow, fill: "var(--color-yellow)" },
    { name: "Emergency", count: analyticsData.red, fill: "var(--color-red)" },
  ];

  const chartConfig = {
    count: { label: "Patients" },
    green: { label: "Non-Urgent", color: "hsl(var(--chart-2))" },
    yellow: { label: "Urgent", color: "hsl(var(--chart-4))" },
    red: { label: "Emergency", color: "hsl(var(--chart-1))" },
  } satisfies import("@/components/ui/chart").ChartConfig;


  return (
    <div className="flex min-h-screen w-full flex-col">
        <main className="grid flex-1 items-start gap-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Patients in Queue</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.total}</div>
                        <p className="text-xs text-muted-foreground">Excluding completed cases</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
                        <Siren className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.red}</div>
                        <p className="text-xs text-muted-foreground">High priority</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.yellow}</div>
                        <p className="text-xs text-muted-foreground">Medium priority</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Non-Urgent Cases</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.green}</div>
                        <p className="text-xs text-muted-foreground">Routine check</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle className="font-headline">Patient Queue</CardTitle>
                    <CardDescription>
                      Live queue of patients waiting for consultation, prioritized by urgency.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Triage</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead className="hidden md:table-cell">Check-in Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="h-6 w-24 rounded-md" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-32 rounded-md" /></TableCell>
                              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24 rounded-md" /></TableCell>
                              <TableCell><Skeleton className="h-8 w-28 rounded-md" /></TableCell>
                              <TableCell><Skeleton className="h-8 w-24 ml-auto rounded-md" /></TableCell>
                            </TableRow>
                          ))
                        ) : queue.length > 0 ? (
                          queue.map((item) => (
                          <TableRow key={item.id} className={cn(item.triageCode === 'red' && 'bg-red-500/10 hover:bg-red-500/20')}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                  <TriageIcon code={item.triageCode} />
                                  <TriageBadge code={item.triageCode} />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{item.patientName}</TableCell>
                            <TableCell className="hidden md:table-cell">{item.date}</TableCell>
                            <TableCell>
                              <StatusSelect queueId={Number(item.id)} currentStatus={item.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              {item.summaryId && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/dashboard/summary/${item.summaryId}`}>View Details</Link>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No patients in the queue.
                                </TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
              </Card>
              <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Triage Distribution</CardTitle>
                  <CardDescription>Patient count by triage level for active queue.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                      <BarChart accessibilityLayer data={chartData}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                          />
                          <Bar dataKey="count" radius={4} />
                      </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
        </main>
    </div>
  );
}
