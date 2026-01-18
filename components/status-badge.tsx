'use client';

import { Badge } from '@/components/ui/badge';
import { getStatusColor } from '@/lib/utils';
import type { ProposalStatus } from '@/types';

interface StatusBadgeProps {
  status: ProposalStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={getStatusColor(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
