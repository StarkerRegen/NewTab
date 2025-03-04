import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useActiveTabs } from "@/hooks/use-tabs";
import { TabItem } from "@/components/tab";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const groupedTabs = (tabs: Tab[]) => tabs.reduce<Record<number, Tab[]>>((acc, item) => {
  const windowId = item.windowId ?? -1;
  if (!acc[windowId]) {
    acc[windowId] = [];
  }
  acc[windowId].push(item);
  return acc;
}, {});

// const defaultTabs: Tab[] = [
//   {
//     id: 1,
//     url: "https://example.com",
//     title: "Example",
//     favIconUrl: "https://example.com/favicon.ico",
//     windowId: 1,
//   },
//   {
//     id: 2,
//     url: "https://example.com",
//     title: "Example",
//     favIconUrl: "https://example.com/favicon.ico",
//     windowId: 1,
//   },
// ];

export function AppSidebar() {
  const { activeTabs, loading } = useActiveTabs();
  //const activeTabs = defaultTabs;
  const [tabs, setTabs] = useState<Record<number, Tab[]>>([]);
  useEffect(() => {
    setTabs(groupedTabs(activeTabs));
  }, [activeTabs]);

  return !loading && (
    <Sidebar side="left" variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-3xl text-gray-700 dark:text-white">Tabs</SidebarGroupLabel>
          <SidebarMenu>
            {Object.entries(tabs).map(([windowId, items]) => (
              <Collapsible defaultOpen className="group/collapsible" key={windowId}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="text-sm text-gray-700 dark:text-white" asChild>
                      <div className="flex items-center">
                        <span>{windowId}</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((item) => (
                          <TabItem {...item} />
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
