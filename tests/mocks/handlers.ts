import { http, HttpResponse } from 'msw'

export const handlers = [
  // OpenAI API mock
  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json({
      id: 'chatcmpl-test',
      object: 'chat.completion',
      created: Date.now(),
      model: 'gpt-4',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: JSON.stringify({
              title: 'Test Recipe',
              description: 'A test recipe for unit testing',
              ingredients: ['1 cup test ingredient'],
              instructions: ['Mix test ingredients'],
              prepTime: 10,
              cookTime: 20,
              servings: 4,
              nutrition: {
                calories: 200,
                protein: 10,
                carbs: 20,
                fat: 8,
                fiber: 2,
              },
              tags: ['test', 'healthy'],
            }),
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 200,
        total_tokens: 300,
      },
    })
  }),

  // Supabase API mocks
  http.get('https://test.supabase.co/rest/v1/*', () => {
    return HttpResponse.json([])
  }),

  http.post('https://test.supabase.co/rest/v1/*', () => {
    return HttpResponse.json({ id: 1 })
  }),

  // Redis/Cache API mocks
  http.get('/api/cache/*', () => {
    return HttpResponse.json(null)
  }),

  http.post('/api/cache/*', () => {
    return HttpResponse.json({ success: true })
  }),
] 