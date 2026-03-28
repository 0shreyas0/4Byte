export interface CompileRequest {
  user_id: string;
  code: string;
  language?: string;
}

export interface CompileResponse {
  success: boolean;
  line_number?: number;
  error_type?: string;
  raw_error?: string;
  faulty_line?: string;
  explanation: string;
  rag_explanation?: string;
  rag_docs?: string[];
  suggestions: string[];
  weak_topics: string[];
  common_errors: string[];
}

export interface UserStatsResponse {
  user_id: string;
  total_errors_recorded: number;
  weak_topics: string[];
  common_errors: string[];
  topic_counts: Record<string, number>;
  error_type_counts: Record<string, number>;
  last_error_at?: string;
}

export interface AnalysisRequest {
  domain: string;
  weak_topics: string[];
  micro_gaps: string[];
  root_cause: string;
  results?: any[]; // QuestionResult[]
}

export interface QuestionAnalysis {
  question_id: string;
  topic: string;
  concept: string;
  is_correct: boolean;
  mentor_thought_process: string;
  key_takeaway: string;
}

export interface AnalysisResponse {
  summary: string;
  reasoning_chain: string[];
  detailed_report?: QuestionAnalysis[];
}

const RAG_API_URL = process.env.NEXT_PUBLIC_RAG_API_URL || 'http://localhost:8000';

export async function compileAndExplain(
  userId: string,
  code: string,
  language: string = 'python'
): Promise<CompileResponse> {
  const response = await fetch(`${RAG_API_URL}/compile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      code: code,
      language: language,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get explanation from RAG service');
  }

  return response.json();
}

export async function getUserStats(userId: string): Promise<UserStatsResponse> {
  const response = await fetch(`${RAG_API_URL}/user/${userId}/stats`);

  if (!response.ok) {
    throw new Error('Failed to get user stats from RAG service');
  }

  return response.json();
}

export async function analyzePerformanceAI(
  domain: string,
  weakTopics: string[],
  microGaps: string[],
  rootCause: string,
  results?: any[]
): Promise<AnalysisResponse> {
  const response = await fetch(`${RAG_API_URL}/analyze/performance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain,
      weak_topics: weakTopics,
      micro_gaps: microGaps,
      root_cause: rootCause,
      results
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get overall performance analysis from RAG service');
  }

  return response.json();
}
