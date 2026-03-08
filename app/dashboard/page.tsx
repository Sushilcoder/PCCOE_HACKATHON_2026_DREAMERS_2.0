'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Upload, LogOut, Shield, History, Loader, AlertCircle, CheckCircle,
  Image, Video, Music, FileText, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { config } from '@/lib/config';
import UploadZone from '@/components/dashboard/upload-zone';
import ResultsViewer from '@/components/dashboard/results-viewer';
import AnalysisHistory from '@/components/dashboard/analysis-history';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const generateMockAnalysis = (type: string, name: string) => {
    // Helper function to ensure percentage is between 0 and 100
    const getRandomPercentage = () => Math.min(100, Math.max(0, Math.random() * 100));
    
    // Classify content into three categories
    const classificationRoll = Math.random();
    let classification: 'authentic' | 'ai_generated' | 'deepfake';
    let authenticity_score: number;
    let ai_probability: number;
    let manipulation_score: number;
    let deepfake_type: string | null = null;
    let ensemble_agreement: number;
    let confidence_calibration: 'low' | 'medium' | 'high';
    
    if (classificationRoll < 0.5) {
      // 50% chance: Authentic content
      classification = 'authentic';
      authenticity_score = Math.min(100, Math.max(85, getRandomPercentage() + 20));
      ai_probability = Math.min(15, getRandomPercentage() * 0.2);
      manipulation_score = Math.min(10, getRandomPercentage() * 0.15);
      ensemble_agreement = Math.min(100, Math.max(90, getRandomPercentage() + 10));
      confidence_calibration = 'high';
    } else if (classificationRoll < 0.75) {
      // 25% chance: AI-Generated content
      classification = 'ai_generated';
      authenticity_score = Math.min(20, getRandomPercentage() * 0.25);
      ai_probability = Math.min(100, Math.max(80, getRandomPercentage() + 20));
      manipulation_score = Math.min(15, getRandomPercentage() * 0.2);
      deepfake_type = ['diffusion_image', 'gan_image', 'stable_diffusion'].at(Math.floor(Math.random() * 3))!;
      ensemble_agreement = Math.min(100, Math.max(85, getRandomPercentage() + 10));
      confidence_calibration = 'high';
    } else {
      // 25% chance: Deepfake (manipulated real content)
      classification = 'deepfake';
      authenticity_score = Math.min(50, Math.max(20, getRandomPercentage() * 0.6));
      ai_probability = Math.min(40, getRandomPercentage() * 0.5);
      manipulation_score = Math.min(100, Math.max(65, getRandomPercentage() + 15));
      deepfake_type = ['face_swap', 'lip_sync', 'voice_clone', 'facial_reenactment'].at(Math.floor(Math.random() * 4))!;
      ensemble_agreement = Math.min(100, Math.max(75, getRandomPercentage() + 5));
      confidence_calibration = Math.random() > 0.3 ? 'high' : 'medium';
    }
    
    return {
      analysis_id: Math.random().toString(36).substr(2, 9),
      filename: name,
      file_type: type,
      timestamp: new Date().toISOString(),
      classification, // 'authentic', 'ai_generated', or 'deepfake'
      deepfake_type, // 'face_swap', 'lip_sync', 'gan_image', etc.
      authenticity_score: Math.round(authenticity_score * 10) / 10,
      ai_probability: Math.round(ai_probability * 10) / 10,
      manipulation_score: Math.round(manipulation_score * 10) / 10,
      overall_confidence: Math.min(100, Math.max(70, getRandomPercentage() + 20)),
      ensemble_agreement: Math.round(ensemble_agreement * 10) / 10,
      confidence_calibration,
      scores: {
        image_detection: getRandomPercentage(),
        video_detection: type === 'video' ? getRandomPercentage() : null,
        audio_detection: type === 'audio' ? getRandomPercentage() : null,
        text_detection: getRandomPercentage(),
        cross_modal: getRandomPercentage()
      },
      artifacts: {
        compression_artifacts: Math.random() > 0.5,
        eye_inconsistencies: Math.random() > 0.6,
        lighting_inconsistencies: Math.random() > 0.5,
        face_warping: Math.random() > 0.7
      },
      ai_indicators: {
        unusual_textures: Math.random() > 0.6,
        inconsistent_shadows: Math.random() > 0.6,
        unrealistic_artifacts: Math.random() > 0.5,
        gaussian_blur_patterns: Math.random() > 0.7
      },
      manipulation_indicators: {
        face_swap_detected: Math.random() > 0.7,
        facial_reenactment: Math.random() > 0.7,
        expression_inconsistency: Math.random() > 0.6,
        lighting_mismatch: Math.random() > 0.5
      }
    };
  };

  const handleFileUpload = async (file: File, type: 'image' | 'video' | 'audio') => {
    setIsLoading(true);
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = generateMockAnalysis(type, file.name);
      setAnalysisResult(mockResult);
      toast.success('Analysis completed!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const getRandomPercentage = () => Math.min(100, Math.max(0, Math.random() * 100));
      
      // Classify text content
      const classificationRoll = Math.random();
      let classification: 'authentic' | 'ai_generated' | 'deepfake';
      let authenticity_score: number;
      let ai_probability: number;
      let deepfake_type: string | null = null;
      let ensemble_agreement: number;
      let confidence_calibration: 'low' | 'medium' | 'high';
      
      if (classificationRoll < 0.5) {
        classification = 'authentic';
        authenticity_score = Math.min(100, Math.max(85, getRandomPercentage() + 20));
        ai_probability = Math.min(15, getRandomPercentage() * 0.2);
        ensemble_agreement = Math.min(100, Math.max(90, getRandomPercentage() + 10));
        confidence_calibration = 'high';
      } else if (classificationRoll < 0.75) {
        classification = 'ai_generated';
        authenticity_score = Math.min(20, getRandomPercentage() * 0.25);
        ai_probability = Math.min(100, Math.max(80, getRandomPercentage() + 20));
        deepfake_type = 'ai_generated_text';
        ensemble_agreement = Math.min(100, Math.max(85, getRandomPercentage() + 10));
        confidence_calibration = 'high';
      } else {
        classification = 'deepfake';
        authenticity_score = Math.min(50, Math.max(20, getRandomPercentage() * 0.6));
        ai_probability = Math.min(40, getRandomPercentage() * 0.5);
        deepfake_type = 'manipulated_text';
        ensemble_agreement = Math.min(100, Math.max(75, getRandomPercentage() + 5));
        confidence_calibration = Math.random() > 0.3 ? 'high' : 'medium';
      }
      
      const mockResult = {
        analysis_id: Math.random().toString(36).substr(2, 9),
        filename: 'text_input',
        file_type: 'text',
        timestamp: new Date().toISOString(),
        classification,
        deepfake_type,
        authenticity_score: Math.round(authenticity_score * 10) / 10,
        ai_probability: Math.round(ai_probability * 10) / 10,
        manipulation_score: Math.round((100 - authenticity_score) * 0.3 * 10) / 10,
        overall_confidence: Math.min(100, Math.max(70, getRandomPercentage() + 20)),
        ensemble_agreement: Math.round(ensemble_agreement * 10) / 10,
        confidence_calibration,
        scores: {
          text_detection: getRandomPercentage(),
          ai_generated_probability: ai_probability,
          linguistic_analysis: getRandomPercentage(),
          cross_modal: 0
        },
        text_analysis: {
          word_count: textInput.split(/\s+/).length,
          sentence_count: textInput.split(/[.!?]+/).length,
          vocabulary_diversity: getRandomPercentage(),
          semantic_consistency: getRandomPercentage(),
          repetition_patterns: getRandomPercentage(),
          linguistic_naturalness: classification === 'authentic' ? Math.min(100, Math.max(80, getRandomPercentage() + 10)) : Math.min(60, getRandomPercentage() * 0.7)
        }
      };
      
      setAnalysisResult(mockResult);
      toast.success('Text analysis completed!');
    } catch (error) {
      console.error('Text analysis error:', error);
      toast.error('An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="dark bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="border-b border-border px-4 py-4 sticky top-0 bg-background/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DeepScan</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Analysis */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  <span className="hidden sm:inline">Image</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline">Video</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Text</span>
                </TabsTrigger>
              </TabsList>

              {/* Image Upload */}
              <TabsContent value="image">
                <Card className="p-8 border-border">
                  <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
                  <UploadZone
                    accept="image/*"
                    onUpload={(file) => handleFileUpload(file, 'image')}
                    isLoading={isLoading}
                    icon={<Image className="w-12 h-12" />}
                    label="Drop your image here"
                  />
                </Card>
              </TabsContent>

              {/* Video Upload */}
              <TabsContent value="video">
                <Card className="p-8 border-border">
                  <h3 className="text-lg font-semibold mb-4">Upload Video</h3>
                  <UploadZone
                    accept="video/*"
                    onUpload={(file) => handleFileUpload(file, 'video')}
                    isLoading={isLoading}
                    icon={<Video className="w-12 h-12" />}
                    label="Drop your video here"
                  />
                </Card>
              </TabsContent>

              {/* Audio Upload */}
              <TabsContent value="audio">
                <Card className="p-8 border-border">
                  <h3 className="text-lg font-semibold mb-4">Upload Audio</h3>
                  <UploadZone
                    accept="audio/*"
                    onUpload={(file) => handleFileUpload(file, 'audio')}
                    isLoading={isLoading}
                    icon={<Music className="w-12 h-12" />}
                    label="Drop your audio here"
                  />
                </Card>
              </TabsContent>

              {/* Text Analysis */}
              <TabsContent value="text">
                <Card className="p-8 border-border">
                  <h3 className="text-lg font-semibold mb-4">Analyze Text</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="text-input">Enter text to analyze</Label>
                      <Textarea
                        id="text-input"
                        placeholder="Paste your text here..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="mt-2 min-h-32"
                      />
                    </div>
                    <Button
                      onClick={handleTextAnalysis}
                      disabled={isLoading || !textInput.trim()}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Analyze Text
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Default Upload Tab */}
              <TabsContent value="upload">
                <Card className="p-8 border-border">
                  <h3 className="text-lg font-semibold mb-6">Choose Analysis Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('image')}
                      className="p-6 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
                    >
                      <Image className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold">Image Analysis</h4>
                      <p className="text-sm text-muted-foreground">Detect face manipulations</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('video')}
                      className="p-6 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all text-center"
                    >
                      <Video className="w-8 h-8 mx-auto mb-2 text-accent" />
                      <h4 className="font-semibold">Video Analysis</h4>
                      <p className="text-sm text-muted-foreground">Detect synthetic videos</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('audio')}
                      className="p-6 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
                    >
                      <Music className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold">Audio Analysis</h4>
                      <p className="text-sm text-muted-foreground">Detect voice cloning</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('text')}
                      className="p-6 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all text-center"
                    >
                      <FileText className="w-8 h-8 mx-auto mb-2 text-accent" />
                      <h4 className="font-semibold">Text Analysis</h4>
                      <p className="text-sm text-muted-foreground">Detect AI-generated text</p>
                    </button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Results */}
            {analysisResult && (
              <div className="mt-8">
                <ResultsViewer result={analysisResult} />
              </div>
            )}
          </div>

          {/* Right Column - History & Stats */}
          <div className="lg:col-span-1">
            {/* Quick Stats */}
            <Card className="p-6 mb-6 border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">API Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-semibold">All Systems Operational</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-sm font-semibold mt-1">&lt; 2 seconds</p>
                </div>
              </div>
            </Card>

            {/* Recent Analyses */}
            <Card className="p-6 border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Analyses
              </h3>
              <AnalysisHistory />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
