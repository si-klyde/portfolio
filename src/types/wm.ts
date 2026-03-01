import type { ReactNode } from 'react';

export interface WindowDef {
  id: string;
  title: string;
  content: ReactNode;
}

export interface FloatingState {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WorkspaceState {
  slots: string[];
  floating: FloatingState[];
}
