
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
  speech_metrics: {
    fluency_score: number;
    speech_rate_wpm: number;
    repeat_count: number;
    avg_confidence: number;
    pause_total_seconds: number;
    avg_pause_seconds: number;
    word_count: number;
    duration_seconds: number;
  };
  analysis: {
    grammar: {
      grammar: string;
    };
    vocabulary: {
      vocabulary: string;
    };
    coherence: {
      coherence: string;
    };
    filler_words: {
      filler_words: string;
    };
    content_relevance: {
      content_relevance: string;
    };
  };
}

export const AnalysisForm = () => {
  const [url, setUrl] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const { toast } = useToast();

  const parseAnalysisScore = (analysisString: string): { score: number; issues: number; justification: string } => {
    try {
      const parsed = JSON.parse(analysisString);
      return {
        score: parsed.grammar_score || parsed.vocabulary_score || parsed.coherence_score || parsed.filler_score || parsed.content_score || 0,
        issues: parsed.issues || 0,
        justification: parsed.justification || "No analysis available"
      };
    } catch {
      return { score: 0, issues: 0, justification: "Failed to parse analysis" };
    }
  };

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
      
      // Use the provided data structure
      const mockResults: AnalysisResults = {
        lambdaRawResponse: {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            transcript: "Wondering how to pass a transcription test, we are here to help you out. A general transcriptionist usually does not need prior education or experience to get transcription jobs, but must pass a test based on typing speed and accuracy in spelling and grammar. Here are some tips to remember. Firstly, you need to type fairly fast for the sake of being productive and meeting deadlines. Find out what the company's minimum typing speed is. Stricter companies tend to set a minimum level of around 50 words per minute, while more flexible firms might go as low as 25 words per minute, or perhaps no minimum at all if deadlines are not as important. You can improve your typing speed by searching for online typing tutorials. Generally speaking, your hands and fingers need to be placed properly and comfortably instead of using the very slow one finger at a time method. Memorizing where letters and numbers are placed on the keyboard will help accelerate the learning process. Secondly, you should have a deep vocabulary in understanding a professional versus common or colloquial usage of terminology and structure. Thirdly, have spell check on your computer to double check your spelling. Fourthly, download any popular and free transcription software to help you practice transcribing before taking the test. Last but not least, adhere to instructions and follow the style guide. Proofread your work before submitting and run a spell check. For more tips to succeed as a transcriptionist, subscribe to our YouTube channel.",
            speech_metrics: {
              fluency_score: 8.5,
              speech_rate_wpm: 173.14,
              repeat_count: 0,
              avg_confidence: 1.0,
              pause_total_seconds: 10.07,
              avg_pause_seconds: 0.84,
              word_count: 251,
              duration_seconds: 86.98
            },
            analysis: {
              grammar: {
                grammar: "{\n  \"grammar_score\": 9,\n  \"issues\": 3,\n  \"justification\": \"The text demonstrates strong grammatical accuracy with only minor issues: one instance of awkward article usage ('a deep vocabulary in understanding'), slight preposition inconsistency in 'based on typing speed' vs. 'based in typing speed', and a minor structural issue in the transition 'Last but not least.' Overall sentence structure, subject-verb agreement, tense consistency, and word forms are excellent throughout.\"\n}"
              },
              vocabulary: {
                vocabulary: "{\n  \"vocabulary_score\": 8,\n  \"issues\": 4,\n  \"justification\": \"The response demonstrates sophisticated vocabulary with domain-specific terms like 'transcriptionist', 'colloquial', and 'terminology'. Strong lexical variation is evident through precise word choices ('adhere', 'accelerate', 'flexible'). Minor issues include some repetition of basic terms like 'typing' and 'spell check'. Overall maintains professional register with appropriate technical language for the context.\"\n}"
              },
              coherence: {
                coherence: "{\n  \"coherence_score\": 9,\n  \"issues\": 2,\n  \"justification\": \"The response demonstrates excellent structural organization with clear enumeration (firstly through lastly) and logical progression of ideas about transcription test preparation. Strong thematic consistency throughout, with well-connected points building on each other. Effective use of transitions and cohesive devices. Only minor issues: slight redundancy in spell-check mentions and an abrupt shift to YouTube promotion at the end.\"\n}"
              },
              filler_words: {
                filler_words: "{\n  \"filler_score\": 9,\n  \"issues\": 3,\n  \"justification\": \"The speech demonstrates exceptional clarity with minimal filler words. Only three notable instances were found: the softening qualifier 'around' when discussing typing speed, and two instances of 'fairly' and 'perhaps' when describing requirements. The speech maintains professional tone and direct communication throughout, with well-structured sentences and clear transitions between points.\"\n}"
              },
              content_relevance: {
                content_relevance: "{\n  \"content_score\": 0,\n  \"issues\": 1,\n  \"justification\": \"The provided content appears to be a JSON transcript object rather than a user's answer that could be compared to a model answer. Without both a model answer and a user's response to compare, a meaningful content relevance evaluation cannot be performed.\"\n}"
              }
            }
          })
        },
        transcript: "Wondering how to pass a transcription test, we are here to help you out. A general transcriptionist usually does not need prior education or experience to get transcription jobs, but must pass a test based on typing speed and accuracy in spelling and grammar. Here are some tips to remember. Firstly, you need to type fairly fast for the sake of being productive and meeting deadlines. Find out what the company's minimum typing speed is. Stricter companies tend to set a minimum level of around 50 words per minute, while more flexible firms might go as low as 25 words per minute, or perhaps no minimum at all if deadlines are not as important. You can improve your typing speed by searching for online typing tutorials. Generally speaking, your hands and fingers need to be placed properly and comfortably instead of using the very slow one finger at a time method. Memorizing where letters and numbers are placed on the keyboard will help accelerate the learning process. Secondly, you should have a deep vocabulary in understanding a professional versus common or colloquial usage of terminology and structure. Thirdly, have spell check on your computer to double check your spelling. Fourthly, download any popular and free transcription software to help you practice transcribing before taking the test. Last but not least, adhere to instructions and follow the style guide. Proofread your work before submitting and run a spell check. For more tips to succeed as a transcriptionist, subscribe to our YouTube channel.",
        speech_metrics: {
          fluency_score: 8.5,
          speech_rate_wpm: 173.14,
          repeat_count: 0,
          avg_confidence: 1.0,
          pause_total_seconds: 10.07,
          avg_pause_seconds: 0.84,
          word_count: 251,
          duration_seconds: 86.98
        },
        analysis: {
          grammar: {
            grammar: "{\n  \"grammar_score\": 9,\n  \"issues\": 3,\n  \"justification\": \"The text demonstrates strong grammatical accuracy with only minor issues: one instance of awkward article usage ('a deep vocabulary in understanding'), slight preposition inconsistency in 'based on typing speed' vs. 'based in typing speed', and a minor structural issue in the transition 'Last but not least.' Overall sentence structure, subject-verb agreement, tense consistency, and word forms are excellent throughout.\"\n}"
          },
          vocabulary: {
            vocabulary: "{\n  \"vocabulary_score\": 8,\n  \"issues\": 4,\n  \"justification\": \"The response demonstrates sophisticated vocabulary with domain-specific terms like 'transcriptionist', 'colloquial', and 'terminology'. Strong lexical variation is evident through precise word choices ('adhere', 'accelerate', 'flexible'). Minor issues include some repetition of basic terms like 'typing' and 'spell check'. Overall maintains professional register with appropriate technical language for the context.\"\n}"
          },
          coherence: {
            coherence: "{\n  \"coherence_score\": 9,\n  \"issues\": 2,\n  \"justification\": \"The response demonstrates excellent structural organization with clear enumeration (firstly through lastly) and logical progression of ideas about transcription test preparation. Strong thematic consistency throughout, with well-connected points building on each other. Effective use of transitions and cohesive devices. Only minor issues: slight redundancy in spell-check mentions and an abrupt shift to YouTube promotion at the end.\"\n}"
          },
          filler_words: {
            filler_words: "{\n  \"filler_score\": 9,\n  \"issues\": 3,\n  \"justification\": \"The speech demonstrates exceptional clarity with minimal filler words. Only three notable instances were found: the softening qualifier 'around' when discussing typing speed, and two instances of 'fairly' and 'perhaps' when describing requirements. The speech maintains professional tone and direct communication throughout, with well-structured sentences and clear transitions between points.\"\n}"
          },
          content_relevance: {
            content_relevance: "{\n  \"content_score\": 0,\n  \"issues\": 1,\n  \"justification\": \"The provided content appears to be a JSON transcript object rather than a user's answer that could be compared to a model answer. Without both a model answer and a user's response to compare, a meaningful content relevance evaluation cannot be performed.\"\n}"
          }
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
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
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

          {/* Speech Metrics */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Speech Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Fluency Score</span>
                  <span className="font-bold">{results.speech_metrics.fluency_score}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Speech Rate (WPM)</span>
                  <span className="font-bold">{results.speech_metrics.speech_rate_wpm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Word Count</span>
                  <span className="font-bold">{results.speech_metrics.word_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration (seconds)</span>
                  <span className="font-bold">{results.speech_metrics.duration_seconds}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Repeat Count</span>
                  <span className="font-bold">{results.speech_metrics.repeat_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Avg Confidence</span>
                  <span className="font-bold">{results.speech_metrics.avg_confidence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Pause Time</span>
                  <span className="font-bold">{results.speech_metrics.pause_total_seconds}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Avg Pause Time</span>
                  <span className="font-bold">{results.speech_metrics.avg_pause_seconds}s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Analysis */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Language Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(results.analysis).map(([category, data]) => {
                const analysisKey = category as keyof typeof data;
                const analysisData = parseAnalysisScore(data[analysisKey] as string);
                
                return (
                  <div key={category} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold capitalize text-lg">{category.replace('_', ' ')}</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Issues: {analysisData.issues}</span>
                        <span className="text-xl font-bold text-blue-600">{analysisData.score}/10</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analysisData.score * 10}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{analysisData.justification}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
