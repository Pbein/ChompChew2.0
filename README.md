# 🍽️ ChompChew - Remove "What Can I Actually Eat?" Anxiety

**ChompChew is an AI-powered recipe discovery platform that removes the daily "What can I actually eat?" anxiety.** Built for people with dietary restrictions, medical conditions, and busy lifestyles who struggle with meal planning decisions.

## 🎯 **Core Mission**
Remove the daily "What can I actually eat?" anxiety by providing personalized, AI-powered recipe discovery that respects individual dietary needs, restrictions, and health conditions.

---

## ✨ **Mission-Aligned Features**

### 🔍 **Multi-Modal Search**
Never wonder what to cook again with flexible search options:
- **Ingredient-based**: "I have chicken and broccoli"
- **Calorie-focused**: "I need a 400-calorie lunch"  
- **Macro-targeted**: "High protein, low carb meal"
- **Constraint-aware**: "Avoid gluten and dairy"

### 🏥 **Medical Condition Support**
Safe recipe discovery for users with health conditions:
- **Trigger Food Management**: UC, Crohn's, IBS-specific avoidance
- **Allergen Safety**: Zero tolerance for allergen inclusion
- **Severity Indicators**: Distinguish preference from medical necessity
- **Safety Validation**: Multi-level checking for dietary compliance

### 📱 **Intuitive Discovery Experience**
Reduce decision fatigue with engaging interfaces:
- **Recipe Card Deck**: Swipeable recipe discovery (like dating apps, but for food)
- **Interactive Cooking Mode**: Step-by-step guidance with timers
- **Make One for Me**: Custom recipe generation when no results found
- **Personal Collections**: Save and organize recipes that work for you

### 🤖 **AI-Powered Intelligence**
- **Smart Recipe Generation**: OpenAI GPT-4o-mini creates personalized recipes
- **Ingredient Substitution**: Automatic alternatives based on restrictions
- **Nutritional Analysis**: Accurate macro and calorie tracking
- **Safety Validation**: Comprehensive allergen and trigger food checking

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL with real-time features)
- **Caching**: Upstash Redis for performance optimization
- **Authentication**: NextAuth.js with Supabase adapter
- **Styling**: Tailwind CSS (v4)
- **Language**: TypeScript
- **AI Integration**: OpenAI API with GPT-4o-mini for recipe generation
- **Design System**: Comprehensive Tailwind CSS design system with food-inspired theming

## 🛠️ Getting Started

### Prerequisites

Before running the project, make sure you have:
- Node.js 18+ installed
- A Supabase project set up
- An Upstash Redis instance
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chompchew
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # NextAuth Configuration
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000

   # Upstash Redis Configuration
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

   # OpenAI Configuration (Required for AI features)
   OPENAI_SECRET_KEY=your_openai_api_key
   ```

4. **Set up the database**
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the query to create all tables and policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### 🩺 Health Check

Verify that all services are running correctly:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-06-14T02:27:13.198Z",
  "services": {
    "redis": { "redis": true, "message": "Redis is healthy" },
    "supabase": { "supabase": true, "message": "Supabase is healthy" },
    "openai": { "openai": true, "message": "OpenAI is healthy" },
    "app": { "app": true, "message": "Application is healthy" }
  }
}
```

### 🤖 AI Recipe Generation

Test the AI recipe generation functionality:

**Basic Recipe Generation:**
```bash
curl -X POST http://localhost:3000/api/recipes/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "chocolate chip cookies"}'
```

**Advanced Generation with Constraints:**
```bash
curl -X POST http://localhost:3000/api/recipes/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "healthy dinner",
    "constraints": {
      "dietaryRestrictions": ["vegetarian", "gluten-free"],
      "availableIngredients": ["quinoa", "vegetables", "olive oil"],
      "cookingTime": 30,
      "difficulty": "easy",
      "servings": 4,
      "equipment": ["stovetop", "pan"]
    }
  }'
```

## 📁 Project Structure

