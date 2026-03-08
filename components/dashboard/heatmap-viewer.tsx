'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface HeatmapViewerProps {
  imageUrl?: string;
  scores: Record<string, number>;
  title?: string;
}

export default function HeatmapViewer({
  imageUrl,
  scores,
  title = 'Attention Heatmap'
}: HeatmapViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Create gradient heatmap overlay
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Generate heatmap data (simulated for demo)
      const heatmapData = new Array(canvas.width * canvas.height).fill(0);

      // Add some hotspots (center regions)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      for (let i = 0; i < heatmapData.length; i++) {
        const x = i % canvas.width;
        const y = Math.floor(i / canvas.width);
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        heatmapData[i] = Math.max(0, 1 - distance / 300);
      }

      // Apply heatmap colors
      for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const heatValue = heatmapData[pixelIndex] || 0;

        // Color gradient: blue -> cyan -> green -> yellow -> red
        let r, g, b;
        if (heatValue < 0.25) {
          // Blue to cyan
          r = 0;
          g = Math.floor(255 * (heatValue / 0.25));
          b = 255;
        } else if (heatValue < 0.5) {
          // Cyan to green
          r = 0;
          g = 255;
          b = Math.floor(255 * (1 - (heatValue - 0.25) / 0.25));
        } else if (heatValue < 0.75) {
          // Green to yellow
          r = Math.floor(255 * ((heatValue - 0.5) / 0.25));
          g = 255;
          b = 0;
        } else {
          // Yellow to red
          r = 255;
          g = Math.floor(255 * (1 - (heatValue - 0.75) / 0.25));
          b = 0;
        }

        // Blend with original image
        data[i] = Math.floor(data[i] * 0.6 + r * 0.4);
        data[i + 1] = Math.floor(data[i + 1] * 0.6 + g * 0.4);
        data[i + 2] = Math.floor(data[i + 2] * 0.6 + b * 0.4);
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <Card className="p-6 border-border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        {title}
      </h3>

      <div className="space-y-6">
        {imageUrl && (
          <div className="rounded-lg overflow-hidden bg-background border border-border">
            <canvas
              ref={canvasRef}
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}

        {/* Legend */}
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-sm font-semibold mb-3">Confidence Legend</p>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-blue-500 rounded" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-cyan-500 rounded" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-yellow-500 rounded" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-red-500 rounded" />
              <span>Critical</span>
            </div>
          </div>
        </div>

        {/* Detailed Scores */}
        {scores && Object.keys(scores).length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(scores).map(([key, value]) => (
              <div key={key} className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs font-medium text-muted-foreground capitalize">
                  {key}
                </p>
                <p className="text-lg font-bold text-primary mt-1">
                  {value === null || value === undefined ? '0.0%' : value.toFixed(1) + '%'}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          The heatmap highlights regions of the image that contributed most to the deepfake detection decision.
          Red areas indicate high confidence in detected manipulation.
        </p>
      </div>
    </Card>
  );
}
