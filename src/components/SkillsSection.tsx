import React from 'react';

const SkillsSection: React.FC = () => {
  return (
    <section className="skills-section" id="skills">
      <div className="section-content">
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          <div className="skill-category">
            <h3>Frontend Development</h3>
            <div className="skill-tags">
              <span className="skill-tag">React</span>
              <span className="skill-tag">Next.js</span>
              <span className="skill-tag">TypeScript</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">GSAP</span>
              <span className="skill-tag">CSS</span>
              <span className="skill-tag">Tailwind</span>
            </div>
          </div>
          <div className="skill-category">
            <h3>Backend & Database</h3>
            <div className="skill-tags">
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Python</span>
              <span className="skill-tag">PostgreSQL</span>
              <span className="skill-tag">MongoDB</span>
              <span className="skill-tag">Redis</span>
              <span className="skill-tag">GraphQL</span>
            </div>
          </div>
          <div className="skill-category">
            <h3>Tools & Platforms</h3>
            <div className="skill-tags">
              <span className="skill-tag">Git</span>
              <span className="skill-tag">Docker</span>
              <span className="skill-tag">AWS</span>
              <span className="skill-tag">Vercel</span>
              <span className="skill-tag">Figma</span>
              <span className="skill-tag">VS Code</span>
            </div>
          </div>
          <div className="skill-category">
            <h3>Currently Learning</h3>
            <div className="skill-tags">
              <span className="skill-tag learning">Rust</span>
              <span className="skill-tag learning">WebGL</span>
              <span className="skill-tag learning">Three.js</span>
              <span className="skill-tag learning">AI/ML</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;