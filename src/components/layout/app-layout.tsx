
"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Home, Users, Briefcase, CheckCircle, Star, LogOut, Upload, UserPlus, Filter, FileText, BarChart, History, CalendarClock, Menu } from "lucide-react"; // Added BarChart, History, CalendarClock, Menu
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "employee"; // Define user roles
}

const AdminSidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/admin/dashboard" passHref>
                <SidebarMenuButton isActive={isActive('/admin/dashboard')} tooltip="View All Leads">
                  <Home />
                  <span>All Leads</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/admin/assign" passHref>
                 <SidebarMenuButton isActive={isActive('/admin/assign')} tooltip="Assign Leads">
                  <UserPlus />
                  <span>Assign Leads</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/admin/upload" passHref>
                 <SidebarMenuButton isActive={isActive('/admin/upload')} tooltip="Upload Leads">
                  <Upload />
                  <span>Upload Leads</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/admin/upload-history" passHref>
                 <SidebarMenuButton isActive={isActive('/admin/upload-history')} tooltip="View Upload History">
                  <History />
                  <span>Upload History</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarSeparator />
       <SidebarGroup>
        <SidebarGroupLabel>Special Views</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/admin/prospects" passHref>
                <SidebarMenuButton isActive={isActive('/admin/prospects')} tooltip="View Prospects">
                  <Star />
                  <span>Prospects</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/admin/won" passHref>
                 <SidebarMenuButton isActive={isActive('/admin/won')} tooltip="View Won Leads">
                  <CheckCircle />
                  <span>Won by GRC</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
       <SidebarSeparator />
       <SidebarGroup>
        <SidebarGroupLabel>Analysis & Records</SidebarGroupLabel> {/* Updated Label */}
        <SidebarGroupContent>
          <SidebarMenu>
             <SidebarMenuItem>
               <Link href="/admin/reports" passHref>
                 <SidebarMenuButton isActive={isActive('/admin/reports')} tooltip="Generate Reports">
                   <FileText />
                   <span>Reports</span>
                 </SidebarMenuButton>
               </Link>
             </SidebarMenuItem>
              <SidebarMenuItem>
               <Link href="/admin/analytics" passHref>
                 <SidebarMenuButton isActive={isActive('/admin/analytics')} tooltip="View Analytics">
                   <BarChart />
                   <span>Analytics</span>
                 </SidebarMenuButton>
               </Link>
             </SidebarMenuItem>
             <SidebarMenuItem>
               <Link href="/admin/attendance" passHref>
                 <SidebarMenuButton isActive={isActive('/admin/attendance')} tooltip="View Attendance">
                   <CalendarClock />
                   <span>Attendance</span>
                 </SidebarMenuButton>
               </Link>
             </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

const EmployeeSidebar = () => {
   const pathname = usePathname();
   const isActive = (path: string) => pathname === path;

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>My Work</SidebarGroupLabel> {/* Updated Label */}
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
               <Link href="/employee/dashboard" passHref>
                  <SidebarMenuButton isActive={isActive('/employee/dashboard')} tooltip="My Assigned Leads">
                    <Briefcase />
                    <span>My Leads</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
               <Link href="/employee/prospects" passHref>
                  <SidebarMenuButton isActive={isActive('/employee/prospects')} tooltip="My Prospects">
                    <Star />
                    <span>My Prospects</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/employee/attendance" passHref>
                  <SidebarMenuButton isActive={isActive('/employee/attendance')} tooltip="Mark Attendance">
                    <CalendarClock />
                    <span>My Attendance</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};


export function AppLayout({ children, userRole }: AppLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication state (e.g., remove token from localStorage)
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId'); // Also remove userId
    // Redirect to login page
    router.push('/login');
  };

  // Determine sidebar content based on user role
  const sidebarContent = userRole === "admin" ? <AdminSidebar /> : <EmployeeSidebar />;

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Pass side prop for mobile sheet */}
      <Sidebar side="left">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          {/* Adjusted text size and wrapping for smaller screens */}
          <h1 className="text-lg sm:text-xl font-semibold text-sidebar-primary-foreground leading-tight">Gaea Realty and Consultants India pvt. ltd.</h1>
          <span className="text-xs sm:text-sm text-sidebar-foreground/80 capitalize mt-1">{userRole} Dashboard</span>
        </SidebarHeader>
        <SidebarContent className="flex-1 overflow-y-auto p-0">
          {sidebarContent}
        </SidebarContent>
        <SidebarFooter className="p-2 sm:p-4 border-t border-sidebar-border"> {/* Adjusted padding */}
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
       {/* Main content area */}
      <SidebarInset className="bg-background">
         {/* Header within the main content area */}
         {/* Changed sticky behavior and layout for responsiveness */}
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 md:px-6 md:static md:h-auto md:border-0 md:bg-transparent">
           {/* Trigger moved to the left */}
           <SidebarTrigger className="md:hidden" /> {/* Show trigger only below md breakpoint */}

           {/* Placeholder for potential header actions like search or user profile */}
           {/* Example: User Profile dropdown */}
           {/* <div className="ml-auto flex items-center gap-4"> */}
             {/* Add user profile/settings dropdown here if needed */}
           {/* </div> */}
        </header>
         {/* Adjusted padding for main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
    