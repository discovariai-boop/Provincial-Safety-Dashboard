'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GuardianLogo, PremierLogo } from '@/components/icons';
import { departments } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AppSidebarProps {
  isMobile?: boolean;
}

export default function AppSidebar({ isMobile = false }: AppSidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {departments.map((dept) => {
        const isActive = pathname === dept.href;
        const linkContent = (
          <>
            <dept.icon className="h-6 w-6" />
            <span className={cn(isMobile ? '' : 'sr-only')}>{dept.name}</span>
          </>
        );

        return isMobile ? (
          <Link
            key={dept.name}
            href={dept.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
              isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
            )}
          >
            {linkContent}
          </Link>
        ) : (
          <TooltipProvider key={dept.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={dept.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {linkContent}
                  <span className="sr-only">{dept.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{dept.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </nav>
  );

  if (isMobile) {
    return (
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GuardianLogo className="h-6 w-6 text-primary" />
            <span>Guardian</span>
          </Link>
        </div>
        <div className="flex-1">
          {navContent}
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="group flex items-center justify-center gap-2 text-lg font-semibold text-primary transition-transform duration-300 group-hover:scale-110">
            <PremierLogo className="h-8 w-8 transition-all group-hover:scale-110" />
            <span className="sr-only">Premier's Office</span>
          </Link>
        </div>
        <div className="flex-1 pt-4">
            {navContent}
        </div>
      </div>
    </aside>
  );
}
