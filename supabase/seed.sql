-- Insert Tech Stacks
INSERT INTO tech_stacks (name, description, typical_features, base_cost, cost_per_feature, base_timeline_weeks, additional_info) VALUES
('MERN', 'MongoDB, Express, React, Node.js - Full stack JavaScript', 
 '["User Authentication", "RESTful API", "Admin Dashboard", "Database Design", "Responsive UI"]'::jsonb,
 5000, 500, 8,
 '{"strengths": ["Fast development", "Modern UI", "Scalable"], "best_for": ["Web apps", "SaaS", "Dashboards"]}'::jsonb),

('WordPress', 'Content Management System with PHP', 
 '["Custom Theme", "Plugin Integration", "SEO Optimization", "Blog", "Contact Forms"]'::jsonb,
 2500, 300, 4,
 '{"strengths": ["Easy to manage", "SEO friendly", "Large ecosystem"], "best_for": ["Blogs", "Business websites", "Portfolios"]}'::jsonb),

('Shopify', 'E-commerce platform', 
 '["Product Catalog", "Shopping Cart", "Payment Gateway", "Inventory Management", "Order Tracking"]'::jsonb,
 4000, 400, 6,
 '{"strengths": ["Quick setup", "Secure payments", "Mobile optimized"], "best_for": ["Online stores", "E-commerce"]}'::jsonb),

('PHP', 'Custom PHP development', 
 '["Custom Backend", "Database Design", "API Development", "CMS Integration"]'::jsonb,
 4500, 450, 7,
 '{"strengths": ["Highly customizable", "Wide hosting support"], "best_for": ["Custom solutions", "Legacy systems"]}'::jsonb),

('MEAN', 'MongoDB, Express, Angular, Node.js', 
 '["Single Page Application", "RESTful API", "Real-time Features", "Admin Panel"]'::jsonb,
 5500, 550, 9,
 '{"strengths": ["Enterprise ready", "TypeScript support"], "best_for": ["Enterprise apps", "Complex SPAs"]}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Insert Sample Template
INSERT INTO templates (name, project_type, description, content, sections) VALUES
('Standard E-commerce Proposal', 'Shopify', 'Template for Shopify e-commerce projects',
'# Proposal: E-commerce Website for {CLIENT_NAME}

## Executive Summary
Thank you for considering us for your e-commerce project. We understand your need for a professional online store that drives sales and provides excellent customer experience.

## Our Understanding
Based on our discussion, you need:
{REQUIREMENTS_SUMMARY}

## Recommended Solution
We propose building your store on Shopify platform because:
- Perfect for product-based businesses
- Built-in payment processing
- Excellent mobile experience
- Strong SEO capabilities
- Easy for you to manage

## Technical Approach
**Platform:** Shopify
**Key Features:**
{FEATURES_LIST}

## Timeline
**Total Duration:** {TIMELINE} weeks
{MILESTONE_BREAKDOWN}

## Investment
**Total Cost:** ${COST}
{COST_BREAKDOWN}

## Next Steps
1. Approve proposal
2. 50% advance payment
3. Kickoff meeting
4. Start development

Looking forward to working with you!',
'{"sections": ["executive_summary", "understanding", "solution", "technical", "timeline", "pricing", "next_steps"]}'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert Pricing Rules
INSERT INTO pricing_rules (feature_name, project_type, base_cost, time_hours, complexity_multiplier) VALUES
('User Authentication', 'MERN', 800, 16, '{"simple": 1, "medium": 1.3, "complex": 1.8}'::jsonb),
('Payment Gateway', 'Shopify', 600, 12, '{"simple": 1, "medium": 1.5, "complex": 2}'::jsonb),
('Admin Dashboard', 'MERN', 1200, 24, '{"simple": 1, "medium": 1.5, "complex": 2.5}'::jsonb),
('Product Catalog', 'Shopify', 800, 16, '{"simple": 1, "medium": 1.4, "complex": 2}'::jsonb),
('Custom Theme', 'WordPress', 1000, 20, '{"simple": 1, "medium": 1.5, "complex": 2}'::jsonb),
('API Integration', 'PHP', 900, 18, '{"simple": 1, "medium": 1.6, "complex": 2.2}'::jsonb)
ON CONFLICT DO NOTHING;
