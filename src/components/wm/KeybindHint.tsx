interface KeybindHintProps {
  onClose: () => void;
}

const BINDS = [
  { key: 'alt +1/2/3', desc: 'switch workspace' },
  { key: 'alt +←→↑↓', desc: 'move focus' },
  { key: 'alt +shift + ←→↑↓', desc: 'swap window' },
  { key: 'alt +f', desc: 'toggle float' },
  { key: 'alt +?', desc: 'toggle this overlay' },
  { key: 'alt +Q', desc: 'exit wm' },
];

export default function KeybindHint({ onClose }: KeybindHintProps) {
  return (
    <div className="keybind-overlay" onClick={onClose}>
      <div className="keybind-card" onClick={e => e.stopPropagation()}>
        <div className="keybind-title">keybinds</div>
        <div className="keybind-grid">
          {BINDS.map(b => (
            <div key={b.key} className="keybind-row">
              <span className="keybind-key">{b.key}</span>
              <span className="keybind-desc">{b.desc}</span>
            </div>
          ))}
        </div>
        <div className="keybind-footer">press ? or ESC to close</div>
      </div>
    </div>
  );
}
