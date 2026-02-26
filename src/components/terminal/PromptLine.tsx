interface PromptLineProps {
  command?: string;
}

export default function PromptLine({ command }: PromptLineProps) {
  return (
    <span className="prompt-line">
      <span className="prompt-user">visitor</span>
      <span className="prompt-sep">@</span>
      <span className="prompt-path">portfolio</span>
      <span className="prompt-sep">:</span>
      <span className="prompt-sep">~</span>
      <span className="prompt-branch"> (main)</span>
      <span className="prompt-symbol"> $</span>
      {command !== undefined && <span className="prompt-command">{command}</span>}
    </span>
  );
}
