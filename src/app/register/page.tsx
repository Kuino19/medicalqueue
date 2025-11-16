'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  hospitalName: z.string().min(2, { message: "Hospital name must be at least 2 characters." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            hospitalName: "",
        },
    });

    const onSubmit = (data: RegisterFormValues) => {
        startTransition(async () => {
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    toast({
                        title: "Registration Successful",
                        description: "Your hospital and doctor profile have been created. You can now log in.",
                    });
                    router.push('/login');
                } else {
                    const errorData = await response.json();
                    toast({
                        title: "Registration Failed",
                        description: errorData.error || "An unknown error occurred.",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Registration error:", error);
                 toast({
                    title: "Registration Failed",
                    description: "An unexpected error occurred. Please try again.",
                    variant: "destructive",
                });
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-md">
                 <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                        <Link href="/">
                            <Logo />
                        </Link>
                    </div>
                    <CardTitle className="font-headline">Register Your Hospital & Practice</CardTitle>
                    <CardDescription>Join MediQ to streamline your healthcare services.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="hospitalName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hospital Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="City General Hospital" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Full Name (Doctor)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dr. John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Register
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    <p>Already have an account?&nbsp;</p>
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
