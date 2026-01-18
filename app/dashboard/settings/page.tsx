'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage templates, pricing rules, and tech stacks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage proposal templates for different project types.
            </p>
            <Button variant="outline" className="w-full">
              Manage Templates
            </Button>
            <p className="text-xs text-muted-foreground">
              Feature coming soon. Templates are currently managed in the database.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure pricing rules for features and project types.
            </p>
            <Button variant="outline" className="w-full">
              Manage Pricing Rules
            </Button>
            <p className="text-xs text-muted-foreground">
              Feature coming soon. Pricing rules are currently managed in the database.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tech Stacks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View and manage technology stack configurations.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">MERN</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">MEAN</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">WordPress</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">PHP</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Shopify</span>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sample Proposals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload sample proposals to improve AI generation quality.
            </p>
            <Button variant="outline" className="w-full">
              Upload Sample Proposal
            </Button>
            <p className="text-xs text-muted-foreground">
              Feature coming soon. Sample proposals are currently managed in the database.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
