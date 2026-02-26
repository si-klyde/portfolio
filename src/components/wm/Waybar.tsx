import { useState, useEffect } from 'react';

function useClock() {
  const [time, setTime] = useState(() => formatTime());
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatTime() {
  const d = new Date();
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${MONTHS[d.getMonth()]} ${d.getDate()} ${h}:${m}`;
}

interface WaybarProps {
  activeWs: number;
  onSwitch: (ws: number) => void;
}

export default function Waybar({ activeWs, onSwitch }: WaybarProps) {
  const clock = useClock();

  return (
    <div className="waybar">
      <div className="waybar-left">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`waybar-workspace${i === activeWs ? ' active' : ''}`}
            onClick={() => onSwitch(i)}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="waybar-center">clyde.dev</div>
      <div className="waybar-right">
        <span>{'\u266a'}</span>
        <span>{'\u25aa'}</span>
        <span className="waybar-distro">arch</span>
        <span>{'\u25aa'}</span>
        <span>{clock}</span>
      </div>
    </div>
  );
}
