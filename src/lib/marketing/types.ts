export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'list';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fill?: string;
    align?: 'left' | 'center' | 'right';
    spacing?: number;
  };
}

export interface LayoutSection {
  width?: number;
  height?: number;
  background?: string;
}

export interface PosterTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  size: 'letter' | 'tabloid' | 'a3' | 'custom';
  layout: {
    [key: string]: LayoutSection;
  };
  elements: DesignElement[];
}

export interface BrochureTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  panels: {
    front: DesignElement[];
    inside: DesignElement[];
    back: DesignElement[];
  };
}