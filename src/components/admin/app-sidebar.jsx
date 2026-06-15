"use client";

import * as React from "react";
import {
  ShoppingCart,
  Users,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  Home,
  TrendingUp,
  FileText,
  Palette,
  Truck,
  ClipboardList,
  Star,
  MapPin,
  HelpCircle,
  Bell,
  MessageSquare,
  Shield,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main";
import { NavQuickAccess } from "./nav-quick-access";
import { NavUser } from "./nav-user";

// Real-time e-commerce data
const data = {
  user: {
    name: "Admin User",
    email: "admin@ecommerce.com",
    avatar: "/avatars/admin.jpg",
    role: "Super Admin",
  },
  stores: [
    {
      id: "store-1",
      name: "Main Store",
      logo: ShoppingCart,
      plan: "Enterprise",
      status: "online",
      sales: "$12.4K",
      visitors: "2.3K",
    },
    {
      id: "store-2",
      name: "Outlet Store",
      logo: Star,
      plan: "Business",
      status: "offline",
      sales: "$8.7K",
      visitors: "1.2K",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
      isActive: true,
      badge: "3",
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "#",
          badge: "24",
        },
        {
          title: "Pending",
          url: "#",
          badge: "12",
        },
        {
          title: "Processing",
          url: "#",
          badge: "7",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: Package,
      items: [
        {
          title: "All Products",
          url: "#",
          badge: "142",
        },
        {
          title: "Categories",
          url: "#",
        },
        {
          title: "Inventory",
          url: "#",
          badge: "12",
        },
      ],
    },
    {
      title: "Customers",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Customers",
          url: "#",
          badge: "1.2K",
        },
        {
          title: "Segments",
          url: "#",
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Sales Report",
          url: "#",
        },
        {
          title: "Customer Report",
          url: "#",
        },
      ],
    },
  ],
  quickAccess: [
    {
      name: "Notifications",
      url: "#",
      icon: Bell,
      badge: "7",
    },
    {
      name: "Messages",
      url: "#",
      icon: MessageSquare,
      badge: "3",
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      name: "Help Center",
      url: "#",
      icon: HelpCircle,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const [unreadNotifications, setUnreadNotifications] = React.useState(7);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher stores={data.stores} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavQuickAccess items={data.quickAccess} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} notifications={unreadNotifications} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
