export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface FetcherOptions extends RequestInit {
  token?: string;
  baseUrl?: string;
}

export const fetcher = async <T>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> => {
  const { token, baseUrl = '', ...rest } = options;
  
  const headers = new Headers(rest.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${url}`, {
    ...rest,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'An error occurred while fetching data.',
      response.status,
      data
    );
  }

  return data as T;
};

// Common usage helpers
export const api = {
  get: <T>(url: string, options?: FetcherOptions) => 
    fetcher<T>(url, { ...options, method: 'GET' }),
    
  post: <T>(url: string, body: any, options?: FetcherOptions) => 
    fetcher<T>(url, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(body) 
    }),
    
  put: <T>(url: string, body: any, options?: FetcherOptions) => 
    fetcher<T>(url, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(body) 
    }),
    
  delete: <T>(url: string, options?: FetcherOptions) => 
    fetcher<T>(url, { ...options, method: 'DELETE' }),
};
