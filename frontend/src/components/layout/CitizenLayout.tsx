import { ReactNode } from "react";
import { CitizenSidebar } from "./CitizenSidebar";
import { TopNavbar } from "./TopNavbar";

interface CitizenLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function CitizenLayout({ children, title, subtitle }: CitizenLayoutProps) {
  return (
    <div className="min-h-screen gradient-bg">
      <CitizenSidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <TopNavbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
