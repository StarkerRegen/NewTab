import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
  } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"

export function TabItem(tab: Tab) {
return (
    <SidebarMenuSubItem  key={tab.title}>
        <SidebarMenuSubButton
            size="sm"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            asChild
        >
            <div className="flex items-center">
            <Avatar className="h-8 w-8 rounded-sm">
                <AvatarImage src={tab.favIconUrl} alt={tab.title} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{tab.title}</span>
                <span className="truncate text-xs">{tab.url}</span>
            </div>
            <Plus className="ml-auto size-4" />
            </div>
        </SidebarMenuSubButton>
    </SidebarMenuSubItem>
)}  