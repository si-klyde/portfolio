import { memo, useRef, useCallback, type ReactNode, type CSSProperties, type MouseEvent } from 'react';
import type { FloatingState } from '../../types/wm';

interface WindowProps {
  id: string;
  title: string;
  focused: boolean;
  onClick: () => void;
  children: ReactNode;
  floating?: FloatingState;
  onFloatingMove?: (id: string, x: number, y: number) => void;
  style?: CSSProperties;
}

function Window({ title, focused, onClick, children, floating, onFloatingMove, style }: WindowProps) {
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!floating || !onFloatingMove) return;
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: floating.x,
      origY: floating.y,
    };

    const onMove = (ev: globalThis.MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      onFloatingMove(floating.id, dragRef.current.origX + dx, dragRef.current.origY + dy);
    };

    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [floating, onFloatingMove]);

  const mergedStyle: CSSProperties = floating
    ? { position: 'absolute', left: floating.x, top: floating.y, width: floating.w, height: floating.h }
    : style ?? {};

  return (
    <div
      className={`wm-window${focused ? ' focused' : ''}${floating ? ' floating' : ''}`}
      onClick={onClick}
      style={mergedStyle}
    >
      <div
        className="wm-window-titlebar"
        onMouseDown={floating ? handleMouseDown : undefined}
      >
        {title}
      </div>
      <div className="wm-window-body">{children}</div>
    </div>
  );
}

export default memo(Window);
