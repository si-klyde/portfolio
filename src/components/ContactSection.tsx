import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="section-content">
        <h2>Get In Touch</h2>
        <div className="contact-content">
          <p className="contact-intro">
            Let's collaborate on something amazing. I'm always interested in new opportunities and meaningful projects.
          </p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <h3>Email</h3>
              <a href="mailto:hello@clyde.dev" className="contact-value">hello@clyde.dev</a>
              <p className="contact-description">Best for project inquiries and collaborations</p>
            </div>
            
            <div className="contact-method">
              <h3>Social</h3>
              <div className="social-links">
                <a href="https://github.com/clyde" className="social-link">GitHub</a>
                <a href="https://linkedin.com/in/clyde" className="social-link">LinkedIn</a>
                <a href="https://twitter.com/clyde" className="social-link">Twitter</a>
              </div>
              <p className="contact-description">Follow my work and connect professionally</p>
            </div>
            
            <div className="contact-method">
              <h3>Location</h3>
              <span className="contact-value">San Francisco, CA</span>
              <p className="contact-description">Available for remote work worldwide</p>
            </div>
          </div>
          
          <div className="contact-cta">
            <a href="/resume.pdf" className="resume-link">Download Resume</a>
            <p className="availability-status">Currently available for new projects</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;