'use client';

import { PanelLeft, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from '../ui/sidebar';
import { usePathname } from 'next/navigation';

function getTitleFromPathname(pathname: string): string {
  if (pathname.startsWith('/patient/')) {
    const patientId = pathname.split('/').pop();
    return `Patient Details: ${patientId}`;
  }
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/tools':
      return 'AI Tools';
    case '/configure-alert':
      return 'Configure Alerts';
    case '/notifications':
      return 'Notifications';
    case '/system-status':
        return 'System Status';
    default:
      return 'ICU AI Guardian';
  }
}

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
      >
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <h1 className="text-xl font-semibold font-headline">{title}</h1>

      <div className="ml-auto flex items-center gap-4">
        <form className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Dr. Robotnik</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
