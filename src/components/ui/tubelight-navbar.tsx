
import React, { useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDeviceContext } from "@/App"

interface NavItem {
  name: string;
  icon: LucideIcon;
  value: string;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
}

export function TubelightNavbar({ items, className, value, onValueChange }: NavBarProps) {
  const deviceType = useDeviceContext();

  return (
    <div
      className={cn(
        "relative z-10 w-full max-w-md mx-auto transition-all duration-300",
        className,
      )}
    >
      <div className={`flex items-center ${deviceType === "mobile" ? "gap-0.5" : deviceType === "tablet" ? "gap-1" : "gap-2"} bg-background/70 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg transition-all duration-300`}>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = value === item.value

          return (
            <button
              key={item.value}
              onClick={() => onValueChange(item.value)}
              className={cn(
                `relative flex-1 cursor-pointer ${deviceType === "mobile" ? "text-xs" : "text-sm"} font-semibold ${deviceType === "mobile" ? "px-1.5" : deviceType === "tablet" ? "px-2" : "px-3"} ${deviceType === "mobile" ? "py-1" : deviceType === "tablet" ? "py-1.5" : "py-2"} rounded-full transition-all duration-300`,
                "text-foreground/80 hover:text-primary",
                isActive && "bg-muted text-primary",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="flex justify-center md:hidden">
                <Icon size={deviceType === "mobile" ? 14 : 16} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className={`absolute ${deviceType === "mobile" ? "-top-0.5" : deviceType === "tablet" ? "-top-1" : "-top-2"} left-1/2 -translate-x-1/2 ${deviceType === "mobile" ? "w-4" : deviceType === "tablet" ? "w-6" : "w-8"} h-1 bg-primary rounded-t-full transition-all duration-300`}>
                    <div className={`absolute ${deviceType === "mobile" ? "w-6" : deviceType === "tablet" ? "w-8" : "w-12"} ${deviceType === "mobile" ? "h-3" : deviceType === "tablet" ? "h-4" : "h-6"} bg-primary/20 rounded-full blur-md ${deviceType === "mobile" ? "-top-0.5" : deviceType === "tablet" ? "-top-1" : "-top-2"} ${deviceType === "mobile" ? "-left-1" : deviceType === "tablet" ? "-left-1" : "-left-2"} transition-all duration-300`} />
                    <div className={`absolute ${deviceType === "mobile" ? "w-4" : deviceType === "tablet" ? "w-6" : "w-8"} ${deviceType === "mobile" ? "h-3" : deviceType === "tablet" ? "h-4" : "h-6"} bg-primary/20 rounded-full blur-md ${deviceType === "mobile" ? "-top-0.25" : deviceType === "tablet" ? "-top-0.5" : "-top-1"} transition-all duration-300`} />
                    <div className={`absolute ${deviceType === "mobile" ? "w-2" : deviceType === "tablet" ? "w-3" : "w-4"} ${deviceType === "mobile" ? "h-2" : deviceType === "tablet" ? "h-3" : "h-4"} bg-primary/20 rounded-full blur-sm top-0 ${deviceType === "mobile" ? "left-1" : deviceType === "tablet" ? "left-1.5" : "left-2"} transition-all duration-300`} />
                  </div>
                </motion.div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
