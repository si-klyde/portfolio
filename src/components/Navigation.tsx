import React from 'react';

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, onNavigate }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    onNavigate(section);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <a
          href="#about"
          className={`nav-item ${currentSection === 'about' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, 'about')}
        >
          About
        </a>
        <a
          href="#skills"
          className={`nav-item ${currentSection === 'skills' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, 'skills')}
        >
          Skills
        </a>
        <a
          href="#work"
          className={`nav-item ${currentSection === 'work' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, 'work')}
        >
          Work
        </a>
        <a
          href="#contact"
          className={`nav-item ${currentSection === 'contact' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, 'contact')}
        >
          Contact
        </a>
        <a
          href="#blog"
          className={`nav-item ${currentSection === 'blog' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, 'blog')}
        >
          Blog
        </a>
      </div>
    </nav>
  );
};

export default Navigation;