import { ReactNode } from 'react';

interface OutputBlockProps {
  children: ReactNode;
}

export default function OutputBlock({ children }: OutputBlockProps) {
  if (!children) return null;
  return <div className="output-block">{children}</div>;
}
