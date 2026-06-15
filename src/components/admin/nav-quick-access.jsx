"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavQuickAccess({ items }) {
  const { state } = useSidebar();

  return (
    <SidebarGroup className="mt-6">
      {state !== "collapsed" && (
        <SidebarGroupLabel className="text-sm font-semibold mb-2 px-3">
          Quick Access
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name} className="my-1">
            <SidebarMenuButton
              asChild
              className="rounded-lg px-3 py-3 hover:bg-primary/20 hover:text-primary-foreground transition-colors duration-200"
              tooltip={state === "collapsed" ? item.name : undefined}
            >
              <a href={item.url}>
                <item.icon className="w-5 h-5" />
                {state !== "collapsed" && (
                  <>
                    <span className="text-base font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
