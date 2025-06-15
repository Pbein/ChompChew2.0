# 🔐 ChompChew Authentication Flow Plan

## 🎯 Overview

This plan outlines the complete authentication system for ChompChew, including user roles, admin access, and integration with the paid recipe generation feature.

---

## 🏗️ Current State Analysis

### ✅ **Already Implemented**
- **Supabase Integration**: Client and server-side clients configured
- **NextAuth Setup**: Basic NextAuth configuration with Supabase adapter
- **Database Schema**: Complete user tables and RLS policies
- **Header Authentication**: User state management in navigation
- **Generate Recipe Page**: Authentication checks for paid features

### ❌ **Missing Components**
- **Authentication Pages**: Sign in, sign up, error pages
- **User Role System**: Admin vs regular user differentiation
- **Admin Profile**: Development admin account
- **Subscription Management**: Paid user verification
- **Profile Management**: User profile pages
- **Email Verification**: Account verification flow

---

## 👥 User Roles & Permissions

### **1. Guest Users (Unauthenticated)**
- ✅ Browse recipes
- ✅ View recipe details
- ✅ Use basic search
- ❌ Save recipes
- ❌ Generate AI recipes
- ❌ Access dietary preferences

### **2. Free Users (Authenticated)**
- ✅ All guest permissions
- ✅ Save/bookmark recipes
- ✅ Set dietary preferences
- ✅ Personalized search results
- ❌ Generate AI recipes (paid feature)

### **3. Premium Users (Paid Subscription)**
- ✅ All free user permissions
- ✅ Generate AI recipes
- ✅ Advanced recipe customization
- ✅ Priority support

### **4. Admin Users (Development/Management)**
- ✅ All premium permissions
- ✅ Access to admin dashboard
- ✅ User management
- ✅ Recipe moderation
- ✅ Analytics access
- ✅ **Free access to all paid features**

---

## 🔧 Implementation Plan

### **Phase 1: Core Authentication Pages (2-3 days)**

#### **Step 1.1: Create Authentication Pages**
```
src/app/auth/
├── signin/
│   └── page.tsx          # Sign in page
├── signup/
│   └── page.tsx          # Sign up page
├── error/
│   └── page.tsx          # Error handling page
├── verify-request/
│   └── page.tsx          # Email verification page
└── signout/
    └── page.tsx          # Sign out confirmation
```

#### **Step 1.2: Authentication Components**
```
src/components/auth/
├── SignInForm.tsx        # Sign in form component
├── SignUpForm.tsx        # Sign up form component
├── AuthProvider.tsx      # Authentication context provider
├── ProtectedRoute.tsx    # Route protection wrapper
└── UserProfile.tsx       # User profile display
```

#### **Step 1.3: User Role System**
```typescript
// src/types/auth.ts
export interface User {
  id: string
  email: string
  full_name?: string
  role: 'guest' | 'free' | 'premium' | 'admin'
  subscription_status?: 'active' | 'inactive' | 'trial'
  subscription_tier?: 'basic' | 'premium'
  created_at: string
  updated_at: string
}

// src/lib/auth-utils.ts
export const checkUserRole = (user: User, requiredRole: string) => boolean
export const isAdmin = (user: User) => boolean
export const isPremium = (user: User) => boolean
export const canGenerateRecipes = (user: User) => boolean
```

### **Phase 2: Admin Profile Setup (1 day)**

#### **Step 2.1: Admin Account Creation**
```sql
-- Add admin role to database
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';

-- Create admin user profile
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  subscription_status,
  subscription_tier
) VALUES (
  'your-user-id-here',
  'your-email@domain.com',
  'Admin User',
  'admin',
  'active',
  'premium'
);
```

#### **Step 2.2: Admin Middleware**
```typescript
// src/middleware/admin.ts
export const adminMiddleware = (req: NextRequest) => {
  // Check if user is admin
  // Allow access to admin routes
  // Bypass payment checks for admin users
}
```

#### **Step 2.3: Admin Dashboard (Future)**
```
src/app/admin/
├── page.tsx              # Admin dashboard
├── users/
│   └── page.tsx          # User management
├── recipes/
│   └── page.tsx          # Recipe moderation
└── analytics/
    └── page.tsx          # Usage analytics
```

### **Phase 3: Subscription Integration (2 days)**

#### **Step 3.1: Subscription Status Checking**
```typescript
// src/lib/subscription.ts
export const checkSubscriptionStatus = async (userId: string) => {
  // Check with payment provider (Stripe/etc)
  // Update user subscription status
  // Return current status
}

export const canAccessPaidFeatures = (user: User) => {
  return user.role === 'admin' || 
         user.role === 'premium' || 
         user.subscription_status === 'active'
}
```

#### **Step 3.2: Payment Integration Preparation**
```
src/lib/payments/
├── stripe.ts             # Stripe integration
├── subscription.ts       # Subscription management
└── webhooks.ts           # Payment webhooks
```

### **Phase 4: Enhanced Authentication Features (2 days)**

#### **Step 4.1: Profile Management**
```
src/app/profile/
├── page.tsx              # User profile page
├── edit/
│   └── page.tsx          # Edit profile
├── subscription/
│   └── page.tsx          # Subscription management
└── settings/
    └── page.tsx          # Account settings
```

