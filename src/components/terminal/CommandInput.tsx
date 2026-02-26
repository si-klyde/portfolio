import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import PromptLine from './PromptLine';
import { COMMAND_NAMES } from '../../commands/registry';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  commandHistory: string[];
  focusTrigger?: number;
}

export default function CommandInput({ onSubmit, commandHistory, focusTrigger }: CommandInputProps) {
  const [value, setValue] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabMatch, setTabMatch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount and clicks
  useEffect(() => {
    inputRef.current?.focus();
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Refocus when WM exits
  useEffect(() => {
    if (focusTrigger !== undefined && focusTrigger > 0) {
      inputRef.current?.focus();
    }
  }, [focusTrigger]);

  const syncCursor = useCallback(() => {
    const pos = inputRef.current?.selectionStart ?? 0;
    setCursorPos(pos);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (trimmed) {
        onSubmit(trimmed);
        setValue('');
        setCursorPos(0);
        setHistoryIndex(-1);
        setTabMatch('');
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const next = historyIndex + 1;
      if (next < commandHistory.length) {
        setHistoryIndex(next);
        const val = commandHistory[commandHistory.length - 1 - next];
        setValue(val);
        setCursorPos(val.length);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setValue('');
        setCursorPos(0);
        return;
      }
      const next = historyIndex - 1;
      setHistoryIndex(next);
      const val = commandHistory[commandHistory.length - 1 - next];
      setValue(val);
      setCursorPos(val.length);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = value.trim().toLowerCase();
      if (!partial) return;
      const matches = COMMAND_NAMES.filter(c => c.startsWith(partial));
      if (matches.length === 1) {
        setValue(matches[0]);
        setCursorPos(matches[0].length);
        setTabMatch('');
      } else if (matches.length > 1) {
        setTabMatch(matches.join('  '));
      }
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      onSubmit('clear');
      setValue('');
      setCursorPos(0);
      return;
    }

    setTabMatch('');
    // Defer cursor sync to after the keydown updates the input
    requestAnimationFrame(syncCursor);
  }, [value, historyIndex, commandHistory, onSubmit, syncCursor]);

  const beforeText = value.slice(0, cursorPos);
  const afterText = value.slice(cursorPos);

  return (
    <>
      {tabMatch && <div className="tab-hint">{tabMatch}</div>}
      <div className="command-input-wrap">
        <PromptLine />
        <div className="input-area">
          <input
            ref={inputRef}
            className="command-input"
            type="text"
            value={value}
            placeholder="help"
            onChange={e => {
              setValue(e.target.value);
              setCursorPos(e.target.selectionStart ?? e.target.value.length);
            }}
            onKeyDown={handleKeyDown}
            onSelect={syncCursor}
            onClick={syncCursor}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label="Terminal command input"
          />
          <div className="input-mirror" aria-hidden>
            {beforeText}<span className="cursor" />{afterText}
          </div>
        </div>
      </div>
    </>
  );
}
