# AI-Powered Proposal Generator 🤖

AI-powered proposal generator for IT project managers. Automatically generates professional project proposals using OpenAI GPT-4, analyzes client requirements, and provides accurate cost and timeline estimates.

## 🌟 Features

- **AI-Powered Analysis**: Uses OpenAI GPT-4 to analyze and structure client requirements
- **Automatic Cost Estimation**: Generates detailed cost breakdowns based on project scope
- **Timeline Planning**: Creates realistic project timelines with phase breakdowns
- **Professional Proposals**: Outputs comprehensive, professional project proposals
- **Multiple Formats**: Supports both plain text and Markdown output formats
- **Interactive & Batch Modes**: Use interactively or process requirements files
- **Risk Assessment**: Identifies potential risks and mitigation strategies
- **Team Structure Recommendations**: Suggests optimal team composition

## 📋 Prerequisites

- Python 3.8 or higher
- OpenAI API key (GPT-4 access required)

## 🚀 Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bhavik-dreamz/proposal-ai-agent.git
cd proposal-ai-agent
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure your OpenAI API key:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### Usage

#### Interactive Mode
```bash
python cli.py
```
Follow the prompts to enter your project requirements interactively.

#### Generate from Requirements File
```bash
python cli.py --input examples/ecommerce_requirements.txt --output proposal.md --format markdown
```

#### Quick Generation with Inline Text
```bash
python cli.py --text "Build a mobile app for fitness tracking with user profiles and workout plans"
```

#### Display to Console Only
```bash
python cli.py --input requirements.txt --no-save
```

## 📖 Command-Line Options

```
Options:
  -i, --input FILE          Input file containing project requirements
  -t, --text TEXT          Requirements as text (inline)
  -o, --output FILE        Output file for the generated proposal (default: proposal.txt)
  -f, --format FORMAT      Output format: text or markdown (default: text)
  --no-save                Print to console only, do not save to file
  -h, --help               Show help message
```

## 💼 Example Requirements Format

Create a text file with your project requirements:

```
Project Name: E-Commerce Platform Redesign

Project Description:
We need to modernize our existing e-commerce platform to improve user experience 
and increase conversion rates.

Key Features:
- Responsive web design
- Product catalog with search
- Shopping cart and checkout
- Payment gateway integration
- Admin dashboard

Technology Preferences: React, Node.js, PostgreSQL

Target Audience: Online shoppers aged 18-65

Constraints: Budget of $50,000, timeline of 4 months
```

See the `examples/` directory for more sample requirements files.

## 📊 Generated Proposal Includes

1. **Executive Summary** - High-level project overview
2. **Client Requirements** - Structured requirements analysis
3. **Technical Approach** - Recommended methodology and technology stack
4. **Project Scope** - Detailed scope with in/out of scope items
5. **Cost Estimate** - Complete cost breakdown with:
   - Development hours
   - Hourly rates
   - Component-level costs
   - Total project cost
6. **Timeline Estimate** - Project phases with durations:
   - Planning and Design
   - Development
   - Testing and QA
   - Deployment
   - Post-launch Support
7. **Team Structure** - Recommended team composition
8. **Risk Assessment** - Identified risks and mitigation strategies
9. **Deliverables** - List of project deliverables

## ⚙️ Configuration

Edit the `.env` file to configure:

```bash
# Required: Your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Model to use (default: gpt-4)
DEFAULT_MODEL=gpt-4

# Optional: Hourly rate for cost calculations (default: 100)
HOURLY_RATE=100

# Optional: Overhead percentage (default: 20)
OVERHEAD_PERCENTAGE=20
```

## 🏗️ Project Structure

```
proposal-ai-agent/
├── cli.py                      # Command-line interface
├── proposal_generator.py       # Main proposal generation logic
├── requirements_analyzer.py    # AI-powered requirements analysis
├── cost_timeline_estimator.py  # Cost and timeline estimation
├── formatter.py                # Proposal formatting (text/markdown)
├── models.py                   # Data models (Pydantic)
├── config.py                   # Configuration management
├── requirements.txt            # Python dependencies
├── .env.example               # Example environment configuration
├── .gitignore                 # Git ignore rules
├── examples/                  # Example requirements files
│   ├── ecommerce_requirements.txt
│   ├── healthcare_requirements.txt
│   └── fitness_app_requirements.txt
└── README.md                  # This file
```

## 🔧 How It Works

1. **Requirements Analysis**: The AI analyzes raw text requirements and extracts structured information (project name, features, constraints, etc.)

2. **Cost Estimation**: Based on the requirements, the system estimates development hours and calculates costs with detailed breakdowns

3. **Timeline Planning**: Creates a realistic project timeline with phases and durations

4. **Proposal Generation**: Uses GPT-4 to generate professional content for each proposal section:
   - Executive summary
   - Technical approach
   - Project scope
   - Risk assessment
   - Team structure

5. **Formatting**: Outputs the complete proposal in your chosen format (text or Markdown)

## 🎯 Use Cases

- **IT Project Managers**: Quickly generate professional proposals for client projects
- **Consulting Firms**: Standardize proposal creation across teams
- **Freelancers**: Create impressive proposals to win more projects
- **Sales Teams**: Generate technical proposals for sales opportunities
- **Startups**: Plan and scope new product development

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## ⚠️ Important Notes

- This tool requires an OpenAI API key with GPT-4 access
- API usage will incur costs based on OpenAI's pricing
- Generated proposals should be reviewed and customized before sending to clients
- Cost and timeline estimates are AI-generated and should be validated
- Always verify technical recommendations for your specific use case

## 🙋 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ using OpenAI GPT-4
