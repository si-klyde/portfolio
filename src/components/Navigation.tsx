import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, onNavigate }) => {
  const highlightRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const currentTimeline = useRef<gsap.core.Timeline | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    onNavigate(section);
  };

  // Handle navbar highlight positioning and animation
  useEffect(() => {
    if (!highlightRef.current || !navContainerRef.current || !currentSection) return;

    const activeItem = navContainerRef.current.querySelector('.nav-item.active') as HTMLElement;
    if (!activeItem) return;

    // Kill any existing timeline and animations to prevent conflicts
    if (currentTimeline.current) {
      currentTimeline.current.kill();
      currentTimeline.current = null;
    }
    gsap.killTweensOf(highlightRef.current);

    // Get the position of the active nav item relative to the container
    const targetLeft = activeItem.offsetLeft;
    const targetWidth = activeItem.offsetWidth;

    // Initialize on first load without animation
    if (!isInitialized.current) {
      gsap.set(highlightRef.current, {
        x: targetLeft,
        width: targetWidth,
        opacity: 1,
        scaleY: 1
      });
      isInitialized.current = true;
      return;
    }

    // Create new timeline for coordinated animation with squeeze effect
    currentTimeline.current = gsap.timeline({
      onComplete: () => {
        currentTimeline.current = null;
      }
    });
    
    // Animate position and width while adding squeeze effect
    currentTimeline.current
      .to(highlightRef.current, {
        x: targetLeft,
        width: targetWidth,
        duration: 0.5,
        ease: "power2.inOut"
      })
      // Add squeeze effect that happens during the movement
      .to(highlightRef.current, {
        scaleY: 0.85,
        duration: 0.15,
        ease: "power1.inOut"
      }, 0.1) // Start after position animation begins
      // Return to normal scale
      .to(highlightRef.current, {
        scaleY: 1,
        duration: 0.2,
        ease: "power1.out"
      }, 0.25); // Start before position animation completes
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