#### **Step 4.2: Email Verification & Password Reset**
```
src/app/auth/
├── verify/
│   └── page.tsx          # Email verification
├── reset-password/
│   └── page.tsx          # Password reset request
└── update-password/
    └── page.tsx          # Password update
```

---

## 🔒 Security Implementation

### **Row Level Security (RLS) Policies**
```sql
-- Admin users can access all data
CREATE POLICY "Admins can access all recipes" ON recipes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Premium users can generate recipes
CREATE POLICY "Premium users can generate recipes" ON ai_generations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (users.role IN ('premium', 'admin') OR users.subscription_status = 'active')
    )
  );
```

### **API Route Protection**
```typescript
// src/lib/auth-middleware.ts
export const requireAuth = (handler: NextApiHandler) => {
  return async (req: NextRequest, res: NextResponse) => {
    const user = await getUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return handler(req, res)
  }
}

export const requireAdmin = (handler: NextApiHandler) => {
  return async (req: NextRequest, res: NextResponse) => {
    const user = await getUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return handler(req, res)
  }
}

export const requirePremium = (handler: NextApiHandler) => {
  return async (req: NextRequest, res: NextResponse) => {
    const user = await getUser(req)
    if (!user || !canAccessPaidFeatures(user)) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 402 })
    }
    return handler(req, res)
  }
}
```

---

## 🧪 Testing Strategy

### **Authentication Tests**
```typescript
// tests/auth/authentication.test.ts
describe('Authentication Flow', () => {
  test('User can sign up with email/password')
  test('User can sign in with valid credentials')
  test('User cannot sign in with invalid credentials')
  test('User can sign out successfully')
  test('User session persists across page reloads')
})

// tests/auth/authorization.test.ts
describe('Authorization', () => {
  test('Guest users cannot access protected routes')
  test('Free users can access basic features')
  test('Premium users can access paid features')
  test('Admin users can access all features')
  test('Admin users bypass payment checks')
})

// tests/auth/admin.test.ts
describe('Admin Features', () => {
  test('Admin can generate recipes without payment')
  test('Admin can access admin dashboard')
  test('Admin can manage other users')
  test('Non-admin cannot access admin routes')
})
```

---

## 🚀 Integration with Generate Recipe Feature

### **Updated Generate Recipe Logic**
```typescript
// src/app/generate-recipe/page.tsx
const canGenerateRecipes = (user: User | null) => {
  if (!user) return false
  
  // Admin users always have access
  if (user.role === 'admin') return true
  
  // Premium users have access
  if (user.role === 'premium') return true
  
  // Users with active subscription have access
  if (user.subscription_status === 'active') return true
  
  return false
}

// Update the authentication check
if (!user) {
  // Show sign-in page
} else if (!canGenerateRecipes(user)) {
  // Show upgrade to premium page
} else {
  // Show recipe generation interface
}
```

---

## 📋 Environment Variables Required

```bash
# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Configuration
ADMIN_EMAIL=your-email@domain.com
ADMIN_USER_ID=your-supabase-user-id

# Payment Integration (Future)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key
```

---

## 🎯 Success Criteria

### **Phase 1 Complete**
- [ ] Users can sign up with email/password
- [ ] Users can sign in and sign out
- [ ] Authentication state persists across sessions
- [ ] Protected routes redirect unauthenticated users
- [ ] Error handling for authentication failures

### **Phase 2 Complete**
- [ ] Admin account created and functional
- [ ] Admin can access all features without payment
- [ ] Admin role properly identified in database
- [ ] Admin bypasses subscription checks

### **Phase 3 Complete**
- [ ] Subscription status checking implemented
- [ ] Payment integration prepared
- [ ] Premium users can generate recipes
- [ ] Free users see upgrade prompts

### **Phase 4 Complete**
- [ ] User profile management working
- [ ] Email verification functional
- [ ] Password reset working
- [ ] Account settings accessible

---

## 🔄 Integration with Rebuild Plan

This authentication plan integrates with the existing rebuild plan as follows:

### **Phase 1 Enhancement**
- **Step 1.1**: Add authentication pages to core infrastructure
- **Step 1.2**: Integrate user role system with existing services

### **Phase 3 Enhancement** 
- **Step 3.1**: Connect dietary preferences with user authentication
- **Step 3.2**: Ensure authenticated users can save preferences

### **Phase 4 Enhancement**
- **Step 4.2**: Connect recipe saving with authenticated users
- **Step 4.2**: Ensure saved recipes are user-specific

### **New Phase: Authentication Testing**
- Add comprehensive authentication tests to testing strategy
- Validate admin access and payment bypassing
- Test subscription status checking

---

## 🚨 Immediate Next Steps

1. **Create Admin Account** (30 minutes)
   - Set up your admin user in Supabase
   - Configure admin role in database
   - Test admin access to generate recipe feature

2. **Build Authentication Pages** (2-3 days)
   - Create sign in/up pages
   - Implement authentication forms
   - Add error handling

3. **Integrate Role System** (1 day)
   - Add role checking to generate recipe page
   - Implement admin bypass logic
   - Test role-based access

4. **Testing** (1 day)
   - Write authentication tests
   - Test admin functionality
   - Validate subscription checking

**Total Timeline**: 4-5 days for complete authentication system

---

This plan ensures you have full admin access for development while building a robust authentication system for your users. The admin role bypasses all payment requirements, allowing you to test and develop the paid features without restrictions. 