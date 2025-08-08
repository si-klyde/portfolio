import React, { useRef, useEffect } from 'react';
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
  useEffect(() => {
    if (!highlightRef.current || !navContainerRef.current || !currentSection) return;

    const activeItem = navContainerRef.current.querySelector('.nav-item.active') as HTMLElement;
    if (!activeItem) return;

    // If this is the first time, just set position without animation
    if (!isInitialized.current) {
      gsap.set(highlightRef.current, {
        left: activeItem.offsetLeft,
        width: activeItem.offsetWidth,
        opacity: 1,
        scaleY: 1
      });
      isInitialized.current = true;
      return;
    }

    // For subsequent changes, capture state and animate
    const state = Flip.getState(highlightRef.current);

    // Position highlight to match active item
    gsap.set(highlightRef.current, {
      left: activeItem.offsetLeft,
      width: activeItem.offsetWidth,
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