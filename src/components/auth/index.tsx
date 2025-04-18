/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { MessageSquareText, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { Checkbox } from "../ui/checkbox";

// Login schema
const loginSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    rememberMe: yup.boolean(),
});

// Register schema
const registerSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: yup.string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    profilePicture: yup.mixed().nullable(),
});

export default function AuthForm() {
    const { data: session, status } = useSession();
    const router = useRouter()
    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit,
        // control: loginControl,
        formState: { errors: loginErrors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: { username: "", password: "", rememberMe: false },
    });

    const {
        register: regRegister,
        handleSubmit: handleRegisterSubmit,
        // control: registerControl,
        formState: { errors: registerErrors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            profilePicture: undefined,
        },
    });

    const onLogin = async (data: any) => {
        const result = await signIn("credentials", {
            redirect: false,
            username: data.username,
            password: data.password,
            rememberMe: data.rememberMe,
        });

        if (result && !result.error) {
            toast.success("Login successful");
            
        } else {
            toast.error("Invalid username or password");
        }
    };

    useEffect(() => {
        if (session && status && status === 'authenticated' && session && session.user) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('at', session.user.token || '');
                localStorage.setItem("guid", session.user.guid);
                localStorage.setItem("email", session.user.email);
                localStorage.setItem('fullName', session.user.firstName + " " + session.user.lastName || '');
            }
            router.push('/chat');
        }
    }, [status, session, router]);

    const onRegister = (data: any) => {
        console.log("Register Data", data);
        toast.success("Registration logic not implemented.");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#e5ddd5] font-sans">
            <h1 className="text-3xl font-bold mb-6 text-[#075e54] flex items-center gap-2">
                <MessageSquareText className="w-8 h-8" /> OV Chat
            </h1>
            <Card className="w-full max-w-md border-0 shadow-xl rounded-xl">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-[#25d366] text-black">
                        <TabsTrigger value="login" className="data-[state=active]:bg-[#ffffff] flex items-center gap-2 justify-center">
                            <MessageSquareText className="w-4 h-4" /> Login
                        </TabsTrigger>
                        <TabsTrigger value="register" className="data-[state=active]:bg-[#ffffff] flex items-center gap-2 justify-center">
                            <UserPlus className="w-4 h-4" /> Register
                        </TabsTrigger>
                    </TabsList>

                    {/* Login Form */}
                    <TabsContent value="login">
                        <form onSubmit={handleLoginSubmit(onLogin)}>
                            <CardContent className="space-y-4 p-6">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" {...loginRegister("username")} className="bg-white" />
                                    {loginErrors.username && <p className="text-red-500 text-sm">{loginErrors.username.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" {...loginRegister("password")} className="bg-white" />
                                    {loginErrors.password && <p className="text-red-500 text-sm">{loginErrors.password.message}</p>}
                                </div>
                                {/* <div className="flex items-center space-x-2">
                                    <Controller
                                        name="rememberMe"
                                        control={loginControl}
                                        render={({ field }) => (
                                            <Checkbox id="rememberMe" {...field} checked={field.value} />
                                        )}
                                    />
                                    <Label htmlFor="rememberMe">Remember Me</Label>
                                </div> */}
                                <Button type="submit" className="w-full bg-[#25d366] hover:bg-[#20c25a] text-white">
                                    Login
                                </Button>
                            </CardContent>
                        </form>
                    </TabsContent>

                    {/* Register Form */}
                    <TabsContent value="register">
                        <form onSubmit={handleRegisterSubmit(onRegister)}>
                            <CardContent className="space-y-4 p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" {...regRegister("firstName")} className="bg-white" />
                                        {registerErrors.firstName && <p className="text-red-500 text-sm">{registerErrors.firstName.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" {...regRegister("lastName")} className="bg-white" />
                                        {registerErrors.lastName && <p className="text-red-500 text-sm">{registerErrors.lastName.message}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" {...regRegister("email")} className="bg-white" />
                                    {registerErrors.email && <p className="text-red-500 text-sm">{registerErrors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input type="password" id="password" {...regRegister("password")} className="bg-white" />
                                    {registerErrors.password && <p className="text-red-500 text-sm">{registerErrors.password.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input type="password" id="confirmPassword" {...regRegister("confirmPassword")} className="bg-white" />
                                    {registerErrors.confirmPassword && <p className="text-red-500 text-sm">{registerErrors.confirmPassword.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="profilePicture">Profile Picture</Label>
                                    <Input
                                        type="file"
                                        id="profilePicture"
                                        {...regRegister("profilePicture")}
                                        className="bg-white"
                                        accept="image/*"
                                    />
                                    {registerErrors.profilePicture && <p className="text-red-500 text-sm">{registerErrors.profilePicture.message as string}</p>}
                                </div>
                                <Button type="submit" className="w-full bg-[#25d366] hover:bg-[#20c25a] text-white">
                                    Register
                                </Button>
                            </CardContent>
                        </form>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
