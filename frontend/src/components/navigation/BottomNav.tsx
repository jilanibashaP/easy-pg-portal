
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Building, Package, Wallet, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const BottomNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    {
      name: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      name: "Rooms",
      icon: Building,
      href: "/rooms",
    },
    {
      name: "Tenants",
      icon: Users,
      href: "/tenants",
    },
    // {
    //   name: "Resources",
    //   icon: Package,
    //   href: "/resources",
    // },
    {
      name: "Finance",
      icon: Wallet,
      href: "/finance",
    },
    // {
    //   name: "Stats",
    //   icon: BarChart3,
    //   href: "/stats",
    // },
    {
      name: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  if (!isMobile) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-background border-t border-border z-50 px-4">
        <nav className="max-w-3xl mx-auto flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 text-xs",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-background border-t border-border z-50 px-4">
      <nav className="max-w-3xl mx-auto flex items-center justify-between">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          
          // On very small screens, skip some items to prevent overflow
          if (index > 4 && window.innerWidth < 360) return null;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-xs",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
