import type { CSSProperties } from 'react';
import Window from './Window';
import type { WindowDef, FloatingState } from '../../types/wm';

interface TilingLayoutProps {
  windowDefs: WindowDef[];
  slots: string[];
  floating: FloatingState[];
  focusedId: string;
  onFocus: (id: string) => void;
  onFloatingMove: (id: string, x: number, y: number) => void;
}

function getGridStyle(count: number): CSSProperties {
  if (count >= 4) return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
  if (count === 3) return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
  if (count === 2) return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' };
  if (count === 1) return { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' };
  return {};
}

function getSlotPlacement(slotIdx: number, count: number): CSSProperties {
  if (count >= 4) {
    const col = (slotIdx % 2) + 1;
    const row = Math.floor(slotIdx / 2) + 1;
    return { gridColumn: col, gridRow: row };
  }
  if (count === 3) {
    if (slotIdx === 0) return { gridColumn: 1, gridRow: '1 / 3' };
    return { gridColumn: 2, gridRow: slotIdx };
  }
  if (count === 2) {
    return { gridColumn: slotIdx + 1, gridRow: 1 };
  }
  return { gridColumn: 1, gridRow: 1 };
}

export default function TilingLayout({ windowDefs, slots, floating, focusedId, onFocus, onFloatingMove }: TilingLayoutProps) {
  const floatMap = new Map(floating.map(f => [f.id, f]));

  return (
    <div className="tiling-layout" style={getGridStyle(slots.length)}>
      {slots.length === 0 && (
        <div className="wm-empty-desktop">
          <span>empty workspace</span>
        </div>
      )}

      {/* Stable render order — explicit grid placement positions them */}
      {windowDefs.map(def => {
        const slotIdx = slots.indexOf(def.id);
        const fState = floatMap.get(def.id);

        if (slotIdx === -1 && !fState) return null;

        if (fState) {
          return (
            <Window
              key={def.id}
              id={def.id}
              title={def.title}
              focused={def.id === focusedId}
              onClick={() => onFocus(def.id)}
              floating={fState}
              onFloatingMove={onFloatingMove}
            >
              {def.content}
            </Window>
          );
        }

        return (
          <Window
            key={def.id}
            id={def.id}
            title={def.title}
            focused={def.id === focusedId}
            onClick={() => onFocus(def.id)}
            style={getSlotPlacement(slotIdx, slots.length)}
          >
            {def.content}
          </Window>
        );
      })}
    </div>
  );
}
