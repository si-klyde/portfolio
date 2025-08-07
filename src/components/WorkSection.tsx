import React from 'react';

const WorkSection: React.FC = () => {
  return (
    <section className="work-section" id="work">
      <div className="section-content">
        <h2>Featured Work</h2>
        <div className="work-grid">
          <div className="project-card">
            <div className="project-header">
              <h3>Interactive Portfolio</h3>
              <div className="project-links">
                <a href="#" className="project-link">Live →</a>
                <a href="#" className="project-link">Code →</a>
              </div>
            </div>
            <p className="project-description">
              Animated portfolio site built with GSAP, featuring smooth transitions and interactive elements. 
              Showcases modern web animations and responsive design.
            </p>
            <div className="project-tags">
              <span className="project-tag">GSAP</span>
              <span className="project-tag">JavaScript</span>
              <span className="project-tag">CSS</span>
            </div>
          </div>
          
          <div className="project-card">
            <div className="project-header">
              <h3>Task Management App</h3>
              <div className="project-links">
                <a href="#" className="project-link">Live →</a>
                <a href="#" className="project-link">Code →</a>
              </div>
            </div>
            <p className="project-description">
              Full-stack productivity app with real-time collaboration, drag-and-drop interface, and advanced filtering. 
              Built with modern React patterns.
            </p>
            <div className="project-tags">
              <span className="project-tag">React</span>
              <span className="project-tag">Node.js</span>
              <span className="project-tag">PostgreSQL</span>
            </div>
          </div>
          
          <div className="project-card">
            <div className="project-header">
              <h3>Data Visualization Dashboard</h3>
              <div className="project-links">
                <a href="#" className="project-link">Live →</a>
                <a href="#" className="project-link">Code →</a>
              </div>
            </div>
            <p className="project-description">
              Interactive dashboard for analyzing complex datasets with custom visualizations, filters, and export capabilities. 
              Optimized for performance.
            </p>
            <div className="project-tags">
              <span className="project-tag">D3.js</span>
              <span className="project-tag">TypeScript</span>
              <span className="project-tag">Python</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;