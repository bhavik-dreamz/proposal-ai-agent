#!/usr/bin/env python3
"""
Command-line interface for the AI-powered proposal generator.
"""
import sys
import argparse
import os
from colorama import init, Fore, Style
from proposal_generator import ProposalGenerator
from formatter import ProposalFormatter
from config import config

# Initialize colorama
init(autoreset=True)


def print_banner():
    """Print application banner."""
    print(Fore.CYAN + "=" * 80)
    print(Fore.CYAN + "  AI-POWERED PROPOSAL GENERATOR FOR IT PROJECT MANAGERS")
    print(Fore.CYAN + "  Powered by OpenAI GPT-4")
    print(Fore.CYAN + "=" * 80)
    print()


def print_error(message: str):
    """Print error message."""
    print(Fore.RED + f"❌ Error: {message}")


def print_success(message: str):
    """Print success message."""
    print(Fore.GREEN + f"✅ {message}")


def print_info(message: str):
    """Print info message."""
    print(Fore.BLUE + f"ℹ️  {message}")


def interactive_mode():
    """Run in interactive mode to collect requirements."""
    print(Fore.YELLOW + "\n📋 Interactive Requirements Collection")
    print(Fore.YELLOW + "-" * 80)
    print()
    
    print("Please provide the following information about your project:")
    print()
    
    project_name = input(Fore.WHITE + "Project Name: ").strip()
    print()
    
    print("Project Description (press Enter twice when done):")
    description_lines = []
    while True:
        line = input()
        if line == "" and description_lines:
            break
        if line:
            description_lines.append(line)
    description = ' '.join(description_lines)
    print()
    
    print("Key Features (one per line, press Enter on empty line when done):")
    features = []
    while True:
        feature = input(f"  Feature {len(features) + 1}: ").strip()
        if not feature:
            break
        features.append(feature)
    print()
    
    tech_prefs = input("Technology Preferences (optional, press Enter to skip): ").strip()
    target_audience = input("Target Audience (optional, press Enter to skip): ").strip()
    constraints = input("Constraints (budget, timeline, etc., optional): ").strip()
    
    # Build requirements text
    req_parts = [
        f"Project Name: {project_name}",
        f"\nProject Description:\n{description}",
        f"\nKey Features:\n" + '\n'.join([f"- {f}" for f in features])
    ]
    
    if tech_prefs:
        req_parts.append(f"\nTechnology Preferences: {tech_prefs}")
    if target_audience:
        req_parts.append(f"\nTarget Audience: {target_audience}")
    if constraints:
        req_parts.append(f"\nConstraints: {constraints}")
    
    return '\n'.join(req_parts)


def main():
    """Main CLI function."""
    parser = argparse.ArgumentParser(
        description="AI-powered proposal generator for IT project managers",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Interactive mode
  python cli.py

  # Generate from requirements file
  python cli.py --input requirements.txt --output proposal.md --format markdown

  # Quick generation with inline requirements
  python cli.py --text "Build a mobile app for fitness tracking with user profiles and workout plans"
        """
    )
    
    parser.add_argument(
        '-i', '--input',
        help='Input file containing project requirements'
    )
    
    parser.add_argument(
        '-t', '--text',
        help='Requirements as text (inline)'
    )
    
    parser.add_argument(
        '-o', '--output',
        help='Output file for the generated proposal (default: proposal.txt)'
    )
    
    parser.add_argument(
        '-f', '--format',
        choices=['text', 'markdown'],
        default='text',
        help='Output format (default: text)'
    )
    
    parser.add_argument(
        '--no-save',
        action='store_true',
        help='Print to console only, do not save to file'
    )
    
    args = parser.parse_args()
    
    print_banner()
    
    # Validate configuration
    if not config.validate():
        print_error("OpenAI API key not configured!")
        print_info("Please create a .env file with your OPENAI_API_KEY")
        print_info("You can copy .env.example to .env and add your API key")
        sys.exit(1)
    
    # Get requirements
    requirements_text = None
    
    if args.input:
        # Read from file
        try:
            with open(args.input, 'r', encoding='utf-8') as f:
                requirements_text = f.read()
            print_success(f"Requirements loaded from {args.input}")
        except FileNotFoundError:
            print_error(f"Input file not found: {args.input}")
            sys.exit(1)
        except Exception as e:
            print_error(f"Failed to read input file: {e}")
            sys.exit(1)
    elif args.text:
        # Use inline text
        requirements_text = args.text
        print_success("Using inline requirements")
    else:
        # Interactive mode
        requirements_text = interactive_mode()
    
    if not requirements_text or not requirements_text.strip():
        print_error("No requirements provided!")
        sys.exit(1)
    
    print()
    print(Fore.YELLOW + "🚀 Generating proposal...")
    print()
    
    try:
        # Generate proposal
        generator = ProposalGenerator()
        proposal = generator.generate_proposal(requirements_text)
        
        # Format proposal
        formatter = ProposalFormatter()
        
        if args.format == 'markdown':
            formatted_proposal = formatter.format_markdown(proposal)
        else:
            formatted_proposal = formatter.format_text(proposal)
        
        # Output
        if args.no_save:
            print()
            print(Fore.CYAN + "=" * 80)
            print(formatted_proposal)
            print(Fore.CYAN + "=" * 80)
        else:
            # Determine output filename
            if args.output:
                output_file = args.output
            else:
                ext = '.md' if args.format == 'markdown' else '.txt'
                output_file = f"proposal_{proposal.client_requirements.project_name.replace(' ', '_').lower()}{ext}"
            
            # Save to file
            saved_path = formatter.save_to_file(proposal, output_file, args.format)
            print()
            print_success(f"Proposal saved to: {saved_path}")
            print()
            
            # Print summary
            print(Fore.YELLOW + "📊 Proposal Summary")
            print(Fore.YELLOW + "-" * 80)
            print(f"Project: {proposal.client_requirements.project_name}")
            print(f"Estimated Cost: ${proposal.cost_estimate.total_cost:,.2f}")
            print(f"Timeline: {proposal.timeline_estimate.total_weeks:.1f} weeks")
            print(f"Development Hours: {proposal.cost_estimate.development_hours:.1f} hours")
            print()
        
        print_success("Proposal generation completed!")
        
    except ValueError as e:
        print_error(str(e))
        sys.exit(1)
    except Exception as e:
        print_error(f"Failed to generate proposal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
