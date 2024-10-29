import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/lib/hooks/use-toast';
import {
  ArrowLeft,
  Brain,
  AlertCircle,
  CheckCircle,
  FileText,
  Target,
  Users,
  Calendar,
  BarChart,
  Clock,
  Download,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { analyzeProtocol, type AnalysisResult } from '@/lib/protocol-analyzer';

// Changed to named export to match the import in Routes.tsx
export function ProtocolAnalysis() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const result = await analyzeProtocol(reader.result as string);
        setAnalysis(result);
        toast({
          title: "Analysis Complete",
          description: "Protocol analysis is ready for review",
        });
      } catch (error) {
        toast({
          title: "Analysis Failed",
          description: "Failed to analyze the protocol",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

    reader.readAsText(file);
  };

  const sections = analysis ? [
    {
      title: "Overview",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Protocol Quality Score</h3>
              <p className="text-sm text-muted-foreground">Based on comprehensive analysis</p>
            </div>
            <div className="text-4xl font-bold text-blue-600">{analysis.score}/100</div>
          </div>
          <Progress value={analysis.score} className="h-2" />
        </div>
      ),
    },
    {
      title: "Suggestions",
      icon: <Brain className="h-5 w-5" />,
      content: (
        <ul className="space-y-4">
          {analysis.suggestions.map((suggestion, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Risks",
      icon: <AlertCircle className="h-5 w-5" />,
      content: (
        <ul className="space-y-4">
          {analysis.risks.map((risk, i) => (
            <li key={i} className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500 shrink-0 mt-0.5" />
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Timeline",
      icon: <Calendar className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-lg font-semibold">{analysis.timeline}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Startup Phase</h4>
              <Progress value={30} className="h-1" />
              <p className="text-sm text-muted-foreground mt-2">2-3 months</p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Enrollment Phase</h4>
              <Progress value={60} className="h-1" />
              <p className="text-sm text-muted-foreground mt-2">12-15 months</p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Analysis Phase</h4>
              <Progress value={20} className="h-1" />
              <p className="text-sm text-muted-foreground mt-2">3-4 months</p>
            </Card>
          </div>
        </div>
      ),
    },
  ] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Protocol Analysis</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Upload Protocol</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <input
                type="file"
                id="protocol-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="protocol-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FileText className="h-8 w-8 mb-2 text-gray-400" />
                <span className="text-sm font-medium">
                  Drop protocol file here or click to upload
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Supports PDF, DOC, DOCX
                </span>
              </label>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={undefined} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Analyzing protocol...
                </p>
              </div>
            )}
          </div>

          {analysis && (
            <div className="mt-6">
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Analysis Report
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-2">
          {analysis ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                {sections.map((section) => (
                  <TabsTrigger
                    key={section.title.toLowerCase()}
                    value={section.title.toLowerCase()}
                    className="flex items-center"
                  >
                    {section.icon}
                    <span className="ml-2">{section.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {sections.map((section) => (
                <TabsContent
                  key={section.title.toLowerCase()}
                  value={section.title.toLowerCase()}
                >
                  <ScrollArea className="h-[500px] pr-4">
                    {section.content}
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Upload a protocol to begin analysis</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}