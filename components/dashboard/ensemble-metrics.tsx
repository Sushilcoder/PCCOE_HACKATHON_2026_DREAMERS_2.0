'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, CheckCircle2, AlertTriangle } from 'lucide-react';

interface EnsembleMetricsProps {
  ensembleAgreement: number;
  imageModelConfidence?: number;
  videoModelConfidence?: number;
  audioModelConfidence?: number;
  textModelConfidence?: number;
}

export default function EnsembleMetrics({
  ensembleAgreement,
  imageModelConfidence = 0,
  videoModelConfidence = 0,
  audioModelConfidence = 0,
  textModelConfidence = 0
}: EnsembleMetricsProps) {
  const models = [
    { name: 'Image Model', confidence: imageModelConfidence, color: 'bg-blue-500' },
    { name: 'Video Model', confidence: videoModelConfidence, color: 'bg-purple-500' },
    { name: 'Audio Model', confidence: audioModelConfidence, color: 'bg-cyan-500' },
    { name: 'Text Model', confidence: textModelConfidence, color: 'bg-green-500' }
  ].filter(m => m.confidence > 0);

  const getAgreementStatus = () => {
    if (ensembleAgreement >= 85) return 'High Agreement';
    if (ensembleAgreement >= 70) return 'Moderate Agreement';
    return 'Low Agreement';
  };

  const getAgreementColor = () => {
    if (ensembleAgreement >= 85) return 'text-green-500';
    if (ensembleAgreement >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <Card className="p-6 border-border">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Multi-Model Ensemble Analysis</h3>
      </div>

      {/* Ensemble Agreement */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">Model Agreement Score</span>
          <span className={`text-sm font-bold ${getAgreementColor()}`}>
            {ensembleAgreement.toFixed(1)}% {getAgreementStatus()}
          </span>
        </div>
        <Progress value={ensembleAgreement} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">
          Measures consensus across all detection models. Higher agreement indicates more reliable results.
        </p>
      </div>

      {/* Individual Model Confidence */}
      {models.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Individual Model Confidence</h4>
          {models.map((model) => (
            <div key={model.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium">{model.name}</span>
                <span className="text-xs font-bold">{model.confidence.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${model.color} transition-all duration-300`}
                  style={{ width: `${Math.min(100, model.confidence)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border/50">
        <div className="flex gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            <strong>Ensemble Fusion:</strong> This system uses weighted predictions from multiple deep learning models to increase robustness and reduce false positives compared to single-model approaches.
          </p>
        </div>
      </div>
    </Card>
  );
}
