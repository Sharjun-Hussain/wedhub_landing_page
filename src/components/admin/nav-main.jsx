"use client";

import { ChevronRight, LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem className="my-1">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className=" transition-all duration-200 rounded-lg px-3 py-3 hover:bg-primary/20 hover:text-primary-foreground"
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="text-base font-medium">{item.title}</span>
                  {item.items && (
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                  {item.badge && !item.items && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && (
                <CollapsibleContent className="mt-1">
                  <SidebarMenuSub className="space-y-1">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title} className="pl-4">
                        <SidebarMenuSubButton
                          asChild
                          className="rounded-lg px-3 py-2.5  hover:text-primary transition-colors duration-200"
                        >
                          <a href={subItem.url}>
                            <span className="text-sm">{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
