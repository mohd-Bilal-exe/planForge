import type { Variants } from 'motion/react';

export interface ComponentProps {
  variants?: Variants;
}

export interface IntegrationItem {
  icon: React.ReactNode;
  label: string;
}

export interface TabOption {
  label: string;
  value: string;
}

export interface InputCardState {
  activeTab: number;
  inputText: string;
}

export interface FloatingWidget {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  position: 'left' | 'right';
  delay?: number;
}
export interface ProjectData {
  id: string;
  userId: string;
  idea: string;
  domain: string;
  platform: string;
  status: 'draft' | 'questions' | 'planning' | 'completed';
  createdAt: any;
  updatedAt: any;
  [key: string]: any;
}
