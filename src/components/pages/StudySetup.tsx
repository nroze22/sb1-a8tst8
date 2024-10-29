import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentUpload } from '@/components/shared/DocumentUpload';
import { Header } from '@/components/layout/Header';
import { useToast } from '@/lib/hooks/use-toast';
import { processDocument, mergeDocumentData } from '@/lib/document-processor';
import {
  FileText,
  FileCheck,
  Building,
  Users,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const therapeuticAreas = [
  'Oncology',
  'Cardiology',
  'Neurology',
  'Immunology',
  'Infectious Disease',
  'Endocrinology',
  'Gastroenterology',
  'Hematology',
  'Psychiatry',
  'Respiratory',
  'Rheumatology',
  'Dermatology',
  'Other'
];

interface StudyData {
  title: string;
  phase: string;
  type: string;
  therapeuticArea: string;
  indication: string;
  patientCount: string;
  duration: string;
  documents: Array<{
    name: string;
    type: string;
  }>;
}

// Changed to named export to match the import in Routes.tsx
export function StudySetup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; type: string }>>([]);
  const [studyData, setStudyData] = useState<StudyData>({
    title: '',
    phase: '',
    type: '',
    therapeuticArea: '',
    indication: '',
    patientCount: '',
    duration: '',
    documents: []
  });

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const doc = await processDocument(file);
      
      // Update study data with extracted information
      setStudyData(prev => ({
        ...prev,
        ...mergeDocumentData(prev, doc.extractedData),
        documents: [...prev.documents, { name: file.name, type: file.type }]
      }));

      setUploadedFiles(prev => [...prev, { name: file.name, type: file.type }]);
      
      toast({
        title: 'File Processed',
        description: `${file.name} has been processed and data extracted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to process document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!studyData.title || !studyData.phase || !studyData.type || !studyData.patientCount || !studyData.duration) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Save study data
    localStorage.setItem('studyData', JSON.stringify(studyData));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Study Setup</h1>
          <p className="text-muted-foreground mb-8">
            Let's gather information about your study and required documentation
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Study Information */}
            <Card className="p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Study Information
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="study-title" className="text-sm font-medium">Study Title</Label>
                  <Input
                    id="study-title"
                    value={studyData.title}
                    onChange={(e) => setStudyData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter the full title of your study"
                    className="h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="study-phase" className="text-sm font-medium">Study Phase</Label>
                    <Select value={studyData.phase} onValueChange={(value) => setStudyData(prev => ({ ...prev, phase: value }))}>
                      <SelectTrigger id="study-phase" className="h-11">
                        <SelectValue placeholder="Select phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="I">Phase I</SelectItem>
                        <SelectItem value="II">Phase II</SelectItem>
                        <SelectItem value="III">Phase III</SelectItem>
                        <SelectItem value="IV">Phase IV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="study-type" className="text-sm font-medium">Study Type</Label>
                    <Select value={studyData.type} onValueChange={(value) => setStudyData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger id="study-type" className="h-11">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interventional">Interventional</SelectItem>
                        <SelectItem value="observational">Observational</SelectItem>
                        <SelectItem value="expanded-access">Expanded Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="therapeutic-area" className="text-sm font-medium">Therapeutic Area</Label>
                  <Select 
                    value={studyData.therapeuticArea} 
                    onValueChange={(value) => setStudyData(prev => ({ ...prev, therapeuticArea: value }))}
                  >
                    <SelectTrigger id="therapeutic-area" className="h-11">
                      <SelectValue placeholder="Select therapeutic area" />
                    </SelectTrigger>
                    <SelectContent>
                      {therapeuticAreas.map(area => (
                        <SelectItem key={area} value={area.toLowerCase()}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="indication" className="text-sm font-medium">Primary Indication</Label>
                  <Input
                    id="indication"
                    value={studyData.indication}
                    onChange={(e) => setStudyData(prev => ({ ...prev, indication: e.target.value }))}
                    placeholder="Primary indication"
                    className="h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="patient-count" className="text-sm font-medium">Number of Patients</Label>
                    <Input
                      id="patient-count"
                      type="number"
                      min="1"
                      value={studyData.patientCount}
                      onChange={(e) => setStudyData(prev => ({ ...prev, patientCount: e.target.value }))}
                      placeholder="Enter target enrollment"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="study-duration" className="text-sm font-medium">Study Duration (months)</Label>
                    <Input
                      id="study-duration"
                      type="number"
                      min="1"
                      value={studyData.duration}
                      onChange={(e) => setStudyData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Enter duration"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Document Upload */}
            <Card className="p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Study Documents
              </h2>

              <DocumentUpload
                onFileUpload={handleFileUpload}
                isUploading={isUploading}
                acceptedFileTypes=".pdf,.doc,.docx,.txt"
                maxFileSize={10}
              />

              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-4">Required Documents</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">Protocol Document</span>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm">Informed Consent Forms</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <Building className="h-4 w-4 text-primary" />
                      <span className="text-sm">Regulatory Documents</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmit} size="lg" className="px-8 h-11">
              Complete Setup
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}