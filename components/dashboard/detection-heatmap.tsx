'use client';

import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface DetectionHeatmapProps {
  title?: string;
  width?: number;
  height?: number;
}

export default function DetectionHeatmap({
  title = 'Detection Hotspots Heatmap',
  width = 12,
  height = 8
}: DetectionHeatmapProps) {
  // Generate random heatmap data with some hotspots
  const generateHeatmapData = () => {
    const data = [];
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        // Create multiple hotspots
        const hotspot1 = Math.exp(-((i - 2) ** 2 + (j - 3) ** 2) / 3);
        const hotspot2 = Math.exp(-((i - 5) ** 2 + (j - 8) ** 2) / 2.5);
        const hotspot3 = Math.exp(-((i - 6) ** 2 + (j - 2) ** 2) / 3.5);
        const noise = Math.random() * 0.1;
        
        const value = Math.min(1, hotspot1 + hotspot2 + hotspot3 + noise);
        row.push(value);
      }
      data.push(row);
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  // Get color based on confidence value (0-1)
  const getColorForValue = (value: number): string => {
    if (value < 0.25) {
      // Low - Blue
      return '#3b82f6';
    } else if (value < 0.5) {
      // Moderate - Cyan
      return '#06b6d4';
    } else if (value < 0.75) {
      // High - Yellow
      return '#eab308';
    } else {
      // Critical - Red
      return '#ef4444';
    }
  };

  const getCellLabel = (value: number): string => {
    return (value * 100).toFixed(0);
  };

  return (
    <Card className="p-6 border-border">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        {title}
      </h3>

      <div className="space-y-6">
        {/* Main Heatmap Grid */}
        <div className="bg-secondary/30 rounded-lg p-4 overflow-x-auto">
          <div className="inline-block">
            {heatmapData.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map((value, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="relative group"
                    style={{
                      width: '40px',
                      height: '40px'
                    }}
                  >
                    <div
                      className="w-full h-full rounded transition-all duration-200 hover:scale-110 cursor-pointer shadow-md"
                      style={{
                        backgroundColor: getColorForValue(value),
                        opacity: 0.8
                      }}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-background border border-border rounded px-2 py-1 text-xs whitespace-nowrap z-10">
                      <span className="text-foreground font-semibold">
                        {getCellLabel(value)}%
                      </span>
                      <div className="text-muted-foreground text-xs mt-1">
                        Region [{rowIndex}, {colIndex}]
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Legend */}
        <div className="bg-secondary/30 rounded-lg p-4">
          <p className="text-sm font-semibold mb-4">Confidence Legend</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded shadow-md"
                style={{ backgroundColor: '#3b82f6', opacity: 0.8 }}
              />
              <div>
                <p className="text-xs font-medium">Low</p>
                <p className="text-xs text-muted-foreground">0-25%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded shadow-md"
                style={{ backgroundColor: '#06b6d4', opacity: 0.8 }}
              />
              <div>
                <p className="text-xs font-medium">Moderate</p>
                <p className="text-xs text-muted-foreground">25-50%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded shadow-md"
                style={{ backgroundColor: '#eab308', opacity: 0.8 }}
              />
              <div>
                <p className="text-xs font-medium">High</p>
                <p className="text-xs text-muted-foreground">50-75%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded shadow-md"
                style={{ backgroundColor: '#ef4444', opacity: 0.8 }}
              />
              <div>
                <p className="text-xs font-medium">Critical</p>
                <p className="text-xs text-muted-foreground">75-100%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-secondary/30 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Average Confidence</p>
            <p className="text-2xl font-bold text-primary">
              {(
                heatmapData
                  .flat()
                  .reduce((a, b) => a + b, 0) /
                (width * height) *
                100
              ).toFixed(1)}%
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Peak Confidence</p>
            <p className="text-2xl font-bold text-red-500">
              {(Math.max(...heatmapData.flat()) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Regions Analyzed</p>
            <p className="text-2xl font-bold text-accent">
              {width * height}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          This heatmap displays manipulation confidence across different regions of the analyzed content. Each cell represents a specific area, with color intensity indicating detection confidence levels. Red areas show the highest confidence of detected deepfake artifacts, while blue areas indicate low manipulation probability.
        </p>
      </div>
    </Card>
  );
}
