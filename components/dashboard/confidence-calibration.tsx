'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2, Gauge } from 'lucide-react';

interface ConfidenceCalibrationProps {
  confidence: number;
  calibrationLevel: 'low' | 'medium' | 'high';
  modelUncertainty?: number;
}

export default function ConfidenceCalibration({
  confidence,
  calibrationLevel,
  modelUncertainty = 0
}: ConfidenceCalibrationProps) {
  const getCalibrationStatus = () => {
    if (calibrationLevel === 'high') {
      return {
        title: 'High Confidence Analysis',
        description: 'Strong consensus across detection models with low uncertainty',
        color: 'text-green-500',
        bgColor: 'bg-green-500/5',
        borderColor: 'border-green-500/20'
      };
    }
    if (calibrationLevel === 'medium') {
      return {
        title: 'Moderate Confidence Analysis',
        description: 'Reasonable model agreement with some variance in predictions',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/5',
        borderColor: 'border-amber-500/20'
      };
    }
    return {
      title: 'Low Confidence Analysis',
      description: 'Models show disagreement or high uncertainty - manual review recommended',
      color: 'text-red-500',
      bgColor: 'bg-red-500/5',
      borderColor: 'border-red-500/20'
    };
  };

  const status = getCalibrationStatus();

  const getRiskLevel = () => {
    if (confidence >= 85) return 'Very High Risk';
    if (confidence >= 70) return 'High Risk';
    if (confidence >= 50) return 'Medium Risk';
    return 'Low Risk';
  };

  const getRiskColor = () => {
    if (confidence >= 85) return 'text-red-500';
    if (confidence >= 70) return 'text-orange-500';
    if (confidence >= 50) return 'text-amber-500';
    return 'text-blue-500';
  };

  return (
    <Card className={`p-6 border-2 ${status.borderColor} ${status.bgColor}`}>
      <div className="flex items-start gap-3 mb-6">
        <Gauge className={`w-5 h-5 ${status.color} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${status.color}`}>{status.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{status.description}</p>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Detection Confidence</span>
            <span className={`text-sm font-bold ${getRiskColor()}`}>
              {confidence.toFixed(1)}% - {getRiskLevel()}
            </span>
          </div>
          <Progress value={confidence} className="h-3" />
        </div>

        {/* Model Uncertainty */}
        {modelUncertainty > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Model Uncertainty</span>
              <span className="text-sm font-bold text-muted-foreground">
                {modelUncertainty.toFixed(1)}%
              </span>
            </div>
            <Progress value={modelUncertainty} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">
              Measured using Monte Carlo Dropout - higher uncertainty may warrant additional analysis
            </p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border/50">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          {calibrationLevel === 'high' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          )}
          Recommendation
        </h4>
        <p className="text-xs text-muted-foreground">
          {calibrationLevel === 'high'
            ? 'Results are reliable. Confidence is high across all detection models with minimal uncertainty.'
            : calibrationLevel === 'medium'
            ? 'Consider requesting manual review or additional forensic analysis for critical decisions.'
            : 'High uncertainty detected. Recommend expert forensic analysis before making definitive conclusions.'}
        </p>
      </div>

      {/* Calibration Info */}
      <div className="mt-4 p-4 bg-secondary/30 rounded-lg border border-border/30">
        <p className="text-xs text-muted-foreground">
          <strong>Confidence Calibration:</strong> This metric adjusts raw model probabilities using temperature scaling and Platt scaling to provide realistic estimates of detection reliability.
        </p>
      </div>
    </Card>
  );
}
