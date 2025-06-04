import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Play,
  FileText,
  BarChart3,
  MessageSquare,
  Brain,
  Upload,
  Link,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnalysisResults {
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
  // Add any additional fields from the API response if needed
}

interface AnalysisWeights {
  coherence_weight: number;
  filler_weight: number;
  fluency_weight: number;
  confidence_weight: number;
  grammar_weight: number;
  vocabulary_weight: number;
  speech_rate_weight: number;
  content_weight: number;
}

const MetricItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const WeightSlider = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between">
      <Label className="text-sm">{label}</Label>
      <span className="text-sm font-medium">{value.toFixed(2)}</span>
    </div>
    <Input
      type="range"
      min={0}
      max={1}
      step={0.05}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full"
    />
  </div>
);

const getScoreDescriptor = (score: number) => {
  if (score >= 90) return { text: "Excellent", color: "bg-green-500" };
  if (score >= 75) return { text: "Very Good", color: "bg-green-400" };
  if (score >= 60) return { text: "Good", color: "bg-blue-500" };
  if (score >= 50) return { text: "Average", color: "bg-yellow-500" };
  if (score >= 35) return { text: "Below Average", color: "bg-orange-500" };
  return { text: "Needs Improvement", color: "bg-red-500" };
};

const ScoreDisplay = ({ score }: { score: number }) => {
  const { text, color } = getScoreDescriptor(score);
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5" />
          Overall Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold">{(score / 10).toFixed(1)}</div>
          <div
            className={`mt-2 px-3 py-1 rounded-full text-white text-sm ${color}`}
          >
            {text}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className={`h-2.5 rounded-full ${color}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export const AnalysisForm = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [modelAnswer, setModelAnswer] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [weights, setWeights] = useState<AnalysisWeights>({
    coherence_weight: 0.15,
    filler_weight: 0.1,
    fluency_weight: 0.1,
    confidence_weight: 0.1,
    grammar_weight: 0.15,
    vocabulary_weight: 0.15,
    speech_rate_weight: 0.1,
    content_weight: 0.15,
  });
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = [
        ".mp3",
        ".mp4",
        ".wav",
        ".flac",
        ".ogg",
        ".amr",
        ".webm",
      ];
      const fileName = file.name.toLowerCase();
      const isValidExtension = allowedExtensions.some((ext) =>
        fileName.endsWith(ext)
      );

      if (isValidExtension) {
        setAudioFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description:
            "Please select a valid audio file (.mp3, .mp4, .wav, .flac, .ogg, .amr, .webm)",
          variant: "destructive",
        });
      }
    }
  };

  const parseAnalysisScore = (
    analysisString: string
  ): { score: number; issues: number; justification: string } => {
    try {
      const parsed = JSON.parse(analysisString);
      return {
        score:
          parsed.grammar_score ||
          parsed.vocabulary_score ||
          parsed.coherence_score ||
          parsed.filler_score ||
          parsed.content_score ||
          0,
        issues: parsed.issues || 0,
        justification: parsed.justification || "No analysis available",
      };
    } catch {
      return { score: 0, issues: 0, justification: "Failed to parse analysis" };
    }
  };

  const createFormData = (file: File, modelAnswer: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model_answer", modelAnswer);

    // Add weights from state
    Object.entries(weights).forEach(([key, value]) => {
      formData.append(key, (1 / 8).toString());
    });
    return formData;
  };

  const handleAnalyze = async () => {
    const hasInput = audioFile;

    if (!hasInput || !modelAnswer.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both audio input and Model Answer",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = createFormData(audioFile, modelAnswer);

      const response = await fetch("http://13.201.153.19/ai_grading/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Log the response

      setResults(data);
      toast({
        title: "Analysis Complete",
        description: "Your audio has been successfully analyzed",
      });
    } catch (error) {
      console.error("Analysis Error:", error); // Log any errors
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error processing your request",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center mb-9">
        <h1
          className="text-4xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
          style={{ backgroundSize: "100% 200%" }}
        >
          Speech & Language Analysis Tool
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Analyze audio content for speech quality, language proficiency, and
          get comprehensive AI-powered insights
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
            Upload an audio file and provide the model answer for comprehensive
            analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-7">
            <div className="w-full">
              <div className="space-y-4">
                <Label>Audio Source</Label>

                {/* File Upload */}
                {
                  <div className="space-y-2">
                    <Label htmlFor="audioFile">Audio File</Label>
                    <Input
                      id="audioFile"
                      type="file"
                      accept=".mp3,.mp4,.wav,.flac,.ogg,.amr,.webm"
                      onChange={handleFileChange}
                      className="text-base"
                    />

                    {audioFile && (
                      <p className="text-sm text-gray-600">
                        Selected: {audioFile.name} (
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                }
              </div>

              <div className="space-y-2 mt-5">
                <Label htmlFor="modelAnswer">What is the topic about ?</Label>
                <Textarea
                  id="modelAnswer"
                  placeholder="Enter the expected or ideal answer for comparison..."
                  value={modelAnswer}
                  onChange={(e) => setModelAnswer(e.target.value)}
                  rows={4}
                  className="text-base resize-none"
                />
              </div>
            </div>
            {/* Analysis Weights */}
            <div className="w-full">
              <div className="space-y-4">
                <h3 className="font-medium">Customize Weightage</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <WeightSlider
                    label="Coherence"
                    value={weights.coherence_weight}
                    onChange={(value) =>
                      setWeights((prev) => ({
                        ...prev,
                        coherence_weight: value,
                      }))
                    }
                  />
                  <WeightSlider
                    label="Filler Words"
                    value={weights.filler_weight}
                    onChange={(value) =>
                      setWeights((prev) => ({ ...prev, filler_weight: value }))
                    }
                  />
                  <WeightSlider
                    label="Fluency"
                    value={weights.fluency_weight}
                    onChange={(value) =>
                      setWeights((prev) => ({ ...prev, fluency_weight: value }))
                    }
                  />

                  <WeightSlider
                    label="Grammar"
                    value={weights.grammar_weight}
                    onChange={(value) =>
                      setWeights((prev) => ({ ...prev, grammar_weight: value }))
                    }
                  />
                  <WeightSlider
                    label="Vocabulary"
                    value={weights.vocabulary_weight}
                    onChange={(value) =>
                      setWeights((prev) => ({
                        ...prev,
                        vocabulary_weight: value,
                      }))
                    }
                  />

                  <WeightSlider
                    label="Content Relevance"
                    value={weights.content_weight}
                    onChange={(value) =>
                      setWeights((prev) => ({ ...prev, content_weight: value }))
                    }
                  />
                </div>
              </div>
            </div>
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
          {/* First row with metrics and score */}
          <div className="grid md:grid-cols-2 gap-4">
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
                  <MetricItem
                    label="Fluency Score"
                    value={`${results.speech_metrics.fluency_score}/10`}
                  />
                  <MetricItem
                    label="Speech Rate"
                    value={`${results.speech_metrics.speech_rate_wpm} WPM`}
                  />
                  <MetricItem
                    label="Word Count"
                    value={results.speech_metrics.word_count}
                  />
                  <MetricItem
                    label="Duration"
                    value={`${results.speech_metrics.duration_seconds}s`}
                  />
                </div>
                <div className="space-y-3">
                  <MetricItem
                    label="Repeat Count"
                    value={results.speech_metrics.repeat_count}
                  />
                  <MetricItem
                    label="Confidence"
                    value={`${(
                      results.speech_metrics.avg_confidence * 100
                    ).toFixed(1)}%`}
                  />
                  <MetricItem
                    label="Total Pause"
                    value={`${results.speech_metrics.pause_total_seconds}s`}
                  />
                  <MetricItem
                    label="Avg Pause"
                    value={`${results.speech_metrics.avg_pause_seconds}s`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Overall Score */}
            <ScoreDisplay
              score={(() => {
                try {
                  const scores = {
                    grammar: parseFloat(
                      JSON.parse(results.analysis.grammar.grammar)
                        .grammar_score || 0
                    ),
                    vocabulary: parseFloat(
                      JSON.parse(results.analysis.vocabulary.vocabulary)
                        .vocabulary_score || 0
                    ),
                    coherence: parseFloat(
                      JSON.parse(results.analysis.coherence.coherence)
                        .coherence_score || 0
                    ),
                    filler: parseFloat(
                      JSON.parse(results.analysis.filler_words.filler_words)
                        .filler_score || 0
                    ),
                    content: parseFloat(
                      JSON.parse(
                        results.analysis.content_relevance.content_relevance
                      ).content_score || 0
                    ),
                    fluency: parseFloat(
                      String(results.speech_metrics.fluency_score || 0)
                    ),
                  };

                 const totalWeight =
                    weights.grammar_weight +
                    weights.vocabulary_weight +
                    weights.coherence_weight +
                    weights.filler_weight +
                    weights.content_weight +
                    weights.fluency_weight
                ;
 
                  const weightedScore =
                    (scores.grammar * weights.grammar_weight +
                      scores.vocabulary * weights.vocabulary_weight +
                      scores.coherence * weights.coherence_weight +
                      scores.filler * weights.filler_weight +
                      scores.content * weights.content_weight +
                      scores.fluency * weights.fluency_weight ) /
                    totalWeight;

                  return weightedScore * 10;
                } catch (error) {
                  console.error("Error calculating score:", error);
                  return 0;
                }
              })()}
            />
          </div>

          {/* Transcript */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="transcript">
              <AccordionTrigger className="flex items-center gap-2 no-underline hover:no-underline focus:no-underline">
                Transcript
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-base leading-relaxed bg-blue-50 p-4 rounded-lg">
                  {results.transcript}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Analysis Section */}
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(results.analysis).map(([category, data]) => {
              let analysisData;
              try {
                const jsonString = (data as Record<string, string>)[category];
                analysisData =
                  typeof jsonString === "string"
                    ? JSON.parse(jsonString)
                    : jsonString;
              } catch (error) {
                console.error(`Error parsing ${category}:`, error);
                return null; // Skip rendering this item if parsing fails
              }

              // Skip if no valid analysis data
              if (!analysisData) return null;

              const score =
                analysisData[`${category}_score`] ||
                analysisData.score ||
                analysisData.filler_score ||
                0;

              return (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="flex items-center gap-2 no-underline hover:no-underline focus:no-underline">
                    <span className="capitalize">
                      {category.replace(/_/g, " ")}
                    </span>
                    <span className="ml-auto text-sm font-medium">
                      Score: {score}/10
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-4 p-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-medium mb-2">Justification</h4>
                        <p className="text-sm text-gray-700">
                          {analysisData.justification ||
                            "No justification provided"}
                        </p>
                      </div>

                      {analysisData.issues_detail &&
                        analysisData.issues_detail.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium">Detailed Issues</h4>
                            {analysisData.issues_detail.map(
                              (issue: any, index: number) => (
                                <div
                                  key={index}
                                  className="border-l-4 border-orange-400 pl-3 py-2"
                                >
                                  <p className="text-sm font-medium text-gray-700">
                                    {issue.issue}
                                  </p>
                                  {issue.suggestion &&
                                    issue.suggestion !== "N/A" && (
                                      <p className="text-sm text-gray-600 mt-1 flex gap-2">
                                        <p className="underline">Suggestion:</p>{" "}
                                        {issue.suggestion}
                                      </p>
                                    )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
};
