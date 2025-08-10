import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const AboutSection: React.FC = () => {
  const [canActivate, setCanActivate] = useState(false);
  const [activated, setActivated] = useState(false);
  const topRightRef = useRef<HTMLDivElement | null>(null);
  const bottomRightRef = useRef<HTMLDivElement | null>(null);

  // Enable click after name scramble completes
  useEffect(() => {
    const handleScrambleDone = () => {
      setCanActivate(true);
    };
    window.addEventListener('scramble:complete', handleScrambleDone as EventListener);
    return () => window.removeEventListener('scramble:complete', handleScrambleDone as EventListener);
  }, []);

  // Click handler to prepare layout containers for future animation
  const handleActivate = () => {
    if (!canActivate || activated) return;
    setActivated(true);

    const tl = gsap.timeline();
    // Reveal the right placeholders by sliding them in from bottom
    tl.set([topRightRef.current, bottomRightRef.current], { display: 'block' })
      .fromTo(
        topRightRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
      )
      .fromTo(
        bottomRightRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
        '-=0.25'
      );
  };

  return (
    <section className={`about-section ${canActivate ? 'can-activate' : ''} ${activated ? 'about-activated' : ''}`} id="about" onClick={handleActivate}>
      <div className="section-content about-grid">
        {/* Left column - existing content wrapped in an invisible card */}
        <div className="about-left-card">
          <div className="about-left-panel">
            <div className="profile-container">
          <img 
            src="/portfolio/assets/profile.JPG" 
            alt="Clyde Baclao Profile" 
            className="profile-image" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/64x64/888888/ffffff?text=C';
            }}
          />
              <div className="profile-content">
                <h1 className="profile-name" id="scramble-text">Collide</h1>
                <p className="profile-title">Software Engineer & Cloud Administrator</p>
              </div>
            </div>
            
            <div className="bio-section">
              <p className="bio-text">
                Passionate about creating <span className="highlight">meaningful digital experiences</span> through clean code and thoughtful design. 
                Currently exploring the intersection of technology and human creativity.
              </p>
            </div>
          </div>
        </div>
        {/* Right column placeholders - initially invisible, do not affect initial layout height */}
        <div className="about-right">
          <div className="about-tile" ref={topRightRef} aria-hidden="true" />
          <div className="about-tile" ref={bottomRightRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;