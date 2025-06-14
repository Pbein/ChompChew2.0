'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/recipe/HeroSection'
import { EnhancedSearchQuery } from '@/types/dietary-preferences'

export default function HomePage() {
  const router = useRouter()

  const handleSearch = async (query: EnhancedSearchQuery) => {
    // TODO: Implement search functionality
    // This will redirect to search results or trigger recipe generation
    console.log('Enhanced search query:', query)
    
    // For now, we'll redirect to the generate page with the serialized query
    // In a real implementation, this would call the search API
    const searchParams = new URLSearchParams()
    if (query.ingredients.length > 0) {
      searchParams.set('ingredients', query.ingredients.join(','))
    }
    if (query.calorieGoal) {
      searchParams.set('calories', query.calorieGoal.toString())
    }
    if (query.macroTargets) {
      searchParams.set('macros', JSON.stringify(query.macroTargets))
    }
    if (query.dietaryRestrictions.length > 0) {
      searchParams.set('dietary', query.dietaryRestrictions.join(','))
    }
    if (query.avoidFoods.length > 0) {
      searchParams.set('avoid', query.avoidFoods.join(','))
    }
    
    router.push(`/generate?${searchParams.toString()}`)
  }

  const handleDietQuickSet = () => {
    // TODO: Open diet configuration modal
    console.log('Opening diet configuration modal')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection 
          onSearch={handleSearch}
          onDietQuickSet={handleDietQuickSet}
        />
        
        {/* Featured Recipes Section */}
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Featured Recipes
            </h2>
            <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed">
              Discover popular recipes created by our AI chef
            </p>
            
            {/* Enhanced recipe cards with better styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { id: 1, title: "Mediterranean Delight", time: "25 min", difficulty: "Easy", cuisine: "Mediterranean" },
                { id: 2, title: "Asian Fusion Bowl", time: "30 min", difficulty: "Medium", cuisine: "Asian" },
                { id: 3, title: "Comfort Classic", time: "45 min", difficulty: "Easy", cuisine: "American" }
              ].map((recipe) => (
                <div 
                  key={recipe.id}
                  className="group relative bg-card rounded-3xl h-96 overflow-hidden border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                >
                  {/* Enhanced gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/15 to-secondary/15 group-hover:from-primary/20 group-hover:via-accent/20 group-hover:to-secondary/20 transition-all duration-300" />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-3xl">🍽️</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors duration-300">
                      {recipe.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      Coming soon - AI-generated {recipe.cuisine.toLowerCase()} recipes tailored to your taste preferences
                    </p>
                    
                    <div className="flex gap-3 mb-4">
                      <span className="px-4 py-2 bg-primary/15 text-primary text-sm rounded-full font-semibold border border-primary/20">
                        ⏱️ {recipe.time}
                      </span>
                      <span className="px-4 py-2 bg-secondary/15 text-secondary text-sm rounded-full font-semibold border border-secondary/20">
                        👨‍🍳 {recipe.difficulty}
                      </span>
                    </div>
                    
                    <span className="px-4 py-2 bg-accent/15 text-accent text-xs rounded-full font-medium border border-accent/20">
                      {recipe.cuisine} Cuisine
                    </span>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30">
          <div className="container mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
              How ChompChew Works
            </h2>
            <p className="text-xl text-muted-foreground mb-20 max-w-3xl mx-auto leading-relaxed">
              Get personalized recipes in three simple steps
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
              {[
                {
                  step: 1,
                  icon: "🔍",
                  title: "Tell Us What You Have",
                  description: "Enter your available ingredients and dietary preferences. Our AI understands your constraints and preferences.",
                  gradient: "from-primary to-accent"
                },
                {
                  step: 2,
                  icon: "🤖",
                  title: "AI Creates Your Recipe",
                  description: "Our AI chef generates a personalized recipe just for you, considering your dietary needs and taste preferences.",
                  gradient: "from-accent to-secondary"
                },
                {
                  step: 3,
                  icon: "🍳",
                  title: "Start Cooking",
                  description: "Follow step-by-step instructions with interactive cooking mode and enjoy your personalized meal.",
                  gradient: "from-secondary to-primary"
                }
              ].map((item) => (
                <div key={item.step} className="text-center group">
                  <div className="relative mb-10">
                    <div className={`w-28 h-28 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                      <span className="text-5xl">{item.icon}</span>
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="py-16 px-4 border-t border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🍽️</span>
              </div>
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ChompChew
              </span>
            </div>
            <p className="text-muted-foreground mb-8 text-lg">
              Made with ❤️ for food lovers everywhere
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
              <span className="font-medium">© 2024 ChompChew</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
              <span className="font-medium">AI-Powered Recipe Discovery</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
              <span className="font-medium">Privacy First</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
