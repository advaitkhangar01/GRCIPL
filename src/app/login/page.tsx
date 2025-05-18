<<<<<<< HEAD

"use client";

import { useState, useEffect } from 'react'; // Added useEffect
=======
"use client";

import { useState } from 'react';
>>>>>>> 573bb45a (Initial project push)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
// import Image from 'next/image'; // Image component is no longer needed
import { LogIn, Building } from 'lucide-react';

// Offline credentials store
const offlineUsers = {
  "master_admin": { password: "master1008", role: 'admin', userId: 'master_admin' },
  "pooja": { password: "pooja@987", role: 'employee', userId: 'pooja' },
  "aditya": { password: "aditya@987", role: 'employee', userId: 'aditya' }
=======
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image'; // Import next/image
import { LogIn, Building } from 'lucide-react'; // Import icons

// Mock authentication function (replace with actual API call)
const authenticateUser = async (email: string, password: string): Promise<{ success: boolean; role?: 'admin' | 'employee'; message?: string; userId?: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Replace with actual authentication logic against your backend (PHP/MySQL)
  // New Credentials
  if (email === "master_admin" && password === "master1008") {
    return { success: true, role: 'admin', userId: 'master_admin' };
  } else if (email === "pooja" && password === "pooja@987") {
    return { success: true, role: 'employee', userId: 'pooja' };
  } else if (email === "aditya" && password === "aditya@987") {
    return { success: true, role: 'employee', userId: 'aditya' };
  } else {
    return { success: false, message: "Invalid credentials" };
  }
>>>>>>> 573bb45a (Initial project push)
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
  const [currentYear, setCurrentYear] = useState<number | null>(null); // For current year
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Set current year only on client-side
    setCurrentYear(new Date().getFullYear());
  }, []);

=======
  const router = useRouter();
  const { toast } = useToast();

>>>>>>> 573bb45a (Initial project push)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

<<<<<<< HEAD
    await new Promise(resolve => setTimeout(resolve, 300));

    const userId = email.trim();
    const user = offlineUsers[userId as keyof typeof offlineUsers];

    if (user && user.password === password) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', user.role!);
        if (user.userId) {
          localStorage.setItem('userId', user.userId);
        }
      }

      toast({
        title: "Login Successful",
        description: `Redirecting to ${user.role} dashboard...`,
      });

      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'employee') {
        router.push('/employee/dashboard');
      }
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid User ID or Password.",
      });
    }

    setIsLoading(false);
