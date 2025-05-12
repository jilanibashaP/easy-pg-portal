
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bed, Users, Package, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
    },
    {
      name: 'Rooms',
      href: '/rooms',
      icon: Bed,
    },
    {
      name: 'Tenants',
      href: '/tenants',
      icon: Users,
    },
    {
      name: 'Resources',
      href: '/resources',
      icon: Package,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center py-2 px-3 text-xs',
                isActive 
                  ? 'text-pgPurple' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 mb-1',
                  isActive ? 'text-pgPurple' : 'text-muted-foreground'
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
