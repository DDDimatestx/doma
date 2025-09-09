import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Zap, Globe, AlertCircle, Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { GeminiService, type GeminiResponse } from '@/services/geminiService';
import { ResultsDisplay } from '@/components/ResultsDisplay';

const Index = () => {
  const [domain, setDomain] = useState('');
  const [apiKey, setApiKey] = useState('AIzaSyAAvk0xo8TPOfYdTC0uhQkdk-apnE28auM');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeminiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain name');
      return;
    }

    if (!apiKey.trim()) {
      toast.error('Please enter your Google AI Studio API key');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const geminiService = new GeminiService(apiKey);
      const response = await geminiService.generateDomainCopy(domain.trim());
      setResults(response);
      toast.success('Marketing copy generated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Domain Marketing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            DomainFluent.ai
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate compelling marketing copy, SEO-optimized headlines, and persuasive descriptions for any domain name in seconds.
          </p>
        </header>

        {/* API Key Input */}
        <Card className="max-w-2xl mx-auto mb-8 border-2 transition-smooth hover:shadow-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Key className="h-5 w-5 text-primary" />
              Google AI Studio API Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="api-key" className="text-sm font-medium">
                Enter your API key from{' '}
                <a 
                  href="https://aistudio.google.com/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  Google AI Studio
                </a>
              </Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="font-mono text-sm border-2 focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers. It's used directly to communicate with Google's API.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Domain Input */}
        <Card className="max-w-2xl mx-auto mb-8 border-2 transition-smooth hover:shadow-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Globe className="h-6 w-6 text-primary" />
              Domain Name Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="domain-input" className="text-base font-medium">
                Enter your domain name
              </Label>
              <Input
                id="domain-input"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., crypto.cool, myawesome.shop, techstartup.io"
                className="text-lg p-4 border-2 focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !domain.trim() || !apiKey.trim()}
              size="lg"
              className="w-full bg-gradient-primary hover:shadow-glow transition-smooth py-4 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Marketing Copy...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Generate Marketing Copy
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-base">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-12">
            <ResultsDisplay results={results} domain={domain} />
          </div>
        )}

        {/* Features */}
        {!results && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6 transition-smooth hover:shadow-smooth border-2">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Content</h3>
              <p className="text-muted-foreground text-sm">
                Leverage Google's Gemini AI to create compelling, professional marketing copy.
              </p>
            </Card>
            
            <Card className="text-center p-6 transition-smooth hover:shadow-smooth border-2">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">SEO Optimized</h3>
              <p className="text-muted-foreground text-sm">
                Generate meta tags and keywords that help your domain rank better in search results.
              </p>
            </Card>
            
            <Card className="text-center p-6 transition-smooth hover:shadow-smooth border-2">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Results</h3>
              <p className="text-muted-foreground text-sm">
                Get professional marketing copy in seconds, ready to copy and use immediately.
              </p>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
