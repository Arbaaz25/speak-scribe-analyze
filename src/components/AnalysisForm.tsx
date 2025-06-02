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
    speech_rate_wpm: number;
    repeat_count: number;
    avg_confidence: number;
    pause_total_seconds: number;
    avg_pause_seconds: number;
    word_count: number;
    duration_seconds: number;
  };
  languageMetrics: {
    basic_metrics: {
      word_count: number;
      sentence_count: number;
      avg_words_per_sentence: number;
      character_count: number;
      avg_word_length: number;
    };
    sentiment: {
      overall_sentiment: string;
      sentiment_scores: {
        Positive: number;
        Negative: number;
        Neutral: number;
        Mixed: number;
      };
    };
    vocabulary: {
      unique_words: number;
      lexical_density: number;
      vocabulary_richness: number;
    };
    readability: {
      avg_syllables_per_word: number;
      flesch_reading_ease: number;
      sentence_complexity_ratio: number;
    };
  };
  llmAnalysis: {
    grammar: {
      dimension: string;
      analysis: string;
    };
    vocabulary: {
      dimension: string;
      analysis: string;
    };
    coherence: {
      dimension: string;
      analysis: string;
    };
    filler_words: {
      dimension: string;
      analysis: string;
    };
    content_relevance: {
      dimension: string;
      analysis: string;
    };
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
      
      // Mock response data with your provided structure
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
              speech_rate_wpm: 173.14,
              repeat_count: 0,
              avg_confidence: 1.0,
              pause_total_seconds: 10.07,
              avg_pause_seconds: 0.84,
              word_count: 251,
              duration_seconds: 86.98
            },
            language_metrics: {
              basic_metrics: {
                word_count: 251,
                sentence_count: 15,
                avg_words_per_sentence: 16.73,
                character_count: 1524,
                avg_word_length: 6.07
              },
              sentiment: {
                overall_sentiment: "NEUTRAL",
                sentiment_scores: {
                  Positive: 0.04871141538023949,
                  Negative: 0.001016165828332305,
                  Neutral: 0.9486352801322937,
                  Mixed: 0.0016371598467230797
                }
              },
              vocabulary: {
                unique_words: 164,
                lexical_density: 0.65,
                vocabulary_richness: 10.35
              },
              readability: {
                avg_syllables_per_word: 1.72,
                flesch_reading_ease: 44.58,
                sentence_complexity_ratio: 0.6
              }
            },
            analysis: {
              grammar: {
                dimension: "grammar",
                analysis: JSON.stringify({
                  grammar_score: 9,
                  issues: 3,
                  justification: "The text demonstrates strong grammatical accuracy with only minor issues: one instance of awkward article usage ('a deep vocabulary in understanding a professional'), slight preposition inconsistency in 'based on typing speed' vs. 'based in', and a potentially redundant article in 'a spell check.' Overall sentence structure, subject-verb agreement, tense consistency, and word forms are excellent throughout."
                })
              },
              vocabulary: {
                dimension: "vocabulary",
                analysis: JSON.stringify({
                  vocabulary_score: 8,
                  issues: 4,
                  justification: "The response demonstrates sophisticated vocabulary with field-specific terminology ('transcriptionist', 'colloquial', 'proofread') and varied word choices. Strong technical precision with terms like 'style guide', 'terminology', and 'accuracy'. Minor issues include some repetition of basic transitional phrases ('firstly', 'secondly') and occasional use of simple word combinations ('help you', 'need to')."
                })
              },
              coherence: {
                dimension: "coherence",
                analysis: JSON.stringify({
                  coherence_score: 9,
                  issues: 2,
                  justification: "The response demonstrates excellent structural organization with clear enumeration (firstly through lastly) and logical progression of ideas about transcription test preparation. Strong thematic unity is maintained throughout, with each point building naturally on previous ones. Effective use of transitions and cohesive devices connects ideas smoothly. The two minor issues are: slight redundancy in discussing spell check twice and an abrupt shift to YouTube promotion at the end."
                })
              },
              filler_words: {
                dimension: "filler_words",
                analysis: JSON.stringify({
                  filler_score: 9,
                  issues: 3,
                  justification: "The speech shows remarkably clean delivery with minimal filler words. Only detected softening qualifiers 'around' (when discussing typing speed) and 'fairly' (describing typing speed), plus one instance of 'perhaps' when discussing minimum requirements. The speech maintains professional clarity throughout with well-structured sentences and minimal disfluencies."
                })
              },
              content_relevance: {
                dimension: "content_relevance",
                analysis: JSON.stringify({
                  content_score: 0,
                  issues: 1,
                  justification: "The provided user input appears to be a JSON object containing transcription data rather than an answer to compare against a model answer. Without a proper user response to evaluate, meaningful content comparison cannot be performed."
                })
              }
            }
          })
        },
        transcript: "Wondering how to pass a transcription test, we are here to help you out. A general transcriptionist usually does not need prior education or experience to get transcription jobs, but must pass a test based on typing speed and accuracy in spelling and grammar. Here are some tips to remember. Firstly, you need to type fairly fast for the sake of being productive and meeting deadlines. Find out what the company's minimum typing speed is. Stricter companies tend to set a minimum level of around 50 words per minute, while more flexible firms might go as low as 25 words per minute, or perhaps no minimum at all if deadlines are not as important. You can improve your typing speed by searching for online typing tutorials. Generally speaking, your hands and fingers need to be placed properly and comfortably instead of using the very slow one finger at a time method. Memorizing where letters and numbers are placed on the keyboard will help accelerate the learning process. Secondly, you should have a deep vocabulary in understanding a professional versus common or colloquial usage of terminology and structure. Thirdly, have spell check on your computer to double check your spelling. Fourthly, download any popular and free transcription software to help you practice transcribing before taking the test. Last but not least, adhere to instructions and follow the style guide. Proofread your work before submitting and run a spell check. For more tips to succeed as a transcriptionist, subscribe to our YouTube channel.",
        speechMetrics: {
          speech_rate_wpm: 173.14,
          repeat_count: 0,
          avg_confidence: 1.0,
          pause_total_seconds: 10.07,
          avg_pause_seconds: 0.84,
          word_count: 251,
          duration_seconds: 86.98
        },
        languageMetrics: {
          basic_metrics: {
            word_count: 251,
            sentence_count: 15,
            avg_words_per_sentence: 16.73,
            character_count: 1524,
            avg_word_length: 6.07
          },
          sentiment: {
            overall_sentiment: "NEUTRAL",
            sentiment_scores: {
              Positive: 0.04871141538023949,
              Negative: 0.001016165828332305,
              Neutral: 0.9486352801322937,
              Mixed: 0.0016371598467230797
            }
          },
          vocabulary: {
            unique_words: 164,
            lexical_density: 0.65,
            vocabulary_richness: 10.35
          },
          readability: {
            avg_syllables_per_word: 1.72,
            flesch_reading_ease: 44.58,
            sentence_complexity_ratio: 0.6
          }
        },
        llmAnalysis: {
          grammar: {
            dimension: "grammar",
            analysis: JSON.stringify({
              grammar_score: 9,
              issues: 3,
              justification: "The text demonstrates strong grammatical accuracy with only minor issues: one instance of awkward article usage ('a deep vocabulary in understanding a professional'), slight preposition inconsistency in 'based on typing speed' vs. 'based in', and a potentially redundant article in 'a spell check.' Overall sentence structure, subject-verb agreement, tense consistency, and word forms are excellent throughout."
            })
          },
          vocabulary: {
            dimension: "vocabulary",
            analysis: JSON.stringify({
              vocabulary_score: 8,
              issues: 4,
              justification: "The response demonstrates sophisticated vocabulary with field-specific terminology ('transcriptionist', 'colloquial', 'proofread') and varied word choices. Strong technical precision with terms like 'style guide', 'terminology', and 'accuracy'. Minor issues include some repetition of basic transitional phrases ('firstly', 'secondly') and occasional use of simple word combinations ('help you', 'need to')."
            })
          },
          coherence: {
            dimension: "coherence",
            analysis: JSON.stringify({
              coherence_score: 9,
              issues: 2,
              justification: "The response demonstrates excellent structural organization with clear enumeration (firstly through lastly) and logical progression of ideas about transcription test preparation. Strong thematic unity is maintained throughout, with each point building naturally on previous ones. Effective use of transitions and cohesive devices connects ideas smoothly. The two minor issues are: slight redundancy in discussing spell check twice and an abrupt shift to YouTube promotion at the end."
            })
          },
          filler_words: {
            dimension: "filler_words",
            analysis: JSON.stringify({
              filler_score: 9,
              issues: 3,
              justification: "The speech shows remarkably clean delivery with minimal filler words. Only detected softening qualifiers 'around' (when discussing typing speed) and 'fairly' (describing typing speed), plus one instance of 'perhaps' when discussing minimum requirements. The speech maintains professional clarity throughout with well-structured sentences and minimal disfluencies."
            })
          },
          content_relevance: {
            dimension: "content_relevance",
            analysis: JSON.stringify({
              content_score: 0,
              issues: 1,
              justification: "The provided user input appears to be a JSON object containing transcription data rather than an answer to compare against a model answer. Without a proper user response to evaluate, meaningful content comparison cannot be performed."
            })
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

  const parseAnalysis = (analysisString: string) => {
    try {
      return JSON.parse(analysisString);
    } catch {
      return { score: 0, issues: 0, justification: "Error parsing analysis" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Speech & Language Analysis Tool
          </h1>
          <p className="text-base text-gray-600">
            Analyze audio content for speech quality, language proficiency, and get comprehensive AI-powered insights
          </p>
        </div>

        {/* Input Form */}
        <Card className="shadow-lg mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Play className="h-4 w-4" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm">Audio URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/audio.wav"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modelAnswer" className="text-sm">Model Answer</Label>
                <Textarea
                  id="modelAnswer"
                  placeholder="Enter the expected or ideal answer for comparison..."
                  value={modelAnswer}
                  onChange={(e) => setModelAnswer(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full h-10 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Audio...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyze Audio
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="grid gap-4">
            {/* Transcript */}
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-4 w-4" />
                  Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed bg-blue-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                  {results.transcript}
                </p>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Speech Metrics */}
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-4 w-4" />
                    Speech Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <div className="text-xs text-gray-600">Speech Rate</div>
                      <div className="text-lg font-bold">{results.speechMetrics.speech_rate_wpm} WPM</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded text-center">
                      <div className="text-xs text-gray-600">Confidence</div>
                      <div className="text-lg font-bold">{(results.speechMetrics.avg_confidence * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-orange-50 p-2 rounded text-center">
                      <div className="text-xs text-gray-600">Duration</div>
                      <div className="text-lg font-bold">{results.speechMetrics.duration_seconds.toFixed(1)}s</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded text-center">
                      <div className="text-xs text-gray-600">Words</div>
                      <div className="text-lg font-bold">{results.speechMetrics.word_count}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    Pauses: {results.speechMetrics.pause_total_seconds.toFixed(1)}s total | 
                    Avg: {results.speechMetrics.avg_pause_seconds.toFixed(1)}s
                  </div>
                </CardContent>
              </Card>

              {/* Language Metrics */}
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-4 w-4" />
                    Language Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-xs text-gray-600">Basic</div>
                    <div className="text-xs">
                      {results.languageMetrics.basic_metrics.sentence_count} sentences | 
                      {results.languageMetrics.basic_metrics.avg_words_per_sentence.toFixed(1)} avg words
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-xs text-gray-600">Sentiment</div>
                    <div className="text-sm font-bold">{results.languageMetrics.sentiment.overall_sentiment}</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="text-xs text-gray-600">Vocabulary</div>
                    <div className="text-xs">
                      {results.languageMetrics.vocabulary.unique_words} unique | 
                      {results.languageMetrics.vocabulary.vocabulary_richness.toFixed(1)} richness
                    </div>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <div className="text-xs text-gray-600">Readability</div>
                    <div className="text-xs">Flesch: {results.languageMetrics.readability.flesch_reading_ease.toFixed(1)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* LLM Analysis */}
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-4 w-4" />
                  LLM Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {Object.entries(results.llmAnalysis).map(([dimension, data]) => {
                    const analysis = parseAnalysis(data.analysis);
                    const scoreKey = dimension === 'filler_words' ? 'filler_score' : 
                                   dimension === 'content_relevance' ? 'content_score' : 
                                   `${dimension}_score`;
                    const score = analysis[scoreKey] || 0;
                    
                    return (
                      <div key={dimension} className="bg-white border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-sm capitalize">{dimension.replace('_', ' ')}</h4>
                          <span className="text-xl font-bold text-blue-600">{score}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${score * 10}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {analysis.justification || "No analysis available"}
                        </p>
                        {analysis.issues > 0 && (
                          <div className="text-xs text-orange-600 mt-1">
                            Issues: {analysis.issues}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Lambda Raw Response - Collapsible */}
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-4 w-4" />
                  Lambda Raw Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-3 rounded-lg overflow-x-auto text-xs max-h-40 overflow-y-auto">
                  {JSON.stringify(results.lambdaRawResponse, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
