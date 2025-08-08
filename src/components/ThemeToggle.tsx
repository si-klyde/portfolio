import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: (newTheme: 'light' | 'dark') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sunIconRef = useRef<HTMLDivElement>(null);
  const moonIconRef = useRef<HTMLDivElement>(null);

  // Animate theme toggle icons
  const updateThemeIcons = (currentTheme: 'light' | 'dark') => {
    if (!sunIconRef.current || !moonIconRef.current) return;

    if (currentTheme === 'light') {
      gsap.to(sunIconRef.current, { opacity: 1, rotation: 0, scale: 1, duration: 0.3, ease: "back.out(1.2)" });
      gsap.to(moonIconRef.current, { opacity: 0, rotation: -180, scale: 0, duration: 0.3, ease: "back.in(1.2)" });
    } else {
      gsap.to(moonIconRef.current, { opacity: 1, rotation: 0, scale: 1, duration: 0.3, ease: "back.out(1.2)" });
      gsap.to(sunIconRef.current, { opacity: 0, rotation: 180, scale: 0, duration: 0.3, ease: "back.in(1.2)" });
    }
  };

  // Theme switching function
  const switchTheme = (newTheme: 'light' | 'dark') => {
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    onToggle(newTheme);
  };

  // GSAP swallow-and-reveal theme transition
  const fallbackThemeTransition = (newTheme: 'light' | 'dark', centerX: number, centerY: number) => {
    console.log(`Swallow-and-reveal transition from toggle at: ${centerX}, ${centerY}`);
    
    // Calculate max distance from center to any corner for full coverage
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(centerX, window.innerWidth - centerX), 2) +
      Math.pow(Math.max(centerY, window.innerHeight - centerY), 2)
    );
    
    // Create the transition overlay (the "swallowing" circle)
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'gsap-swallow-transition';
    
    // Set overlay color based on new theme
    const overlayColor = newTheme === 'dark' ? '#0e0e0e' : '#ffffff';
    
    // Style the overlay to start as a tiny circle at toggle position
    transitionOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 10000;
      pointer-events: none;
      background: ${overlayColor};
      clip-path: circle(0px at ${centerX}px ${centerY}px);
    `;
    
    // Add overlay to page
    document.body.appendChild(transitionOverlay);
    
    // Create GSAP timeline for the two-phase animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Clean up overlay
        if (document.body.contains(transitionOverlay)) {
          document.body.removeChild(transitionOverlay);
        }
      }
    });
    
    // Add subtle toggle button press effect
    if (toggleRef.current) {
      tl.to(toggleRef.current, {
        scale: 1.1,
        duration: 0.08,
        ease: 'back.out(1.7)',
        yoyo: true,
        repeat: 1
      }, 0);
    }
    
    // Phase 1: SWALLOW - Expand circle to cover entire screen
    tl.to(transitionOverlay, {
      clipPath: `circle(${maxDistance * 1.2}px at ${centerX}px ${centerY}px)`,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => {
        // Apply theme change when screen is fully covered
        switchTheme(newTheme);
      }
    }, 0.1);
    
    // Phase 2: REVEAL - Contract circle towards bottom left
    const revealX = 0; // Bottom left X position
    const revealY = window.innerHeight; // Bottom left Y position
    
    tl.to(transitionOverlay, {
      clipPath: `circle(0px at ${revealX}px ${revealY}px)`,
      duration: 0.6,
      ease: 'power2.out'
    }, 0.8); // Start after swallow completes
    
    return tl;
  };

  // Theme transition animation function
  const animateThemeTransition = (newTheme: 'light' | 'dark') => {
    if (!toggleRef.current) return;

    const toggleBtn = toggleRef.current;
    const toggleRect = toggleBtn.getBoundingClientRect();
    // Get center position relative to viewport (since mask is fixed positioned)
    const toggleCenterX = toggleRect.left + toggleRect.width / 2;
    const toggleCenterY = toggleRect.top + toggleRect.height / 2;
    
    // Set CSS custom properties for mask position
    const xPercent = (toggleCenterX / window.innerWidth) * 100;
    const yPercent = (toggleCenterY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--toggle-x', `${xPercent}%`);
    document.documentElement.style.setProperty('--toggle-y', `${yPercent}%`);
    
    // Use View Transition API if available
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => switchTheme(newTheme));
    } else {
      // Fallback for browsers without View Transition API
      fallbackThemeTransition(newTheme, toggleCenterX, toggleCenterY);
    }
  };

  // Handle click
  const handleToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Update icons immediately
    updateThemeIcons(newTheme);
    
    // Start theme transition
    animateThemeTransition(newTheme);
  };

  // Set initial icon state on mount and theme changes
  useEffect(() => {
    updateThemeIcons(theme);
  }, [theme]);

  return (
    <button
      ref={toggleRef}
      className="theme-toggle"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      <div className="theme-icon">
        <div ref={sunIconRef} className="sun-icon">☀</div>
        <div ref={moonIconRef} className="moon-icon">🌙</div>
      </div>
    </button>
  );
};

export default ThemeToggle;