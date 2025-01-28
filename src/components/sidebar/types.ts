import { LucideIcon } from "lucide-react";

export type BaseMenuItem = {
  icon: LucideIcon;
}

export type RegularMenuItem = BaseMenuItem & {
  title: string;
  path: string;
}

export type GroupMenuItem = BaseMenuItem & {
  group: string;
  items: RegularMenuItem[];
}

export type MenuItem = RegularMenuItem | GroupMenuItem;