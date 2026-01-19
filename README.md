# Proposal AI Agent

An AI-powered Next.js application that helps IT project managers generate professional project proposals automatically. The application uses OpenAI GPT-4 to analyze client requirements and generate proposals based on templates, similar past proposals, and pricing rules.

## Features

- 🤖 **AI-Powered Generation**: Automatically generates professional proposals using GPT-4
- � **Authentication & Authorization**: Secure login with role-based access control (Admin/User)
- 👥 **User Management**: Admin panel to manage users and roles
- 📊 **Smart Analysis**: Detects project type and complexity from requirements
- 🔍 **Vector Search**: Finds similar past proposals using embeddings
- 💰 **Cost Estimation**: Automatically calculates cost and timeline estimates
- 📝 **Template System**: Uses customizable templates for different project types
- ✏️ **Editor**: Edit and refine generated proposals
- 📈 **Dashboard**: Track all proposals with statistics and filters
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Authentication**: NextAuth.js v5
- **AI**: Vercel AI SDK with OpenAI GPT-4
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or use Neon, Supabase, etc.)
- OpenAI API key

## Quick Start

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd proposal-ai-agent
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/proposal_ai_db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Run migrations
npm run prisma:migrate

# Seed with default users
npm run prisma:seed
```

Default accounts created:
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login with the default credentials.

## Authentication

The application includes a complete authentication system with role-based access control:

- **Admin Role**: Full access including user management and settings
- **User Role**: Access to proposal creation and viewing

See [AUTH_GUIDE.md](AUTH_GUIDE.md) for detailed authentication documentation.

## Project Structure

```
proposal-agent/
├── app/
│   ├── api/                    # API routes
│   │   ├── generate-proposal/  # Main proposal generation
│   │   ├── proposals/          # CRUD operations
│   │   ├── search-similar/     # Vector search
│   │   └── embeddings/         # Embedding generation
│   ├── dashboard/              # Dashboard pages
│   │   ├── page.tsx            # Main dashboard
│   │   ├── new-proposal/       # Create proposal
│   │   ├── proposals/          # List & view proposals
│   │   └── settings/           # Settings page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── proposal-form.tsx       # Proposal input form
│   ├── proposal-preview.tsx    # Proposal preview
│   ├── proposal-editor.tsx     # Proposal editor
│   └── ...
├── lib/
│   ├── supabase.ts            # Supabase client
│   ├── openai.ts              # OpenAI client
│   ├── proposal-generator.ts  # Main AI logic
│   ├── vector-search.ts       # Vector similarity search
│   └── utils.ts               # Helper functions
├── types/
│   ├── index.ts               # TypeScript types
│   └── database.ts            # Database types
└── supabase/
    ├── schema.sql             # Database schema
    └── seed.sql               # Seed data
```

## Usage

### Creating a Proposal

1. Navigate to `/dashboard/new-proposal`
2. Fill in:
   - Client name (required)
   - Client email (optional)
   - Project requirements (required) - be as detailed as possible
   - Project type (optional) - leave empty for auto-detection
   - Complexity (optional) - leave empty for auto-detection
3. Click "Generate Proposal"
4. Review the generated proposal
5. Edit if needed
6. Save the proposal

### Example Requirements

```
We need an online store to sell handmade jewelry. Need product catalog with 
filters by price, material, and category. Shopping cart, payment integration 
with Stripe and PayPal. Admin panel to add/edit products. Mobile responsive. 
Budget: $5000-$8000. Timeline: 2-3 months.
```

## Database Schema

The application uses 5 main tables:

1. **proposals**: Stores generated proposals
2. **templates**: Proposal templates for different project types
3. **tech_stacks**: Technology stack configurations
4. **sample_proposals**: Past proposals for AI learning
5. **pricing_rules**: Pricing rules for features

See `supabase/schema.sql` for the complete schema.

## API Routes

- `POST /api/generate-proposal` - Generate a new proposal
- `GET /api/proposals` - List all proposals
- `GET /api/proposals/[id]` - Get a single proposal
- `PATCH /api/proposals/[id]` - Update a proposal
- `DELETE /api/proposals/[id]` - Delete a proposal
- `POST /api/search-similar` - Search for similar proposals
- `POST /api/embeddings` - Generate embeddings

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Customization

### Adding New Tech Stacks

Insert into the `tech_stacks` table:

```sql
INSERT INTO tech_stacks (name, description, typical_features, base_cost, cost_per_feature, base_timeline_weeks, additional_info)
VALUES ('YourStack', 'Description', '["Feature1", "Feature2"]'::jsonb, 5000, 500, 8, '{"strengths": [...]}'::jsonb);
```

### Creating Templates

Insert into the `templates` table:

```sql
INSERT INTO templates (name, project_type, description, content, sections)
VALUES ('Template Name', 'MERN', 'Description', 'Template content with {PLACEHOLDERS}', '{"sections": [...]}'::jsonb);
```

### Adding Sample Proposals

Insert into the `sample_proposals` table. The AI will use these for reference when generating new proposals.

## Troubleshooting

### Vector Search Not Working

If vector search isn't working:
1. Ensure pgvector extension is enabled in Supabase
2. Check that embeddings are being generated (check the `embedding` column)
3. The fallback text search will be used if vector search fails

### OpenAI API Errors

- Check your API key is correct
- Ensure you have credits in your OpenAI account
- Check rate limits

### Supabase Connection Issues

- Verify your environment variables
- Check Supabase project is active
- Ensure Row Level Security (RLS) policies allow access if needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, OpenAI, and Supabase
