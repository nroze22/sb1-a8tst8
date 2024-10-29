import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { TrainingModuleEditor } from './TrainingModuleEditor';
import { ModuleSelector } from './ModuleSelector';
import { generateTrainingMaterials, type TrainingModule } from '@/lib/document-generators/training-materials';
import { useToast } from '@/lib/hooks/use-toast';
import {
  ArrowLeft,
  GraduationCap,
  Loader2,
  Download,
  Share2,
  History,
  Users,
  Clock,
  Target,
  Brain,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Changed to named export to match the import in Routes.tsx
export function TrainingMaterials() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [modules, setModules] = useState<TrainingModule[]>([]);

  // Get study data from localStorage
  const studyData = JSON.parse(localStorage.getItem('studyData') || '{}');

  const handleModuleGenerate = async (moduleType: string) => {
    if (!studyData.title) {
      toast({
        title: 'Study Information Required',
        description: 'Please complete study setup first',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const newModule = await generateTrainingMaterials(
        studyData,
        moduleType,
        (progress) => setGenerationProgress(progress)
      );

      setModules(prev => [...prev, newModule]);
      setSelectedModule(newModule);

      toast({
        title: 'Training Module Generated',
        description: 'Your training material is ready for review',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate training material',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleModuleUpdate = (moduleId: string, content: string) => {
    setModules(prev =>
      prev.map(mod =>
        mod.id === moduleId
          ? {
              ...mod,
              content,
              lastModified: new Date(),
              versions: [
                {
                  id: `${mod.id}-v${mod.versions.length + 1}`,
                  version: mod.versions.length + 1,
                  createdAt: new Date(),
                  createdBy: {
                    name: 'John Smith',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
                  },
                  status: 'draft'
                },
                ...mod.versions
              ]
            }
          : mod
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Training Materials Generator</h1>
              <p className="text-muted-foreground mt-1">
                Create comprehensive training content for your study team
              </p>
            </div>
          </div>
          
          {modules.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Module Selection */}
          <div className="space-y-6">
            <ModuleSelector
              onSelect={handleModuleGenerate}
              isGenerating={isGenerating}
              modules={modules}
              selectedModuleId={selectedModule?.id}
              onModuleSelect={(moduleId) => {
                const module = modules.find(m => m.id === moduleId);
                setSelectedModule(module || null);
              }}
            />

            {isGenerating && (
              <Card className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Generating module...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} />
                </div>
              </Card>
            )}
          </div>

          {/* Module Editor */}
          <div className="lg:col-span-3">
            {selectedModule ? (
              <TrainingModuleEditor
                module={selectedModule}
                onChange={(content) => handleModuleUpdate(selectedModule.id, content)}
              />
            ) : (
              <Card className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                <GraduationCap className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Module Selected</h3>
                <p>Select a training module type to begin or choose an existing module to edit</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}