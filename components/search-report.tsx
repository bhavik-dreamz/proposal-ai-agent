'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface SearchReportProps {
  report?: {
    query: string;
    total_found: number;
    results: Array<{
      title: string;
      similarity: number;
      relevance: 'high' | 'medium' | 'low';
      source: 'sample' | 'previous';
    }>;
  };
}

export function SearchReport({ report }: SearchReportProps) {
  if (!report || report.results.length === 0) {
    return null;
  }

  const getRelevanceBadgeColor = (relevance: string) => {
    switch (relevance) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    return source === 'sample'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  };

  return (
    <Card className="border-blue-200 dark:border-blue-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle>Search Report & Analysis</CardTitle>
          </div>
          <Badge variant="outline" className="text-blue-600">
            {report.total_found} proposal{report.total_found !== 1 ? 's' : ''} found
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Searched query:</p>
          <p className="italic">&quot;{report.query.substring(0, 150)}&quot;</p>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-sm">Similar Proposals Used as Reference:</p>
          {report.results.map((result, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{result.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Match Score: {result.similarity}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`text-xs ${getRelevanceBadgeColor(result.relevance)}`}
                >
                  {result.relevance.charAt(0).toUpperCase() + result.relevance.slice(1)} Relevance
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs ${getSourceBadgeColor(result.source)}`}
                >
                  {result.source === 'sample' ? 'Sample' : 'Previous'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-1">How this helps:</p>
          <p>
            The AI agent analyzed these {report.total_found} similar proposal{report.total_found !== 1 ? 's' : ''} and used their successful patterns to generate your proposal. The higher the match score, the more similar the project scope.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
