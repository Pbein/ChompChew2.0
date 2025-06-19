import { config } from 'dotenv';
config({ path: '.env.local' });

import OpenAI from 'openai';

async function testAIImageGeneration() {
  console.log('🧪 Testing AI Image Generation...');
  
  // Check if OpenAI key exists
  const apiKey = process.env.OPENAI_SECRET_KEY;
  if (!apiKey) {
    console.error('❌ No OPENAI_SECRET_KEY found in environment');
    return;
  }
  
  console.log('✅ OpenAI API key found');
  
  // Initialize OpenAI client
  const openai = new OpenAI({ apiKey });
  
  try {
    console.log('🎨 Testing Responses API with image generation...');
    
    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: 'Generate an image of a delicious chicken teriyaki bowl with rice and vegetables',
      tools: [{
        type: 'image_generation',
        size: '1024x1024',
        quality: 'medium',
        output_format: 'png',
      }],
    });
    
    console.log('📝 Response received:', {
      id: response.id,
      outputCount: response.output?.length || 0,
      outputTypes: response.output?.map(o => o.type) || []
    });
    
    // Extract image data
    const imageGenerationCalls = response.output?.filter(
      (output) => output.type === 'image_generation_call'
    );
    
    if (!imageGenerationCalls || imageGenerationCalls.length === 0) {
      console.error('❌ No image generation calls found in response');
      console.log('Full response:', JSON.stringify(response, null, 2));
      return;
    }
    
    const imageCall = imageGenerationCalls[0];
    console.log('🖼️ Image generation call:', {
      type: imageCall.type,
      status: imageCall.status,
      hasResult: !!imageCall.result
    });
    
    if (imageCall.status !== 'completed' || !imageCall.result) {
      console.error('❌ Image generation failed:', imageCall.status);
      return;
    }
    
    console.log('✅ AI image generation successful!');
    console.log('📊 Image data length:', imageCall.result.length);
    
  } catch (error) {
    console.error('❌ AI image generation error:', error.message);
    console.error('Error details:', error);
  }
}

testAIImageGeneration().catch(console.error); 