import React from 'react';

const BlogSection: React.FC = () => {
  return (
    <section className="blog-section" id="blog">
      <div className="section-content">
        <h2>Latest Writing</h2>
        <div className="blog-content">
          <p className="blog-intro">
            Thoughts on technology, design, and the intersection of creativity and code.
          </p>
          
          <div className="articles-grid">
            <article className="article-card">
              <h3>The Art of Subtle Animations</h3>
              <p className="article-date">December 2024</p>
              <p className="article-excerpt">
                Exploring how micro-interactions and thoughtful animations can enhance user experience without overwhelming the interface.
              </p>
              <a href="#" className="article-link">Read more →</a>
            </article>
            
            <article className="article-card">
              <h3>Building with Intention</h3>
              <p className="article-date">November 2024</p>
              <p className="article-excerpt">
                Why every design decision should have purpose, and how to create digital experiences that truly matter.
              </p>
              <a href="#" className="article-link">Read more →</a>
            </article>
            
            <article className="article-card">
              <h3>Modern CSS Layout Patterns</h3>
              <p className="article-date">October 2024</p>
              <p className="article-excerpt">
                A deep dive into CSS Grid, Flexbox, and container queries for building responsive, maintainable layouts.
              </p>
              <a href="#" className="article-link">Read more →</a>
            </article>
            
            <article className="article-card">
              <h3>GSAP Animation Techniques</h3>
              <p className="article-date">September 2024</p>
              <p className="article-excerpt">
                Advanced techniques for creating smooth, performant web animations that enhance user experience.
              </p>
              <a href="#" className="article-link">Read more →</a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;