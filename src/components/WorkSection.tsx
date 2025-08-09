import React, { useMemo, useState } from 'react';

type Project = {
  title: string;
  discipline: string;
  href?: string;
  // Gradient-based preview to avoid external assets and keep branding
  previewGradient: string;
};

const WorkSection: React.FC = () => {
  const projects: Project[] = useMemo(
    () => [
      {
        title: 'Interactive Portfolio',
        discipline: 'Web Development',
        href: '#',
        previewGradient:
          'radial-gradient(1200px 600px at 25% 65%, rgba(87, 166, 255, 0.35), transparent 60%), radial-gradient(900px 700px at 70% 30%, rgba(212, 175, 55, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
      },
      {
        title: 'Task Management App',
        discipline: 'Product Design',
        href: '#',
        previewGradient:
          'radial-gradient(800px 800px at 25% 30%, rgba(212, 175, 55, 0.3), transparent 55%), radial-gradient(900px 900px at 80% 75%, rgba(87, 166, 255, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
      },
      {
        title: 'Data Visualization Dashboard',
        discipline: 'Analytics',
        href: '#',
        previewGradient:
          'radial-gradient(700px 700px at 20% 25%, rgba(87, 166, 255, 0.35), transparent 55%), radial-gradient(1000px 600px at 80% 60%, rgba(212, 175, 55, 0.3), transparent 60%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
      },
      {
        title: 'Cocolyze',
        discipline: 'UX/UI Design',
        href: '#',
        previewGradient:
          'radial-gradient(950px 900px at 30% 70%, rgba(87, 166, 255, 0.35), transparent 55%), radial-gradient(850px 800px at 70% 20%, rgba(212, 175, 55, 0.3), transparent 50%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
      },
      {
        title: 'Les Indécis',
        discipline: 'Branding',
        href: '#',
        previewGradient:
          'radial-gradient(700px 700px at 35% 40%, rgba(212, 175, 55, 0.35), transparent 55%), radial-gradient(1000px 800px at 80% 70%, rgba(87, 166, 255, 0.35), transparent 60%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
      },
      {
        title: 'Game of the Goose',
        discipline: 'Game Design',
        href: '#',
        previewGradient:
          'radial-gradient(900px 900px at 25% 30%, rgba(87, 166, 255, 0.35), transparent 55%), radial-gradient(900px 900px at 75% 80%, rgba(212, 175, 55, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
      },
    ],
    []
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const selectedProject = hoveredIndex !== null ? projects[hoveredIndex] : projects[0];

  return (
    <section className="work-section" id="work">
      <div className="section-content">
        <div className="work-layout" onMouseLeave={() => setHoveredIndex(null)}>
          <div
            className={`work-preview ${hoveredIndex !== null ? 'visible' : ''}`}
            aria-hidden="true"
            style={{ backgroundImage: selectedProject.previewGradient }}
          />

          <div className="work-list">
            <div className="work-header">
              <h2 className="work-title">Work</h2>
              <span className="work-count" aria-label={`Total projects: ${projects.length}`}>
                {projects.length}
              </span>
            </div>

            <ul className="work-rows" role="list">
              {projects.map((project, index) => (
                <li key={project.title}>
                  <button
                    className={`project-row project-card ${index === hoveredIndex ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex(null)}
                  >
                    <span className="row-title">
                      <span className="row-arrow" aria-hidden>
                        →
                      </span>
                      {project.title}
                    </span>
                    <span className="row-discipline">{project.discipline}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;