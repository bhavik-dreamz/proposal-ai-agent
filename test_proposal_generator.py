"""
Basic tests for the proposal generator components.
"""
import unittest
from unittest.mock import Mock, patch, MagicMock
from models import ClientRequirement, CostEstimate, TimelineEstimate
from config import Config


class TestModels(unittest.TestCase):
    """Test data models."""
    
    def test_client_requirement_creation(self):
        """Test creating a ClientRequirement object."""
        req = ClientRequirement(
            project_name="Test Project",
            project_description="A test project description",
            key_features=["Feature 1", "Feature 2"],
            technology_preferences="Python, React",
            target_audience="Developers",
            constraints="Budget: $10,000"
        )
        
        self.assertEqual(req.project_name, "Test Project")
        self.assertEqual(len(req.key_features), 2)
        self.assertEqual(req.technology_preferences, "Python, React")
    
    def test_cost_estimate_creation(self):
        """Test creating a CostEstimate object."""
        cost = CostEstimate(
            development_hours=100.0,
            hourly_rate=100.0,
            base_cost=10000.0,
            overhead_cost=2000.0,
            total_cost=12000.0,
            breakdown={"development": 80, "testing": 20}
        )
        
        self.assertEqual(cost.development_hours, 100.0)
        self.assertEqual(cost.total_cost, 12000.0)
        self.assertEqual(cost.breakdown["development"], 80)
    
    def test_timeline_estimate_creation(self):
        """Test creating a TimelineEstimate object."""
        timeline = TimelineEstimate(
            total_weeks=12.0,
            phases=[
                {"phase": "Planning", "weeks": 2.0, "description": "Planning phase"},
                {"phase": "Development", "weeks": 8.0, "description": "Development phase"}
            ]
        )
        
        self.assertEqual(timeline.total_weeks, 12.0)
        self.assertEqual(len(timeline.phases), 2)
        self.assertEqual(timeline.phases[0]["phase"], "Planning")


class TestConfig(unittest.TestCase):
    """Test configuration."""
    
    def test_config_creation(self):
        """Test creating a Config object."""
        config = Config()
        
        self.assertIsNotNone(config.default_model)
        self.assertIsNotNone(config.hourly_rate)
        self.assertIsNotNone(config.overhead_percentage)
    
    def test_config_validation(self):
        """Test config validation."""
        config = Config()
        # Validation depends on environment variables
        result = config.validate()
        self.assertIsInstance(result, bool)


class TestCostTimelineEstimator(unittest.TestCase):
    """Test cost and timeline estimation."""
    
    def test_default_estimate(self):
        """Test default cost estimation fallback."""
        from cost_timeline_estimator import CostTimelineEstimator
        
        estimator = CostTimelineEstimator.__new__(CostTimelineEstimator)
        
        req = ClientRequirement(
            project_name="Test",
            project_description="Test description",
            key_features=["Feature 1", "Feature 2", "Feature 3"]
        )
        
        result = estimator._default_estimate(req)
        
        self.assertIn('development_hours', result)
        self.assertIn('breakdown', result)
        self.assertGreater(result['development_hours'], 0)
    
    def test_default_timeline(self):
        """Test default timeline estimation fallback."""
        from cost_timeline_estimator import CostTimelineEstimator
        
        estimator = CostTimelineEstimator.__new__(CostTimelineEstimator)
        
        cost = CostEstimate(
            development_hours=160.0,
            hourly_rate=100.0,
            base_cost=16000.0,
            overhead_cost=3200.0,
            total_cost=19200.0,
            breakdown={}
        )
        
        result = estimator._default_timeline(cost)
        
        self.assertIn('total_weeks', result)
        self.assertIn('phases', result)
        self.assertGreater(result['total_weeks'], 0)
        self.assertEqual(len(result['phases']), 5)


class TestFormatter(unittest.TestCase):
    """Test proposal formatting."""
    
    def test_format_text(self):
        """Test text formatting."""
        from formatter import ProposalFormatter
        from models import Proposal
        
        req = ClientRequirement(
            project_name="Test Project",
            project_description="Test description",
            key_features=["Feature 1", "Feature 2"]
        )
        
        cost = CostEstimate(
            development_hours=100.0,
            hourly_rate=100.0,
            base_cost=10000.0,
            overhead_cost=2000.0,
            total_cost=12000.0,
            breakdown={}
        )
        
        timeline = TimelineEstimate(
            total_weeks=8.0,
            phases=[{"phase": "Development", "weeks": 8.0}]
        )
        
        proposal = Proposal(
            client_requirements=req,
            executive_summary="Test summary",
            technical_approach="Test approach",
            project_scope="Test scope",
            cost_estimate=cost,
            timeline_estimate=timeline,
            risk_assessment="Test risks",
            team_structure="Test team",
            deliverables=["Deliverable 1", "Deliverable 2"]
        )
        
        formatter = ProposalFormatter()
        text = formatter.format_text(proposal)
        
        self.assertIn("Test Project", text)
        self.assertIn("EXECUTIVE SUMMARY", text)
        self.assertIn("$12,000.00", text)
    
    def test_format_markdown(self):
        """Test Markdown formatting."""
        from formatter import ProposalFormatter
        from models import Proposal
        
        req = ClientRequirement(
            project_name="Test Project",
            project_description="Test description",
            key_features=["Feature 1"]
        )
        
        cost = CostEstimate(
            development_hours=50.0,
            hourly_rate=100.0,
            base_cost=5000.0,
            overhead_cost=1000.0,
            total_cost=6000.0,
            breakdown={}
        )
        
        timeline = TimelineEstimate(
            total_weeks=4.0,
            phases=[{"phase": "Development", "weeks": 4.0}]
        )
        
        proposal = Proposal(
            client_requirements=req,
            executive_summary="Summary",
            technical_approach="Approach",
            project_scope="Scope",
            cost_estimate=cost,
            timeline_estimate=timeline,
            risk_assessment="Risks",
            team_structure="Team",
            deliverables=["Deliverable 1"]
        )
        
        formatter = ProposalFormatter()
        markdown = formatter.format_markdown(proposal)
        
        self.assertIn("# Project Proposal: Test Project", markdown)
        self.assertIn("## Executive Summary", markdown)
        self.assertIn("$6,000.00", markdown)


if __name__ == '__main__':
    unittest.main()
