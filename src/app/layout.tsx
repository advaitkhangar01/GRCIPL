
import './globals.css'; // Re-enable global styles
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"; // Re-enable Toaster

export const metadata: Metadata = {
  title: 'GRCIPL CRM Lead Management Software',
  description: 'Lead Management and Sales Tracking App for Gaea Realty and Consultants India pvt. ltd.',

import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Use specific font objects
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const geistSans = Geist({
  variable: '--font-geist-sans',
  // subsets: ['latin'], // Remove subsets if using the full font
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  // subsets: ['latin'], // Remove subsets if using the full font
});


export const metadata: Metadata = {
  title: 'Gaea Realty and Consultants India pvt. ltd. - Lead Management',
  description: 'Lead Management and Sales Tracking App',

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      {/* Using Tailwind's default font-sans which will use system UI fonts */}
      <body className="font-sans antialiased">
        {children}
        <Toaster />

      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster here */}

      </body>
    </html>
  );
}
