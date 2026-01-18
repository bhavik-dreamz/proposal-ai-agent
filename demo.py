#!/usr/bin/env python3
"""
Demo script to showcase the proposal generator's structure and capabilities.
This demo uses mock data to demonstrate functionality without requiring an API key.
"""
from models import ClientRequirement, CostEstimate, TimelineEstimate, Proposal
from formatter import ProposalFormatter


def create_demo_proposal():
    """Create a demo proposal using sample data."""
    
    # Sample client requirements
    requirements = ClientRequirement(
        project_name="E-Commerce Platform Redesign",
        project_description="Modernize existing e-commerce platform to improve user experience, increase conversion rates, and support mobile shopping.",
        key_features=[
            "Responsive web design optimized for mobile and desktop",
            "Product catalog with advanced search and filtering",
            "Shopping cart and secure checkout process",
            "User account management and order history",
            "Payment gateway integration (Stripe, PayPal)",
            "Real-time inventory tracking",
            "Admin dashboard for product and order management",
            "Email notifications for order confirmations",
            "Product recommendations using AI",
            "Multi-language support"
        ],
        technology_preferences="React for frontend, Node.js for backend, PostgreSQL database, AWS cloud hosting",
        target_audience="Online shoppers aged 18-65, primarily mobile users",
        constraints="Budget of $50,000, timeline of 4 months, must integrate with existing SAP system"
    )
    
    # Sample cost estimate
    cost_estimate = CostEstimate(
        development_hours=320.0,
        hourly_rate=100.0,
        base_cost=32000.0,
        overhead_cost=6400.0,
        total_cost=38400.0,
        breakdown={
            "feature_development": 160.0,
            "backend_api": 48.0,
            "frontend_ui": 48.0,
            "database_design": 16.0,
            "testing_qa": 32.0,
            "deployment": 10.0,
            "documentation": 6.0
        }
    )
    
    # Sample timeline estimate
    timeline_estimate = TimelineEstimate(
        total_weeks=16.0,
        phases=[
            {
                "phase": "Planning and Design",
                "weeks": 2.4,
                "description": "Requirements analysis, system architecture design, and UI/UX wireframing"
            },
            {
                "phase": "Development",
                "weeks": 8.0,
                "description": "Core feature implementation including frontend, backend, and database development"
            },
            {
                "phase": "Testing and QA",
                "weeks": 3.2,
                "description": "Comprehensive testing including unit tests, integration tests, and user acceptance testing"
            },
            {
                "phase": "Deployment",
                "weeks": 1.6,
                "description": "Production deployment, data migration, and system integration"
            },
            {
                "phase": "Post-launch Support",
                "weeks": 0.8,
                "description": "Initial monitoring, bug fixes, and user support"
            }
        ]
    )
    
    # Sample proposal content
    executive_summary = """
This proposal outlines the comprehensive redesign and modernization of your e-commerce platform. 
The project aims to enhance user experience, improve conversion rates, and ensure seamless mobile 
shopping capabilities. By leveraging modern technologies and best practices, we will deliver a 
scalable, high-performance platform that meets your business objectives.

The proposed solution will integrate with your existing SAP system while introducing cutting-edge 
features such as AI-powered product recommendations, real-time inventory tracking, and a responsive 
design optimized for all devices. With an estimated investment of $38,400 and a 16-week timeline, 
this project represents excellent value and positions your business for continued growth in the 
competitive e-commerce landscape.
"""
    
    technical_approach = """
**Development Methodology:**
We recommend an Agile/Scrum approach with 2-week sprints, allowing for iterative development and 
continuous feedback integration.

**Technology Stack:**
- Frontend: React.js with TypeScript for type safety and better maintainability
- Backend: Node.js with Express framework for RESTful API development
- Database: PostgreSQL for robust data management with Redis for caching
- Cloud Infrastructure: AWS (EC2, S3, RDS, CloudFront)
- Payment Integration: Stripe and PayPal SDKs
- AI/ML: TensorFlow.js for product recommendation engine

**Architecture:**
The platform will follow a microservices architecture pattern, ensuring scalability and maintainability. 
The frontend will communicate with the backend through a well-documented REST API, with JWT-based 
authentication for security.

**Development Best Practices:**
- Version control with Git
- Automated testing (Jest, Mocha)
- Continuous Integration/Continuous Deployment (CI/CD) pipeline
- Code reviews and pair programming
- Comprehensive documentation
"""
    
    project_scope = """
**In Scope:**
- Responsive web application for desktop and mobile browsers
- Product catalog with search, filtering, and sorting capabilities
- Shopping cart and checkout functionality
- Integration with Stripe and PayPal payment gateways
- User authentication and account management
- Order history and tracking
- Admin dashboard for product and order management
- Real-time inventory synchronization with SAP
- Email notification system
- AI-based product recommendations
- Multi-language support (English, Spanish, French)

**Out of Scope:**
- Native mobile applications (iOS/Android apps)
- Custom CRM development
- Physical inventory management
- Third-party seller marketplace features
- Advanced analytics and business intelligence dashboards

**Assumptions:**
- Client will provide existing SAP API documentation and test environment
- Product images and descriptions will be provided by the client
- SSL certificate and domain management are handled by the client
- Client stakeholders are available for regular sprint reviews

**Dependencies:**
- Access to existing SAP system for integration testing
- Timely provision of content and product data
- Client approval at key milestones
"""
    
    risk_assessment = """
**Risk 1: SAP Integration Complexity**
- Impact: High | Likelihood: Medium
- Mitigation: Early technical discovery session with SAP team, dedicated integration testing phase

**Risk 2: Performance Under High Traffic**
- Impact: High | Likelihood: Low
- Mitigation: Load testing, CDN implementation, database optimization, auto-scaling infrastructure

**Risk 3: Payment Gateway Integration Issues**
- Impact: Medium | Likelihood: Low
- Mitigation: Use well-documented SDKs, implement in sandbox environment first, thorough testing

**Risk 4: Scope Creep**
- Impact: Medium | Likelihood: Medium
- Mitigation: Clear change request process, regular stakeholder communication, documented requirements

**Risk 5: Timeline Delays Due to External Dependencies**
- Impact: Medium | Likelihood: Medium
- Mitigation: Early identification of dependencies, buffer time in schedule, parallel workstreams
"""
    
    team_structure = """
**Recommended Team Composition:**

- **Project Manager (0.5 FTE)**: Overall project coordination, stakeholder communication, and delivery oversight
- **Senior Full-Stack Developer (1 FTE)**: Lead developer responsible for architecture and complex features
- **Frontend Developer (1 FTE)**: React development, UI implementation, responsive design
- **Backend Developer (0.5 FTE)**: API development, database design, SAP integration
- **QA Engineer (0.5 FTE)**: Test planning, automated testing, quality assurance
- **UI/UX Designer (0.25 FTE)**: Design system, user experience optimization

**Collaboration Approach:**
- Daily stand-up meetings
- Bi-weekly sprint planning and retrospectives
- Regular demo sessions with stakeholders
- Slack/Teams for real-time communication
- Jira for project tracking and issue management
"""
    
    deliverables = [
        "Fully functional e-commerce web application",
        "Source code repository with comprehensive documentation",
        "Technical architecture documentation",
        "API documentation (OpenAPI/Swagger)",
        "User manual and training materials",
        "Admin guide for platform management",
        "Deployment and installation scripts",
        "Test reports and QA documentation",
        "Performance test results",
        "Security audit report",
        "Post-launch support plan"
    ]
    
    # Create proposal
    proposal = Proposal(
        client_requirements=requirements,
        executive_summary=executive_summary.strip(),
        technical_approach=technical_approach.strip(),
        project_scope=project_scope.strip(),
        cost_estimate=cost_estimate,
        timeline_estimate=timeline_estimate,
        risk_assessment=risk_assessment.strip(),
        team_structure=team_structure.strip(),
        deliverables=deliverables
    )
    
    return proposal


