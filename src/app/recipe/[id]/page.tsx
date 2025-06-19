import { Metadata } from 'next'
import { fetchRecipe } from '@/lib/recipes'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface RecipePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { id } = await params
  const recipe = await fetchRecipe(id)
  return {
    title: recipe?.title || 'Recipe'
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params
  const recipe = await fetchRecipe(id)
  
  if (!recipe) return notFound()

  // Access properties with proper fallbacks and data normalization
  const nutrition = recipe.nutrition_info as Record<string, number> | null
  
  // Handle different instruction formats from database
  let instructions: { step: number; text: string }[] | undefined
  if (recipe.instructions) {
    if (Array.isArray(recipe.instructions)) {
      // Check if it's already in the correct format
      if (recipe.instructions.length > 0 && typeof recipe.instructions[0] === 'object' && 'text' in recipe.instructions[0]) {
        instructions = recipe.instructions as { step: number; text: string }[]
      } else if (recipe.instructions.length > 0 && typeof recipe.instructions[0] === 'string') {
        // Convert string array to object format
        instructions = (recipe.instructions as unknown as string[]).map((text, index) => ({
          step: index + 1,
          text: text
        }))
      }
    }
  }
  
  // Handle ingredients - might be string array or object array
  let ingredients: { name: string; amount: string }[] | undefined
  if (recipe.ingredients) {
    if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
      if (typeof recipe.ingredients[0] === 'object' && 'name' in recipe.ingredients[0]) {
        ingredients = recipe.ingredients as { name: string; amount: string }[]
      } else if (typeof recipe.ingredients[0] === 'string') {
        // Convert string array to object format
        ingredients = (recipe.ingredients as unknown as string[]).map((item) => {
          // Try to split amount and name (e.g., "1 cup flour" -> {amount: "1 cup", name: "flour"})
          const parts = item.split(' ')
          if (parts.length >= 3) {
            const amount = parts.slice(0, 2).join(' ')
            const name = parts.slice(2).join(' ')
            return { amount, name }
          } else {
            return { amount: '', name: item }
          }
        })
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{recipe.title}</h1>

      {recipe.description && (
        <p className="text-lg text-gray-800 dark:text-gray-200">{recipe.description}</p>
      )}

      {recipe.image_url && (
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow bg-gray-100">
          <Image 
            src={recipe.image_url} 
            alt={recipe.title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px" 
            className="object-cover"
            onError={(e) => {
              // Fallback to a default image if the image fails to load
              e.currentTarget.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80'
            }}
          />
        </div>
      )}

      {/* Recipe Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <span className="block text-sm text-gray-700 dark:text-gray-300">Prep Time</span>
          <span className="text-lg font-semibold">{recipe.prep_time || 0} min</span>
        </div>
        {recipe.cook_time && (
          <div className="text-center">
            <span className="block text-sm text-gray-700 dark:text-gray-300">Cook Time</span>
            <span className="text-lg font-semibold">{recipe.cook_time} min</span>
          </div>
        )}
        <div className="text-center">
          <span className="block text-sm text-gray-700 dark:text-gray-300">Servings</span>
          <span className="text-lg font-semibold">{recipe.servings || 1}</span>
        </div>
        <div className="text-center">
          <span className="block text-sm text-gray-700 dark:text-gray-300">Difficulty</span>
          <span className="text-lg font-semibold capitalize">{recipe.difficulty || 'Easy'}</span>
        </div>
      </div>

      {/* Dietary Tags */}
      {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Dietary Information</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.dietary_tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Nutrition */}
      {nutrition && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Nutrition (per serving)</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(nutrition).map(([k, v]) => (
              <li key={k} className="p-3 bg-gray-50 rounded-lg text-center">
                <span className="block text-gray-700 capitalize">{k}</span>
                <span className="font-semibold text-emerald-700">{v}g</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Ingredients */}
      {ingredients && ingredients.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
          <ul className="list-disc ml-6 space-y-1">
            {ingredients.map((ing, index) => (
              <li key={index}><span className="font-medium">{ing.amount}</span> {ing.name}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Instructions */}
      {instructions && instructions.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Instructions</h2>
          <ol className="list-decimal ml-6 space-y-3">
            {instructions.map((step, index) => (
              <li key={`step-${step.step || index}`}>{step.text}</li>
            ))}
          </ol>
        </section>
      )}

      {/* Additional Info */}
      <div className="mt-8 p-6 bg-emerald-50 rounded-lg">
        <div className="flex items-center justify-between">
          {recipe.calories_per_serving && (
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Calories per serving:</span>
              <span className="ml-2 text-lg font-semibold text-emerald-700">
                {recipe.calories_per_serving}
              </span>
            </div>
          )}
          {recipe.rating_average && (
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Rating:</span>
              <span className="ml-2 text-lg font-semibold text-emerald-700">
                {recipe.rating_average}/5 ⭐
              </span>
            </div>
          )}
        </div>
        {recipe.safety_validated && (
          <div className="mt-4 flex items-center text-emerald-700">
            <span className="text-sm">✅ Safety validated - This recipe has been reviewed for common allergens and dietary restrictions</span>
          </div>
        )}
      </div>
    </div>
  )
} 