import { useState } from 'react';
import { Stage, Layer, Rect, Text, Image, Transformer } from 'react-konva';
import { ChromePicker } from 'react-color';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Type,
  Image as ImageIcon,
  Palette,
  Layout,
  Save,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Move,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Layers,
  Plus,
  FileImage,
  Upload,
  Settings,
  Loader2
} from 'lucide-react';
import useImage from 'use-image';
import { jsPDF } from 'jspdf';
import html2canvas from 'html-to-image';
import { generatePosterContent } from '@/lib/marketing-generators/poster';

// Constants for standard poster sizes
const POSTER_SIZES = {
  'letter': { width: 2550, height: 3300 }, // 8.5" x 11" at 300 DPI
  'tabloid': { width: 3300, height: 5100 }, // 11" x 17" at 300 DPI
  'a3': { width: 3508, height: 4961 }, // A3 at 300 DPI
  'custom': { width: 3300, height: 5100 } // Default custom size
};

interface PosterElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'template';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  fill?: string;
  url?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  locked?: boolean;
  opacity?: number;
  strokeWidth?: number;
  stroke?: string;
  align?: 'left' | 'center' | 'right';
  draggable?: boolean;
  zIndex?: number;
}

interface PosterDesignerProps {
  studyDetails: any;
  onSave: (elements: PosterElement[]) => void;
}

export function PosterDesigner({ studyDetails, onSave }: PosterDesignerProps) {
  const [posterSize, setPosterSize] = useState<keyof typeof POSTER_SIZES>('letter');
  const [elements, setElements] = useState<PosterElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(0.2);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInitialContent = async () => {
    setIsGenerating(true);
    try {
      const content = await generatePosterContent(studyDetails);
      
      // Transform the generated content into poster elements
      const newElements = [
        // Title
        {
          id: 'title',
          type: 'text',
          x: POSTER_SIZES[posterSize].width / 2,
          y: 200,
          content: content.title,
          fontSize: 120,
          fontFamily: 'Arial',
          fill: '#000000',
          align: 'center',
          draggable: true,
          zIndex: 1
        },
        // Subtitle
        {
          id: 'subtitle',
          type: 'text',
          x: POSTER_SIZES[posterSize].width / 2,
          y: 400,
          content: content.subtitle,
          fontSize: 72,
          fontFamily: 'Arial',
          fill: '#666666',
          align: 'center',
          draggable: true,
          zIndex: 2
        },
        // Key points
        ...content.keyPoints.map((point, index) => ({
          id: `point-${index}`,
          type: 'text',
          x: 300,
          y: 600 + (index * 150),
          content: `• ${point}`,
          fontSize: 48,
          fontFamily: 'Arial',
          fill: '#333333',
          align: 'left',
          draggable: true,
          zIndex: 3 + index
        })),
        // Contact info
        {
          id: 'contact',
          type: 'text',
          x: POSTER_SIZES[posterSize].width / 2,
          y: POSTER_SIZES[posterSize].height - 300,
          content: content.contactInfo,
          fontSize: 48,
          fontFamily: 'Arial',
          fill: '#000000',
          align: 'center',
          draggable: true,
          zIndex: 10
        }
      ];

      setElements(newElements);
    } catch (error) {
      console.error('Failed to generate poster content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // ... Rest of the component implementation similar to BrochureEditor
  // Including element management, export functions, and rendering logic
  // Adapted for poster-specific requirements

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select
              className="border rounded p-2"
              value={posterSize}
              onChange={(e) => setPosterSize(e.target.value as keyof typeof POSTER_SIZES)}
            >
              <option value="letter">Letter (8.5" x 11")</option>
              <option value="tabloid">Tabloid (11" x 17")</option>
              <option value="a3">A3</option>
              <option value="custom">Custom Size</option>
            </select>
            <Button
              onClick={generateInitialContent}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setScale(s => Math.max(0.1, s - 0.1))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button variant="outline" onClick={() => setScale(s => Math.min(2, s + 0.1))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-auto bg-gray-100">
          <Stage
            width={POSTER_SIZES[posterSize].width * scale}
            height={POSTER_SIZES[posterSize].height * scale}
            scale={{ x: scale, y: scale }}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedId(null);
              }
            }}
          >
            <Layer>
              {/* Background */}
              <Rect
                width={POSTER_SIZES[posterSize].width}
                height={POSTER_SIZES[posterSize].height}
                fill="white"
                shadowColor="rgba(0, 0, 0, 0.15)"
                shadowBlur={20}
                shadowOffset={{ x: 5, y: 5 }}
              />

              {/* Elements */}
              {elements.map((element) => {
                if (element.type === 'text') {
                  return (
                    <Text
                      key={element.id}
                      {...element}
                      onClick={() => setSelectedId(element.id)}
                      onTap={() => setSelectedId(element.id)}
                    />
                  );
                }
                // Add handlers for other element types
                return null;
              })}

              {/* Transformer for selected element */}
              {selectedId && <Transformer />}
            </Layer>
          </Stage>
        </div>
      </Card>

      {/* Tools Panel */}
      {/* Add tools panel implementation */}
    </div>
  );
}