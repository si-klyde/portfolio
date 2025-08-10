import { useEffect, useState, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import Navigation from './components/Navigation';
import ThemeToggle from './components/ThemeToggle';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import WorkSection from './components/WorkSection';
import ContactSection from './components/ContactSection';
import BlogSection from './components/BlogSection';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { scrambleText } from './utils/scrambleText';
import './styles.css';

const sections = ['about', 'skills', 'work', 'contact', 'blog'];

function AppContent() {
  const [currentSection, setCurrentSection] = useState('about');
  const { theme, setTheme } = useTheme();
  const transitionTlRef = useRef<gsap.core.Timeline | null>(null);

  // Navigation function with slide transitions
  const navigateToSection = useCallback((targetSection: string) => {
    if (currentSection === targetSection) return;
    console.log('Navigating from', currentSection, 'to', targetSection);

    const currentSectionEl = document.querySelector(`#${currentSection}`);
    const targetSectionEl = document.querySelector(`#${targetSection}`);
    
    // Scramble text back to "Collide" when leaving about section
    if (currentSection === 'about') {
      scrambleText("#scramble-text", "Collide", 0);
    }
    
    // Determine slide direction based on section order
    const currentIndex = sections.indexOf(currentSection);
    const targetIndex = sections.indexOf(targetSection);
    const slideDirection = targetIndex > currentIndex ? 1 : -1;

    // Kill any in-flight transition to avoid race conditions during rapid navigation
    if (transitionTlRef.current) {
      transitionTlRef.current.kill();
      transitionTlRef.current = null;
    }

    // Also kill tweens on involved elements before starting a new transition
    if (currentSectionEl) gsap.killTweensOf(currentSectionEl);
    if (targetSectionEl) gsap.killTweensOf(targetSectionEl);

    // Create transition timeline
    const transitionTl = gsap.timeline({
      onComplete: () => {
        transitionTlRef.current = null;
      }
    });
    transitionTlRef.current = transitionTl;

    // Set initial position for target section (off-screen)
    gsap.set(targetSectionEl, { 
      display: "flex", 
      x: slideDirection * window.innerWidth,
      opacity: 1 
    });

    // Slide out current section and slide in target section simultaneously
    transitionTl.to(currentSectionEl, {
      x: -slideDirection * window.innerWidth,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(currentSectionEl, { display: "none", x: 0 });
      }
    })
    .to(targetSectionEl, {
      x: 0,
      duration: 0.7,
      ease: "back.out(0.5)"
    }, 0);

    // Animate section-specific content with fade-in only (scoped to target section)
    if (targetSectionEl) {
      if (targetSection === 'skills') {
        const items = targetSectionEl.querySelectorAll('.skill-category');
        transitionTl.set(items, { opacity: 0 })
          .to(items, {
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.out'
          }, '-=0.1');
      } else if (targetSection === 'work') {
        const items = targetSectionEl.querySelectorAll('.project-card');
        transitionTl.set(items, { opacity: 0 })
          .to(items, {
            opacity: 1,
            duration: 0.4,
            stagger: 0.15,
            ease: 'power2.out'
          }, '-=0.1');
      } else if (targetSection === 'contact') {
        const items = targetSectionEl.querySelectorAll('.contact-method');
        transitionTl.set(items, { opacity: 0 })
          .to(items, {
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.out'
          }, '-=0.1');
      } else if (targetSection === 'blog') {
        const items = targetSectionEl.querySelectorAll('.article-card');
        transitionTl.set(items, { opacity: 0 })
          .to(items, {
            opacity: 1,
            duration: 0.4,
            stagger: 0.15,
            ease: 'power2.out'
          }, '-=0.1');
      }
    }

    // Re-animate scramble text when returning to about section
    if (targetSection === 'about') {
      setTimeout(() => {
        scrambleText("#scramble-text", "Clyde Baclao");
      }, 400);
    }

    setCurrentSection(targetSection);
  }, [currentSection]);

  // Initial setup effect - runs only once
  useEffect(() => {
    // Set initial states for animations
    gsap.set([".navigation", ".about-section", ".skills-section", ".work-section", ".contact-section", ".blog-section", ".theme-toggle"], {
      opacity: 0,
      y: 30
    });
    
    gsap.set("#scramble-text", { opacity: 0 });
    gsap.set(".profile-image", { scale: 0.8, opacity: 0 });
    gsap.set([".skill-category", ".project-card", ".contact-method", ".article-card"], {
      opacity: 0,
      y: 50
    });

    // Initially show only the about section
    gsap.set([".skills-section", ".work-section", ".contact-section", ".blog-section"], {
      display: "none"
    });

    // Create initial page load timeline
    const initialTl = gsap.timeline({ defaults: { duration: 0.8, ease: "power2.out" } });

    initialTl.to([".navigation", ".theme-toggle"], {
      opacity: 1,
      y: 0,
      duration: 0.6
    })
    .to(".about-section", {
      display: "flex",
      opacity: 1,
      y: 0,
      duration: 0.6
    }, "-=0.3")
    .to(".profile-image", {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.2)"
    }, "-=0.4")
    .to("#scramble-text", {
      opacity: 1,
      duration: 0.3,
      onComplete: () => {
        scrambleText("#scramble-text", "Clyde Baclao");
      }
    }, "-=0.3")
    .to(".bio-section", {
      opacity: 1,
      y: 0
    }, "-=0.5");
  }, []); // Empty dependency array - run only once

  // Keyboard navigation effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = sections.indexOf(currentSection);
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % sections.length;
        navigateToSection(sections[nextIndex]);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
        navigateToSection(sections[prevIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigateToSection, currentSection]);

  useEffect(() => {
    console.log('App mounted, current section:', currentSection);
    console.log('Theme:', theme);
  }, [currentSection, theme]);

  return (
    <div className="App">
      {/* Theme Toggle in top-right corner */}
      <ThemeToggle theme={theme} onToggle={setTheme} />
      
      {/* Navigation */}
      <Navigation currentSection={currentSection} onNavigate={navigateToSection} />
      
      {/* Main container with sections */}
      <main className="main-container">
        <AboutSection />
        <SkillsSection />
        <WorkSection isActive={currentSection === 'work'} />
        <ContactSection />
        <BlogSection />
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;