import { openai } from './openai';
import { prisma } from './prisma';
import { searchSimilarProposals } from './vector-search';
import type { 
  ProposalGenerationRequest, 
  ProposalGenerationResponse,
  ProjectType,
  Complexity,
  TechStack,
  Template,
  PricingRule
} from '@/types';

/**
 * Detect project type from requirements using AI
 */
export async function detectProjectType(requirements: string): Promise<ProjectType> {
  const prompt = `Analyze the following project requirements and determine the most appropriate technology stack. 
Return ONLY one of these options: MERN, MEAN, WordPress, PHP, Shopify

Requirements:
${requirements}

Consider:
- MERN: Web applications, SaaS, dashboards, real-time features
- MEAN: Enterprise applications, complex SPAs, TypeScript projects
- WordPress: Blogs, business websites, content-heavy sites, portfolios
- PHP: Custom backend solutions, legacy integrations
- Shopify: E-commerce, online stores, product sales

Return only the stack name (e.g., "MERN" or "Shopify"):`;

  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content: 'You are a technical expert. Return only the technology stack name, nothing else.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const detected = (response.choices[0]?.message?.content || 'MERN')
      .trim()
      .toUpperCase() as ProjectType;

    // Validate it's a valid project type
    const validTypes: ProjectType[] = ['MERN', 'MEAN', 'WordPress', 'PHP', 'Shopify'];
    return validTypes.includes(detected) ? detected : 'MERN';
  } catch (error) {
    console.error('Error detecting project type:', error);
    return 'MERN'; // Default fallback
  }
}

/**
 * Detect complexity from requirements
 */
export async function detectComplexity(requirements: string): Promise<Complexity> {
  const prompt = `Analyze the complexity of this project based on requirements. Return ONLY: simple, medium, or complex

Requirements:
${requirements}

Consider:
- simple: Basic features, standard functionality, <10 features
- medium: Moderate features, some custom work, 10-20 features
- complex: Advanced features, custom integrations, >20 features, enterprise-level

Return only: simple, medium, or complex`;

  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content: 'Return only: simple, medium, or complex. Nothing else.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const detected = (response.choices[0]?.message?.content || 'medium')
      .trim()
      .toLowerCase() as Complexity;

    const validComplexities: Complexity[] = ['simple', 'medium', 'complex'];
    return validComplexities.includes(detected) ? detected : 'medium';
  } catch (error) {
    console.error('Error detecting complexity:', error);
    return 'medium';
  }
}

/**
 * Get tech stack information
 */
export async function getTechStackInfo(projectType: ProjectType): Promise<TechStack | null> {
  try {
    const techStack = await prisma.techStack.findUnique({
      where: { name: projectType },
    });

    return techStack as TechStack | null;
  } catch (error) {
    console.error('Error fetching tech stack:', error);
    return null;
  }
}

/**
 * Get template for project type
 */
export async function getTemplate(projectType: ProjectType): Promise<Template | null> {
  try {
    const template = await prisma.template.findFirst({
      where: {
        projectType,
        isActive: true,
      },
    });

    return template as Template | null;
  } catch (error) {
    console.error('Error fetching template:', error);
    return null;
  }
}

/**
 * Calculate cost and timeline estimate
 */
export async function calculateEstimate(
  requirements: string,
  projectType: ProjectType,
  complexity: Complexity
): Promise<{ cost: number; timelineWeeks: number }> {
  // Get tech stack info
  const techStack = await getTechStackInfo(projectType);
  if (!techStack) {
    // Default estimates
    return {
      cost: 5000,
      timelineWeeks: 8,
    };
  }

  // Extract features from requirements using AI
  const featuresPrompt = `Extract a list of specific features mentioned in these requirements. 
Return ONLY a JSON array of feature names, nothing else.

Requirements:
${requirements}

Example format: ["User Authentication", "Payment Gateway", "Admin Dashboard"]`;

  let features: string[] = [];
  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content: 'Return a JSON object with a "features" array. Example: {"features": ["Feature 1", "Feature 2"]}',
        },
        { role: 'user', content: featuresPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    try {
      const parsed = JSON.parse(content);
      features = Array.isArray(parsed.features) ? parsed.features : (parsed.list || []);
    } catch {
      // If parsing fails, estimate based on requirements
      const wordCount = requirements.split(/\s+/).length;
      features = Array(Math.min(Math.max(Math.floor(wordCount / 50), 3), 15)).fill('Feature');
    }
  } catch (error) {
    console.error('Error extracting features:', error);
    // Estimate based on requirements length
    const wordCount = requirements.split(/\s+/).length;
    features = Array(Math.min(Math.max(Math.floor(wordCount / 50), 3), 15)).fill('Feature');
  }

  // Get pricing rules
  const pricingRules = await prisma.pricingRule.findMany({
    where: {
      OR: [
        { projectType: null },
        { projectType },
      ],
    },
  });

  // Calculate base cost
  let totalCost = Number(techStack.baseCost || 0);
  let totalHours = (techStack.baseTimelineWeeks || 0) * 40; // Assume 40 hours per week

  // Add feature costs
  for (const feature of features) {
    const matchingRule = pricingRules?.find(
      (rule) =>
        rule.featureName.toLowerCase().includes(feature.toLowerCase()) ||
        feature.toLowerCase().includes(rule.featureName.toLowerCase())
    );

    if (matchingRule) {
      const multiplier = (matchingRule.complexityMultiplier as any)?.[complexity] || 1;
      totalCost += Number(matchingRule.baseCost || 0) * multiplier;
      totalHours += (matchingRule.timeHours || 0) * multiplier;
    } else {
      // Default feature cost
      totalCost += Number(techStack.costPerFeature || 0);
      totalHours += 8; // 8 hours per feature
    }
  }

  // Apply complexity multiplier to total
  const complexityMultipliers = {
    simple: 0.8,
    medium: 1.0,
    complex: 1.5,
  };
  const complexityMultiplier = complexityMultipliers[complexity];

  totalCost = Math.round(totalCost * complexityMultiplier);
  const timelineWeeks = Math.ceil((totalHours * complexityMultiplier) / 40);

  return {
    cost: totalCost,
    timelineWeeks: Math.max(timelineWeeks, techStack.baseTimelineWeeks || 0),
  };
}

