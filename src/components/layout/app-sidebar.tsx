'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Bell,
  LayoutDashboard,
  Settings,
  ShieldHalf,
  Wrench,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AppSidebar = () => {
  const pathname = usePathname();
  const { state } = useSidebar();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:bg-primary/10">
            <ShieldHalf className="size-5" />
          </Button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              state === 'collapsed' ? 'w-0' : 'w-auto'
            )}
          >
            <h1 className="text-lg font-headline font-semibold">ICU AI Guardian</h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        <SidebarMenuItem>
          <Link href="/dashboard" passHref>
            <SidebarMenuButton
              isActive={isActive('/dashboard')}
              tooltip={{ children: 'Dashboard' }}
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/tools" passHref>
            <SidebarMenuButton
              isActive={isActive('/tools')}
              tooltip={{ children: 'Tools' }}
            >
              <Wrench />
              <span>Tools</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/configure-alert" passHref>
            <SidebarMenuButton
              isActive={isActive('/configure-alert')}
              tooltip={{ children: 'Configure Alerts' }}
            >
              <Settings />
              <span>Configure Alerts</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
      <Separator className="my-2" />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/notifications" passHref>
              <SidebarMenuButton 
                isActive={isActive('/notifications')}
                tooltip={{ children: 'Notifications' }}>
                <Bell />
                <span>Notifications</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/system-status" passHref>
              <SidebarMenuButton 
                isActive={isActive('/system-status')}
                tooltip={{ children: 'System Status' }}>
                <Activity />
                <span>System Status</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
