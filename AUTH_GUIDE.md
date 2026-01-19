# Authentication & Authorization Guide

## Overview

The Proposal AI Agent now includes a complete authentication and role-based access control system using NextAuth.js v5.

## User Roles

### ADMIN
- Full access to all dashboard pages
- Can manage settings
- Can create, edit, and delete users
- Can access user management page

### USER
- Access to all dashboard pages except:
  - Settings page
  - User management page
- Can create and manage proposals
- Can view all proposals

## Default Accounts

After running the seed script, the following accounts are available:

```
Admin Account:
Email: admin@example.com
Password: admin123

Regular User Account:
Email: user@example.com
Password: user123
```

## Features Implemented

### 1. User Table (Prisma Schema)
- Email/password authentication
- Role-based access (ADMIN/USER)
- Active/inactive status
- Timestamps for created/updated dates

### 2. Authentication
- Login page at `/login`
- Secure password hashing with bcryptjs
- JWT-based session management
- Automatic redirect to login for unauthenticated users

### 3. Protected Routes
- All `/dashboard/*` routes require authentication
- Middleware automatically redirects unauthenticated users to login
- Role-based route protection for admin-only pages

### 4. User Management (Admin Only)
- View all users
- Create new users
- Edit existing users
- Delete users (cannot delete self)
- Toggle user active/inactive status
- Assign roles (ADMIN/USER)

### 5. Settings Page (Admin Only)
- Manage templates
- Configure pricing rules
- Add sample proposals
- View tech stacks

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handlers (login, logout, session)

### User Management (Admin Only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## Usage

### Login
1. Navigate to `http://localhost:3000/login`
2. Enter credentials
3. Click "Sign In"
4. Redirected to dashboard on success

### Logout
Click the "Logout" button in the dashboard navigation

### Managing Users (Admin)
1. Login as admin
2. Navigate to "Users" in the dashboard
3. Click "Add User" to create new users
4. Edit or delete existing users as needed

### Accessing Protected Pages
- Users automatically see only the pages they have access to
- Admin-only links (Settings, Users) are hidden for regular users
- Attempting to access unauthorized pages redirects to dashboard

## Environment Variables

Add these to your `.env` file:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-min-32-chars

# Database
DATABASE_URL=your_database_url
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Development Commands

```bash
# Run database migrations
npm run prisma:migrate

# Seed the database with default users
npm run prisma:seed

# View database in Prisma Studio
npm run prisma:studio

# Reset database (development only)
npm run prisma:reset
```

## Security Notes

1. **Change Default Passwords**: The seed script creates default accounts for development. Change or remove these in production.

2. **NEXTAUTH_SECRET**: Generate a strong, unique secret for production environments.

3. **Password Requirements**: Consider implementing password strength requirements in production.

4. **HTTPS**: Use HTTPS in production. Update `NEXTAUTH_URL` accordingly.

5. **Rate Limiting**: Consider adding rate limiting to login endpoints to prevent brute force attacks.

## File Structure

```
lib/
  auth.ts                           # NextAuth configuration
  
app/
  api/
    auth/
      [...nextauth]/route.ts        # NextAuth API route
      register/route.ts             # User registration
    users/
      route.ts                      # User CRUD operations
      [id]/route.ts                 # Individual user operations
  
  login/
    page.tsx                        # Login page
  
  dashboard/
    layout.tsx                      # Dashboard with role-based nav
    users/
      page.tsx                      # User management (admin only)
    settings/
      page.tsx                      # Settings wrapper (admin only)
      settings-content.tsx          # Settings content component

middleware.ts                       # Route protection
prisma/
  schema.prisma                     # User model with Role enum
  seed.ts                           # Seed default users
types/
  next-auth.d.ts                    # TypeScript definitions
```

## Troubleshooting

### Cannot Login
- Check database is running
- Verify `DATABASE_URL` in `.env`
- Ensure migrations are applied: `npm run prisma:migrate`
- Check if user exists and is active

### Unauthorized Access
- Verify user role is correct
- Check middleware configuration
- Clear browser cookies and try again

### Seed Script Fails
- Ensure database is accessible
- Check for existing users with same email
- Run `npm run prisma:generate` first
