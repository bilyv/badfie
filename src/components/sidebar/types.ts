
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  id: string;
}

export interface MenuGroup {
  group: string;
  icon: LucideIcon;
  id: string;
  items: MenuItem[];
}

export type SidebarMenuItem = MenuItem | MenuGroup;
