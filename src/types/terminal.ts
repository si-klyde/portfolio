import { ReactNode } from 'react';

export interface HistoryEntry {
  id: string;
  command: string;
  output: ReactNode;
}

export interface CommandResult {
  output: ReactNode;
  startWm?: boolean;
}

export type CommandHandler = (args: string[]) => CommandResult;

export interface CommandDef {
  description: string;
  handler: CommandHandler;
}
