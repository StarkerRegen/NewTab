import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { closeTabById } from "@/utils/tabUtils";

interface TabItemProps {
  tab: Tab;
  setTabs: React.Dispatch<React.SetStateAction<Record<number, Tab[]>>>;
}

export const TabItem: React.FC<TabItemProps> = ({ tab, setTabs }) => {
  const closeTab = async () => {
    await closeTabById(tab.id ?? -1);
    setTabs((prev) => {
      const windowTabs = prev[tab.windowId ?? -1] ?? [];
      return {
        ...prev,
        [tab.windowId ?? -1]: windowTabs.filter((t) => t.id !== tab.id),
      };
    });
  };
  return (
    <SidebarMenuSubItem key={tab.id}>
      <SidebarMenuSubButton
        size="sm"
        className="h-16 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-blue-50 hover:text-gray-700 dark:text-white dark:hover:text-white"
        asChild
      >
        <div className="flex items-center">
          <Avatar className="h-6 w-6 rounded-full">
            <AvatarImage src={tab.favIconUrl} alt={tab.title} />
            <AvatarFallback className="rounded-lg text-white text-sm bg-amber-400">
              {tab.title?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight ml-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate font-semibold hover:underline">
                  {tab.title}
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                className="bg-amber-100 border-amber-300 shadow-amber-500 text-gray-500"
              >
                {tab.title}
              </TooltipContent>
            </Tooltip>
            <span className="truncate text-xs text-gray-500">{tab.url}</span>
          </div>
          <div className="flex flex-col justify-between items-center gap-2">
            <Button
              variant="ghost"
              className="hover:bg-blue-100 hover:shadow-2xl size-4"
              onClick={closeTab}
            >
              <X className="ml-auto size-4" />
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-blue-100 hover:shadow-2xl size-4"
              onClick={() => console.log(tab)}
            >
              <Plus className="ml-auto size-4" />
            </Button>
          </div>
        </div>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};
