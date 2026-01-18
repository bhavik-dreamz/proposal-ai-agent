'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/status-badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Eye } from 'lucide-react';
import type { Proposal, ProjectType, ProposalStatus } from '@/types';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all');

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    filterProposals();
  }, [proposals, searchQuery, statusFilter, typeFilter]);

  async function fetchProposals() {
    try {
      const response = await fetch('/api/proposals');
      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterProposals() {
    let filtered = [...proposals];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.client_name.toLowerCase().includes(query) ||
          p.requirements.toLowerCase().includes(query) ||
          (p.generated_proposal?.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((p) => p.project_type === typeFilter);
    }

    setFilteredProposals(filtered);
  }

  if (loading) {
    return <LoadingSpinner message="Loading proposals..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Proposals</h1>
          <p className="text-muted-foreground">
            View and manage all your proposals
          </p>
        </div>
        <Link href="/dashboard/new-proposal">
          <Button>Create New Proposal</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProposalStatus | 'all')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ProjectType | 'all')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="MERN">MERN</option>
              <option value="MEAN">MEAN</option>
              <option value="WordPress">WordPress</option>
              <option value="PHP">PHP</option>
              <option value="Shopify">Shopify</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Proposals ({filteredProposals.length} of {proposals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProposals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No proposals found.</p>
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
                {filteredProposals.map((proposal) => (
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
                          <Eye className="mr-2 h-4 w-4" />
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
