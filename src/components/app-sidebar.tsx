import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveTabs } from "@/hooks/use-tabs";
import { TabItem } from "@/components/tab";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AppWindowMac, ChevronDown } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import "../App.css";

const groupedTabs = (tabs: Tab[]) =>
  tabs.reduce<Record<number, Tab[]>>((acc, item) => {
    const windowId = item.windowId ?? -1;
    if (!acc[windowId]) {
      acc[windowId] = [];
    }
    acc[windowId].push(item);
    return acc;
  }, {});

export function AppSidebar() {
  const { activeTabs, loading } = useActiveTabs();
  const { open } = useSidebar();
  const [tabs, setTabs] = useState<Record<number, Tab[]>>([]);
  useEffect(() => {
    setTabs(groupedTabs(activeTabs));
  }, [activeTabs]);

  return (
    <Sidebar side="left" variant="floating" collapsible="icon">
      <SidebarHeader>
        {open && (
          <span className="text-3xl text-gray-500 dark:text-white mt-10 ml-3 font-bold text-shadow-lg">
            Tabs
          </span>
        )}
        <SidebarTrigger />
      </SidebarHeader>
      <Separator className="my-4" />
      <SidebarContent className="overflow-x-hidden overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            {loading ? (
              <Skeleton />
            ) : (
              Object.entries(tabs).map(([windowId, items], index) => (
                <Collapsible
                  defaultOpen
                  className="group/collapsible"
                  key={windowId}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="h-10 text-md text-gray-700 dark:text-white bg-amber-50"
                        asChild
                      >
                        <div className="flex items-center">
                          <AppWindowMac className="fill-gray-400" />
                          {open && (
                            <>
                              <span>Window{index + 1}</span>
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="w-full pr-3">
                        {items.map((item) => (
                          <TabItem tab={item} setTabs={setTabs} />
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
