export interface GeminiResponse {
  description: string;
  metaTags: string[];
  headline: string;
}

export interface GeminiError {
  message: string;
  code?: string;
}

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateDomainCopy(domain: string): Promise<GeminiResponse> {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    if (!domain.trim()) {
      throw new Error('Domain name is required');
    }

    const requestBody = {
      contents: [{
        parts: [{
          text: `You are an expert domain name broker and SEO specialist. Generate compelling marketing copy for the following domain name: '${domain}'. Your response MUST be a valid JSON object with the following keys: 'description' (a 2-3 sentence persuasive sales pitch), 'metaTags' (an array of 5-7 SEO meta keywords), and 'headline' (a single, catchy headline for a landing page). Do not add any other text or formatting outside of the JSON object.`
        }]
      }]
    };

    try {
      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Invalid API key or request format');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (response.status === 403) {
          throw new Error('API key access denied. Please check your API key permissions.');
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Clean the response text - remove markdown code blocks if present
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const parsedResponse = JSON.parse(cleanedText) as GeminiResponse;
        
        // Validate required fields
        if (!parsedResponse.description || !parsedResponse.metaTags || !parsedResponse.headline) {
          throw new Error('Response missing required fields');
        }

        if (!Array.isArray(parsedResponse.metaTags)) {
          throw new Error('Meta tags must be an array');
        }

        return parsedResponse;
      } catch (parseError) {
        console.error('Failed to parse JSON response:', cleanedText);
        throw new Error('Failed to parse API response. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred. Please check your internet connection.');
    }
  }
}