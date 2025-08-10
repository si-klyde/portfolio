import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

interface AboutSectionProps { isActive?: boolean }

const AboutSection: React.FC<AboutSectionProps> = ({ isActive = true }) => {
  const [canActivate, setCanActivate] = useState(false);
  const [activated, setActivated] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const topRightRef = useRef<HTMLDivElement | null>(null);
  const bottomRightRef = useRef<HTMLDivElement | null>(null);
  const animatingRef = useRef(false);

  // Enable click after name scramble completes
  useEffect(() => {
    const handleScrambleDone = () => {
      setCanActivate(true);
    };
    window.addEventListener('scramble:complete', handleScrambleDone as EventListener);
    return () => window.removeEventListener('scramble:complete', handleScrambleDone as EventListener);
  }, []);

  // Reset layout when section becomes inactive to avoid stale sizes
  useEffect(() => {
    if (!isActive && activated && !animatingRef.current) {
      // Animate back to initial layout
      animatingRef.current = true;
      const leftCard = document.querySelector('.about-left-card') as HTMLElement | null;
      const inner = leftCard?.querySelector('.about-left-inner') as HTMLElement | null;
      const tiles = [topRightRef.current, bottomRightRef.current].filter(Boolean) as HTMLElement[];
      if (!leftCard) { animatingRef.current = false; return; }

      // Current rect while in activated layout
      const first = leftCard.getBoundingClientRect();

      // Switch to base layout (single column)
      sectionRef.current?.classList.remove('about-activated');

      // Force layout and measure destination
      const last = leftCard.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;

      // Hold visual position to the 'first' state
      gsap.set(leftCard, { x: dx, y: dy, width: first.width, height: first.height });
      if (inner) gsap.set(inner, { transformOrigin: 'top left' });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: () => {
          animatingRef.current = false;
          setActivated(false);
          gsap.set(leftCard, { clearProps: 'transform,width,height' });
          if (inner) gsap.set(inner, { clearProps: 'transform' });
          tiles.forEach(t => { if (t) t.style.display = 'none'; });
        }
      });

      // Animate left card back to its base position/size with inner blur during motion
      tl.to(leftCard, { x: 0, y: 0, width: last.width, height: last.height, duration: 0.7 }, 0);
      if (inner) tl.fromTo(inner, { filter: 'blur(10px)' }, { filter: 'blur(0px)', duration: 0.7, ease: 'power2.inOut' }, 0);

      // Slide/fade tiles down then hide
      if (tiles.length) {
        tl.to(tiles as gsap.TweenTarget, {
          opacity: 0,
          y: 80,
          scale: 0.98,
          duration: 0.5,
          ease: 'power2.in',
          stagger: 0.08,
        }, 0);
      }
    }
  }, [isActive]);

  // Click handler to prepare layout containers for future animation
  const handleActivate = () => {
    if (!canActivate || activated || animatingRef.current) return;
    animatingRef.current = true;

    // Manual FLIP for the left card to avoid offset issues
    const leftCard = document.querySelector('.about-left-card') as HTMLElement | null;
    if (!leftCard) { animatingRef.current = false; return; }

    const first = leftCard.getBoundingClientRect();

    // Fade out textual content quickly BEFORE transition
    const profileContentEl = leftCard.querySelector('.profile-content') as HTMLElement | null;
    const bioEl = leftCard.querySelector('.bio-section') as HTMLElement | null;
    const textEls = [profileContentEl, bioEl].filter(Boolean) as HTMLElement[];

    const startTransition = () => {
      // Apply final layout and reveal right tiles (hidden initially)
      if (sectionRef.current) sectionRef.current.classList.add('about-activated');
      if (topRightRef.current) { topRightRef.current.style.display = 'block'; topRightRef.current.style.opacity = '0'; }
      if (bottomRightRef.current) { bottomRightRef.current.style.display = 'block'; bottomRightRef.current.style.opacity = '0'; }

      // Force layout, then compute destination rect
      const last = leftCard.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;

      // Prepare transforms
      const inner = leftCard.querySelector('.about-left-inner') as HTMLElement | null;
      gsap.set(leftCard, { transformOrigin: 'top left', x: dx, y: dy, width: first.width, height: first.height, boxShadow: '0 0 0 rgba(0,0,0,0)', borderRadius: 8 });
      if (inner) gsap.set(inner, { transformOrigin: 'top left' });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          animatingRef.current = false;
          gsap.set(leftCard, { clearProps: 'transform,width,height' });
          if (inner) gsap.set(inner, { clearProps: 'transform,filter' });
        }
      });

      // Container transition
      tl.to(leftCard, { x: 0, y: 0, width: last.width, height: last.height, duration: 0.85 }, 0)
        .to(leftCard, { boxShadow: '0 10px 28px rgba(0,0,0,0.25)', borderRadius: 12, duration: 0.6, ease: 'power2.out' }, '-=0.6');
      if (inner) tl.fromTo(inner, { filter: 'blur(10px)' }, { filter: 'blur(0px)', duration: 0.85, ease: 'power3.inOut' }, 0);

      const entering = [topRightRef.current, bottomRightRef.current].filter(Boolean) as HTMLElement[];
      // Force a reflow so the browser registers display before animating
      entering[0]?.offsetHeight;
      tl.fromTo(entering as gsap.TweenTarget,
        { opacity: 0, y: 88, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(0.6)', stagger: 0.12, immediateRender: true,
          onComplete: () => { gsap.set(entering, { clearProps: 'transform,opacity' }); }
        },
        '-=0.25'
      );

      // Fade text back in near the end
      const contentEls = [leftCard.querySelector('.profile-content'), leftCard.querySelector('.bio-section')].filter(Boolean) as Element[];
      if (contentEls.length) {
        tl.to(contentEls, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.06, ease: 'power2.out' }, '-=0.55');
      }

      setActivated(true);
    };

    if (textEls.length) {
      gsap.to(textEls, { opacity: 0, y: 8, filter: 'blur(2px)', duration: 0.15, ease: 'power2.in', onComplete: startTransition });
    } else {
      startTransition();
    }
  };

  return (
    <section ref={sectionRef} className={`about-section ${canActivate ? 'can-activate' : ''} ${activated ? 'about-activated' : ''}`} id="about" onClick={handleActivate}>
      <div className="section-content about-grid">
        {/* Left column - existing content wrapped in an invisible card */}
        <div className="about-left-card">
          <div className="about-left-inner">
          <div className="about-left-panel">
            <div className="profile-container" role="group" aria-label="Profile">
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