import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';

interface TypewriterOptions {
  speed?: number;
  onComplete?: () => void;
}

export function useTypewriter() {
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const type = useCallback((el: HTMLElement, text: string, opts: TypewriterOptions = {}) => {
    const { speed = 0.03, onComplete } = opts;
    if (tweenRef.current) tweenRef.current.kill();

    el.textContent = '';
    tweenRef.current = gsap.to(el, {
      duration: text.length * speed,
      text: { value: text, delimiter: '' },
      ease: 'none',
      onComplete,
    });

    return tweenRef.current;
  }, []);

  const kill = useCallback(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
  }, []);

  return { type, kill };
}
