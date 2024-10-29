import { generateWithGPT4 } from '../gpt';

export interface IrbDocument {
  id: string;
  title: string;
  content: string;
  version: number;
  status: 'generating' | 'completed' | 'error';
  progress: number;
  createdAt: Date;
  lastModified: Date;
  approvalStatus: 'draft' | 'pending_review' | 'approved';
  collaborators: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    user: {
      name: string;
      avatar?: string;
    }
  }>;
  versions: Array<{
    id: string;
    version: number;
    createdAt: Date;
    createdBy: {
      name: string;
      avatar?: string;
    };
    status: 'draft' | 'pending_review' | 'approved';
  }>;
}

interface StudyDetails {
  studyTitle: string;
  protocolNumber: string;
  sponsorName: string;
  phase: string;
  studyType: string;
  irbName: string;
  primaryObjective: string;
  secondaryObjectives?: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
}

const documentPrompts = {
  coverLetter: (details: StudyDetails) => `
Create a professional IRB cover letter for the following study:

Study Title: ${details.studyTitle}
Protocol Number: ${details.protocolNumber}
Sponsor: ${details.sponsorName}
Phase: ${details.phase}
Type: ${details.studyType}

The cover letter should:
1. Follow standard IRB submission format
2. Include a clear introduction of the study
3. List all documents being submitted
4. Request IRB review and approval
5. Provide investigator contact information
6. Maintain a professional and formal tone

Format the response with appropriate sections, headers, and professional formatting.`,

  protocolSummary: (details: StudyDetails) => `
Create a detailed protocol summary for IRB review of the following study:

Study Title: ${details.studyTitle}
Primary Objective: ${details.primaryObjective}
Secondary Objectives: ${details.secondaryObjectives || 'N/A'}
Phase: ${details.phase}
Type: ${details.studyType}

Include the following sections:
1. Study Background and Rationale
2. Study Design Overview
3. Primary and Secondary Endpoints
4. Subject Population
5. Inclusion/Exclusion Criteria
6. Study Procedures
7. Safety Monitoring
8. Statistical Considerations

Format with clear headers, bullet points where appropriate, and professional language.`,

  informedConsent: (details: StudyDetails) => `
Create a comprehensive informed consent form following ${details.irbName} guidelines for:

Study Title: ${details.studyTitle}
Protocol Number: ${details.protocolNumber}

Include all required sections:
1. Study Purpose and Background
2. Study Procedures
3. Risks and Discomforts
4. Potential Benefits
5. Alternatives to Participation
6. Confidentiality
7. Costs and Compensation
8. Voluntary Participation
9. Contact Information
10. Signature Section

Use clear, simple language appropriate for participants. Include all required regulatory elements.`,

  recruitmentMaterials: (details: StudyDetails) => `
Create participant recruitment materials for:

Study Title: ${details.studyTitle}
Type: ${details.studyType}

Include:
1. Study Advertisement (print-ready)
2. Recruitment Script
3. Social Media Content
4. Email Template

Ensure materials:
- Are clear and concise
- Include required regulatory elements
- Avoid coercive language
- Maintain appropriate reading level
- Include clear contact information`,
};

export async function generateIrbDocuments(
  studyDetails: StudyDetails,
  onProgress: (documentId: string, progress: number) => void
): Promise<IrbDocument[]> {
  const documents: IrbDocument[] = [
    {
      id: 'cover-letter',
      title: 'IRB Cover Letter',
      content: '',
      version: 1,
      status: 'generating',
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      approvalStatus: 'draft',
      collaborators: [
        { name: 'John Smith', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { name: 'Sarah Johnson', role: 'Reviewer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
      ],
      comments: [],
      versions: []
    },
    {
      id: 'protocol-summary',
      title: 'Protocol Summary',
      content: '',
      version: 1,
      status: 'generating',
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      approvalStatus: 'draft',
      collaborators: [
        { name: 'John Smith', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { name: 'Michael Chen', role: 'Editor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' }
      ],
      comments: [],
      versions: []
    },
    {
      id: 'informed-consent',
      title: 'Informed Consent Form',
      content: '',
      version: 1,
      status: 'generating',
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      approvalStatus: 'draft',
      collaborators: [
        { name: 'John Smith', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { name: 'Emily Wilson', role: 'Reviewer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' }
      ],
      comments: [],
      versions: []
    },
    {
      id: 'recruitment-materials',
      title: 'Recruitment Materials',
      content: '',
      version: 1,
      status: 'generating',
      progress: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      approvalStatus: 'draft',
      collaborators: [
        { name: 'John Smith', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { name: 'Lisa Martinez', role: 'Editor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' }
      ],
      comments: [],
      versions: []
    }
  ];

  const generateDocument = async (
    doc: IrbDocument,
    prompt: string
  ): Promise<IrbDocument> => {
    try {
      // Simulate progressive generation with multiple steps
      const steps = ['Analyzing requirements', 'Generating content', 'Formatting document', 'Finalizing'];
      for (let i = 0; i < steps.length; i++) {
        onProgress(doc.id, (i + 1) * 25);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const content = await generateWithGPT4([
        { role: 'system', content: 'You are an expert in creating IRB documentation for clinical trials.' },
        { role: 'user', content: prompt }
      ]);

      return {
        ...doc,
        content: content || 'Failed to generate content',
        status: 'completed',
        progress: 100,
        lastModified: new Date(),
        versions: [
          {
            id: `${doc.id}-v1`,
            version: 1,
            createdAt: new Date(),
            createdBy: {
              name: 'John Smith',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
            },
            status: 'draft'
          }
        ]
      };
    } catch (error) {
      return {
        ...doc,
        status: 'error',
        progress: 0
      };
    }
  };

  const generatedDocs = await Promise.all([
    generateDocument(documents[0], documentPrompts.coverLetter(studyDetails)),
    generateDocument(documents[1], documentPrompts.protocolSummary(studyDetails)),
    generateDocument(documents[2], documentPrompts.informedConsent(studyDetails)),
    generateDocument(documents[3], documentPrompts.recruitmentMaterials(studyDetails))
  ]);

  return generatedDocs;
}