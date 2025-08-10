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

  // Reset layout when section becomes inactive (use GSAP Flip)
  useEffect(() => {
    if (!isActive && activated && !animatingRef.current) {
      animatingRef.current = true;
      const leftCard = document.querySelector('.about-left-card') as HTMLElement | null;
      const grid = document.querySelector('.about-grid') as HTMLElement | null;
      if (!leftCard || !grid) { animatingRef.current = false; return; }

      const state = Flip.getState([leftCard, grid]);
      sectionRef.current?.classList.remove('about-activated');

      Flip.from(state, {
        duration: 0.7,
        ease: 'power2.inOut',
        absolute: true,
        scale: true,
        nested: true,
        onComplete: () => {
          [topRightRef.current, bottomRightRef.current].forEach(el => { if (el) (el as HTMLElement).style.display = 'none'; });
          setActivated(false);
          animatingRef.current = false;
        }
      });
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
    const avatarEl = leftCard.querySelector('.profile-image') as HTMLElement | null;
    const textEls = [profileContentEl, bioEl].filter(Boolean) as HTMLElement[];

    // Build a ghost that matches the pre-activation bio tile shape and style
    let bioGhost: HTMLDivElement | null = null;
    let bioStartRect: DOMRect | null = null;
    if (bioEl) {
      bioStartRect = bioEl.getBoundingClientRect();
      const cs = getComputedStyle(bioEl);
      bioGhost = document.createElement('div');
      // No border on the ghost; keep it visually the same color as the background
      bioGhost.style.cssText = `position: fixed; left: ${bioStartRect.left}px; top: ${bioStartRect.top}px; width: ${bioStartRect.width}px; height: ${bioStartRect.height}px; background: ${cs.backgroundColor}; border: none; border-radius: ${cs.borderTopLeftRadius}; box-shadow: ${cs.boxShadow || 'none'}; z-index: 9999; pointer-events: none; will-change: transform,width,height,opacity; opacity: 1;`;
      document.body.appendChild(bioGhost);
      (bioEl as HTMLElement).style.visibility = 'hidden';
    }

    const startTransition = () => {
      // Hide left card during layout swap to prevent early growth flicker
      gsap.set(leftCard, { opacity: 0 });

      // Apply final layout and reveal right tiles (hidden initially)
      if (sectionRef.current) sectionRef.current.classList.add('about-activated', 'is-transitioning');
      if (topRightRef.current) { topRightRef.current.style.display = 'block'; (topRightRef.current as HTMLElement).style.opacity = '0'; }
      if (bottomRightRef.current) { bottomRightRef.current.style.display = 'block'; (bottomRightRef.current as HTMLElement).style.opacity = '0'; }

      // Force layout, then compute destination rect
      const last = leftCard.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;

      // Prepare transforms
      const inner = leftCard.querySelector('.about-left-inner') as HTMLElement | null;
      // Capture target visual styles for a seamless handoff
      const targetStyles = getComputedStyle(leftCard);
      const targetBg = targetStyles.backgroundColor;
      // We intentionally avoid showing any border during the transition
      const targetPaddingTop = targetStyles.paddingTop;
      const targetPaddingRight = targetStyles.paddingRight;
      const targetPaddingBottom = targetStyles.paddingBottom;
      const targetPaddingLeft = targetStyles.paddingLeft;
      const targetRadius = targetStyles.borderTopLeftRadius;

      gsap.set(leftCard, {
        transformOrigin: 'top left',
        x: dx,
        y: dy,
        width: first.width,
        height: first.height,
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        borderRadius: targetRadius,
        backgroundColor: targetBg,
        border: 'none',
        boxSizing: 'border-box',
        padding: 0
      });
      if (inner) gsap.set(inner, { transformOrigin: 'top left' });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          animatingRef.current = false;
          gsap.set(leftCard, { clearProps: 'transform,width,height' });
          if (inner) gsap.set(inner, { clearProps: 'transform,filter' });
          if (bioEl) (bioEl as HTMLElement).style.visibility = '';
          if (bioGhost && bioGhost.parentNode) bioGhost.parentNode.removeChild(bioGhost);
        }
      });

      // Container transition (background already set, keep constant to avoid flashes)
      // Animate paddings independently so the visual growth is eased evenly
      tl.to(leftCard, {
        x: 0,
        y: 0,
        width: last.width,
        height: last.height,
        paddingTop: targetPaddingTop,
        paddingRight: targetPaddingRight,
        paddingBottom: targetPaddingBottom,
        paddingLeft: targetPaddingLeft,
        duration: 0.85,
        ease: 'power3.inOut'
      }, 0)
      // Fade in the card just before the end to hide early growth
      .to(leftCard, { opacity: 1, duration: 0.18, ease: 'power1.out' }, '-=0.18');

      // Ghost morphs into the LEFT container's final tile and fades out
      if (bioGhost && bioStartRect) {
        const trg = last; // morph to the activated left card rect
        // Smooth in the ghost to avoid an abrupt appearance
        tl.fromTo(bioGhost, { opacity: 0.001, scale: 0.96, transformOrigin: 'top left' }, { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' }, 0)
          .to(bioGhost, { left: trg.left, top: trg.top, width: trg.width, height: trg.height, borderRadius: targetRadius, duration: 0.85, ease: 'power3.inOut' }, 0)
          .to(bioGhost, { opacity: 0, duration: 0.2, ease: 'power2.out' }, '-=0.2');
      }
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

      // Fade text back in near the end; keep avatar grayscale
      const textBackEls = [leftCard.querySelector('.profile-content'), leftCard.querySelector('.bio-section')].filter(Boolean) as Element[];
      if (textBackEls.length) tl.to(textBackEls, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.06, ease: 'power2.out' }, '-=0.55');
      if (avatarEl) tl.to(avatarEl, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '<');
      // Reveal the left card itself just at the end (ghost covers the motion)
      tl.to(leftCard, { opacity: 1, duration: 0.12, ease: 'power1.out' }, '>-0.12');
      // Remove transitioning class at the very end so tile BG appears AFTER motion
      tl.add(() => { sectionRef.current?.classList.remove('is-transitioning'); });

      setActivated(true);
    };

    if (textEls.length || avatarEl) {
      const tlFade = gsap.timeline({ onComplete: startTransition });
      if (textEls.length) tlFade.to(textEls, { opacity: 0, y: 8, filter: 'blur(2px)', duration: 0.15, ease: 'power2.in' }, 0);
      if (avatarEl) tlFade.to(avatarEl, { opacity: 0, y: 8, duration: 0.15, ease: 'power2.in' }, 0);
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