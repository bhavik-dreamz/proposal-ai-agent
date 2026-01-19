'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  const [templates, setTemplates] = useState([]);
  const [pricingRules, setPricingRules] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  const [sampleProposals, setSampleProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [templatesRes, pricingRes, techRes, samplesRes] = await Promise.all([
        fetch('/api/templates'),
        fetch('/api/pricing-rules'),
        fetch('/api/tech-stacks'),
        fetch('/api/sample-proposals'),
      ]);

      setTemplates(await templatesRes.json());
      setPricingRules(await pricingRes.json());
      setTechStacks(await techRes.json());
      setSampleProposals(await samplesRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          projectType: formData.get('projectType'),
          description: formData.get('description'),
          content: formData.get('content'),
          sections: [],
          isActive: true,
        }),
      });
      await fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error adding template:', error);
    }
    setLoading(false);
  };

  const handleAddPricingRule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const projectType = formData.get('projectType');
      await fetch('/api/pricing-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureName: formData.get('featureName'),
          baseCost: formData.get('baseCost'),
          timeHours: formData.get('timeHours'),
          projectType: projectType === 'ALL' ? null : projectType,
          complexityMultiplier: {
            simple: 0.8,
            medium: 1.0,
            complex: 1.5,
          },
        }),
      });
      await fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error adding pricing rule:', error);
    }
    setLoading(false);
  };

  const handleAddSampleProposal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await fetch('/api/sample-proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          projectType: formData.get('projectType'),
          fullContent: formData.get('fullContent'),
          requirementsExcerpt: formData.get('requirementsExcerpt'),
          cost: formData.get('cost'),
          timelineWeeks: formData.get('timelineWeeks'),
          isApproved: true,
        }),
      });
      await fetchData();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error adding sample proposal:', error);
    }
    setLoading(false);
  };

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
            <CardTitle>Templates ({templates.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage proposal templates for different project types.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Add New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white text-foreground dark:bg-neutral-900">
                <DialogHeader>
                  <DialogTitle>Add New Template</DialogTitle>
                  <DialogDescription>
                    Create a new proposal template for a project type.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTemplate} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select name="projectType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-foreground dark:bg-neutral-900">
                        <SelectItem value="MERN">MERN</SelectItem>
                        <SelectItem value="MEAN">MEAN</SelectItem>
                        <SelectItem value="WordPress">WordPress</SelectItem>
                        <SelectItem value="PHP">PHP</SelectItem>
                        <SelectItem value="Shopify">Shopify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" />
                  </div>
                  <div>
                    <Label htmlFor="content">Template Content</Label>
                    <Textarea id="content" name="content" rows={8} required />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Template'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <div className="text-xs text-muted-foreground">
              {templates.length} template(s) configured
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Rules ({pricingRules.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure pricing rules for features and project types.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Add Pricing Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white text-foreground dark:bg-neutral-900">
                <DialogHeader>
                  <DialogTitle>Add Pricing Rule</DialogTitle>
                  <DialogDescription>
                    Create a new pricing rule for a feature.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPricingRule} className="space-y-4">
                  <div>
                    <Label htmlFor="featureName">Feature Name</Label>
                    <Input id="featureName" name="featureName" placeholder="e.g., User Authentication" required />
                  </div>
                  <div>
                    <Label htmlFor="baseCost">Base Cost ($)</Label>
                    <Input id="baseCost" name="baseCost" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="timeHours">Time (Hours)</Label>
                    <Input id="timeHours" name="timeHours" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="projectType">Project Type (Optional)</Label>
                    <Select name="projectType">
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-foreground dark:bg-neutral-900">
                        <SelectItem value="ALL">All Types</SelectItem>
                        <SelectItem value="MERN">MERN</SelectItem>
                        <SelectItem value="MEAN">MEAN</SelectItem>
                        <SelectItem value="WordPress">WordPress</SelectItem>
                        <SelectItem value="PHP">PHP</SelectItem>
                        <SelectItem value="Shopify">Shopify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Rule'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <div className="text-xs text-muted-foreground">
              {pricingRules.length} rule(s) configured
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tech Stacks ({techStacks.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View and manage technology stack configurations.
            </p>
            <div className="space-y-2">
              {techStacks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Loading tech stacks...</p>
              ) : (
                techStacks.map((stack: any) => (
                  <div key={stack.id} className="flex items-center justify-between">
                    <span className="text-sm">{stack.name}</span>
                    <Badge variant="outline">${stack.baseCost}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sample Proposals ({sampleProposals.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload sample proposals to improve AI generation quality.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Add Sample Proposal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white text-foreground dark:bg-neutral-900">
                <DialogHeader>
                  <DialogTitle>Add Sample Proposal</DialogTitle>
                  <DialogDescription>
                    Add a sample proposal to train the AI.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSampleProposal} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div>
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select name="projectType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-foreground dark:bg-neutral-900">
                        <SelectItem value="MERN">MERN</SelectItem>
                        <SelectItem value="MEAN">MEAN</SelectItem>
                        <SelectItem value="WordPress">WordPress</SelectItem>
                        <SelectItem value="PHP">PHP</SelectItem>
                        <SelectItem value="Shopify">Shopify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="requirementsExcerpt">Requirements Summary</Label>
                    <Textarea id="requirementsExcerpt" name="requirementsExcerpt" rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="fullContent">Full Proposal Content</Label>
                    <Textarea id="fullContent" name="fullContent" rows={8} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cost">Cost ($)</Label>
                      <Input id="cost" name="cost" type="number" step="0.01" required />
                    </div>
                    <div>
                      <Label htmlFor="timelineWeeks">Timeline (Weeks)</Label>
                      <Input id="timelineWeeks" name="timelineWeeks" type="number" required />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Sample'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <div className="text-xs text-muted-foreground">
              {sampleProposals.length} sample(s) available
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
