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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Title from "@/components/Title";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
    const { toast } = useToast()

    const formSchema = z.object({
        username: z.string().min(2, {
          message: "Username must be at least 2 characters.",
        }),
        password: z.string().min(2, {
            message: "Password must be at least 8 characters.",
          }),
      })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await fetch("/api/auth/login", {
            method: "post",
            body: JSON.stringify({
                username: values.username,
                password: values.password,
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
            title: "Login failed",
            description: "Wrong username or password",
            })
      }

    return (
        <Main>
            <Title text="Welcome back!" />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-72"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="My username" {...field} />
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
                                    <Input placeholder="Secure password" {...field} type="password"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Submit</Button>
                </form>
            </Form>
            <a href="/registration" style={{color: "hsl(var(--muted-foreground))"}} className="mt-6 text-xs">New here? Register</a>
        </Main>
    );
}
