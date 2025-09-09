import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { GeminiResponse } from '@/services/geminiService';

interface ResultsDisplayProps {
  results: GeminiResponse;
  domain: string;
}

export function ResultsDisplay({ results, domain }: ResultsDisplayProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(label));
      toast.success(`${label} copied to clipboard!`);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(label);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => {
    const isCopied = copiedItems.has(label);
    
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(text, label)}
        className="transition-smooth hover:shadow-smooth"
      >
        {isCopied ? (
          <>
            <Check className="h-4 w-4 mr-2 text-success" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </>
        )}
      </Button>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          Generated for {domain}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {/* Headline Section */}
        <Card className="transition-smooth hover:shadow-smooth border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                Landing Page Headline
              </CardTitle>
              <CopyButton text={results.headline} label="Headline" />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {results.headline}
            </h2>
          </CardContent>
        </Card>

        {/* Description Section */}
        <Card className="transition-smooth hover:shadow-smooth border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                Sales Description
              </CardTitle>
              <CopyButton text={results.description} label="Description" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {results.description}
            </p>
          </CardContent>
        </Card>

        {/* Meta Tags Section */}
        <Card className="transition-smooth hover:shadow-smooth border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                SEO Keywords
              </CardTitle>
              <CopyButton text={results.metaTags.join(', ')} label="Keywords" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.metaTags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-sm py-1 px-3 transition-smooth hover:bg-accent hover:text-accent-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Copy All Button */}
        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            className="bg-gradient-primary hover:shadow-glow transition-smooth px-8 py-3 text-lg font-semibold"
            onClick={() => {
              const allContent = `Headline: ${results.headline}\n\nDescription: ${results.description}\n\nSEO Keywords: ${results.metaTags.join(', ')}`;
              copyToClipboard(allContent, 'All Content');
            }}
          >
            <Copy className="h-5 w-5 mr-2" />
            Copy All Content
          </Button>
        </div>
      </div>
    </div>
  );
}