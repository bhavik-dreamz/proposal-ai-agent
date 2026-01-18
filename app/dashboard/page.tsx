'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/status-badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, DollarSign, TrendingUp, Clock } from 'lucide-react';
import type { Proposal } from '@/types';

export default function DashboardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
    accepted: 0,
    avgCost: 0,
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  async function fetchProposals() {
    try {
      const response = await fetch('/api/proposals?limit=10');
      const data = await response.json();
      setProposals(data.proposals || []);

      // Calculate stats
      const allProposals = data.proposals || [];
      const total = allProposals.length;
      const totalValue = allProposals.reduce(
        (sum: number, p: Proposal) => sum + (p.cost_estimate || 0),
        0
      );
      const accepted = allProposals.filter(
        (p: Proposal) => p.status === 'accepted'
      ).length;
      const avgCost = total > 0 ? totalValue / total : 0;

      setStats({ total, totalValue, accepted, avgCost });
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your proposals and statistics
          </p>
        </div>
        <Link href="/dashboard/new-proposal">
          <Button>Create New Proposal</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalValue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? `${Math.round((stats.accepted / stats.total) * 100)}% acceptance rate`
                : '0%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Cost</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.avgCost)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Proposals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No proposals yet. Create your first proposal to get started!</p>
              <Link href="/dashboard/new-proposal">
                <Button className="mt-4">Create Proposal</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Project Type</TableHead>
                  <TableHead>Cost Estimate</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-medium">
                      {proposal.client_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{proposal.project_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {proposal.cost_estimate
                        ? formatCurrency(proposal.cost_estimate)
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {proposal.timeline_weeks
                        ? `${proposal.timeline_weeks} weeks`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={proposal.status} />
                    </TableCell>
                    <TableCell>{formatDate(proposal.created_at)}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/proposals/${proposal.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
