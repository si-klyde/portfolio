import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ArrowIconProps {
  expanded: boolean;
}

// Lightweight GSAP attr tween between two polylines to simulate morph
// No paid plugins required
const RIGHT_POINTS = '8,6 14,12 8,18';
const DOWN_POINTS = '6,10 12,16 18,10';

const ArrowIcon: React.FC<ArrowIconProps> = ({ expanded }) => {
  const polyRef = useRef<SVGPolylineElement>(null);

  useEffect(() => {
    if (!polyRef.current) return;
    gsap.to(polyRef.current, {
      duration: 0.28,
      ease: 'power2.out',
      attr: { points: expanded ? DOWN_POINTS : RIGHT_POINTS },
    });
  }, [expanded]);

  return (
    <svg
      className="arrow-svg"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline ref={polyRef} points={RIGHT_POINTS} />
    </svg>
  );
};

export default ArrowIcon;


