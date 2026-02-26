import { useState, useCallback, useEffect, useRef, createElement, forwardRef, useImperativeHandle } from 'react';
import type { HistoryEntry } from '../../types/terminal';
import { executeCommand } from '../../commands/registry';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import TerminalIntro from './TerminalIntro';
import CommandInput from './CommandInput';
import PromptLine from './PromptLine';
import OutputBlock from './OutputBlock';
import MobileCommandPalette from './MobileCommandPalette';

function useIsTouchDevice() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || window.matchMedia('(hover: none)').matches;
}

export interface TerminalHandle {
  runCommand: (cmd: string) => void;
}

interface TerminalProps {
  onStartWm?: () => void;
  wmSessionCount?: number;
}

export default forwardRef<TerminalHandle, TerminalProps>(function Terminal({ onStartWm, wmSessionCount = 0 }, ref) {
  const [introComplete, setIntroComplete] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const prevWmCount = useRef(0);

  useEffect(() => {
    if (wmSessionCount > prevWmCount.current) {
      prevWmCount.current = wmSessionCount;
      setHistory(prev => [...prev, {
        id: crypto.randomUUID(),
        command: '',
        output: createElement('span', { className: 'output-label' }, '[session ended — returned to terminal]'),
      }]);
    }
  }, [wmSessionCount]);
  const isTouch = useIsTouchDevice();

  const scrollRef = useAutoScroll<HTMLDivElement>([history, introComplete]);

  const handleCommand = useCallback((input: string) => {
    const { entry, shouldClear, startWm } = executeCommand(input);

    if (shouldClear) {
      setHistory([]);
    } else {
      setHistory(prev => [...prev, entry]);
    }

    setCommandHistory(prev => [...prev, input]);

    if (startWm && onStartWm) {
      setTimeout(onStartWm, 300);
    }
  }, [onStartWm]);

  useImperativeHandle(ref, () => ({ runCommand: handleCommand }), [handleCommand]);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <div className={`terminal${isTouch ? ' has-palette' : ''}`}>
      <div className="terminal-body" ref={scrollRef}>
        <TerminalIntro onComplete={handleIntroComplete} />

        {history.map(entry => (
          <div key={entry.id} className="history-entry">
            <PromptLine command={entry.command} />
            <OutputBlock>{entry.output}</OutputBlock>
          </div>
        ))}

        {introComplete && (
          <CommandInput onSubmit={handleCommand} commandHistory={commandHistory} focusTrigger={wmSessionCount} />
        )}
      </div>

      {isTouch && introComplete && <MobileCommandPalette onCommand={handleCommand} />}
    </div>
  );
});
