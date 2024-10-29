import { generateWithGPT4 } from './gpt';

export interface AnalysisResult {
  score: number;
  suggestions: string[];
  risks: string[];
  timeline: string;
  phases: {
    startup: { duration: string; progress: number };
    enrollment: { duration: string; progress: number };
    analysis: { duration: string; progress: number };
  };
  statistics: {
    sampleSize: number;
    powerAnalysis: string;
    primaryEndpoint: string;
  };
  compliance: {
    regulatoryRequirements: string[];
    monitoringPlan: string;
    safetyReporting: string;
  };
}

export async function analyzeProtocol(content: string): Promise<AnalysisResult> {
  const systemPrompt = `You are an expert clinical trial protocol analyzer. Analyze the provided protocol content and provide a detailed analysis including:

1. Overall quality score (0-100)
2. Key suggestions for improvement
3. Potential risks and mitigation strategies
4. Timeline estimation with phases
5. Statistical considerations
6. Compliance requirements

Format the response as a JSON object matching the AnalysisResult interface.`;

  const response = await generateWithGPT4([
    { role: 'system', content: systemPrompt },
    { role: 'user', content }
  ]);

  try {
    if (!response) {
      // Return mock data for demonstration
      return {
        score: 85,
        suggestions: [
          "Consider adding more detailed inclusion/exclusion criteria",
          "Strengthen statistical analysis plan with power calculations",
          "Add more details about adverse event reporting procedures",
          "Include specific monitoring frequency and requirements"
        ],
        risks: [
          "Potential recruitment challenges in target population",
          "Complex protocol may increase protocol deviations",
          "Timeline might be affected by seasonal variations",
          "Data quality risks due to multiple endpoints"
        ],
        timeline: "Estimated 18-24 months",
        phases: {
          startup: { duration: "2-3 months", progress: 30 },
          enrollment: { duration: "12-15 months", progress: 60 },
          analysis: { duration: "3-4 months", progress: 20 }
        },
        statistics: {
          sampleSize: 200,
          powerAnalysis: "90% power to detect 20% difference",
          primaryEndpoint: "Change from baseline at week 24"
        },
        compliance: {
          regulatoryRequirements: [
            "IND submission required",
            "Annual safety reports",
            "IRB continuing review"
          ],
          monitoringPlan: "Risk-based monitoring approach recommended",
          safetyReporting: "24-hour reporting for SAEs"
        }
      };
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse protocol analysis:', error);
    throw new Error('Failed to analyze protocol');
  }
}