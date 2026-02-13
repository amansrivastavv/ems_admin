"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { PageTransition } from "@/components/ui/page-transition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuth();

  // Basic protection for dashboard root layouts
  // Actually useAuth handles redirect, but we can return null while loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-2xl font-semibold text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
      // Should be handled by useAuth effect, but just in case
      return null; 
  }

  return (
    <div className="flex h-screen bg-muted/40 font-sans antialiased text-foreground">
      <Sidebar className="hidden border-r bg-background lg:block" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-muted/30">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
