# 🎯 ChompChew Project Vision & Alignment

## 📋 Product Description
**ChompChew is a Next.js–based recipe discovery platform that removes the daily "What can I actually eat?" anxiety. Start by typing an ingredient, calorie goal, or macro target into the hero search bar. Optionally open the Diet Quick-Set modal to declare foods you embrace (List Y) or must avoid (List Z), including personal trigger items for conditions like ulcerative colitis.**

---

## 🎯 Core Mission
**Remove the daily "What can I actually eat?" anxiety** by providing personalized, AI-powered recipe discovery that respects individual dietary needs, restrictions, and health conditions.

## 🔑 Key Value Propositions

### 1. **Anxiety Reduction**
- **Problem**: Daily decision fatigue around meal planning
- **Solution**: Intelligent suggestions based on available ingredients and personal constraints
- **Target**: People with dietary restrictions, health conditions, busy lifestyles

### 2. **Flexible Input Methods**
- **Ingredient-based**: "I have chicken and broccoli"
- **Calorie-focused**: "I need a 400-calorie lunch"
- **Macro-targeted**: "High protein, low carb meal"
- **Constraint-aware**: "Avoid gluten and dairy"

### 3. **Medical Condition Support**
- **Trigger Foods**: Specific items that cause flare-ups (UC, Crohn's, IBS)
- **Allergen Management**: Comprehensive avoidance lists
- **Nutritional Therapy**: Support for specific dietary protocols

---

## 📊 Current Implementation Status

### ✅ **IMPLEMENTED FEATURES**

#### **Hero Search Bar** ✅
- ✅ Ingredient-based search with categorized suggestions
- ✅ Enhanced UX with popular ingredients and category browser
- ✅ Proper visual hierarchy and accessibility
- ❌ **MISSING**: Calorie goal input
- ❌ **MISSING**: Macro target input

#### **AI Recipe Generation** ✅
- ✅ OpenAI integration with structured prompts
- ✅ Secure, rate-limited Server Action
- ✅ Zod validation for robust error handling
- ✅ User permission checks (premium/admin access)
- ✅ Comprehensive unit, integration, and E2E tests (159+ tests passing)
- ✅ Handles dietary restrictions, nutrition calculation, and recipe adaptation.

#### **Design System** ✅
- ✅ Comprehensive color palette for dietary categories
- ✅ Accessibility-compliant contrast ratios
- ✅ Responsive design patterns
- ✅ Animation and interaction guidelines

#### **Diet Quick-Set Foundation** ✅
- ✅ Diet badge selection (Vegetarian, Vegan, Keto, etc.)
- ✅ Visual feedback for selected preferences
- ✅ Integration with search functionality
- ❌ **MISSING**: Full Diet Quick-Set modal
- ❌ **MISSING**: List Y (embrace) and List Z (avoid) management
- ❌ **MISSING**: Medical condition trigger foods

### ❌ **CRITICAL GAPS**

#### **1. Search Input Limitations**
- **Current**: Only ingredient-based search
- **Needed**: Calorie goal input field
- **Needed**: Macro target specification (protein/carbs/fat ratios)
- **Needed**: Combined search modes

#### **2. Diet Quick-Set Modal**
- **Current**: Basic diet badges only
- **Needed**: Full modal with List Y/Z management
- **Needed**: Medical condition support
- **Needed**: Trigger food specification
- **Needed**: Severity indicators (preference vs. medical necessity)

#### **3. Personalization Depth**
- **Current**: Session-based preferences
- **Needed**: User profiles and saved preferences
- **Needed**: Learning from user interactions
- **Needed**: Condition-specific recommendations

---

## 🚀 Priority Development Roadmap

### **Phase 1: Core Search Enhancement** (IMMEDIATE)
1. **Enhanced Search Bar**
   - Add calorie goal input field
   - Add macro target sliders/inputs
   - Implement multi-mode search (ingredient + calories + macros)
   - Update search prompt generation

2. **Diet Quick-Set Modal**
   - Build full modal component
   - Implement List Y (embrace foods) management
   - Implement List Z (avoid foods) management
   - Add medical condition categories

### **Phase 2: Medical Condition Support** (HIGH PRIORITY)
1. **Trigger Food Management**
   - UC/Crohn's/IBS specific food categories
   - Severity indicators (mild discomfort vs. severe reaction)
   - Personal trigger food addition
   - Safety warnings in recipe generation

2. **Nutritional Therapy Support**
   - Low-FODMAP diet support
   - Anti-inflammatory food emphasis
   - Elimination diet protocols
   - Gut-healing ingredient suggestions

### **Phase 3: Personalization & Learning** (MEDIUM PRIORITY)
1. **User Profiles**
   - Save dietary preferences
   - Track successful recipes
   - Learn from user feedback
   - Personalized recommendations

2. **Advanced Recipe Adaptation**
   - Real-time macro optimization
   - Ingredient substitution suggestions
   - Portion scaling for calorie targets
   - Seasonal ingredient swapping

---

## 🎯 Success Metrics

### **User Experience Metrics**
- **Anxiety Reduction**: User surveys on meal planning stress
- **Decision Speed**: Time from search to recipe selection
- **Success Rate**: Percentage of searches resulting in cooked meals
- **Return Usage**: Daily/weekly active users

### **Technical Metrics**
- **Search Accuracy**: Relevance of recipe suggestions
- **Dietary Compliance**: Zero tolerance for allergen inclusion
- **Performance**: Sub-2-second search response times
- **Accessibility**: WCAG 2.2 AA compliance

### **Health Impact Metrics**
- **Condition Management**: User-reported symptom improvement
- **Nutritional Goals**: Achievement of macro/calorie targets
- **Dietary Adherence**: Consistency with prescribed diets
- **Quality of Life**: Reduced meal planning anxiety

---

## 🔧 Technical Architecture Alignment

### **Current Stack Evaluation**
- ✅ **Next.js**: Excellent choice for SEO and performance
- ✅ **TypeScript**: Critical for dietary restriction safety
- ✅ **Tailwind CSS**: Rapid UI development with design system
- ✅ **OpenAI**: Powerful recipe generation capabilities
- ✅ **Supabase**: Scalable for user profiles and preferences

### **Required Enhancements**
- **Search Service**: Multi-modal input processing
- **Nutrition API**: Accurate macro/calorie calculations
- **Medical Database**: Trigger foods and condition mappings
- **User Preference Engine**: Learning and personalization
- **Safety Validation**: Allergen and trigger food checking

---

## 📝 Documentation Updates Needed

1. **User Stories**: Detailed personas including medical conditions
2. **API Specifications**: Multi-modal search endpoints
3. **Safety Protocols**: Allergen and trigger food validation
4. **Testing Strategy**: Medical condition scenario testing
5. **Accessibility Guidelines**: Screen reader and keyboard navigation

---

## 🎯 Next Steps

### **Immediate Actions** (This Sprint)
1. Implement calorie goal input in search bar
2. Add macro target specification UI
3. Begin Diet Quick-Set modal development
4. Update recipe generation prompts for multi-modal input

### **Short Term** (Next 2 Sprints)
1. Complete Diet Quick-Set modal with List Y/Z
2. Add medical condition categories
3. Implement trigger food management
4. Add safety warnings to recipe generation

### **Medium Term** (Next Quarter)
1. User profile system
2. Advanced personalization
3. Learning algorithms
4. Comprehensive testing with medical conditions

---

**The vision is clear: ChompChew should be the go-to solution for anyone who struggles with "What can I actually eat?" - whether due to allergies, medical conditions, dietary preferences, or simply decision fatigue. Every feature should serve this core mission.** 