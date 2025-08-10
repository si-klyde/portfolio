import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, onNavigate }) => {
  const highlightRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    onNavigate(section);
  };

  // Handle both initialization and animation
  useLayoutEffect(() => {
    if (!highlightRef.current || !navContainerRef.current || !currentSection) return;

    const container = navContainerRef.current;
    const activeItem = container.querySelector('.nav-item.active') as HTMLElement;
    if (!activeItem) return;

    // If this is the first time, just set position without animation
    if (!isInitialized.current) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      gsap.set(highlightRef.current, {
        left: itemRect.left - containerRect.left + container.scrollLeft,
        width: itemRect.width,
        opacity: 1,
        scaleY: 1
      });
      isInitialized.current = true;
      return;
    }

    // For subsequent changes, capture state and animate
    const state = Flip.getState(highlightRef.current);

    // Position highlight to match active item
    const containerRect2 = container.getBoundingClientRect();
    const itemRect2 = activeItem.getBoundingClientRect();
    gsap.set(highlightRef.current, {
      left: itemRect2.left - containerRect2.left + container.scrollLeft,
      width: itemRect2.width,
      opacity: 1
    });

    // Animate from previous state to new state with squeeze effect
    Flip.from(state, {
      duration: 0.7,
      ease: "power2.inOut",
      onUpdate: function() {
        // Add squeeze effect during transition
        const progress = this.progress();
        const squeeze = Math.sin(progress * Math.PI) * 0.15; // Max 15% squeeze
        gsap.set(highlightRef.current, {
          scaleY: 1 - squeeze
        });
      },
      onComplete: () => {
        // Reset scale after animation
        gsap.set(highlightRef.current, { scaleY: 1 });
      }
    });
  }, [currentSection]);

  // On mount and on window resize, force a recalculation to avoid initial misalignment
  useEffect(() => {
    const sync = () => {
      if (!highlightRef.current || !navContainerRef.current) return;
      const container = navContainerRef.current;
      const activeItem = container.querySelector('.nav-item.active') as HTMLElement;
      if (!activeItem) return;
      const cr = container.getBoundingClientRect();
      const ir = activeItem.getBoundingClientRect();
      gsap.set(highlightRef.current, {
        left: ir.left - cr.left + container.scrollLeft,
        width: ir.width,
        opacity: 1,
        scaleY: 1
      });
    };

    sync();

    window.addEventListener('resize', sync);
    requestAnimationFrame(sync);
    const timeout = setTimeout(sync, 100);
    // Re-sync after fonts load
    if ((document as any).fonts && (document as any).fonts.ready) {
      (document as any).fonts.ready.then(sync).catch(() => {});
    }
    // Observe size changes of container/active item
    const ro = new ResizeObserver(sync);
    if (navContainerRef.current) ro.observe(navContainerRef.current);
    const activeItem = navContainerRef.current?.querySelector('.nav-item.active') as HTMLElement | null;
    if (activeItem) ro.observe(activeItem);

    return () => {
      window.removeEventListener('resize', sync);
      clearTimeout(timeout);
      ro.disconnect();
    };
  }, []);

  return (
    <nav className="navigation">
      <div className="nav-container" ref={navContainerRef}>
        <div className="nav-highlight" ref={highlightRef}></div>
        <a
          href="#about"
          className={`nav-item ${currentSection === 'about' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, 'about')}
        >
          About
        </a>
        <a
          href="#skills"
          className={`nav-item ${currentSection === 'skills' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, 'skills')}
        >
          Skills
        </a>
        <a
          href="#work"
          className={`nav-item ${currentSection === 'work' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, 'work')}
        >
          Work
        </a>
        <a
          href="#contact"
          className={`nav-item ${currentSection === 'contact' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, 'contact')}
        >
          Contact
        </a>
        <a
          href="#blog"
          className={`nav-item ${currentSection === 'blog' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, 'blog')}
        >
          Blog
        </a>
      </div>
    </nav>
  );
};

export default Navigation;