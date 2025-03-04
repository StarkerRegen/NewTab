import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <main>
        {children}
      </main>
    </SidebarProvider>
  )
}

