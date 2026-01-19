# Prisma PostgreSQL Migration Guide

## Overview
Your project has been successfully converted from Supabase to PostgreSQL with Prisma ORM. This guide covers the setup and migration steps.

## Prerequisites
- PostgreSQL database running locally or remotely
- Node.js and npm installed

## Setup Steps

### 1. Configure Environment Variables
Update your `.env.local` file with your PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/proposal_ai_db"
```

**Connection String Format:**
- `postgresql://[user]:[password]@[host]:[port]/[database]`

### 2. Create PostgreSQL Database
If you haven't already, create the database:

```bash
createdb proposal_ai_db
```

Or connect to your PostgreSQL server and run:
```sql
CREATE DATABASE proposal_ai_db;
```

### 3. Initialize Prisma Migrations
Run the initial migration to set up the database schema:

```bash
npm run prisma:migrate
```

This will create all tables defined in `prisma/schema.prisma`.

### 4. Generate Prisma Client
```bash
npm run prisma:generate
```

### 5. (Optional) Seed Database
If you have sample data, you can create a seed script at `prisma/seed.ts`.

## Available npm Scripts

Add these scripts to your `package.json` if not already present:

```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:migrate:prod": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:reset": "prisma migrate reset"
  }
}
```

## Running in Development

```bash
# Start dev server
npm run dev

# In another terminal, open Prisma Studio to view/edit data
npm run prisma:studio
```

## Migrating Data from Supabase

If you have existing data in Supabase, follow these steps:

### Option 1: Export and Import (Recommended)
1. Export data from Supabase as CSV
2. Import into PostgreSQL tables using `COPY` command or GUI tools

### Option 2: Direct Database Connection
Use a database migration tool like:
- DBeaver
- pgAdmin
- DataGrip

### Option 3: Write a Migration Script
Create `scripts/migrate-from-supabase.ts` to programmatically migrate data.

## Key Changes from Supabase

### Before (Supabase):
```typescript
import { supabaseAdmin } from '@/lib/supabase';

const { data, error } = await supabaseAdmin
  .from('proposals')
  .select('*')
  .eq('status', 'draft');
```

### After (Prisma):
```typescript
import { prisma } from '@/lib/prisma';

const proposals = await prisma.proposal.findMany({
  where: { status: 'draft' },
});
```

## Field Name Mappings

Prisma uses camelCase while SQL uses snake_case. The schema handles this automatically:

| Prisma | SQL |
|--------|-----|
| clientName | client_name |
| clientEmail | client_email |
| projectType | project_type |
| generatedProposal | generated_proposal |
| costEstimate | cost_estimate |
| timelineWeeks | timeline_weeks |
| isActive | is_active |
| isApproved | is_approved |
| createdAt | created_at |
| updatedAt | updated_at |

## Troubleshooting

### Connection Issues
```bash
# Test PostgreSQL connection
psql postgresql://username:password@localhost:5432/proposal_ai_db
```

### Schema Out of Sync
```bash
# Reset database (WARNING: deletes all data)
npm run prisma:reset

# Create new migration
npm run prisma:migrate -- --name description_of_change
```

### Generate Prisma Client
```bash
npm run prisma:generate
```

## Production Deployment

For production, use:
```bash
npm run prisma:migrate:prod
```

This only runs pending migrations without interactive prompts.

## Support

For issues, check:
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Migration Date:** January 2026
**Removed:** Supabase (@supabase/supabase-js)
**Added:** Prisma (@prisma/client, prisma)
