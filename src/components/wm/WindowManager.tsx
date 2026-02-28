import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import Waybar from './Waybar';
import TilingLayout from './TilingLayout';
import KeybindHint from './KeybindHint';
import AboutOutput from '../terminal/outputs/AboutOutput';
import SkillsOutput from '../terminal/outputs/SkillsOutput';
import ContactOutput from '../terminal/outputs/ContactOutput';
import GitHubBrowser from './GitHubBrowser';
import ForumBrowser from './ForumBrowser';
import type { WindowDef, WorkspaceState } from '../../types/wm';

interface WindowManagerProps {
  onExit: () => void;
}

const WINDOW_DEFS: WindowDef[] = [
  { id: 'about', title: 'About', content: <AboutOutput /> },
  { id: 'skills', title: 'Skills', content: <SkillsOutput /> },
  { id: 'contact', title: 'Contact', content: <ContactOutput /> },
  { id: 'projects', title: 'Projects', content: <GitHubBrowser /> },
  { id: 'comments', title: 'Comments', content: <ForumBrowser /> },
];

const INITIAL_WORKSPACES: WorkspaceState[] = [
  { slots: ['about', 'skills', 'contact'], floating: [] },
  { slots: ['projects'], floating: [] },
  { slots: ['comments'], floating: [] },
];

function cloneWorkspaces(ws: WorkspaceState[]): WorkspaceState[] {
  return ws.map(w => ({ slots: [...w.slots], floating: w.floating.map(f => ({ ...f })) }));
}

function getNeighborIndex(slots: string[], currentIdx: number, dir: 'left' | 'right' | 'up' | 'down'): number | null {
  const count = slots.length;
  if (count <= 1) return null;

  if (count === 2) {
    if (dir === 'left' && currentIdx === 1) return 0;
    if (dir === 'right' && currentIdx === 0) return 1;
    return null;
  }

  if (currentIdx === 0) {
    if (dir === 'right') return 1;
    return null;
  }
  if (dir === 'left') return 0;
  if (dir === 'up' && currentIdx > 1) return currentIdx - 1;
  if (dir === 'down' && currentIdx < count - 1) return currentIdx + 1;
  return null;
}

const FLOAT_STEP = 40;

const STARTUP_BINDS = [
  { key: '1/2/3', desc: 'switch workspace' },
  { key: '←→↑↓', desc: 'move focus' },
  { key: 'shift+←→↑↓', desc: 'swap window' },
  { key: 'f', desc: 'toggle float' },
  { key: '?', desc: 'keybind overlay' },
  { key: 'h', desc: 'toggle this card' },
  { key: 'Q', desc: 'exit wm' },
];