/**
 * Generate proposal using AI
 */
export async function generateProposal(
  request: ProposalGenerationRequest
): Promise<ProposalGenerationResponse> {
  // Detect project type and complexity if not provided
  const projectType = request.project_type || await detectProjectType(request.requirements);
  const complexity = request.complexity || await detectComplexity(request.requirements);

  // Get context
  const [techStack, template, similarProposals, estimate] = await Promise.all([
    getTechStackInfo(projectType),
    getTemplate(projectType),
    searchSimilarProposals(request.requirements, projectType, 3),
    calculateEstimate(request.requirements, projectType, complexity),
  ]);

  // Build context for AI
  const similarProposalsContext = similarProposals
    .map((p, i) => `Example ${i + 1}:\n${(p.fullContent || p.full_content || '').substring(0, 1000)}...`)
    .join('\n\n');

  const techStackContext = techStack
    ? `Tech Stack: ${techStack.name}\nDescription: ${techStack.description}\nStrengths: ${(techStack.additionalInfo as any)?.strengths?.join(', ')}\nBest For: ${(techStack.additionalInfo as any)?.best_for?.join(', ')}`
    : '';

  const templateContent = template?.content || '';

  // Build the AI prompt
  const systemPrompt = `You are an expert proposal writer for an IT project management company. Always generate a complete, professional proposal even if you don't have all the context.

Your role:
1. Analyze client requirements carefully
2. Identify the best technology stack
3. Generate a professional, detailed proposal

Writing Style:
- Professional but friendly and conversational
- Use simple language, avoid jargon
- Be specific with timelines and costs
- Show understanding of client needs
- Structure: Executive Summary → Understanding → Solution → Technical → Timeline → Pricing → Next Steps

Rules:
- Always base estimates on similar past projects
- Be realistic with timelines
- Explain WHY you chose a particular tech stack
- Include specific features, not generic statements
- Make it sound human, not robotic
- Use the client's language/terminology from their requirements

Output Format:
Return a complete proposal in Markdown format with proper headings and structure.`;

  const userPrompt = `Generate a professional proposal for:

Client Name: ${request.client_name}
${request.client_email ? `Client Email: ${request.client_email}` : ''}

Requirements:
${request.requirements}

Project Type: ${projectType}
Complexity: ${complexity}
Estimated Cost: $${estimate.cost}
Estimated Timeline: ${estimate.timelineWeeks} weeks

${techStackContext ? `\n${techStackContext}\n` : ''}

${similarProposalsContext ? `\nSimilar Past Proposals for Reference:\n${similarProposalsContext}\n` : ''}

${templateContent ? `\nTemplate Structure (use as guide, but personalize):\n${templateContent}\n` : ''}

Generate a complete, professional proposal that addresses all requirements. Replace placeholders like {CLIENT_NAME}, {REQUIREMENTS_SUMMARY}, etc. with actual content.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const proposal = response.choices[0]?.message?.content || '';

    return {
      proposal,
      cost_estimate: estimate.cost,
      timeline_weeks: estimate.timelineWeeks,
      project_type: projectType,
      complexity,
      similar_proposals: similarProposals,
    };
  } catch (error) {
    console.error('Error generating proposal:', error);
    throw new Error('Failed to generate proposal. Please try again.');
  }
}
