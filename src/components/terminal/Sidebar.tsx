import { useState, useEffect, useRef, useCallback } from 'react';
import aboutData from '../../data/about.json';

interface SidebarProps {
  onRunCommand: (cmd: string) => void;
}

const TREE: Array<{ name: string; cmd: string }> = [
  { name: 'about', cmd: 'about' },
  { name: 'experience', cmd: 'experience' },
  { name: 'skills', cmd: 'skills' },
  { name: 'work', cmd: 'work' },
  { name: 'comments', cmd: 'comments' },
  { name: 'contact', cmd: 'contact' },
];


const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const SCRAMBLE_FRAMES = 35;
const SCRAMBLE_INTERVAL = 50;
const SCRAMBLE_PAUSE = 3000;

function useScramble(a: string, b: string) {
  const elRef = useRef<HTMLDivElement>(null);
  const scrambleId = useRef<ReturnType<typeof setInterval>>(undefined);
  const pauseId = useRef<ReturnType<typeof setTimeout>>(undefined);

  const run = useCallback((from: string, to: string, onDone: () => void) => {
    const el = elRef.current;
    if (!el) return;
    let frame = 0;
    scrambleId.current = setInterval(() => {
      const progress = frame / SCRAMBLE_FRAMES;
      const len = Math.round(from.length + (to.length - from.length) * Math.min(progress * 1.3, 1));
      let out = '';
      for (let i = 0; i < len; i++) {
        const resolve = (i * 2) + 3;
        out += frame > resolve ? (to[i] ?? '') : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      el.textContent = out;
      frame++;
      if (frame > SCRAMBLE_FRAMES) {
        clearInterval(scrambleId.current);
        el.textContent = to;
        onDone();
      }
    }, SCRAMBLE_INTERVAL);
  }, []);

  useEffect(() => {
    let showingB = false;
    function cycle() {
      const from = showingB ? b : a;
      const to = showingB ? a : b;
      run(from, to, () => {
        showingB = !showingB;
        pauseId.current = setTimeout(cycle, SCRAMBLE_PAUSE);
      });
    }
    pauseId.current = setTimeout(cycle, SCRAMBLE_PAUSE);
    return () => {
      if (scrambleId.current) clearInterval(scrambleId.current);
      if (pauseId.current) clearTimeout(pauseId.current);
    };
  }, [a, b, run]);

  return elRef;
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function useUptime() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function Sidebar({ onRunCommand }: SidebarProps) {
  const nameRef = useScramble(aboutData.name, 'Collide');
  const now = useClock();
  const uptime = useUptime();
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <aside className="sidebar">
      <div className="sb-section">
        <div className="sb-name" ref={nameRef}>{aboutData.name}</div>
        <div className="sb-title">{aboutData.title}</div>
        <div className="sb-bio">{aboutData.more.paragraph}</div>
      </div>

      <div className="sb-sep" />

      <div className="sb-section">
        <div className="sb-row">
          <span className="sb-label">time</span>
          <span className="sb-value sb-mono">{time}</span>
        </div>
        <div className="sb-row">
          <span className="sb-label">date</span>
          <span className="sb-value">{date}</span>
        </div>
        <div className="sb-row">
          <span className="sb-label">uptime</span>
          <span className="sb-value sb-mono">{uptime}</span>
        </div>
      </div>

      <div className="sb-sep" />

      <div className="sb-section">
        <div className="sb-tree-header">~/portfolio</div>
        {TREE.map(({ name, cmd }) => (
          <button
            key={name}
            className="sb-tree-item"
            onClick={() => onRunCommand(cmd)}
          >
            {name}/
          </button>
        ))}
      </div>

    </aside>
  );
}
