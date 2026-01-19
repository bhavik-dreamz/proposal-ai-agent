import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Home, Settings, Plus, Users, LogOut } from 'lucide-react';
import { auth, signOut } from '@/lib/auth';
import { Role } from '@prisma/client';
import { DashboardSessionProvider } from './session-provider';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === Role.ADMIN;
  return (
    <DashboardSessionProvider session={session}>
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
                {isAdmin && (
                  <>
                    <Link href="/dashboard/users">
                      <Button variant="ghost" size="sm">
                        <Users className="mr-2 h-4 w-4" />
                        Users
                      </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                      <Button variant="ghost" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </Link>
                  </>
                )}
                <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/login' });
                  }}
                >
                  <Button variant="ghost" size="sm" type="submit">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </DashboardSessionProvider>
  );
}
