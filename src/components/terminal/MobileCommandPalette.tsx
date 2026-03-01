import { COMMAND_NAMES } from '../../commands/registry';

interface MobileCommandPaletteProps {
  onCommand: (command: string) => void;
}

const visibleCommands = COMMAND_NAMES.filter(c => c !== 'clear' && c !== 'startx');

export default function MobileCommandPalette({ onCommand }: MobileCommandPaletteProps) {
  return (
    <div className="mobile-palette">
      {visibleCommands.map(cmd => (
        <button
          key={cmd}
          className="palette-btn"
          onClick={() => onCommand(cmd)}
          type="button"
        >
          {cmd}
        </button>
      ))}
    </div>
  );
}
