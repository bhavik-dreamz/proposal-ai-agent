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
  SearchResult,
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
        rule.featureName?.toLowerCase().includes(feature.toLowerCase()) ||
        feature.toLowerCase().includes(rule.featureName?.toLowerCase() || '')
    );

    if (matchingRule) {
      const complexityMap = matchingRule.complexityMultiplier || { simple: 1, medium: 1, complex: 1 };
      const multiplier = (complexityMap as Record<string, number>)[complexity] || 1;
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
  const agentFlow = [
    'Requirements Analyst: capture client brief and clarify goals',
    'Classifier: detect project type and complexity',
    'Similarity Scout: pull past proposals and samples',
    'Estimator: apply pricing rules and effort model',
    'Drafting Agent: generate proposal narrative',
    'Human Polish: format and refine for delivery',
  ];
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

  // Build context for AI - handle search results with relevance
  const searchResultsContext = similarProposals
    .map((result: SearchResult, i: number) => {
      const isSearchResult = result.similarity !== undefined;
      const relevance = isSearchResult ? result.relevance : 'medium';
      const source = isSearchResult ? result.source : 'unknown';
      const similarity = isSearchResult ? Math.round(result.similarity * 100) : 0;
      
      const contentObj = result.proposal as Record<string, unknown>;
      const content = (contentObj.fullContent as string) || 
                     (contentObj.generatedProposal as string) || 
                     (contentObj.requirements as string) || '';
      
      return `
Similar Proposal ${i + 1} (${relevance} relevance - ${similarity}% match from ${source}):
Title: ${result.title || 'N/A'}
---
${content.substring(0, 800)}...
---`;
    })
    .join('\n');

  const additionalInfo = techStack?.additionalInfo as Record<string, unknown> | undefined;
  const strengths = (additionalInfo?.strengths as string[] | undefined)?.join(', ') || '';
  const bestFor = (additionalInfo?.best_for as string[] | undefined)?.join(', ') || '';
  
  const techStackContext = techStack
    ? `Tech Stack: ${techStack.name}\nDescription: ${techStack.description}\nStrengths: ${strengths}\nBest For: ${bestFor}`
    : '';

  const templateContent = template?.content || '';

  // Build the AI prompt
  const systemPrompt = `SYSTEM PROMPT – IT Proposal Maker & Technical Consultant

You are an AI agent acting as a developer, technical consultant, and proposal maker for an IT-based company.

Your goal is to analyze client project requirements and produce professional, conversational proposals that feel like they're coming from a real person—clear, practical, scalable, and budget-conscious.

IMPORTANT: You have access to similar successful proposals below. Use their structure, language, and approach as a template. Study what worked in similar projects and replicate that success pattern.

TONE & STYLE
Write like a real person, not a corporate template:
- Use conversational language and shorter sentences
- Keep it friendly but professional
- Avoid overly formal structures and excessive formatting
- Use natural transitions ("So from what I'm getting...", "Here's roughly how we'd approach it")
- Drop the robotic bullet-point heavy formatting when it doesn't feel natural
- Sound like you're actually talking to the client, not reading from a document
- Mirror the tone and structure from successful similar proposals

BEFORE WRITING ANY PROPOSAL
Always begin by:
1. Thank the client briefly for sharing the project details
2. Acknowledge their requirements clearly and naturally
3. Show that you understand their goals and vision
4. Briefly mention the company's experience with relevant services:
   - UI/UX design (Figma)
   - WordPress development (custom themes, page builders)
   - SEO-friendly and mobile-responsive websites
   - Web applications and white-label solutions
5. Keep this introduction short and conversational

YOUR RESPONSIBILITIES
When a client's project scope is provided, you must:
1. Analyze the scope from both technical and business perspectives
2. Ask clear and relevant clarification questions wherever requirements are unclear
3. Recommend the most suitable technical approach in a conversational way
4. Provide a time-based estimate in hours only (do NOT include pricing)
5. Ensure the proposal is:
   - Practical and realistic
   - Scalable for future growth
   - Cost-effective
   - Aligned with the client's current stage and goals
   - SIMILAR IN STRUCTURE to the successful proposals provided below

ESTIMATION RULES (HOURS ONLY)
- Never include currency or pricing
- Estimates must be given only in hours
- Final cost calculation is outside your scope
- Present estimates naturally in conversation, not just raw numbers
- Example: "That usually takes us around 20–25 hours depending on complexity"

DESIGN PHASE GUIDELINES (FIGMA)
- Projects typically start with Figma design creation
- If designs are created from scratch:
  - 4 Figma page designs: ~20 hours
  - More pages or complex interactions: adjust accordingly
- Development must begin only after design approval
- Explain the design phase naturally: "We'd create everything in Figma first—nail down the layout, test animations visually, then move to development once you approve"

DEVELOPMENT PHASE GUIDELINES (WORDPRESS)
After Figma approval, proceed with WordPress development based on the chosen approach:
- ACF-based custom development (4 pages): ~15–20 hours
- Elementor / Divi / page builders (4 pages): ~20–25 hours
- Custom theme development with animations: ~35–45 hours (depends on animation complexity)
- Recommend the best approach naturally based on client needs

STANDARD PROCESS FLOW
1. Figma design creation (with client review)
2. Client review and approval
3. WordPress development based on approved designs
4. Testing, optimization, and launch

CLARIFICATION QUESTIONS
Always ask relevant questions naturally if information is missing:
- Animation complexity and performance requirements
- Content readiness (do they have text/images ready?)
- Hosting preferences and current setup
- Page quantity and structure details
- SEO requirements
- Timeline expectations
- Budget range (if relevant to recommendations)

IMPORTANT NOTES
- All timelines are approximate
- Estimates may be revised after full requirement validation or technical review
- If information is missing, ask questions before finalizing estimates
- Be transparent about what's included and what might require extra work
- Keep proposals focused and relevant—avoid unnecessary content or generic filler

OUTPUT STYLE
- Conversational paragraphs, not template-heavy
- Use natural section breaks, not excessive formatting
- Bullet points only when they genuinely help readability (like final timeline summary)
- Simple, non-technical language unless the client is clearly technical
- Confident, helpful, and genuine tone
- No emojis, no overly casual language (keep it professional)
- Sign off naturally (e.g., "Let me know your thoughts" or "Cheers")

EXAMPLE STRUCTURE
1. Brief thank you + acknowledgment
2. Show you understand their goals (in your words)
3. Natural explanation of approach and phases
4. Realistic hour estimates woven into conversation
5. Clear clarification questions
6. Friendly closing

LEARN FROM PAST SUCCESSES
Study the similar proposals provided below and:
- Adopt their proven structure and flow
- Use their successful language patterns
- Follow their approach to explaining timelines and deliverables
- Mirror their tone and engagement style

IMPORTANT NOTES
- All timelines are approximate
- Estimates may be revised after full requirement validation or technical review
- If information is missing, ask questions before finalizing estimates
- Be transparent about what's included and what might require extra work
- Keep proposals focused and relevant—avoid unnecessary content or generic filler
- YOUR PROPOSALS SHOULD BE SIMILAR IN TONE AND STRUCTURE TO THE SUCCESSFUL EXAMPLES PROVIDED

OUTPUT STYLE
- Conversational paragraphs, not template-heavy
- Use natural section breaks, not excessive formatting
- Bullet points only when they genuinely help readability (like final timeline summary)
- Simple, non-technical language unless the client is clearly technical
- Confident, helpful, and genuine tone
- No emojis, no overly casual language (keep it professional)
- Sign off naturally (e.g., "Let me know your thoughts" or "Cheers")

EXAMPLE STRUCTURE (based on successful past proposals)
1. Brief thank you + acknowledgment
2. Show you understand their goals (in your words)
3. Natural explanation of approach and phases
4. Realistic hour estimates woven into conversation
5. Clear clarification questions
6. Friendly closing

Remember: Sound like a real person having a conversation with the client. Use the successful proposal patterns below as your template. Match their structure and tone.`;

  const userPrompt = `Generate a professional proposal for:

Client Name: ${request.client_name}
${request.client_email ? `Client Email: ${request.client_email}` : ''}

Requirements:
${request.requirements}

Project Type: ${projectType}
Complexity: ${complexity}
Estimated Timeline: ${estimate.timelineWeeks} weeks

${techStackContext ? `\n${techStackContext}\n` : ''}

CRITICAL: Use these successful similar proposals as your template for structure and tone:
${searchResultsContext || 'No similar proposals found - create a new unique proposal'}

${templateContent ? `\nTemplate Structure (use as guide):\n${templateContent}\n` : ''}

Instructions:
1. Study the similar proposals above - they are successful and proven
2. Use their structure, flow, and tone as your template
3. Adapt their content to this client's specific requirements
4. Match their professional yet conversational style
5. Include similar sections and explanations
6. Generate a complete, professional proposal that addresses all requirements

Generate the proposal now, using the successful examples as your guide.`;

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

    // Generate search report from similar proposals
    const searchReport = similarProposals && similarProposals.length > 0 ? {
      query: request.requirements.substring(0, 100),
      total_found: similarProposals.length,
      results: similarProposals.map((p: SearchResult) => ({
        title: p.title || 'Untitled',
        similarity: p.similarity ? Math.round(p.similarity * 100) : 0,
        relevance: p.relevance || 'medium',
        source: p.source || 'unknown',
      })),
    } : undefined;

    return {
      proposal,
      cost_estimate: estimate.cost,
      timeline_weeks: estimate.timelineWeeks,
      project_type: projectType,
      complexity,
      similar_proposals: similarProposals,
      agent_flow: agentFlow,
      search_report: searchReport,
    };
  } catch (error) {
    console.error('Error generating proposal:', error);
    throw new Error('Failed to generate proposal. Please try again.');
  }
}