=======
    try {
      const authResult = await authenticateUser(email, password);

      if (authResult.success) {
        // Store user session/token (e.g., in localStorage or cookies)
        // Store role and potentially user ID for employee view
        localStorage.setItem('userRole', authResult.role!);
        if(authResult.userId) {
            localStorage.setItem('userId', authResult.userId);
        }

        toast({
          title: "Login Successful",
          description: `Redirecting to ${authResult.role} dashboard...`,
        });

        // Redirect based on role
        if (authResult.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (authResult.role === 'employee') {
          router.push('/employee/dashboard'); // Employee dashboard can fetch based on stored userId
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: authResult.message || "An error occurred.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
>>>>>>> 573bb45a (Initial project push)
  };

  return (
    <main className="flex min-h-screen items-stretch bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Left Side - Login Form */}
<<<<<<< HEAD
      <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6 md:w-1/2 lg:w-2/5 xl:w-1/3">
        <Card className="w-full max-w-md shadow-xl border border-border/50 bg-card rounded-xl backdrop-blur-sm bg-opacity-90">
          <CardHeader className="text-center space-y-2 pt-6 pb-4 sm:pt-8">
            <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-3 border border-primary/20 shadow-inner">
              <Building className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Welcome Back!</CardTitle>
            <CardDescription className="text-muted-foreground">Login to GRCIPL CRM Lead Management Software</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="userIdInput" className="text-sm font-medium text-foreground/80">User ID</Label>
                <Input
                  id="userIdInput"
                  type="text"
=======
      <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6 md:w-1/2 lg:w-2/5 xl:w-1/3"> {/* Adjusted padding */}
        <Card className="w-full max-w-md shadow-xl border border-border/50 bg-card rounded-xl backdrop-blur-sm bg-opacity-90">
          <CardHeader className="text-center space-y-2 pt-6 pb-4 sm:pt-8"> {/* Adjusted padding */}
            {/* Logo Placeholder */}
            <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-3 border border-primary/20 shadow-inner"> {/* Adjusted size */}
              <Building className="h-7 w-7 sm:h-8 sm:w-8" /> {/* Adjusted size */}
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Welcome Back!</CardTitle> {/* Adjusted size */}
            <CardDescription className="text-muted-foreground">Login to Gaea Realty CRM</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8"> {/* Adjusted padding */}
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6"> {/* Adjusted spacing */}
              <div className="space-y-1.5 sm:space-y-2"> {/* Adjusted spacing */}
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80">User ID</Label>
                <Input
                  id="email"
                  type="text" // Change type to text for User ID
>>>>>>> 573bb45a (Initial project push)
                  placeholder="Enter your User ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
<<<<<<< HEAD
                  className="h-10 sm:h-11 text-sm sm:text-base border-input bg-input/70 focus:border-primary focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
=======
                  className="h-10 sm:h-11 text-sm sm:text-base border-input bg-input/70 focus:border-primary focus:ring-primary/50 transition-all" /* Adjusted height/text size */
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2"> {/* Adjusted spacing */}
>>>>>>> 573bb45a (Initial project push)
                <Label htmlFor="password" className="text-sm font-medium text-foreground/80">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
<<<<<<< HEAD
                  className="h-10 sm:h-11 text-sm sm:text-base border-input bg-input/70 focus:border-primary focus:ring-primary/50 transition-all"
                />
              </div>
              <Button type="submit" className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold mt-2 transition-transform duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading}>
                 <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
=======
                  className="h-10 sm:h-11 text-sm sm:text-base border-input bg-input/70 focus:border-primary focus:ring-primary/50 transition-all" /* Adjusted height/text size */
                />
              </div>
              <Button type="submit" className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold mt-2 transition-transform duration-150 ease-in-out hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading}> {/* Adjusted height/text size */}
                 <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> {/* Adjusted size */}
>>>>>>> 573bb45a (Initial project push)
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
<<<<<<< HEAD
        {currentYear !== null && (
          <p className="mt-6 sm:mt-8 text-center text-xs text-muted-foreground">
            &copy; {currentYear} Gaea Realty and Consultants India pvt. ltd.
          </p>
        )}
      </div>

      {/* Right Side - Branding Text (Image Removed) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 xl:w-2/3 items-center justify-center bg-gradient-to-br from-primary via-accent/80 to-secondary p-6 lg:p-10 relative overflow-hidden">
         <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cg%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%3E%3Cpath%20opacity%3D%225%22%20d%3D%22M96%2095h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-9-10h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm9-10v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-9-10h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm9-10v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-9-10h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm9-10v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9z%22%2F%3E%3Cpath%20d%3D%22M6%205V0H5v5H0v1h5v94h1V6h94V5H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] mix-blend-overlay"></div>
        
        {/* Text container, now a direct child of the right-side panel */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 lg:p-8 text-white">
           {/* Optional: Add a semi-transparent backdrop if needed for readability against the gradient */}
           {/* <div className="absolute inset-0 bg-black/30 rounded-lg -z-10"></div> */}
           <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-lg">CRM Lead Management Software</h2>
           <p className="text-base lg:text-lg xl:text-xl text-primary-foreground/90 drop-shadow-md max-w-md lg:max-w-lg">
             Empowering Gaea Realty with Streamlined Lead Tracking and Sales Performance Insights.
           </p>
=======
        <p className="mt-6 sm:mt-8 text-center text-xs text-muted-foreground"> {/* Adjusted margin */}
           &copy; {new Date().getFullYear()} Gaea Realty and Consultants India pvt. ltd.
        </p>
      </div>

      {/* Right Side - Image/Branding (Hidden below md breakpoint) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 xl:w-2/3 items-center justify-center bg-gradient-to-br from-primary via-accent/80 to-secondary p-6 lg:p-10 relative overflow-hidden"> {/* Adjusted padding */}
         {/* Subtle background pattern */}
         <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cg%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%3E%3Cpath%20opacity%3D%225%22%20d%3D%22M96%2095h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-9-10h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm9-10v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-9-10h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm9-10v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-9-10h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm10%200h9v-9h-9v9zm9-10v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9zm-10%200v-9h-9v9h9z%22%2F%3E%3Cpath%20d%3D%22M6%205V0H5v5H0v1h5v94h1V6h94V5H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] mix-blend-overlay"></div>
        <div className="relative z-10 w-full max-w-lg lg:max-w-xl aspect-video"> {/* Adjusted max-width */}
          <Image
            src="https://picsum.photos/800/450" // Placeholder image, adjusted aspect ratio
            alt="Modern Real Estate"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-2xl border-4 border-white/10"
            data-ai-hint="modern architecture real estate high-rise building" // AI hint for image generation
            priority // Prioritize loading the hero image
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-lg flex flex-col items-center justify-end text-center p-6 lg:p-8"> {/* Adjusted padding */}
             <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg">CRM Lead Management Software</h2> {/* Adjusted text size and margin */}
             <p className="text-base lg:text-lg xl:text-xl text-primary-foreground/90 drop-shadow-md max-w-md lg:max-w-lg"> {/* Adjusted text size */}
               Empowering Gaea Realty with Streamlined Lead Tracking and Sales Performance Insights.
             </p>
          </div>
>>>>>>> 573bb45a (Initial project push)
        </div>
      </div>
    </main>
  );
}
