'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle, XCircle, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import HeatmapViewer from './heatmap-viewer';
import DetectionHeatmap from './detection-heatmap';
import BlockchainVerify from './blockchain-verify';
import EnsembleMetrics from './ensemble-metrics';
import DeepfakeTypeClassifier from './deepfake-type-classifier';
import ConfidenceCalibration from './confidence-calibration';

interface AnalysisResult {
  analysis_id: string;
  filename: string;
  file_type: string;
  classification: 'authentic' | 'ai_generated' | 'deepfake';
  deepfake_type?: string;
  authenticity_score: number;
  ai_probability: number;
  manipulation_score: number;
  overall_confidence: number;
  ensemble_agreement: number;
  confidence_calibration: 'low' | 'medium' | 'high';
  scores?: Record<string, number>;
  timestamp: string;
}

export default function ResultsViewer({ result }: { result: AnalysisResult }) {
  const isAuthentic = result.classification === 'authentic';
  const isAIGenerated = result.classification === 'ai_generated';
  const isDeepfake = result.classification === 'deepfake';

  const getIcon = () => {
    if (isDeepfake) return <XCircle className="w-6 h-6 text-red-500" />;
    if (isAIGenerated) return <AlertCircle className="w-6 h-6 text-amber-500" />;
    return <CheckCircle className="w-6 h-6 text-green-500" />;
  };

  const getStatusColor = () => {
    if (isDeepfake) return 'bg-red-500/10 border-red-500/20';
    if (isAIGenerated) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-green-500/10 border-green-500/20';
  };

  const getStatusText = () => {
    if (isDeepfake) return 'Deepfake Detected';
    if (isAIGenerated) return 'AI-Generated Content';
    return 'Authentic Content';
  };

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className={`p-8 border-2 ${getStatusColor()}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{getStatusText()}</h2>
            <p className="text-muted-foreground mb-4">{result.filename}</p>

            {/* Classification Scores */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Authenticity Score</span>
                  <span className="text-sm font-bold text-green-500">
                    {result.authenticity_score.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={result.authenticity_score}
                  className="h-3"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">AI-Generated Probability</span>
                  <span className="text-sm font-bold text-amber-500">
                    {result.ai_probability.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={result.ai_probability}
                  className="h-3"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Manipulation Score</span>
                  <span className="text-sm font-bold text-red-500">
                    {result.manipulation_score.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={result.manipulation_score}
                  className="h-3"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Analysis Confidence</span>
                  <span className="text-sm font-bold text-primary">
                    {result.overall_confidence.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={result.overall_confidence}
                  className="h-3"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Scores */}
      {result.scores && Object.keys(result.scores).length > 0 && (
        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Modality Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(result.scores).map(([key, score]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium capitalize">{key} Detection</span>
                  <span className="text-sm font-bold text-primary">
                    {score === null || score === undefined ? '0.0%' : score.toFixed(1) + '%'}
                  </span>
                </div>
                <Progress value={score || 0} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Metadata */}
      <Card className="p-6 border-border">
        <h3 className="text-lg font-semibold mb-4">Analysis Details</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Analysis ID</dt>
            <dd className="font-mono text-xs">{result.analysis_id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">File Type</dt>
            <dd className="capitalize">{result.file_type}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Timestamp</dt>
            <dd>{new Date(result.timestamp).toLocaleString()}</dd>
          </div>
        </dl>
      </Card>

      {/* Confidence Calibration */}
      <ConfidenceCalibration
        confidence={result.overall_confidence}
        calibrationLevel={result.confidence_calibration}
        modelUncertainty={100 - result.overall_confidence}
      />

      {/* Deepfake Type Classification */}
      <DeepfakeTypeClassifier
        classification={result.classification}
        deepfakeType={result.deepfake_type}
      />

      {/* Ensemble Metrics */}
      <EnsembleMetrics
        ensembleAgreement={result.ensemble_agreement}
        imageModelConfidence={result.scores?.image_detection}
        videoModelConfidence={result.scores?.video_detection}
        audioModelConfidence={result.scores?.audio_detection}
        textModelConfidence={result.scores?.text_detection}
      />

      {/* Detection Hotspots Heatmap */}
      <DetectionHeatmap title="Detection Hotspots Heatmap" />

      {/* Heatmap Visualization */}
      <HeatmapViewer
        scores={result.scores || {}}
        title="Detection Heatmap"
      />

      {/* Blockchain Authentication */}
      <BlockchainVerify
        analysisId={result.analysis_id}
      />

      {/* Recommendations */}
      <Card className="p-6 border-border bg-accent/5">
        <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>
              {isDeepfake
                ? 'This content appears to be manipulated or fabricated. This is a deepfake with signs of facial reenactment, face-swapping, or expression inconsistency. Do not share or distribute without proper context.'
                : isAIGenerated
                ? 'This content appears to be AI-generated and was not created from real footage. Use this information appropriately when considering the source and authenticity of the material.'
                : 'This content appears to be authentic with no signs of AI generation or deepfake manipulation. The analysis shows consistent indicators of genuine, unaltered content.'}
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Always verify critical content through multiple sources before sharing.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>
              {isAIGenerated
                ? 'If sharing AI-generated content, clearly disclose that it was created with AI technology.'
                : 'For legal or official proceedings, consult with forensic experts for formal verification.'}
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Register your content on the blockchain for cryptographic proof of authenticity.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
