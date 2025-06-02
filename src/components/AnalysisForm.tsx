
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Play, FileText, BarChart3, MessageSquare, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResults {
  lambdaRawResponse: any;
  transcript: string;
  speechMetrics: {
    fluency: number;
    pace: number;
    clarity: number;
    volume: number;
    pronunciation: number;
  };
  languageMetrics: {
    vocabulary: number;
    grammar: number;
    coherence: number;
    complexity: number;
    accuracy: number;
  };
  llmAnalysis: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    summary: string;
  };
}

export const AnalysisForm = () => {
  const [url, setUrl] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!url.trim() || !modelAnswer.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both URL and Model Answer",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response data
      const mockResults: AnalysisResults = {
        lambdaRawResponse: {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: {
            audioUrl: url,
            processedAt: new Date().toISOString(),
            duration: 45.2,
            fileSize: '2.3MB',
            format: 'wav'
          }
        },
        transcript: "Hello, this is a sample transcript of the audio content. The speaker discusses various topics with good clarity and appropriate pace. The content demonstrates strong vocabulary usage and grammatical accuracy throughout the presentation.",
        speechMetrics: {
          fluency: 8.5,
          pace: 7.8,
          clarity: 9.2,
          volume: 8.0,
          pronunciation: 8.7
        },
        languageMetrics: {
          vocabulary: 8.9,
          grammar: 9.1,
          coherence: 8.3,
          complexity: 7.6,
          accuracy: 8.8
        },
        llmAnalysis: {
          overallScore: 8.5,
          strengths: [
            "Excellent pronunciation and clarity",
            "Strong grammatical structure",
            "Appropriate vocabulary usage",
            "Good pacing and fluency"
          ],
          improvements: [
            "Could increase speech complexity",
            "Add more varied vocabulary",
            "Improve transitional phrases"
          ],
          summary: "The speaker demonstrates strong overall communication skills with excellent clarity and grammatical accuracy. There are opportunities to enhance complexity and vocabulary variety for even better performance."
        }
      };
      
      setResults(mockResults);
      toast({
        title: "Analysis Complete",
        description: "Your audio has been successfully analyzed",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error processing your request",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Speech & Language Analysis Tool
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Analyze audio content for speech quality, language proficiency, and get comprehensive AI-powered insights
        </p>
      </div>

      {/* Input Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Input Parameters
          </CardTitle>
          <CardDescription>
            Provide the audio URL and model answer for comprehensive analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">Audio URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/audio.wav"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-base"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="modelAnswer">Model Answer</Label>
            <Textarea
              id="modelAnswer"
              placeholder="Enter the expected or ideal answer for comparison..."
              value={modelAnswer}
              onChange={(e) => setModelAnswer(e.target.value)}
              rows={4}
              className="text-base"
            />
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Audio...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-5 w-5" />
                Analyze Audio
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="grid gap-6">
          {/* Lambda Raw Response */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Lambda Raw Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(results.lambdaRawResponse, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Transcript */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed bg-blue-50 p-4 rounded-lg">
                {results.transcript}
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Speech Metrics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Speech Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(results.speechMetrics).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{key}</span>
                      <span className="font-bold text-lg">{value}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${value * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Language Metrics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Language Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(results.languageMetrics).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{key}</span>
                      <span className="font-bold text-lg">{value}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${value * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* LLM Analysis */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                LLM Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {results.llmAnalysis.overallScore}/10
                </div>
                <p className="text-gray-600">Overall Score</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">Strengths</h4>
                  <ul className="space-y-2">
                    {results.llmAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-orange-600 mb-3">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {results.llmAnalysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-gray-700 leading-relaxed">{results.llmAnalysis.summary}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
