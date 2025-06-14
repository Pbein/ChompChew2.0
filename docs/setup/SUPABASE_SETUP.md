# 🗄️ Supabase Setup Guide for ChompChew

## ✅ Completed Setup

The following Supabase components have been configured:

### 📁 Files Created
- `src/lib/supabase.ts` - Supabase client configurations
- `src/types/database.ts` - TypeScript database types
- `supabase/schema.sql` - Complete database schema
- `src/lib/auth.ts` - NextAuth configuration with Supabase
- `src/lib/services/userService.ts` - User service for database operations
- `src/middleware.ts` - Authentication middleware

### 📦 Dependencies Installed
- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/ssr` - Server-side rendering support
- `next-auth` - Authentication for Next.js
- `@auth/supabase-adapter` - Supabase adapter for NextAuth
- `zod` - Schema validation

---

## 🚀 Next Steps

### 1. Set Up Your Supabase Database

You need to run the database schema in your Supabase project:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the query to create all tables, indexes, and security policies

### 2. Configure Environment Variables

Add these additional variables to your `.env.local`:

```bash
# Required for NextAuth (if you don't have them yet)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Optional: Service role key for advanced operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: OpenAI for recipe generation
OPENAI_API_KEY=your-openai-api-key
```

### 3. Test Your Setup

You can test your Supabase connection by:

1. Starting your development server: `npm run dev`
2. Checking the browser console for any connection errors
3. Trying to access authentication routes (once you create them)

### 4. Create Authentication Pages

The authentication is configured but you'll need to create the actual pages:

- `src/app/auth/signin/page.tsx` - Sign in page
- `src/app/auth/error/page.tsx` - Error page
- `src/app/auth/verify-request/page.tsx` - Email verification page

### 5. Row Level Security (RLS)

The schema includes comprehensive RLS policies that:
- Allow users to only access their own data
- Enable public viewing of public recipes
- Protect sensitive user information
- Prevent unauthorized data modifications

---

## 🔧 How to Use

### Client-Side Usage
```typescript
import { createClientComponentClient } from '@/lib/supabase'

const supabase = createClientComponentClient()
```

### Server-Side Usage
```typescript
import { createServerComponentClient } from '@/lib/supabase'

const supabase = createServerComponentClient()
```

### User Service Usage
```typescript
import { userService } from '@/lib/services/userService'

// Get user profile
const profile = await userService.getUserProfile(userId)

// Update user profile
await userService.updateUserProfile(userId, { full_name: 'New Name' })
```

---

## 📊 Database Schema Overview

Your database includes these main tables:

- **users** - User profiles and preferences
- **recipes** - Recipe data with AI generation support
- **user_favorites** - User's favorite recipes
- **recipe_reviews** - Recipe ratings and comments
- **user_follows** - Social following system
- **shopping_lists** - Shopping list management
- **pantry_items** - Pantry inventory tracking

All tables include:
- Automatic timestamps
- UUID primary keys
- Row Level Security policies
- Proper indexes for performance
- Foreign key relationships

---

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Authentication** required for protected routes
- **Data validation** with TypeScript types
- **API rate limiting** ready to implement
- **CSRF protection** via NextAuth
- **Automatic user profile creation** on signup

---

## 🐛 Troubleshooting

### Connection Issues
- Verify your Supabase URL and keys in `.env.local`
- Check that your Supabase project is active
- Ensure you've run the database schema

### Authentication Issues
- Make sure `NEXTAUTH_SECRET` is set
- Verify your NextAuth configuration
- Check that the `auth.users` table exists in Supabase

### Permission Issues
- Verify RLS policies are enabled
- Check that your user is authenticated
- Ensure proper user IDs are being passed

---

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Review the Supabase dashboard logs
3. Verify all environment variables are set correctly
4. Ensure the database schema was applied successfully

The setup is now ready for Phase 1 development! 🎉 