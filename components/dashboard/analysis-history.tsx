'use client';

import { useEffect, useState } from 'react';
import { Image, Video, Music, FileText, Loader } from 'lucide-react';
import { config } from '@/lib/config';

interface Analysis {
  id: string;
  file_name: string;
  file_type: string;
  status: string;
  created_at: string;
}

const getIcon = (fileType: string) => {
  switch (fileType) {
    case 'image':
      return <Image className="w-4 h-4" />;
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'audio':
      return <Music className="w-4 h-4" />;
    case 'text':
      return <FileText className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Simulate fetching history with mock data
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockAnalyses = [
          {
            id: '1',
            file_name: 'portrait_001.jpg',
            file_type: 'image',
            status: 'completed',
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '2',
            file_name: 'interview_video.mp4',
            file_type: 'video',
            status: 'completed',
            created_at: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: '3',
            file_name: 'voice_sample.mp3',
            file_type: 'audio',
            status: 'completed',
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '4',
            file_name: 'article_text.txt',
            file_type: 'text',
            status: 'completed',
            created_at: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: '5',
            file_name: 'photo_sample.jpg',
            file_type: 'image',
            status: 'completed',
            created_at: new Date(Date.now() - 259200000).toISOString()
          }
        ];
        
        setAnalyses(mockAnalyses);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No analyses yet. Start by uploading content!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {analyses.map((analysis) => (
        <div
          key={analysis.id}
          className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-primary">{getIcon(analysis.file_type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{analysis.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(analysis.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary whitespace-nowrap">
              {analysis.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
