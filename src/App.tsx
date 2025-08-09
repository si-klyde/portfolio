import React, { useEffect, useState, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
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

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const sections = ['about', 'skills', 'work', 'contact', 'blog'];

function AppContent() {
  const [currentSection, setCurrentSection] = useState('about');
  const { theme, setTheme } = useTheme();
  const isNavigating = useRef(false);

  // Navigation function with smooth scrolling
  const navigateToSection = useCallback((targetSection: string) => {
    const targetSectionEl = document.getElementById(targetSection);
    
    if (targetSectionEl) {
      // Set navigation flag to prevent ScrollTrigger interference
      isNavigating.current = true;
      
      // Update current section immediately to prevent highlight jumping
      setCurrentSection(targetSection);
      
      // Kill any existing scroll animations
      gsap.killTweensOf(window);
      
      // Calculate position accounting for navbar
      const navbarHeight = 80;
      const rect = targetSectionEl.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let targetY = rect.top + scrollTop;
      
      // For the about section, account for navbar
      if (targetSection === 'about') {
        targetY = Math.max(0, targetY - navbarHeight);
      }
      
      // Use GSAP ScrollTo for smooth scrolling
      gsap.to(window, {
        duration: 1.0,
        scrollTo: {
          y: targetY,
          autoKill: false
        },
        ease: "power2.inOut",
        onComplete: () => {
          // Reset navigation flag after scroll completes
          setTimeout(() => {
            isNavigating.current = false;
          }, 100);
        }
      });
    }
  }, []);

  // Initial setup effect - runs only once
  useEffect(() => {
    // Set initial states for animations
    gsap.set([".navigation", ".theme-toggle"], {
      opacity: 0,
      y: 30
    });
    
    // Create initial page load timeline
    const initialTl = gsap.timeline({ defaults: { duration: 0.8, ease: "power2.out" } });

    initialTl.to([".navigation", ".theme-toggle"], {
      opacity: 1,
      y: 0,
      duration: 0.6
    });


    // Set up ScrollTriggers for each section
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: `#${section}`,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          // Only update section if not currently navigating programmatically
          if (!isNavigating.current) {
            setCurrentSection(section);
          }
          
          // Handle scramble text for about section
          if (section === 'about') {
            setTimeout(() => {
              scrambleText("#scramble-text", "Clyde Baclao");
            }, 100);
          }
        },
        onEnterBack: () => {
          // Only update section if not currently navigating programmatically
          if (!isNavigating.current) {
            setCurrentSection(section);
          }
          
          // Handle scramble text for about section
          if (section === 'about') {
            setTimeout(() => {
              scrambleText("#scramble-text", "Clyde Baclao");
            }, 100);
          }
        }
      });

      // Animate section content on scroll
      if (section === 'about') {
        ScrollTrigger.create({
          trigger: `#${section}`,
          start: "top 80%",
          onEnter: () => {
            gsap.fromTo(".profile-image", 
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.2)" }
            );
            gsap.fromTo("#scramble-text", 
              { opacity: 0 },
              { opacity: 1, duration: 0.3, onComplete: () => scrambleText("#scramble-text", "Clyde Baclao") }
            );
            gsap.fromTo(".bio-section", 
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
            );
          }
        });
      } else if (section === 'skills') {
        ScrollTrigger.create({
          trigger: `#${section}`,
          start: "top 80%",
          onEnter: () => {
            gsap.fromTo(".skill-category", 
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
            );
          }
        });
      } else if (section === 'work') {
        ScrollTrigger.create({
          trigger: `#${section}`,
          start: "top 80%",
          onEnter: () => {
            gsap.fromTo(".project-card", 
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }
            );
          }
        });
      } else if (section === 'contact') {
        ScrollTrigger.create({
          trigger: `#${section}`,
          start: "top 80%",
          onEnter: () => {
            gsap.fromTo(".contact-method", 
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
            );
          }
        });
      } else if (section === 'blog') {
        ScrollTrigger.create({
          trigger: `#${section}`,
          start: "top 80%",
          onEnter: () => {
            gsap.fromTo(".article-card", 
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }
            );
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []); // Empty dependency array - run only once

  // Keyboard navigation effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = sections.indexOf(currentSection);
      
      if (e.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % sections.length;
        navigateToSection(sections[nextIndex]);
      } else if (e.key === 'ArrowUp') {
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
        navigateToSection(sections[prevIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigateToSection, currentSection]);


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
        <WorkSection />
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