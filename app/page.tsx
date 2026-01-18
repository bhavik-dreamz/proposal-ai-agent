import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Zap, Target, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            AI-Powered Proposal Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate professional project proposals in seconds using AI. 
            Analyze requirements, match with templates, and create winning proposals automatically.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/dashboard">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/dashboard/new-proposal">
              <Button size="lg" variant="outline">
                Create Proposal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-4" />
              <CardTitle>AI-Powered Generation</CardTitle>
              <CardDescription>
                Advanced AI analyzes requirements and generates professional proposals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Smart Templates</CardTitle>
              <CardDescription>
                Pre-built templates for different project types and industries
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Accurate Estimates</CardTitle>
              <CardDescription>
                Automatic cost and timeline estimation based on similar projects
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Learn & Improve</CardTitle>
              <CardDescription>
                AI learns from past proposals to improve future generations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Create your first AI-generated proposal in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard/new-proposal">
              <Button size="lg" variant="secondary">
                Create Your First Proposal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
