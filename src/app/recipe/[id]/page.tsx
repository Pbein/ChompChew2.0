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

  // Access properties with proper fallbacks
  const nutrition = recipe.nutrition_info as Record<string, number> | null
  const instructions = recipe.instructions as { step: number; text: string }[] | undefined
  const ingredients = recipe.ingredients as { name: string; amount: string }[] | undefined

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{recipe.title}</h1>

      {recipe.description && (
        <p className="text-lg text-gray-800 dark:text-gray-200">{recipe.description}</p>
      )}

      {recipe.image_url && (
        <div className="relative w-full h-64 rounded-xl overflow-hidden shadow">
          <Image src={recipe.image_url} alt={recipe.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px" className="object-cover" />
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