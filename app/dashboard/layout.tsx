import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Home, Settings, Plus } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Proposal AI Agent</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/new-proposal">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Proposal
                </Button>
              </Link>
              <Link href="/dashboard/proposals">
                <Button variant="ghost" size="sm">
                  All Proposals
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
