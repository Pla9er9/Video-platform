"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Main from "@/components/Main";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Title from "@/components/Title";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Registration() {
    const [step, setStep] = useState(0);
    const { toast } = useToast()

    const formSchema = z
        .object({
            username: z
                .string()
                .min(2, {
                    message: "Username must be at least 2 characters.",
                })
                .max(12, {
                    message: "Username must be max 12 characters",
                }),
            password: z
                .string()
                .min(2, {
                    message: "Password must be at least 8 characters.",
                })
                .max(50, {
                    message: "Password must be max 50 characters",
                }),
            confirmPassword: z.string(),
            email: z.string().email(),
            firstname: z
                .string()
                .min(2, {
                    message: "Name must be at least 2 characters",
                })
                .max(12, {
                    message: "Name must be max 12 characters",
                }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't match",
            path: ["confirmPassword"],
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            firstname: "",
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await fetch("/api/auth/registration", {
            method: "post",
            body: JSON.stringify({
                username: values.username,
                password: values.password,
                firstname: values.firstname,
                email: values.email,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            window.location.replace("/")
            return
        }
        toast({
            variant: "destructive",
            title: "Registration failed",
            description: "",
            })
    }

    return (
        <Main>
            <Title text="Create account" />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-72"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem
                                className={step === 0 ? "block" : "hidden"}
                            >
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="My username"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem
                                className={step === 0 ? "block" : "hidden"}
                            >
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="example@mail.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem
                                className={step === 0 ? "block" : "hidden"}
                            >
                                <FormLabel>Firstname</FormLabel>
                                <FormControl>
                                    <Input placeholder="Alex" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem
                                className={step === 1 ? "block" : "hidden"}
                            >
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Secure password"
                                        {...field}
                                        type="password"
                                        autoComplete="on"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem
                                className={step === 1 ? "block" : "hidden"}
                            >
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Same password"
                                        {...field}
                                        type="password"
                                        autoComplete="on"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {step === 1 && (
                        <>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => setStep(0)}
                            >
                                Back
                            </Button>{" "}
                            <br></br>
                        </>
                    )}
                    <Button
                        type={step === 0 ? "button" : "submit"}
                        className="w-full"
                        onClick={
                            step === 0
                                ? (e) => {
                                      e.preventDefault();
                                      setStep(1);
                                  }
                                : undefined
                        }
                    >
                        {step === 0 && form ? "Next" : "Sign up"}
                    </Button>
                </form>
                <a
                    href="/login"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                    className="mt-6 text-xs"
                >
                    Already have an account? Sign in
                </a>
            </Form>
        </Main>
    );
}
