
import { Bell, Moon, Sun, User, Check, LogOut, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Low Stock Alert",
      message: "Bar inventory running low on premium whiskey",
      time: "5 minutes ago",
      read: false,
      type: "warning"
    },
    {
      id: 2,
      title: "Kitchen Order",
      message: "Table 12 ordered seafood pasta - Kitchen needs attention",
      time: "10 minutes ago",
      read: false,
      type: "info"
    },
    {
      id: 3,
      title: "Daily Sales Report",
      message: "Today's sales exceeded target by 15%",
      time: "1 hour ago",
      read: false,
      type: "success"
    },
    {
      id: 4,
      title: "Staff Schedule",
      message: "Weekend shift assignments have been updated",
      time: "2 hours ago",
      read: true,
      type: "info"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast({
      description: "Notification marked as read"
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      description: "Notification deleted"
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      description: "All notifications marked as read"
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      description: "All notifications cleared"
    });
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-100 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      case 'success':
        return 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'info':
        return 'bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-gray-100 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📋';
    }
  };

  const handleLogout = () => {
    navigate("/auth");
    toast({
      description: "You have been logged out"
    });
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/60 dark:border-gray-800/60 transition-all duration-300">
      <div className="flex h-16 items-center px-4 md:px-6">
        <SidebarTrigger className="mr-4" />

        <div className="ml-auto flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 rounded-full"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -right-2 -top-2 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full animate-pulse"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[450px] backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-l border-gray-200/60 dark:border-gray-800/60">
              <SheetHeader className="space-y-4 pb-4">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg font-semibold">Notifications</SheetTitle>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={markAllAsRead}
                        className="flex-1 text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark all read
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearAllNotifications}
                      className="flex-1 text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear all
                    </Button>
                  </div>
                )}
              </SheetHeader>

              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`relative p-4 rounded-lg border transition-all duration-200 ${
                        notification.read ? 'opacity-70' : ''
                      } ${getNotificationTypeColor(notification.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-medium leading-tight">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground/80">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "light" ? "dark" : "light")} 
            className="hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-500 rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 rounded-full"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 backdrop-blur-lg bg-white/95 dark:bg-gray-900/95">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
