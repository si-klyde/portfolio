import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="about-section" id="about">
      <div className="section-content">
        <div className="profile-container">
          <img 
            src="assets/profile.jpg" 
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
    </section>
  );
};

export default AboutSection;