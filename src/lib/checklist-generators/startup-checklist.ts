import { generateWithGPT4 } from '../gpt';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  dueDate?: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
  estimatedDuration?: string;
  actualDuration?: string;
  notes?: string;
  attachments?: string[];
  regulatoryRequirement?: boolean;
  milestoneTask?: boolean;
  completedDate?: string;
  completedBy?: string;
  verifiedBy?: string;
  tags: string[];
}

export interface ChecklistCategory {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  progress: number;
  dueDate?: string;
  owner?: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface StudySetupDetails {
  title: string;
  phase: string;
  type: string;
  regulatoryPath: string;
  siteCount: number;
  estimatedDuration: string;
  targetEnrollment: number;
  fundingSource: string;
  monitoringStrategy: string;
  dataManagement: string;
  safetyReporting: string;
}

const categoryPrompts = {
  regulatory: `Generate a comprehensive regulatory checklist for study startup including:
1. IND/IDE requirements and submissions
2. IRB/EC submissions and approvals
3. Required regulatory documents
4. Site regulatory documentation
5. Essential document collection and filing
6. Regulatory authority communications
7. Protocol registration requirements
8. Clinical trials registry requirements

Consider:
- Phase-specific requirements
- Local vs. central IRB processes
- International requirements if applicable
- Document version control
- Filing and archival requirements
- Regulatory authority timelines
- Safety reporting requirements`,

  contracts: `Generate a detailed contracts and agreements checklist including:
1. Clinical trial agreements
2. Budget negotiations
3. Confidentiality agreements
4. Site contracts
5. Vendor agreements
6. Master service agreements
7. Work orders
8. Contract amendments

Consider:
- Contract review processes
- Legal department timelines
- Payment terms and schedules
- Performance metrics
- Liability and insurance requirements
- Intellectual property terms
- Publication rights`,

  siteManagement: `Generate a site startup and management checklist including:
1. Site selection activities
2. Site qualification visits
3. Site initiation visits
4. Training requirements
5. Essential document collection
6. Site activation requirements
7. Recruitment planning
8. Site communication plans

Consider:
- Site feasibility assessments
- Training documentation
- Site file setup
- Local requirements
- Resource availability
- Equipment needs
- Personnel qualifications`,

  studyDocuments: `Generate a study documents preparation checklist including:
1. Protocol development
2. Informed consent forms
3. Case report forms
4. Source document templates
5. Study manuals
6. Training materials
7. Recruitment materials
8. Safety reporting forms

Consider:
- Document version control
- Translation requirements
- Review processes
- Distribution plans
- Implementation timelines
- Quality control procedures`,

  dataManagement: `Generate a data management setup checklist including:
1. Database design and validation
2. EDC system setup
3. Data entry guidelines
4. Query management processes
5. Data validation plans
6. Data security measures
7. Backup procedures
8. Archive planning

Consider:
- System validation requirements
- User access controls
- Training needs
- Data standards
- Quality control procedures
- Integration requirements`,

  safety: `Generate a safety management setup checklist including:
1. Safety monitoring plans
2. DSMB/DMC setup
3. Safety reporting procedures
4. SAE processing workflows
5. Safety database setup
6. Medical monitoring plans
7. Safety review processes
8. Risk management plans

Consider:
- Regulatory reporting requirements
- Timeline requirements
- Documentation needs
- Communication plans
- Medical review processes`,

  monitoring: `Generate a monitoring setup checklist including:
1. Monitoring plan development
2. CRA assignments
3. Visit scheduling
4. Remote monitoring procedures
5. Quality management system
6. Issue escalation processes
7. Trip report templates
8. Performance metrics

Consider:
- Risk-based monitoring approach
- Resource allocation
- Training requirements
- Documentation standards
- Quality control measures`,

  pharmacy: `Generate a pharmacy setup checklist including:
1. Drug supply management
2. Storage requirements
3. Temperature monitoring
4. Dispensing procedures
5. Drug accountability
6. Returns and destruction
7. Blinding procedures
8. Emergency unblinding

Consider:
- Storage conditions
- Security requirements
- Documentation needs
- Temperature excursion procedures
- Drug labeling requirements`,

  laboratory: `Generate a laboratory setup checklist including:
1. Lab manual development
2. Sample handling procedures
3. Lab supplies management
4. Specimen shipping requirements
5. Results reporting processes
6. Normal ranges establishment
7. Lab certification verification
8. Quality control procedures

Consider:
- Sample storage requirements
- Shipping regulations
- Documentation needs
- Result reporting timelines
- Quality control measures`
};

export async function generateStartupChecklist(
  studyDetails: StudySetupDetails,
  onProgress?: (category: string, progress: number) => void
): Promise<ChecklistCategory[]> {
  const baseSystemPrompt = `You are an expert clinical research consultant specializing in study startup.
Create a comprehensive startup checklist for the following study:

Study Title: ${studyDetails.title}
Phase: ${studyDetails.phase}
Type: ${studyDetails.type}
Regulatory Path: ${studyDetails.regulatoryPath}
Site Count: ${studyDetails.siteCount}
Target Enrollment: ${studyDetails.targetEnrollment}
Estimated Duration: ${studyDetails.estimatedDuration}
Monitoring Strategy: ${studyDetails.monitoringStrategy}
Data Management: ${studyDetails.dataManagement}
Safety Reporting: ${studyDetails.safetyReporting}

The checklist must:
1. Follow ICH GCP guidelines and industry best practices
2. Include all regulatory requirements
3. Consider risk-based approaches
4. Include realistic timelines
5. Account for dependencies
6. Identify critical path items
7. Include quality control measures
8. Consider resource requirements

Format each checklist item as a detailed JSON object matching the ChecklistItem interface.
Ensure all dates are in ISO format and all IDs are unique.
Include specific assignee roles, not placeholder names.
Tag items appropriately for filtering and reporting.`;

  try {
    const categories = Object.keys(categoryPrompts);
    const checklist = await Promise.all(
      categories.map(async (category, index) => {
        if (onProgress) {
          onProgress(category, (index / categories.length) * 100);
        }

        const response = await generateWithGPT4([
          { role: 'system', content: baseSystemPrompt },
          { role: 'user', content: categoryPrompts[category as keyof typeof categoryPrompts] }
        ]);

        if (!response) {
          throw new Error(`Failed to generate checklist for ${category}`);
        }

        try {
          return JSON.parse(response);
        } catch (error) {
          console.error(`Failed to parse ${category} checklist:`, error);
          return generateFallbackCategory(category);
        }
      })
    );

    return checklist.flat();
  } catch (error) {
    console.error('Failed to generate startup checklist:', error);
    return generateFallbackChecklist();
  }
}

// Rest of the file remains the same...