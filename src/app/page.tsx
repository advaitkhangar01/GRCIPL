<<<<<<< HEAD
// This page should redirect to the login page

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login');
  // Note: redirect() must be called before any JSX is returned.
  // To be absolutely safe and avoid " niets returnen" issues in some Next.js versions/setups,
  // you might return null or a minimal loading indicator, though redirect() should prevent rendering.
  // return null;
=======
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Welcome to Gaea Realty and Consultants India pvt. ltd.</CardTitle>
          <CardDescription>Your Lead Management and Sales Tracking Solution</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-muted-foreground">
            Please log in to access your dashboard.
          </p>
          <Link href="/login" passHref>
            <Button className="w-full">Login</Button>
          </Link>
          {/* Add registration link if needed */}
          {/* <Link href="/register" passHref>
            <Button variant="outline" className="w-full">Register</Button>
          </Link> */}
        </CardContent>
      </Card>
    </main>
  );
>>>>>>> 573bb45a (Initial project push)
}
