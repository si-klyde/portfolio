import { useState, useCallback, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import Terminal from './components/terminal/Terminal';
import type { TerminalHandle } from './components/terminal/Terminal';
import Sidebar from './components/terminal/Sidebar';
import WindowManager from './components/wm/WindowManager';
import './terminal.css';
import './wm.css';
import './browser.css';

gsap.registerPlugin(TextPlugin);

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 700);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return mobile;
}

export default function App() {
  const [wmActive, setWmActive] = useState(false);
  const wmSessionCount = useRef(0);
  const terminalRef = useRef<TerminalHandle>(null);
  const isMobile = useIsMobile();

  const handleStartWm = useCallback(() => {
    if (window.innerWidth <= 700) return;
    setWmActive(true);
  }, []);
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
      {wmActive && !isMobile && <WindowManager onExit={handleExitWm} />}
    </>
  );
}
