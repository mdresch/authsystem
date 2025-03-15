// app/api/claude/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model, max_tokens, temperature } = body;
    
    // Claude API requires specific model name format
    const modelName = model === "Claude 3.7 Sonnet" ? "claude-3-7-sonnet-20250219" : model;
    
    // Prepare the request to Claude API
    const claudeRequest = {
      model: modelName,
      messages: messages,
      max_tokens: max_tokens || 4096,
      temperature: temperature || 0.7,
    };
    
    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(claudeRequest),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from Claude' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error processing Claude request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}