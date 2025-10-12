"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Copy, Check, RefreshCw, X } from "lucide-react";

/**
 * AI Description Generator Component
 * Generates professional descriptions using OpenRouter GPT or Google Gemini
 */

interface AIDescriptionGeneratorProps {
  label: string;
  placeholder?: string;
  onGenerate: (description: string) => void;
  context?: string;
  type?: 'summary' | 'experience' | 'project' | 'general';
}

type AIModel = 'gpt' | 'gemini';

export function AIDescriptionGenerator({
  label,
  placeholder = "Enter details to generate a professional description...",
  onGenerate,
  context,
  type = 'general',
}: AIDescriptionGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gpt');
  const [usedModel, setUsedModel] = useState<string>('');

  // Generate description with AI
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setGeneratedText("");
    setUsedModel('');

    // Select API endpoint based on model
    const endpoint = selectedModel === 'gemini' 
      ? '/api/generate-description-gemini' 
      : '/api/generate-description';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          context,
          type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate description');
      }

      const data = await response.json();
      setGeneratedText(data.description);
      setUsedModel(data.model || (selectedModel === 'gemini' ? 'Gemini 2.0 Flash' : 'GPT-OSS-20B'));
    } catch (err) {
      console.error("Error generating description:", err);
      setError(err instanceof Error ? err.message : 'Failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  // Copy description to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Use generated description
  const handleUse = () => {
    onGenerate(generatedText);
    setPrompt("");
    setGeneratedText("");
    setError("");
  };

  // Regenerate with same prompt
  const handleRegenerate = () => {
    handleGenerate();
  };

  // Clear all
  const handleClear = () => {
    setPrompt("");
    setGeneratedText("");
    setError("");
  };

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          {label}
        </CardTitle>
        <CardDescription>
          Enter key points and AI will generate a professional description for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label>AI Model</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={selectedModel === 'gpt' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedModel('gpt')}
              disabled={loading}
              className="flex-1"
            >
              GPT-OSS-20B
            </Button>
            <Button
              type="button"
              variant={selectedModel === 'gemini' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedModel('gemini')}
              disabled={loading}
              className="flex-1"
            >
              Gemini 2.0 Flash
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-prompt">Your Input</Label>
          <Textarea
            id="ai-prompt"
            placeholder={placeholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] bg-white/5 border-white/10"
            disabled={loading}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate with AI
              </>
            )}
          </Button>
          
          {(generatedText || error) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClear}
              title="Clear"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* AI Generated Result */}
        {generatedText && (
          <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-base">Generated Description</Label>
                {usedModel && (
                  <Badge variant="secondary" className="text-xs">
                    {usedModel}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {generatedText}
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex-1"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={handleUse}
                className="flex-1"
              >
                Use This Description
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
