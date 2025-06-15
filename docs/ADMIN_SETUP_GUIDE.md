# 🔐 Admin Account Setup Guide

## 📋 Prerequisites

Before setting up your admin account, ensure you have:

- ✅ Supabase project configured
- ✅ Environment variables set in `.env.local`
- ✅ Database schema applied
- ✅ Development server running

## 🚀 Step-by-Step Setup

### **Step 1: Apply Database Migration**

First, run the database migration to add role columns:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_add_user_roles.sql`
4. Click **Run** to execute the migration

This will add:
- `role` column to users table
- `subscription_status` and `subscription_tier` columns
- Admin-specific RLS policies
- Helper functions for role checking

### **Step 2: Sign Up with Your Admin Email**

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/auth/signup`

3. Sign up with your admin credentials:
   - **Email**: `example@gmail.com`
   - **Password**: `examplePassword`
   - **Full Name**: `Admin User` (or your preferred name)

4. Check your email for the confirmation link and click it to verify your account

5. After verification, sign in at: `http://localhost:3000/auth/signin`

### **Step 3: Run Admin Setup Script**

After signing up and verifying your email, run the admin setup script:

```bash
node scripts/setup-admin.js
```

This script will:
- Find your user account in the database
- Promote your account to admin role
- Set subscription status to active
- Set subscription tier to premium
- Verify the setup was successful

Expected output:
```
🔧 Setting up admin account...
📧 Admin email: philipbein10697@gmail.com
✅ Found auth user: [your-user-id]
📝 Updating existing profile to admin...
✅ User profile updated to admin role

🎉 Admin setup complete!
📊 Admin profile details:
   - ID: [your-user-id]
   - Email: philipbein10697@gmail.com
   - Name: Admin User
   - Role: admin
   - Subscription: active
   - Tier: premium

✨ You now have admin access to all paid features!
🚀 You can now test the AI recipe generation feature.
```

### **Step 4: Test Admin Access**

1. Navigate to: `http://localhost:3000/generate-recipe`

2. You should now see the recipe generation interface instead of the payment prompt

3. Try generating a recipe with "chicken burrito" to test the functionality

4. Verify that you have admin access by checking that:
   - No payment prompts appear
   - You can access the recipe generation form
   - The interface shows you're authenticated

## 🔧 Troubleshooting

### **Issue: Script can't find user**
```
❌ User with email philipbein10697@gmail.com not found in auth.users
```

**Solution**: Make sure you've signed up and verified your email first.

### **Issue: Missing environment variables**
```
❌ Missing required environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
```

**Solution**: Check your `.env.local` file has the correct Supabase credentials.

### **Issue: Database connection error**

**Solution**: 
1. Verify your Supabase project is active
2. Check that the database migration was applied successfully
3. Ensure your service role key has the correct permissions

### **Issue: Still seeing payment prompts**

**Solution**:
1. Sign out and sign back in to refresh your session
2. Check the browser console for any errors
3. Verify the admin setup script completed successfully
4. Clear browser cache and cookies

## 🧪 Verification Checklist

After setup, verify these work:

- [ ] You can sign in with `philipbein10697@gmail.com`
- [ ] Your user profile shows `role: admin` in the database
- [ ] You can access `/generate-recipe` without payment prompts
- [ ] The recipe generation form is visible and functional
- [ ] No subscription upgrade messages appear
- [ ] Your navigation shows "Profile" instead of "Sign In"

## 🔒 Security Notes

- Your admin account bypasses all payment checks
- Admin role gives access to all premium features
- Keep your admin credentials secure
- Don't share admin access with others
- Consider using a separate admin email for production

## 🚀 Next Steps

Once your admin account is set up:

1. **Test all paid features** to ensure they work correctly
2. **Build authentication pages** for regular users
3. **Implement subscription checking** for non-admin users
4. **Add role-based UI elements** throughout the app
5. **Create admin dashboard** (future enhancement)

---

**🎉 Congratulations!** You now have full admin access to test and develop all paid features without restrictions. 