```
chompchew/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── recipes/       # Recipe generation endpoints
│   │   │   └── health/        # Health check endpoint
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── lib/                   # Utility libraries
│   │   ├── services/          # Business logic services
│   │   │   ├── userService.ts # User-related operations
│   │   │   ├── cacheService.ts # Caching operations
│   │   │   └── recipeGenerationService.ts # AI recipe generation
│   │   ├── middleware/        # Custom middleware
│   │   │   └── rateLimiter.ts # Rate limiting middleware
│   │   ├── utils/             # Utility functions
│   │   │   └── ip.ts          # IP address utilities
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── redis.ts           # Redis client and utilities
│   │   ├── supabase.ts        # Supabase client configurations
│   │   ├── openai.ts          # OpenAI client configuration
│   │   └── design-system.ts   # Design system utilities and tokens
│   ├── types/                 # TypeScript type definitions
│   │   └── database.ts        # Database schema types
│   └── middleware.ts          # Next.js middleware
├── supabase/                  # Database schema and migrations
│   └── schema.sql             # Complete database schema
├── specs/                     # Project specifications
├── public/                    # Static assets
└── docs/                      # Documentation
    ├── README.md              # Documentation index
    ├── setup/                 # Setup and configuration guides
    │   ├── SUPABASE_SETUP.md  # Database setup guide
    │   ├── REDIS_SETUP.md     # Caching and rate limiting setup
    │   └── OPENAI_SETUP.md    # AI integration guide
    ├── design/                # Design system and specifications
    │   └── DESIGN_SYSTEM.md   # Comprehensive design system
    ├── development/           # Development planning and roadmap
    │   └── DEVELOPMENT_TODO.md # Phase-by-phase development plan
    └── recipejen_design_brief.md # Original design requirements
```

## 📖 Documentation

- [**📚 Documentation Index**](docs/README.md) - Complete documentation overview and navigation
- [**🛠️ Setup Guides**](docs/setup/) - Database, caching, and AI integration setup
  - [Supabase Setup](docs/setup/SUPABASE_SETUP.md) - Database configuration
  - [Redis Setup](docs/setup/REDIS_SETUP.md) - Caching and rate limiting
  - [OpenAI Setup](docs/setup/OPENAI_SETUP.md) - AI recipe generation
- [**🎨 Design System**](docs/design/DESIGN_SYSTEM.md) - Comprehensive UI/UX guidelines
- [**🚀 Development Roadmap**](docs/development/DEVELOPMENT_TODO.md) - Project planning and progress
- [**📋 Project Specifications**](specs/index.md) - Detailed feature specifications

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code analysis

### Key Features Implemented

- ✅ **Database Schema** - Complete PostgreSQL schema with RLS policies
- ✅ **Authentication** - NextAuth.js with Supabase integration
- ✅ **Caching** - Redis-powered caching for optimal performance
- ✅ **Rate Limiting** - API protection with configurable limits (10 requests/hour for recipe generation)
- ✅ **AI Recipe Generation** - OpenAI GPT-4o-mini integration with advanced constraint handling
- ✅ **Design System** - Comprehensive Tailwind CSS design system with food-inspired theming
- ✅ **Type Safety** - Full TypeScript implementation with Zod validation
- ✅ **Health Monitoring** - System health checks and monitoring

### Development Phases

**Phase 1** (Weeks 1-4): Core Features ✅ **COMPLETED**
- ✅ User authentication and profiles
- ✅ AI-powered recipe generation with OpenAI integration
- ✅ Recipe storage with Supabase database
- ✅ Comprehensive design system implementation

**Phase 2** (Weeks 5-8): Enhanced Features
- Advanced search and filtering
- Recipe customization engine
- Mobile optimization

**Phase 3** (Weeks 9-12): Social Features
- User following and profiles
- Recipe reviews and ratings
- Cooking challenges

**Phase 4** (Weeks 13-16): Smart Features
- Shopping list generation
- Pantry management
- Meal planning

**Phase 5** (Weeks 17-20): Advanced Features
- Video integration
- Voice commands and accessibility
- Analytics dashboard

## 🚀 Performance

- **Redis Caching**: 90%+ faster data retrieval with intelligent cache invalidation
- **Database Optimization**: Indexed queries and RLS policies for secure, fast access
- **Rate Limiting**: API protection against abuse (10 requests/hour for AI generation)
- **AI Cost Optimization**: GPT-4o-mini model for cost-effective recipe generation
- **Token Usage Tracking**: Monitor and optimize OpenAI API costs
- **Image Optimization**: Next.js automatic image optimization
- **Edge Runtime**: Optimized for Vercel Edge Network

## 🔒 Security

- **Row Level Security** (RLS) on all database tables
- **Rate limiting** on all API endpoints (10 requests/hour for AI generation)
- **Input validation** with Zod schemas for all API inputs
- **API key protection** with secure OpenAI key management
- **CSRF protection** via NextAuth.js
- **Environment variable validation** and secure configuration
- **User authentication** required for recipe generation and storage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues:

1. Check the [health endpoint](http://localhost:3000/api/health) for system status
2. Review the [setup guides](docs/setup/) for configuration issues
3. Consult the [documentation index](docs/README.md) for comprehensive guides
4. Verify all environment variables are configured correctly
5. Check the browser console and server logs for error messages

---

Built with ❤️ using Next.js 15, Supabase, and Upstash Redis.
