
import React from 'react';
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { TooltipProvider } from "@/components/ui/tooltip";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TooltipProvider>
      <>
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </>
    </TooltipProvider>
  );
};
