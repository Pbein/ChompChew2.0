import { Metadata } from 'next'
import { fetchRecipe } from '@/lib/recipes'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface RecipePageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await fetchRecipe(params.id)
  return {
    title: recipe?.title || 'Recipe'
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await fetchRecipe(params.id)
  if (!recipe) return notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r: any = recipe
  const nutrition = r.nutrition_info as Record<string, number> | null
  const instructions = r.instructions as { step: number; text: string }[]
  const ingredients = r.ingredients as { name: string; amount: string }[]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>

      {recipe.image_url && (
        <div className="relative w-full h-64 rounded-xl overflow-hidden shadow">
          <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover" />
        </div>
      )}

      {/* Nutrition */}
      {nutrition && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Nutrition (per serving)</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(nutrition).map(([k, v]) => (
              <li key={k} className="p-3 bg-gray-50 rounded-lg text-center">
                <span className="block text-gray-700 capitalize">{k}</span>
                <span className="font-semibold text-emerald-700">{v}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Ingredients */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
        <ul className="list-disc ml-6 space-y-1">
          {ingredients.map((ing) => (
            <li key={ing.name}><span className="font-medium">{ing.amount}</span> {ing.name}</li>
          ))}
        </ul>
      </section>

      {/* Instructions */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Instructions</h2>
        <ol className="list-decimal ml-6 space-y-3">
          {instructions.map((step) => (
            <li key={step.step}>{step.text}</li>
          ))}
        </ol>
      </section>
    </div>
  )
} 