export default function WindowManager({ onExit }: WindowManagerProps) {
  const [activeWs, setActiveWs] = useState(0);
  const [workspaces, setWorkspaces] = useState<WorkspaceState[]>(cloneWorkspaces(INITIAL_WORKSPACES));
  const [focusedId, setFocusedId] = useState('about');
  const [showHints, setShowHints] = useState(false);
  const [showStartupHints, setShowStartupHints] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const waybarRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const startupHintsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const currentWs = workspaces[activeWs];
  const windowDefs = useMemo(() => WINDOW_DEFS, []);

  // Enter animation
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const container = containerRef.current;
    const waybar = waybarRef.current;
    if (!container || !waybar) return;

    const windows = container.querySelectorAll('.wm-window');
    const hint = container.querySelector('.wm-exit-hint');

    const tl = gsap.timeline();
    tl.fromTo(waybar, { y: -36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
    tl.fromTo(windows, { scale: 0.92, opacity: 0, y: 12 }, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.4)', stagger: 0.06 }, '-=0.15');
    if (hint) {
      tl.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.2');
    }

    tl.call(() => {
      const el = startupHintsRef.current;
      if (!el) return;
      gsap.fromTo(el, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)' });
    });
  }, []);

  // Animate startup hints in when toggled back on (skip initial — handled by enter timeline)
  useEffect(() => {
    if (!showStartupHints || !hasAnimated.current) return;
    const el = startupHintsRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)' });
  }, [showStartupHints]);

  const dismissStartupHints = useCallback(() => {
    const el = startupHintsRef.current;
    if (!el) { setShowStartupHints(false); return; }
    gsap.to(el, { opacity: 0, scale: 0.95, duration: 0.2, ease: 'power2.in', onComplete: () => setShowStartupHints(false) });
  }, []);

  const handleExit = useCallback(() => {
    const container = containerRef.current;
    if (!container) { onExit(); return; }

    const windows = container.querySelectorAll('.wm-window');
    const tl = gsap.timeline({ onComplete: onExit });
    tl.to(windows, { scale: 0.95, opacity: 0, duration: 0.2, ease: 'power2.in', stagger: 0.03 });
    tl.to(container, { opacity: 0, duration: 0.15, ease: 'power2.in' }, '-=0.1');
  }, [onExit]);

  const switchWorkspace = useCallback((ws: number) => {
    if (ws === activeWs || ws < 0 || ws > 2) return;
    const layout = layoutRef.current;
    if (!layout) {
      setActiveWs(ws);
      return;
    }

    const dir = ws > activeWs ? -1 : 1;
    const slide = 80;

    const tl = gsap.timeline();
    tl.to(layout, { x: dir * slide, opacity: 0, duration: 0.2, ease: 'power3.in' });
    tl.call(() => {
      setActiveWs(ws);
      setWorkspaces(prev => {
        const first = prev[ws].slots[0];
        if (first) setFocusedId(first);
        return prev;
      });
    });
    tl.fromTo(layout, { x: -dir * slide, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25, ease: 'power3.out' });
  }, [activeWs]);

  const moveFocus = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    setWorkspaces(prev => {
      const ws = prev[activeWs];
      const floatIdx = ws.floating.findIndex(f => f.id === focusedId);
      if (floatIdx !== -1) return prev;

      const slotIdx = ws.slots.indexOf(focusedId);
      if (slotIdx === -1) return prev;
      const neighbor = getNeighborIndex(ws.slots, slotIdx, dir);
      if (neighbor !== null) setFocusedId(ws.slots[neighbor]);
      return prev;
    });
  }, [activeWs, focusedId]);

  const swapWindow = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    setWorkspaces(prev => {
      const next = cloneWorkspaces(prev);
      const ws = next[activeWs];

      const floatIdx = ws.floating.findIndex(f => f.id === focusedId);
      if (floatIdx !== -1) {
        const f = ws.floating[floatIdx];
        if (dir === 'left') f.x -= FLOAT_STEP;
        if (dir === 'right') f.x += FLOAT_STEP;
        if (dir === 'up') f.y -= FLOAT_STEP;
        if (dir === 'down') f.y += FLOAT_STEP;
        return next;
      }

      const slotIdx = ws.slots.indexOf(focusedId);
      if (slotIdx === -1) return prev;
      const neighbor = getNeighborIndex(ws.slots, slotIdx, dir);
      if (neighbor === null) return prev;

      [ws.slots[slotIdx], ws.slots[neighbor]] = [ws.slots[neighbor], ws.slots[slotIdx]];
      return next;
    });
  }, [activeWs, focusedId]);

  const toggleFloat = useCallback(() => {
    setWorkspaces(prev => {
      const next = cloneWorkspaces(prev);
      const ws = next[activeWs];

      const floatIdx = ws.floating.findIndex(f => f.id === focusedId);
      if (floatIdx !== -1) {
        const f = ws.floating.splice(floatIdx, 1)[0];
        ws.slots.push(f.id);
        return next;
      }

      const slotIdx = ws.slots.indexOf(focusedId);
      if (slotIdx === -1) return prev;

      ws.slots.splice(slotIdx, 1);
      ws.floating.push({
        id: focusedId,
        x: window.innerWidth * 0.25,
        y: window.innerHeight * 0.2,
        w: window.innerWidth * 0.5,
        h: window.innerHeight * 0.6,
      });

      return next;
    });
  }, [activeWs, focusedId]);

  const handleFloatingMove = useCallback((id: string, x: number, y: number) => {
    setWorkspaces(prev => {
      const next = cloneWorkspaces(prev);
      const f = next[activeWs].floating.find(fl => fl.id === id);
      if (f) { f.x = x; f.y = y; }
      return next;
    });
  }, [activeWs]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (showHints) { setShowHints(false); e.preventDefault(); return; }
        e.preventDefault();
        handleExit();
        return;
      }
      if (e.ctrlKey && e.key === 'q') { e.preventDefault(); handleExit(); return; }

      if (e.key === '?') { e.preventDefault(); setShowHints(p => !p); return; }
      if (showHints) return;

      if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
        if (e.key === '1') { switchWorkspace(0); return; }
        if (e.key === '2') { switchWorkspace(1); return; }
        if (e.key === '3') { switchWorkspace(2); return; }
      }

      if (e.key === 'h' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        if (showStartupHints) { dismissStartupHints(); } else { setShowStartupHints(true); }
        return;
      }

      if (e.key === 'f' && !e.shiftKey && !e.ctrlKey) { e.preventDefault(); toggleFloat(); return; }

      const arrowMap: Record<string, 'left' | 'right' | 'up' | 'down'> = {
        ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
      };
      const dir = arrowMap[e.key];
      if (dir) {
        e.preventDefault();
        e.shiftKey ? swapWindow(dir) : moveFocus(dir);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleExit, switchWorkspace, moveFocus, swapWindow, toggleFloat, showHints, showStartupHints, dismissStartupHints]);

  return (
    <div className="wm" ref={containerRef}>
      <div ref={waybarRef}>
        <Waybar activeWs={activeWs} onSwitch={switchWorkspace} />
      </div>
      <div ref={layoutRef} style={{ flex: 1, display: 'flex', position: 'relative', minHeight: 0 }}>
        <TilingLayout
          windowDefs={windowDefs}
          slots={currentWs.slots}
          floating={currentWs.floating}
          focusedId={focusedId}
          onFocus={setFocusedId}
          onFloatingMove={handleFloatingMove}
        />
      </div>
      <div className="wm-exit-hint">
        Q to exit &middot; h for keybinds
      </div>
      {showStartupHints && (
        <div className="wm-startup-hints" ref={startupHintsRef} style={{ opacity: 0 }}>
          <div className="wm-startup-hints-header">
            <span className="wm-startup-hints-title">keybinds</span>
            <button className="wm-startup-hints-close" onClick={dismissStartupHints}>&times;</button>
          </div>
          <div className="wm-startup-hints-grid">
            {STARTUP_BINDS.map(b => (
              <div key={b.key} className="keybind-row">
                <span className="keybind-key">{b.key}</span>
                <span className="keybind-desc">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {showHints && <KeybindHint onClose={() => setShowHints(false)} />}
    </div>
  );
}
