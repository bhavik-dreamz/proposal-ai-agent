"""
Main proposal generator that orchestrates all components.
"""
from typing import Dict, Any
from openai import OpenAI
from config import config
from models import ClientRequirement, Proposal
from requirements_analyzer import RequirementsAnalyzer
from cost_timeline_estimator import CostTimelineEstimator
import json


class ProposalGenerator:
    """Main class for generating complete project proposals."""
    
    def __init__(self):
        """Initialize the proposal generator."""
        if not config.validate():
            raise ValueError("OpenAI API key not configured. Please set OPENAI_API_KEY in .env file")
        self.client = OpenAI(api_key=config.openai_api_key)
        self.requirements_analyzer = RequirementsAnalyzer()
        self.estimator = CostTimelineEstimator()
    
    def generate_proposal(self, raw_requirements: str) -> Proposal:
        """
        Generate a complete proposal from raw requirements.
        
        Args:
            raw_requirements: Raw text containing client requirements
            
        Returns:
            Complete Proposal object
        """
        # Step 1: Analyze requirements
        print("🔍 Analyzing client requirements...")
        requirements = self.requirements_analyzer.analyze_requirements(raw_requirements)
        
        # Step 2: Estimate cost
        print("💰 Estimating project cost...")
        cost_estimate = self.estimator.estimate_cost(requirements)
        
        # Step 3: Estimate timeline
        print("📅 Creating project timeline...")
        timeline_estimate = self.estimator.estimate_timeline(requirements, cost_estimate)
        
        # Step 4: Generate proposal sections
        print("📝 Generating proposal content...")
        
        executive_summary = self._generate_executive_summary(requirements, cost_estimate, timeline_estimate)
        technical_approach = self._generate_technical_approach(requirements)
        project_scope = self._generate_project_scope(requirements)
        risk_assessment = self._generate_risk_assessment(requirements)
        team_structure = self._generate_team_structure(requirements, cost_estimate)
        deliverables = self._generate_deliverables(requirements)
        
        proposal = Proposal(
            client_requirements=requirements,
            executive_summary=executive_summary,
            technical_approach=technical_approach,
            project_scope=project_scope,
            cost_estimate=cost_estimate,
            timeline_estimate=timeline_estimate,
            risk_assessment=risk_assessment,
            team_structure=team_structure,
            deliverables=deliverables
        )
        
        print("✅ Proposal generated successfully!")
        return proposal
    
    def _generate_executive_summary(self, requirements: ClientRequirement, cost: Any, timeline: Any) -> str:
        """Generate executive summary."""
        prompt = f"""
        Write a professional executive summary for an IT project proposal:
        
        Project: {requirements.project_name}
        Description: {requirements.project_description}
        Estimated Cost: ${cost.total_cost:,.2f}
        Timeline: {timeline.total_weeks} weeks
        
        The summary should be concise (2-3 paragraphs) and highlight:
        - Project overview and objectives
        - Key benefits and value proposition
        - High-level cost and timeline
        """
        
        response = self.client.chat.completions.create(
            model=config.default_model,
            messages=[
                {"role": "system", "content": "You are an expert proposal writer creating professional executive summaries."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_technical_approach(self, requirements: ClientRequirement) -> str:
        """Generate technical approach section."""
        prompt = f"""
        Describe the technical approach and methodology for:
        
        Project: {requirements.project_name}
        Features: {', '.join(requirements.key_features)}
        Technology Preferences: {requirements.technology_preferences or 'Modern web technologies'}
        
        Include:
        - Development methodology (Agile/Scrum recommended)
        - Technology stack recommendations
        - Architecture approach
        - Development best practices
        """
        
        response = self.client.chat.completions.create(
            model=config.default_model,
            messages=[
                {"role": "system", "content": "You are a senior technical architect describing project approach."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_project_scope(self, requirements: ClientRequirement) -> str:
        """Generate detailed project scope."""
        prompt = f"""
        Define the detailed project scope for:
        
        Project: {requirements.project_name}
        Description: {requirements.project_description}
        Key Features: {', '.join(requirements.key_features)}
        
        Include:
        - In-scope items
        - Out-of-scope items
        - Assumptions
        - Dependencies
        """
        
        response = self.client.chat.completions.create(
            model=config.default_model,
            messages=[
                {"role": "system", "content": "You are a project manager defining clear project scope."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_risk_assessment(self, requirements: ClientRequirement) -> str:
        """Generate risk assessment and mitigation strategies."""
        prompt = f"""
        Identify potential risks and mitigation strategies for:
        
        Project: {requirements.project_name}
        Description: {requirements.project_description}
        
        Provide:
        - Top 5 project risks
        - Impact and likelihood for each
        - Mitigation strategies
        """
        
        response = self.client.chat.completions.create(
            model=config.default_model,
            messages=[
                {"role": "system", "content": "You are a risk management expert analyzing project risks."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_team_structure(self, requirements: ClientRequirement, cost: Any) -> str:
        """Generate recommended team structure."""
        hours = cost.development_hours
        
        prompt = f"""
        Recommend team structure for:
        
        Project: {requirements.project_name}
        Total Hours: {hours}
        
        Suggest:
        - Team size and roles
        - Key responsibilities
        - Collaboration approach
        """
        
        response = self.client.chat.completions.create(
            model=config.default_model,
            messages=[
                {"role": "system", "content": "You are an IT staffing expert recommending team structures."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_deliverables(self, requirements: ClientRequirement) -> list:
        """Generate list of project deliverables."""
        deliverables = [
            f"{requirements.project_name} - Fully functional application",
            "Source code repository with documentation",
            "Technical documentation and API specifications",
            "User documentation and training materials",
            "Deployment and installation guides",
            "Test reports and quality assurance documentation"
        ]
        
        # Add feature-specific deliverables
        for feature in requirements.key_features[:3]:  # Top 3 features
            deliverables.append(f"{feature} - Feature implementation")
        
        return deliverables
