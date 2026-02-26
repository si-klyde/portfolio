import { useState, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import Terminal from './components/terminal/Terminal';
import type { TerminalHandle } from './components/terminal/Terminal';
import Sidebar from './components/terminal/Sidebar';
import WindowManager from './components/wm/WindowManager';
import './terminal.css';
import './wm.css';

gsap.registerPlugin(TextPlugin);

export default function App() {
  const [wmActive, setWmActive] = useState(false);
  const wmSessionCount = useRef(0);
  const terminalRef = useRef<TerminalHandle>(null);

  const handleStartWm = useCallback(() => setWmActive(true), []);
  const handleExitWm = useCallback(() => {
    wmSessionCount.current += 1;
    setWmActive(false);
  }, []);

  const handleRunCommand = useCallback((cmd: string) => {
    terminalRef.current?.runCommand(cmd);
  }, []);

  return (
    <>
      <div className="terminal-shell" style={{ display: wmActive ? 'none' : undefined }}>
        <Terminal ref={terminalRef} onStartWm={handleStartWm} wmSessionCount={wmSessionCount.current} />
        <Sidebar onRunCommand={handleRunCommand} />
      </div>
      {wmActive && <WindowManager onExit={handleExitWm} />}
    </>
  );
}
