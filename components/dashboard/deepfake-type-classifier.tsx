'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, AlertCircle, Layers } from 'lucide-react';

interface DeepfakeTypeProps {
  classification: 'authentic' | 'ai_generated' | 'deepfake';
  deepfakeType?: string;
}

const DEEPFAKE_TYPES = {
  face_swap: {
    name: 'Face Swap',
    description: 'One person\'s face replaced with another using face-swapping techniques',
    riskLevel: 'critical',
    indicators: ['Face detection mismatch', 'Identity inconsistency', 'Boundary artifacts']
  },
  lip_sync: {
    name: 'Lip Sync / Reenactment',
    description: 'Mouth and lip movements synchronized with different audio',
    riskLevel: 'critical',
    indicators: ['Lip-audio misalignment', 'Jaw movement anomaly', 'Phoneme inconsistency']
  },
  voice_clone: {
    name: 'Voice Cloning',
    description: 'Speech synthesized or cloned to mimic another person\'s voice',
    riskLevel: 'high',
    indicators: ['Prosody patterns unusual', 'Voice artifact detection', 'Audio spectrogram anomaly']
  },
  facial_reenactment: {
    name: 'Facial Reenactment',
    description: 'Real footage with expressions manipulated to show different emotions',
    riskLevel: 'high',
    indicators: ['Expression inconsistency', 'Micro-expression absence', 'Eye gaze mismatch']
  },
  diffusion_image: {
    name: 'Diffusion Model Image',
    description: 'Image generated using diffusion-based AI (Stable Diffusion, DALL-E)',
    riskLevel: 'medium',
    indicators: ['Texture smoothness', 'Unusual artifacts', 'Blur pattern detection']
  },
  gan_image: {
    name: 'GAN-Generated Image',
    description: 'Image created using generative adversarial networks (StyleGAN, ProGAN)',
    riskLevel: 'medium',
    indicators: ['Artifact patterns', 'Color distribution anomaly', 'Edge inconsistency']
  },
  stable_diffusion: {
    name: 'Stable Diffusion',
    description: 'High-quality AI-generated image from Stable Diffusion model',
    riskLevel: 'medium',
    indicators: ['Token patterns', 'Lighting inconsistency', 'Texture synthesis markers']
  },
  ai_generated_text: {
    name: 'AI-Generated Text',
    description: 'Text written or modified by language models (GPT, Claude, etc.)',
    riskLevel: 'low',
    indicators: ['Repetitive patterns', 'Unusual phrasing', 'Vocabulary distribution']
  },
  manipulated_text: {
    name: 'Manipulated Text',
    description: 'Authentic text edited or altered to change meaning',
    riskLevel: 'medium',
    indicators: ['Context inconsistency', 'Fact contradiction', 'Tone shift']
  }
};

export default function DeepfakeTypeClassifier({
  classification,
  deepfakeType
}: DeepfakeTypeProps) {
  if (classification === 'authentic') {
    return (
      <Card className="p-6 border-border bg-green-500/5">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Authentic Content</h3>
            <p className="text-sm text-muted-foreground">
              No signs of AI generation or deepfake manipulation detected. Content appears to be genuine and unaltered.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const typeInfo = deepfakeType && DEEPFAKE_TYPES[deepfakeType as keyof typeof DEEPFAKE_TYPES];

  return (
    <Card className="p-6 border-border">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">
            {classification === 'ai_generated' ? 'AI-Generated Content Detected' : 'Deepfake Type Classification'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {classification === 'ai_generated'
              ? 'This content was generated or created by artificial intelligence.'
              : 'This deepfake has been classified into a specific manipulation category.'}
          </p>
        </div>
      </div>

      {typeInfo && (
        <div className="space-y-4">
          {/* Type Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`
                ${typeInfo.riskLevel === 'critical' ? 'bg-red-500/20 text-red-500 border-red-500/30' : ''}
                ${typeInfo.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : ''}
                ${typeInfo.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : ''}
                ${typeInfo.riskLevel === 'low' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' : ''}
              `}
            >
              {typeInfo.name}
            </Badge>
            <Badge variant="outline" className="capitalize">
              Risk: {typeInfo.riskLevel}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground">{typeInfo.description}</p>

          {/* Indicators */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Detected Indicators
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {typeInfo.indicators.map((indicator) => (
                <div key={indicator} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{indicator}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
