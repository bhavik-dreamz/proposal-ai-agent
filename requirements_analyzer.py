"""
Requirements analyzer using OpenAI GPT-4 to analyze and structure client requirements.
"""
from typing import List, Dict, Any
from openai import OpenAI
from config import config
from models import ClientRequirement


class RequirementsAnalyzer:
    """Analyzes client requirements using AI."""
    
    def __init__(self):
        """Initialize the requirements analyzer."""
        if not config.validate():
            raise ValueError("OpenAI API key not configured. Please set OPENAI_API_KEY in .env file")
        self.client = OpenAI(api_key=config.openai_api_key)
    
    def analyze_requirements(self, raw_requirements: str) -> ClientRequirement:
        """
        Analyze raw client requirements and extract structured information.
        
        Args:
            raw_requirements: Raw text containing client requirements
            
        Returns:
            ClientRequirement object with structured data
        """
        prompt = f"""
        Analyze the following client requirements and extract structured information:
        
        Requirements:
        {raw_requirements}
        
        Extract and provide the following information in a structured format:
        1. Project Name
        2. Project Description (clear and concise)
        3. Key Features (list of main features)
        4. Technology Preferences (if mentioned)
        5. Target Audience (if mentioned)
        6. Constraints (budget, timeline, etc. if mentioned)
        
        Provide your response in the following format:
        PROJECT_NAME: [name]
        PROJECT_DESCRIPTION: [description]
        KEY_FEATURES:
        - [feature 1]
        - [feature 2]
        ...
        TECHNOLOGY_PREFERENCES: [preferences or "Not specified"]
        TARGET_AUDIENCE: [audience or "Not specified"]
        CONSTRAINTS: [constraints or "Not specified"]
        """
        
        response = self.client.chat.completions.create(
            model=config.default_model,
            messages=[
                {"role": "system", "content": "You are an expert business analyst helping to structure client requirements for IT projects."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        analysis = response.choices[0].message.content
        return self._parse_analysis(analysis, raw_requirements)
    
    def _parse_analysis(self, analysis: str, raw_requirements: str) -> ClientRequirement:
        """Parse the AI analysis into a ClientRequirement object."""
        lines = analysis.split('\n')
        data = {
            'project_name': '',
            'project_description': '',
            'key_features': [],
            'technology_preferences': None,
            'target_audience': None,
            'constraints': None
        }
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if line.startswith('PROJECT_NAME:'):
                data['project_name'] = line.split(':', 1)[1].strip()
            elif line.startswith('PROJECT_DESCRIPTION:'):
                data['project_description'] = line.split(':', 1)[1].strip()
            elif line.startswith('KEY_FEATURES:'):
                current_section = 'features'
            elif line.startswith('TECHNOLOGY_PREFERENCES:'):
                pref = line.split(':', 1)[1].strip()
                data['technology_preferences'] = None if pref == "Not specified" else pref
                current_section = None
            elif line.startswith('TARGET_AUDIENCE:'):
                audience = line.split(':', 1)[1].strip()
                data['target_audience'] = None if audience == "Not specified" else audience
                current_section = None
            elif line.startswith('CONSTRAINTS:'):
                constraints = line.split(':', 1)[1].strip()
                data['constraints'] = None if constraints == "Not specified" else constraints
                current_section = None
            elif line.startswith('-') and current_section == 'features':
                feature = line[1:].strip()
                if feature:
                    data['key_features'].append(feature)
        
        # Fallback if parsing failed
        if not data['project_name']:
            data['project_name'] = "IT Project"
        if not data['project_description']:
            data['project_description'] = raw_requirements[:500]
        
        return ClientRequirement(**data)
    
    def enhance_requirements(self, requirements: ClientRequirement) -> Dict[str, Any]:
        """
        Enhance requirements with additional insights and recommendations.
        
        Args:
            requirements: Structured client requirements
            
        Returns:
            Dictionary with enhanced insights
        """
        prompt = f"""
        Based on the following project requirements, provide additional insights:
        
        Project: {requirements.project_name}
        Description: {requirements.project_description}
        Key Features: {', '.join(requirements.key_features)}
        
        Provide:
        1. Recommended technologies and tools
        2. Potential challenges
        3. Best practices to consider
        4. Similar project examples
        """
        
        response = self.client.chat.completions.create(
            model=config.default_model,
            messages=[
                {"role": "system", "content": "You are an expert IT consultant providing insights on project requirements."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        
        return {
            'insights': response.choices[0].message.content
        }
