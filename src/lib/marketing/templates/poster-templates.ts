import { PosterTemplate } from '../types';

export const posterTemplates: PosterTemplate[] = [
  {
    id: 'clinical-modern',
    name: 'Modern Clinical',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    description: 'Clean, modern design with emphasis on readability',
    size: 'letter',
    layout: {
      header: { height: 0.2, background: '#2563eb' },
      body: { height: 0.6 },
      footer: { height: 0.2, background: '#f3f4f6' }
    },
    elements: [
      {
        id: 'title',
        type: 'text',
        x: 0.5,
        y: 0.1,
        width: 0.8,
        content: '[Study Title]',
        style: {
          fontSize: 72,
          fontFamily: 'Inter',
          fill: '#ffffff',
          align: 'center'
        }
      },
      {
        id: 'subtitle',
        type: 'text',
        x: 0.5,
        y: 0.15,
        width: 0.7,
        content: 'Research Study Participants Needed',
        style: {
          fontSize: 36,
          fontFamily: 'Inter',
          fill: '#ffffff',
          align: 'center'
        }
      },
      {
        id: 'key-points',
        type: 'list',
        x: 0.1,
        y: 0.3,
        width: 0.8,
        style: {
          fontSize: 24,
          fontFamily: 'Inter',
          fill: '#1f2937',
          spacing: 1.5
        }
      },
      {
        id: 'contact',
        type: 'text',
        x: 0.5,
        y: 0.85,
        width: 0.8,
        content: 'Contact Information',
        style: {
          fontSize: 28,
          fontFamily: 'Inter',
          fill: '#1f2937',
          align: 'center'
        }
      }
    ]
  },
  {
    id: 'medical-professional',
    name: 'Professional Medical',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
    description: 'Professional design for medical institutions',
    size: 'letter',
    layout: {
      sidebar: { width: 0.3, background: '#1e40af' },
      main: { width: 0.7 }
    },
    elements: [
      {
        id: 'logo',
        type: 'image',
        x: 0.15,
        y: 0.1,
        width: 0.2,
        height: 0.1
      },
      {
        id: 'title',
        type: 'text',
        x: 0.35,
        y: 0.1,
        width: 0.6,
        content: '[Study Title]',
        style: {
          fontSize: 64,
          fontFamily: 'Inter',
          fill: '#1f2937',
          align: 'left'
        }
      }
      // Add more elements...
    ]
  }
];