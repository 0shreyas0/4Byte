import { z } from 'zod';
import { generateAIResponse } from '../ai/openai';

/**
 * AI Agent Framework Core
 * Designed for High-Performance Hackathon Projects
 */

export const ExtractorAgent = async <T extends z.ZodType>(
  input: string,
  schema: T,
  instruction: string = "Extract the following information in strict JSON format."
): Promise<z.infer<T>> => {
  const prompt = `
    ${instruction}
    
    Input: ${input}
    
    Format the response as a JSON object that strictly follows this schema:
    ${JSON.stringify(schema.description || 'No description provided')}
    
    Example Structure:
    ${JSON.stringify(schema.parse(undefined as any))}
    
    Return ONLY valid JSON.
  `;

  const response = await generateAIResponse(prompt, 'llama-3.3-70b-versatile');
  
  try {
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Agent Extraction Failed:", e);
    throw new Error("Failed to parse agent response into structured data.");
  }
};

export const SummarizerAgent = async (text: string, length: 'short' | 'detailed' = 'short') => {
  const prompt = `Summarize the following text in a ${length} manner. Use bullet points for key takeaways. \n\nText: ${text}`;
  return await generateAIResponse(prompt);
};

export const ResearchAgent = async (topic: string) => {
  const prompt = `You are a Research Agent. Conduct a deep dive into: ${topic}. 
  Provide:
  1. Overview
  2. Top 3 current trends
  3. Key challenges
  4. Suggested tech stack for a startup in this space.`;
  return await generateAIResponse(prompt);
};

export const FileProcessingAgent = async (fileText: string, query: string = "Summarize the key findings of this document.") => {
  const prompt = `
    You are an Expert Document Auditor. 
    Analyze the following extracted text from a document and answer the user query.
    
    Document Text: 
    ${fileText.substring(0, 8000)} // Context limit safety
    
    Query: ${query}
    
    Provide a professional, structured analysis.
  `;
  return await generateAIResponse(prompt);
};
