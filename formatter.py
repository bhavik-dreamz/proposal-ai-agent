"""
Formatter for generating human-readable proposal documents.
"""
from models import Proposal
from datetime import datetime


class ProposalFormatter:
    """Formats proposals into readable documents."""
    
    def format_text(self, proposal: Proposal) -> str:
        """
        Format proposal as plain text document.
        
        Args:
            proposal: Proposal object to format
            
        Returns:
            Formatted text document
        """
        lines = []
        lines.append("=" * 80)
        lines.append(f"PROJECT PROPOSAL: {proposal.client_requirements.project_name.upper()}")
        lines.append("=" * 80)
        lines.append("")
        lines.append(f"Generated on: {datetime.now().strftime('%B %d, %Y')}")
        lines.append("")
        
        # Executive Summary
        lines.append("-" * 80)
        lines.append("EXECUTIVE SUMMARY")
        lines.append("-" * 80)
        lines.append(proposal.executive_summary)
        lines.append("")
        
        # Project Requirements
        lines.append("-" * 80)
        lines.append("CLIENT REQUIREMENTS")
        lines.append("-" * 80)
        lines.append(f"Project Name: {proposal.client_requirements.project_name}")
        lines.append(f"Description: {proposal.client_requirements.project_description}")
        lines.append("")
        lines.append("Key Features:")
        for i, feature in enumerate(proposal.client_requirements.key_features, 1):
            lines.append(f"  {i}. {feature}")
        
        if proposal.client_requirements.technology_preferences:
            lines.append(f"\nTechnology Preferences: {proposal.client_requirements.technology_preferences}")
        if proposal.client_requirements.target_audience:
            lines.append(f"Target Audience: {proposal.client_requirements.target_audience}")
        if proposal.client_requirements.constraints:
            lines.append(f"Constraints: {proposal.client_requirements.constraints}")
        lines.append("")
        
        # Technical Approach
        lines.append("-" * 80)
        lines.append("TECHNICAL APPROACH")
        lines.append("-" * 80)
        lines.append(proposal.technical_approach)
        lines.append("")
        
        # Project Scope
        lines.append("-" * 80)
        lines.append("PROJECT SCOPE")
        lines.append("-" * 80)
        lines.append(proposal.project_scope)
        lines.append("")
        
        # Cost Estimate
        lines.append("-" * 80)
        lines.append("COST ESTIMATE")
        lines.append("-" * 80)
        lines.append(f"Development Hours: {proposal.cost_estimate.development_hours:.1f} hours")
        lines.append(f"Hourly Rate: ${proposal.cost_estimate.hourly_rate:.2f}")
        lines.append(f"Base Cost: ${proposal.cost_estimate.base_cost:,.2f}")
        lines.append(f"Overhead & Contingency: ${proposal.cost_estimate.overhead_cost:,.2f}")
        lines.append(f"TOTAL COST: ${proposal.cost_estimate.total_cost:,.2f}")
        lines.append("")
        
        if proposal.cost_estimate.breakdown:
            lines.append("Cost Breakdown:")
            for component, hours in proposal.cost_estimate.breakdown.items():
                cost = hours * proposal.cost_estimate.hourly_rate
                lines.append(f"  - {component.replace('_', ' ').title()}: {hours:.1f} hours (${cost:,.2f})")
            lines.append("")
        
        # Timeline Estimate
        lines.append("-" * 80)
        lines.append("TIMELINE ESTIMATE")
        lines.append("-" * 80)
        lines.append(f"Total Duration: {proposal.timeline_estimate.total_weeks:.1f} weeks")
        lines.append("")
        lines.append("Project Phases:")
        for phase in proposal.timeline_estimate.phases:
            lines.append(f"\n  {phase['phase']}: {phase['weeks']:.1f} weeks")
            if 'description' in phase:
                lines.append(f"    {phase['description']}")
        lines.append("")
        
        # Team Structure
        lines.append("-" * 80)
        lines.append("TEAM STRUCTURE")
        lines.append("-" * 80)
        lines.append(proposal.team_structure)
        lines.append("")
        
        # Risk Assessment
        lines.append("-" * 80)
        lines.append("RISK ASSESSMENT")
        lines.append("-" * 80)
        lines.append(proposal.risk_assessment)
        lines.append("")
        
        # Deliverables
        lines.append("-" * 80)
        lines.append("PROJECT DELIVERABLES")
        lines.append("-" * 80)
        for i, deliverable in enumerate(proposal.deliverables, 1):
            lines.append(f"  {i}. {deliverable}")
        lines.append("")
        
        lines.append("=" * 80)
        lines.append("END OF PROPOSAL")
        lines.append("=" * 80)
        
        return '\n'.join(lines)
    
    def format_markdown(self, proposal: Proposal) -> str:
        """
        Format proposal as Markdown document.
        
        Args:
            proposal: Proposal object to format
            
        Returns:
            Formatted Markdown document
        """
        lines = []
        lines.append(f"# Project Proposal: {proposal.client_requirements.project_name}")
        lines.append("")
        lines.append(f"**Generated on:** {datetime.now().strftime('%B %d, %Y')}")
        lines.append("")
        lines.append("---")
        lines.append("")
        
        # Executive Summary
        lines.append("## Executive Summary")
        lines.append("")
        lines.append(proposal.executive_summary)
        lines.append("")
        
        # Client Requirements
        lines.append("## Client Requirements")
        lines.append("")
        lines.append(f"**Project Name:** {proposal.client_requirements.project_name}")
        lines.append("")
        lines.append(f"**Description:** {proposal.client_requirements.project_description}")
        lines.append("")
        lines.append("### Key Features")
        lines.append("")
        for feature in proposal.client_requirements.key_features:
            lines.append(f"- {feature}")
        lines.append("")
        
        if proposal.client_requirements.technology_preferences:
            lines.append(f"**Technology Preferences:** {proposal.client_requirements.technology_preferences}")
            lines.append("")
        if proposal.client_requirements.target_audience:
            lines.append(f"**Target Audience:** {proposal.client_requirements.target_audience}")
            lines.append("")
        
        # Technical Approach
        lines.append("## Technical Approach")
        lines.append("")
        lines.append(proposal.technical_approach)
        lines.append("")
        
        # Project Scope
        lines.append("## Project Scope")
        lines.append("")
        lines.append(proposal.project_scope)
        lines.append("")
        
        # Cost Estimate
        lines.append("## Cost Estimate")
        lines.append("")
        lines.append(f"- **Development Hours:** {proposal.cost_estimate.development_hours:.1f} hours")
        lines.append(f"- **Hourly Rate:** ${proposal.cost_estimate.hourly_rate:.2f}")
        lines.append(f"- **Base Cost:** ${proposal.cost_estimate.base_cost:,.2f}")
        lines.append(f"- **Overhead & Contingency:** ${proposal.cost_estimate.overhead_cost:,.2f}")
        lines.append(f"- **TOTAL COST:** ${proposal.cost_estimate.total_cost:,.2f}")
        lines.append("")
        
        if proposal.cost_estimate.breakdown:
            lines.append("### Cost Breakdown")
            lines.append("")
            for component, hours in proposal.cost_estimate.breakdown.items():
                cost = hours * proposal.cost_estimate.hourly_rate
                lines.append(f"- **{component.replace('_', ' ').title()}:** {hours:.1f} hours (${cost:,.2f})")
            lines.append("")
        
        # Timeline
        lines.append("## Timeline Estimate")
        lines.append("")
        lines.append(f"**Total Duration:** {proposal.timeline_estimate.total_weeks:.1f} weeks")
        lines.append("")
        lines.append("### Project Phases")
        lines.append("")
        for phase in proposal.timeline_estimate.phases:
            lines.append(f"#### {phase['phase']} ({phase['weeks']:.1f} weeks)")
            if 'description' in phase:
                lines.append(f"{phase['description']}")
            lines.append("")
        
        # Team Structure
        lines.append("## Team Structure")
        lines.append("")
        lines.append(proposal.team_structure)
        lines.append("")
        
        # Risk Assessment
        lines.append("## Risk Assessment")
        lines.append("")
        lines.append(proposal.risk_assessment)
        lines.append("")
        
        # Deliverables
        lines.append("## Project Deliverables")
        lines.append("")
        for deliverable in proposal.deliverables:
            lines.append(f"- {deliverable}")
        lines.append("")
        
        lines.append("---")
        lines.append("")
        lines.append("*End of Proposal*")
        
        return '\n'.join(lines)
    
    def save_to_file(self, proposal: Proposal, filename: str, format: str = 'text') -> str:
        """
        Save proposal to a file.
        
        Args:
            proposal: Proposal object
            filename: Output filename
            format: 'text' or 'markdown'
            
        Returns:
            Path to saved file
        """
        if format == 'markdown':
            content = self.format_markdown(proposal)
            if not filename.endswith('.md'):
                filename += '.md'
        else:
            content = self.format_text(proposal)
            if not filename.endswith('.txt'):
                filename += '.txt'
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return filename
