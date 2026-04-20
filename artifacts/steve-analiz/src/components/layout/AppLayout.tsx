import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
