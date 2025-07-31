import type { Context, Config } from "@netlify/functions";
import { createClient } from '@supabase/supabase-js';

export default async (req: Request, context: Context) => {
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  try {
    const { message, visionDocument, recentChats } = await req.json();

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      throw new Error('No user found');
    }

    // For now, return a placeholder response
    // In production, this would call OpenAI API
    const aiResponse = generatePlaceholderResponse(message, visionDocument);

    // Save the AI response to the database
    const { data, error } = await supabase
      .from('vision_chats')
      .insert({
        user_id: user.id,
        message: aiResponse,
        role: 'assistant',
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ data }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
};

export const config: Config = {
  path: "/api/vision-chat"
};

function generatePlaceholderResponse(message: string, visionDocument: any): string {
  if (!visionDocument) {
    return "I'd be happy to help you define your vision! Let's start by exploring what matters most to you. What are your core values and what kind of impact do you want to make in your field?";
  }

  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('mission') || lowerMessage.includes('purpose')) {
    return "Your mission is the North Star that guides all your decisions. Based on what you've shared, consider how your daily actions align with this larger purpose. What small steps can you take today that move you closer to this vision?";
  }
  
  if (lowerMessage.includes('goal') || lowerMessage.includes('achieve')) {
    return "Breaking down your goals into actionable steps is key. Start with your most important goal and work backwards - what needs to happen this quarter, this month, and this week to make progress?";
  }
  
  if (lowerMessage.includes('value') || lowerMessage.includes('principle')) {
    return "Your values are the compass that keeps you on course when the seas get rough. How can you ensure your daily decisions and actions reflect these core principles?";
  }
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('tool') || lowerMessage.includes('learn')) {
    return "Continuous learning is essential for growth. Based on your goals, identify the top 2-3 skills that would have the most impact. Focus on depth rather than breadth - mastery comes from deliberate practice.";
  }

  return "That's an interesting question! Reflecting on your vision document, consider how this connects to your broader mission and goals. What specific aspect would you like to explore further?";
}