def main():
    """Run the demo."""
    print("=" * 80)
    print("  PROPOSAL GENERATOR DEMO")
    print("  Showcasing capabilities with sample data")
    print("=" * 80)
    print()
    
    # Create demo proposal
    print("📋 Creating demo proposal for E-Commerce Platform Redesign...")
    proposal = create_demo_proposal()
    
    # Format as text
    print("✅ Proposal created successfully!")
    print()
    
    formatter = ProposalFormatter()
    
    # Save text version
    text_file = formatter.save_to_file(proposal, "demo_proposal.txt", format="text")
    print(f"📄 Text proposal saved to: {text_file}")
    
    # Save markdown version
    md_file = formatter.save_to_file(proposal, "demo_proposal.md", format="markdown")
    print(f"📝 Markdown proposal saved to: {md_file}")
    
    print()
    print("=" * 80)
    print("📊 PROPOSAL SUMMARY")
    print("=" * 80)
    print(f"Project Name: {proposal.client_requirements.project_name}")
    print(f"Key Features: {len(proposal.client_requirements.key_features)}")
    print(f"Development Hours: {proposal.cost_estimate.development_hours:.1f} hours")
    print(f"Total Cost: ${proposal.cost_estimate.total_cost:,.2f}")
    print(f"Timeline: {proposal.timeline_estimate.total_weeks:.1f} weeks")
    print(f"Phases: {len(proposal.timeline_estimate.phases)}")
    print(f"Deliverables: {len(proposal.deliverables)}")
    print()
    
    print("✨ Demo completed! Check the generated files for full proposal content.")
    print()


if __name__ == '__main__':
    main()
