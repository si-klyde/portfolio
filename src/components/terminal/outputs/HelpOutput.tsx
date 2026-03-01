import type { CommandDef } from '../../../types/terminal';

interface HelpOutputProps {
  commands: Record<string, CommandDef>;
}

export default function HelpOutput({ commands }: HelpOutputProps) {
  return (
    <div className="help-grid">
      {Object.entries(commands).map(([name, def]) => (
        <div key={name} style={{ display: 'contents' }}>
          <span className="help-cmd">{name}</span>
          <span className="help-desc">{def.description}</span>
        </div>
      ))}
    </div>
  );
}
