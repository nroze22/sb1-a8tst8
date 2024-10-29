import { generateWithGPT4 } from '../gpt';
import { presentationTemplates } from './presentation-templates';
import { quizTemplates } from './quiz-templates';
import type { PresentationSlide, QuizDefinition } from './types';

interface StudyDetails {
  title: string;
  phase: string;
  type: string;
  primaryObjective: string;
  procedures: string[];
  endpoints: string[];
  safetyConsiderations: string[];
}

export async function generateProtocolTraining(studyDetails: StudyDetails) {
  const systemPrompt = `You are an expert in creating clinical trial training materials. 
Create a comprehensive protocol training presentation for:

Study: ${studyDetails.title}
Phase: ${studyDetails.phase}
Type: ${studyDetails.type}

The presentation should include:
1. Study Overview
2. Background and Rationale
3. Study Design
4. Study Population
5. Study Procedures
6. Safety Assessments
7. Data Collection
8. Key Points for Success

Format the response as a JSON object with this structure:
{
  "slides": [
    {
      "type": "title|content|bullets|image",
      "content": {
        "title": string,
        "subtitle"?: string,
        "bullets"?: string[],
        "content"?: string,
        "notes"?: string
      }
    }
  ]
}`;

  try {
    const response = await generateWithGPT4([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate a protocol training presentation with clear, concise slides.' }
    ]);

    const presentation = JSON.parse(response || '{"slides": []}');
    return transformToRevealJs(presentation.slides);
  } catch (error) {
    console.error('Failed to generate protocol training:', error);
    throw new Error('Failed to generate training content');
  }
}

export async function generateSafetyQuiz(studyDetails: StudyDetails): Promise<QuizDefinition> {
  const systemPrompt = `Create a comprehensive safety reporting quiz for:

Study: ${studyDetails.title}
Phase: ${studyDetails.phase}

Include questions about:
1. Adverse Event Definitions
2. Reporting Requirements
3. Assessment of Causality
4. Documentation Requirements
5. Case Scenarios

Format as a JSON quiz with:
- Multiple choice questions
- True/False questions
- Case-based scenarios
- Clear explanations for correct answers`;

  try {
    const response = await generateWithGPT4([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate a safety assessment quiz with 10 varied questions.' }
    ]);

    const quiz = JSON.parse(response || '{}');
    validateQuizStructure(quiz);
    return quiz;
  } catch (error) {
    console.error('Failed to generate safety quiz:', error);
    throw new Error('Failed to generate quiz content');
  }
}

function transformToRevealJs(slides: PresentationSlide[]): string {
  return slides.map(slide => {
    switch (slide.type) {
      case 'title':
        return `
          <section>
            <h1>${slide.content.title}</h1>
            ${slide.content.subtitle ? `<h3>${slide.content.subtitle}</h3>` : ''}
            ${slide.content.notes ? `<aside class="notes">${slide.content.notes}</aside>` : ''}
          </section>
        `;
      case 'bullets':
        return `
          <section>
            <h2>${slide.content.title}</h2>
            <ul>
              ${slide.content.bullets?.map(bullet => `<li>${bullet}</li>`).join('\n') || ''}
            </ul>
            ${slide.content.notes ? `<aside class="notes">${slide.content.notes}</aside>` : ''}
          </section>
        `;
      case 'content':
        return `
          <section>
            <h2>${slide.content.title}</h2>
            <div class="content">
              ${slide.content.content || ''}
            </div>
            ${slide.content.notes ? `<aside class="notes">${slide.content.notes}</aside>` : ''}
          </section>
        `;
      default:
        return '';
    }
  }).join('\n');
}

function validateQuizStructure(quiz: any): asserts quiz is QuizDefinition {
  if (!quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
    throw new Error('Invalid quiz structure');
  }

  // Add more validation as needed
}