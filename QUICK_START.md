# Quick Start - Prisma PostgreSQL

## 🎯 Quick Setup (5 minutes)

### 1. Install PostgreSQL (if not already installed)
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql

# Windows
# Download from https://www.postgresql.org/download/
```

### 2. Create Database
```bash
createdb proposal_ai_db
```

### 3. Configure Connection
Edit `.env.local` (create if doesn't exist):
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/proposal_ai_db"
```
Replace `password` with your PostgreSQL password.

### 4. Run Setup
```bash
# Run migrations
npm run prisma:migrate

# Or use the automated script
bash scripts/setup-prisma.sh
```

### 5. Start Development
```bash
npm run dev
```

## 📚 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run prisma:migrate` | Create/run database migrations |
| `npm run prisma:studio` | Open GUI database editor |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:reset` | ⚠️ Reset database (loses all data) |

## 🔍 View Data

```bash
# Open Prisma Studio
npm run prisma:studio
```

Then visit `http://localhost:5555` in your browser.

## 📝 Make Schema Changes

1. Edit `prisma/schema.prisma`
2. Run: `npm run prisma:migrate -- --name description_of_change`
3. That's it!

## 🐛 Troubleshooting

**Can't connect to database?**
```bash
# Test connection
psql postgresql://postgres:password@localhost:5432/proposal_ai_db
```

**Port already in use?**
```bash
# Find process using port 5432
lsof -i :5432
# Kill it
kill -9 <PID>
```

**Need to reset database?**
```bash
# WARNING: This deletes all data!
npm run prisma:reset
```

## 📖 Documentation

- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- Full guide: See `PRISMA_MIGRATION_GUIDE.md`

---

**You're all set! 🚀**
