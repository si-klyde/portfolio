const LOGO = [
  '       /\\        ',
  '      /  \\       ',
  '     /\\   \\      ',
  '    /      \\     ',
  '   /   ,,   \\    ',
  '  /   |  |   \\   ',
  " /_-''    ''-_\\  ",
];

const PAD = '                  ';

const INFO: Array<{ type: 'header' | 'sep' | 'info'; label?: string; value: string }> = [
  { type: 'header', value: '' },
  { type: 'sep', value: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500' },
  { type: 'info', label: 'os', value: 'portfolio.dev' },
  { type: 'info', label: 'shell', value: 'portfolio-sh' },
  { type: 'info', label: 'stack', value: 'React \u00b7 TS \u00b7 GSAP' },
  { type: 'info', label: 'wm', value: 'Hyprland' },
  { type: 'info', label: 'uptime', value: 'since 2024' },
];

const PALETTE_COLORS = [
  'var(--accent)',
  'var(--prompt-path)',
  'var(--green)',
  'var(--peach)',
  'var(--mauve)',
  'var(--error)',
  'var(--teal)',
  'var(--text-dim)',
];

export default function NeofetchOutput() {
  return (
    <div className="neofetch">
      {INFO.map((info, i) => (
        <div key={i} className="nf-row">
          <span className="nf-logo">{LOGO[i] ?? PAD}</span>
          {'   '}
          {info.type === 'header' && (
            <>
              <span className="nf-user">visitor</span>
              <span className="nf-at">@</span>
              <span className="nf-host">portfolio</span>
            </>
          )}
          {info.type === 'sep' && <span className="nf-sep">{info.value}</span>}
          {info.type === 'info' && (
            <>
              <span className="nf-label">{(info.label ?? '').padEnd(8)}</span>
              <span className="nf-value">{info.value}</span>
            </>
          )}
        </div>
      ))}
      <div className="nf-row">
        <span className="nf-logo">{PAD}</span>
        {'   '}
        <span className="nf-palette">
          {PALETTE_COLORS.map((color, i) => (
            <span key={i} style={{ color }}>{'\u25cf'}</span>
          ))}
        </span>
      </div>
    </div>
  );
}
