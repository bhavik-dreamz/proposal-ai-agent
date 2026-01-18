"""
Cost and timeline estimator for IT projects.
"""
from typing import Dict, Any, List
from datetime import datetime, timedelta
from openai import OpenAI
from config import config
from models import ClientRequirement, CostEstimate, TimelineEstimate
import json


class CostTimelineEstimator:
    """Estimates project cost and timeline using AI analysis."""
    
    def __init__(self):
        """Initialize the estimator."""
        if not config.validate():
            raise ValueError("OpenAI API key not configured. Please set OPENAI_API_KEY in .env file")
        self.client = OpenAI(api_key=config.openai_api_key)
    
    def estimate_cost(self, requirements: ClientRequirement) -> CostEstimate:
        """
        Estimate project cost based on requirements.
        
        Args:
            requirements: Client requirements
            
        Returns:
            CostEstimate with detailed breakdown
        """
        prompt = f"""
        Estimate the development cost for the following IT project:
        
        Project: {requirements.project_name}
        Description: {requirements.project_description}
        Key Features: {', '.join(requirements.key_features)}
        Technology: {requirements.technology_preferences or 'Standard web technologies'}
        
        Provide estimates for:
        1. Total development hours
        2. Breakdown by component/feature (in hours)
        3. Testing and QA hours
        4. Deployment and setup hours
        5. Documentation hours
        
        Format your response as JSON with this structure:
        {{
            "development_hours": <total_hours>,
            "breakdown": {{
                "feature_development": <hours>,
                "backend_api": <hours>,
                "frontend_ui": <hours>,
                "database_design": <hours>,
                "testing_qa": <hours>,
                "deployment": <hours>,
                "documentation": <hours>
            }}
        }}
        """
        
        response = self.client.chat.completions.create(
            model=config.default_model,
            messages=[
                {"role": "system", "content": "You are an expert IT project manager with extensive experience in cost estimation. Provide realistic estimates based on industry standards."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        # Parse response
        try:
            content = response.choices[0].message.content
            # Extract JSON from response
            start = content.find('{')
            end = content.rfind('}') + 1
            if start >= 0 and end > start:
                json_str = content[start:end]
                estimate_data = json.loads(json_str)
            else:
                # Fallback to default estimates
                estimate_data = self._default_estimate(requirements)
        except (json.JSONDecodeError, Exception):
            estimate_data = self._default_estimate(requirements)
        
        development_hours = estimate_data.get('development_hours', 160)
        breakdown = estimate_data.get('breakdown', {})
        
        # Calculate costs
        base_cost = development_hours * config.hourly_rate
        overhead_cost = base_cost * (config.overhead_percentage / 100)
        total_cost = base_cost + overhead_cost
        
        return CostEstimate(
            development_hours=development_hours,
            hourly_rate=config.hourly_rate,
            base_cost=base_cost,
            overhead_cost=overhead_cost,
            total_cost=total_cost,
            breakdown=breakdown
        )
    
    def estimate_timeline(self, requirements: ClientRequirement, cost_estimate: CostEstimate) -> TimelineEstimate:
        """
        Estimate project timeline based on requirements and cost.
        
        Args:
            requirements: Client requirements
            cost_estimate: Cost estimate
            
        Returns:
            TimelineEstimate with phases
        """
        prompt = f"""
        Create a project timeline for the following IT project:
        
        Project: {requirements.project_name}
        Total Development Hours: {cost_estimate.development_hours}
        
        Assuming a team of 2-3 developers working simultaneously, break down the project into phases:
        1. Planning and Design
        2. Development (with iterations)
        3. Testing and QA
        4. Deployment and Launch
        5. Post-launch Support
        
        Provide the timeline as JSON:
        {{
            "total_weeks": <total_weeks>,
            "phases": [
                {{"phase": "Planning and Design", "weeks": <weeks>, "description": "<brief_description>"}},
                {{"phase": "Development", "weeks": <weeks>, "description": "<brief_description>"}},
                {{"phase": "Testing and QA", "weeks": <weeks>, "description": "<brief_description>"}},
                {{"phase": "Deployment", "weeks": <weeks>, "description": "<brief_description>"}},
                {{"phase": "Post-launch Support", "weeks": <weeks>, "description": "<brief_description>"}}
            ]
        }}
        """
        
        response = self.client.chat.completions.create(
            model=config.default_model,
            messages=[
                {"role": "system", "content": "You are an expert project manager creating realistic project timelines for IT projects."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        # Parse response
        try:
            content = response.choices[0].message.content
            start = content.find('{')
            end = content.rfind('}') + 1
            if start >= 0 and end > start:
                json_str = content[start:end]
                timeline_data = json.loads(json_str)
            else:
                timeline_data = self._default_timeline(cost_estimate)
        except (json.JSONDecodeError, Exception):
            timeline_data = self._default_timeline(cost_estimate)
        
        total_weeks = timeline_data.get('total_weeks', 12)
        phases = timeline_data.get('phases', [])
        
        return TimelineEstimate(
            total_weeks=total_weeks,
            phases=phases
        )
    
    def _default_estimate(self, requirements: ClientRequirement) -> Dict[str, Any]:
        """Provide default cost estimate when AI fails."""
        num_features = len(requirements.key_features) or 5
        base_hours = num_features * 20
        
        return {
            'development_hours': base_hours,
            'breakdown': {
                'feature_development': base_hours * 0.5,
                'backend_api': base_hours * 0.15,
                'frontend_ui': base_hours * 0.15,
                'testing_qa': base_hours * 0.1,
                'deployment': base_hours * 0.05,
                'documentation': base_hours * 0.05
            }
        }
    
    def _default_timeline(self, cost_estimate: CostEstimate) -> Dict[str, Any]:
        """Provide default timeline when AI fails."""
        weeks = max(8, cost_estimate.development_hours / 40)
        
        return {
            'total_weeks': weeks,
            'phases': [
                {'phase': 'Planning and Design', 'weeks': weeks * 0.15, 'description': 'Requirements analysis and system design'},
                {'phase': 'Development', 'weeks': weeks * 0.5, 'description': 'Core feature development'},
                {'phase': 'Testing and QA', 'weeks': weeks * 0.2, 'description': 'Quality assurance and testing'},
                {'phase': 'Deployment', 'weeks': weeks * 0.1, 'description': 'Production deployment'},
                {'phase': 'Post-launch Support', 'weeks': weeks * 0.05, 'description': 'Initial support period'}
            ]
        }
