#!/bin/bash

# Prisma PostgreSQL Setup Script
# This script helps set up your PostgreSQL database with Prisma

set -e

echo "🚀 Prisma PostgreSQL Setup"
echo "======================================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   - macOS: brew install postgresql"
    echo "   - Ubuntu: sudo apt-get install postgresql"
    exit 1
fi

echo "✅ PostgreSQL found"
echo ""

# Create database if it doesn't exist
DB_NAME="proposal_ai_db"
DB_USER="${POSTGRES_USER:-postgres}"

echo "📦 Creating database: $DB_NAME"

# Try to create the database
PGPASSWORD="${POSTGRES_PASSWORD:-}" psql -U "$DB_USER" -h localhost -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || PGPASSWORD="${POSTGRES_PASSWORD:-}" psql -U "$DB_USER" -h localhost -c "CREATE DATABASE $DB_NAME;" || echo "⚠️  Database may already exist or you need proper PostgreSQL credentials"

echo ""
echo "🔧 Running Prisma migrations..."
npm run prisma:migrate

echo ""
echo "📊 Generating Prisma client..."
npm run prisma:generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start your development server: npm run dev"
echo "2. Open Prisma Studio: npm run prisma:studio"
echo "3. Enjoy! 🎉"
echo ""
