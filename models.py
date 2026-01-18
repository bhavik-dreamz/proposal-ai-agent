"""
Data models for the proposal generator.
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class ClientRequirement(BaseModel):
    """Model for client requirements."""
    project_name: str = Field(..., description="Name of the project")
    project_description: str = Field(..., description="Detailed project description")
    key_features: List[str] = Field(default_factory=list, description="List of key features required")
    technology_preferences: Optional[str] = Field(None, description="Preferred technologies or frameworks")
    target_audience: Optional[str] = Field(None, description="Target users or audience")
    constraints: Optional[str] = Field(None, description="Budget, timeline, or other constraints")


class CostEstimate(BaseModel):
    """Model for cost estimation."""
    development_hours: float = Field(..., description="Estimated development hours")
    hourly_rate: float = Field(..., description="Hourly rate for development")
    base_cost: float = Field(..., description="Base development cost")
    overhead_cost: float = Field(..., description="Overhead and contingency cost")
    total_cost: float = Field(..., description="Total project cost")
    breakdown: dict = Field(default_factory=dict, description="Detailed cost breakdown")


class TimelineEstimate(BaseModel):
    """Model for timeline estimation."""
    total_weeks: float = Field(..., description="Total project duration in weeks")
    phases: List[dict] = Field(default_factory=list, description="Project phases with durations")
    start_date: Optional[str] = Field(None, description="Estimated start date")
    end_date: Optional[str] = Field(None, description="Estimated completion date")


class Proposal(BaseModel):
    """Complete proposal model."""
    client_requirements: ClientRequirement
    executive_summary: str = Field(..., description="Executive summary of the proposal")
    technical_approach: str = Field(..., description="Technical approach and methodology")
    project_scope: str = Field(..., description="Detailed project scope")
    cost_estimate: CostEstimate
    timeline_estimate: TimelineEstimate
    risk_assessment: str = Field(..., description="Risk assessment and mitigation strategies")
    team_structure: str = Field(..., description="Recommended team structure")
    deliverables: List[str] = Field(default_factory=list, description="Project deliverables")
