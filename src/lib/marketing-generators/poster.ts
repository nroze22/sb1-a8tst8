import { generateWithGPT4 } from '../gpt';

interface PosterContent {
  title: string;
  subtitle: string;
  keyPoints: string[];
  contactInfo: string;
  suggestedColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  suggestedImages: string[];
}

export async function generatePosterContent(studyDetails: any): Promise<PosterContent> {
  const systemPrompt = `You are an expert in creating compelling clinical trial recruitment posters.
Create engaging and compliant content for a recruitment poster based on the following study details:

Study Title: ${studyDetails.title}
Phase: ${studyDetails.phase}
Type: ${studyDetails.type}
Primary Objective: ${studyDetails.primaryObjective}

The content should:
1. Be clear and engaging
2. Highlight key benefits
3. Include clear eligibility criteria
4. Maintain regulatory compliance
5. Have a clear call to action

Format the response as a JSON object matching the PosterContent interface.`;

  const response = await generateWithGPT4([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Generate recruitment poster content that is engaging and compliant.' }
  ]);

  if (!response) {
    throw new Error('Failed to generate poster content');
  }

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse poster content:', error);
    // Return fallback content
    return {
      title: studyDetails.title,
      subtitle: 'Research Study Participants Needed',
      keyPoints: [
        'Seeking volunteers for a clinical research study',
        'Compensation provided for time and travel',
        'No-cost study-related medical care',
        'Must be 18 years or older'
      ],
      contactInfo: 'Contact us to learn more: (555) 123-4567',
      suggestedColors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#60a5fa'
      },
      suggestedImages: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118'
      ]
    };
  }
}