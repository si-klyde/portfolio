import { createElement } from 'react';
import type { CommandDef, CommandResult, HistoryEntry } from '../types/terminal';
import HelpOutput from '../components/terminal/outputs/HelpOutput';
import AboutOutput from '../components/terminal/outputs/AboutOutput';
import SkillsOutput from '../components/terminal/outputs/SkillsOutput';
import WorkOutput from '../components/terminal/outputs/WorkOutput';
import ContactOutput from '../components/terminal/outputs/ContactOutput';
import BlogOutput from '../components/terminal/outputs/BlogOutput';
import NeofetchOutput from '../components/terminal/outputs/NeofetchOutput';

const commands: Record<string, CommandDef> = {
  help: {
    description: 'list available commands',
    handler: () => ({ output: createElement(HelpOutput, { commands }) }),
  },
  about: {
    description: 'who am i',
    handler: () => ({ output: createElement(AboutOutput) }),
  },
  skills: {
    description: 'technical skills',
    handler: () => ({ output: createElement(SkillsOutput) }),
  },
  work: {
    description: 'projects & work',
    handler: () => ({ output: createElement(WorkOutput) }),
  },
  contact: {
    description: 'get in touch',
    handler: () => ({ output: createElement(ContactOutput) }),
  },
  blog: {
    description: 'latest writing',
    handler: () => ({ output: createElement(BlogOutput) }),
  },
  clear: {
    description: 'clear terminal',
    handler: () => ({ output: null }),
  },
  startx: {
    description: 'launch window manager',
    handler: () => ({
      output: createElement('span', null, 'starting Hyprland...'),
      startWm: true,
    }),
  },
};

// Easter eggs
const easterEggs: Record<string, () => CommandResult> = {
  sudo: () => ({ output: createElement('span', { className: 'error-text' }, 'nice try. permission denied.') }),
  whoami: () => ({ output: createElement('span', null, 'visitor') }),
  neofetch: () => ({ output: createElement(NeofetchOutput) }),
  ls: () => ({ output: createElement('span', null, 'about/  skills/  work/  contact/  blog/') }),
  pwd: () => ({ output: createElement('span', null, '/home/visitor/portfolio') }),
  cd: () => ({ output: createElement('span', null, 'nowhere to go. you\'re already home.') }),
  exit: () => ({ output: createElement('span', null, 'there is no escape. type "help" instead.') }),
  rm: () => ({ output: createElement('span', { className: 'error-text' }, 'rm: permission denied. nice try though.') }),
  cat: () => ({ output: createElement('span', null, 'meow.') }),
  vim: () => ({ output: createElement('span', null, "you're trapped. press :q! to\u2014 just kidding. type \"help\".") }),
  ping: () => ({ output: createElement('span', null, 'pong.') }),
};

export const COMMAND_NAMES = Object.keys(commands);

export function executeCommand(input: string): { entry: HistoryEntry; shouldClear: boolean; startWm: boolean } {
  const trimmed = input.trim().toLowerCase();
  const [cmd, ...args] = trimmed.split(/\s+/);
  const id = crypto.randomUUID();

  if (cmd === 'clear') {
    return { entry: { id, command: input, output: null }, shouldClear: true, startWm: false };
  }

  if (commands[cmd]) {
    const result = commands[cmd].handler(args);
    return { entry: { id, command: input, output: result.output }, shouldClear: false, startWm: !!result.startWm };
  }

  if (easterEggs[cmd]) {
    const result = easterEggs[cmd]();
    return { entry: { id, command: input, output: result.output }, shouldClear: false, startWm: false };
  }

  return {
    entry: {
      id,
      command: input,
      output: createElement('span', { className: 'error-text' }, `command not found: ${cmd}. Type "help" for available commands.`),
    },
    shouldClear: false,
    startWm: false,
  };
}
