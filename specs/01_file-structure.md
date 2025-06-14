## File System
```
Frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── recipe/
│   │   │   └── [id]/
│   │   ├── cookbook/
│   │   ├── share/
│   │   │   └── [shareId]/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── recipes/
│   │   │   ├── generate/
│   │   │   └── user/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                 # Radix UI primitives
│   │   ├── recipe/
│   │   ├── auth/
│   │   └── common/
│   ├── lib/
│   │   ├── db/                 # Prisma client
│   │   ├── auth/               # NextAuth config
│   │   ├── ai/                 # OpenAI integration
│   │   ├── utils/
│   │   └── validators/         # Zod schemas
│   └── hooks/                  # Custom React hooks
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── images/
│   └── icons/
└── package.json

Backend/
├── Database (PostgreSQL)
├── Redis (Upstash)
├── OpenAI API
├── NextAuth providers
└── External APIs
    ├── USDA FoodData Central
    └── Nutrition APIs
```

---

## Feature Specifications