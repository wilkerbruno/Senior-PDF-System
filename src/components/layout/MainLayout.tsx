import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { UserMenu } from './UserMenu';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background dark">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      <main className="md:ml-64 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <MobileSidebar />
          <div className="ml-auto">
            <UserMenu />
          </div>
        </div>
        <div className="p-4 md:p-8">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
