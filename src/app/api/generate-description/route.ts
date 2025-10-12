import { NextRequest, NextResponse } from 'next/server';

/**
 * OpenRouter AI API Route
 * Generates professional descriptions using GPT-OSS-20B free model
 */

const OPENROUTER_API_KEY = process.env.NEXT_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Model for description generation
const MODEL = 'openai/gpt-oss-20b:free';

interface GenerateRequest {
  prompt: string;
  context?: string;
  type?: 'summary' | 'experience' | 'project' | 'general';
}

/**
 * Generate description using a specific model
 */
async function generateWithModel(
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Resume Builder',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Model ${model} error:`, error);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error(`Error with model ${model}:`, error);
    throw error;
  }
}

/**
 * Get system prompt based on description type
 */
function getSystemPrompt(type: string): string {
  const prompts = {
    summary: `You are a professional resume writer specializing in crafting compelling professional summaries. 
Create a concise, impactful professional summary (2-3 sentences) that highlights the candidate's expertise, 
experience, and career goals. Use action-oriented language and quantify achievements when possible.`,
    
    experience: `You are a professional resume writer specializing in job descriptions. 
Create a compelling job description that highlights responsibilities, achievements, and impact. 
Use bullet points, action verbs, and quantify results when possible. Focus on accomplishments rather than duties.`,
    
    project: `You are a professional resume writer specializing in project descriptions. 
Create a concise, impactful project description that highlights the problem solved, technologies used, 
and measurable outcomes. Focus on your role and the project's impact.`,
    
    general: `You are a professional resume writer. Create clear, concise, and impactful professional content 
that showcases skills, achievements, and value. Use professional language and focus on results.`,
  };

  return prompts[type as keyof typeof prompts] || prompts.general;
}

/**
 * POST /api/generate-description
 * Generates descriptions using both AI models
 */
export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: GenerateRequest = await request.json();
    const { prompt, context, type = 'general' } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Build system and user prompts
    const systemPrompt = getSystemPrompt(type);
    const userPrompt = context
      ? `Context: ${context}\n\nUser Input: ${prompt}\n\nGenerate a professional description based on the above information.`
      : `User Input: ${prompt}\n\nGenerate a professional description based on the above information.`;

    // Generate description with GPT model
    const description = await generateWithModel(MODEL, systemPrompt, userPrompt);

    // Return result
    return NextResponse.json({
      success: true,
      description,
    });
  } catch (error) {
    console.error('Generate description error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate description' },
      { status: 500 }
    );
  }
}
