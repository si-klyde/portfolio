import React, { useEffect, useMemo, useState } from 'react';

type Project = {
  title: string;
  discipline: string;
  href?: string;
  // Multiple previews per project for shuffling
  previews: string[];
};

interface WorkSectionProps {
  isActive: boolean;
}

const WorkSection: React.FC<WorkSectionProps> = ({ isActive }) => {
  const projects: Project[] = useMemo(
    () => [
      {
        title: 'Interactive Portfolio',
        discipline: 'Web Development',
        href: '#',
        previews: [
          'radial-gradient(1200px 600px at 25% 65%, rgba(87, 166, 255, 0.35), transparent 60%), radial-gradient(900px 700px at 70% 30%, rgba(212, 175, 55, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
          'radial-gradient(900px 700px at 75% 40%, rgba(212, 175, 55, 0.35), transparent 55%), radial-gradient(800px 600px at 20% 70%, rgba(87, 166, 255, 0.35), transparent 60%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
          'radial-gradient(850px 700px at 40% 30%, rgba(87, 166, 255, 0.35), transparent 55%), radial-gradient(1000px 800px at 80% 75%, rgba(212, 175, 55, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
        ],
      },
      {
        title: 'Task Management App',
        discipline: 'Product Design',
        href: '#',
        previews: [
          'radial-gradient(800px 800px at 25% 30%, rgba(212, 175, 55, 0.3), transparent 55%), radial-gradient(900px 900px at 80% 75%, rgba(87, 166, 255, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
          'radial-gradient(700px 700px at 70% 60%, rgba(87, 166, 255, 0.3), transparent 55%), radial-gradient(900px 900px at 20% 25%, rgba(212, 175, 55, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
        ],
      },
      {
        title: 'Data Visualization Dashboard',
        discipline: 'Analytics',
        href: '#',
        previews: [
          'radial-gradient(700px 700px at 20% 25%, rgba(87, 166, 255, 0.35), transparent 55%), radial-gradient(1000px 600px at 80% 60%, rgba(212, 175, 55, 0.3), transparent 60%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
          'radial-gradient(900px 600px at 70% 70%, rgba(212, 175, 55, 0.3), transparent 55%), radial-gradient(800px 800px at 30% 30%, rgba(87, 166, 255, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
        ],
      },
      {
        title: 'Cocolyze',
        discipline: 'UX/UI Design',
        href: '#',
        previews: [
          'radial-gradient(950px 900px at 30% 70%, rgba(87, 166, 255, 0.35), transparent 55%), radial-gradient(850px 800px at 70% 20%, rgba(212, 175, 55, 0.3), transparent 50%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
          'radial-gradient(800px 700px at 65% 30%, rgba(212, 175, 55, 0.3), transparent 55%), radial-gradient(900px 900px at 20% 70%, rgba(87, 166, 255, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
        ],
      },
      {
        title: 'Les Indécis',
        discipline: 'Branding',
        href: '#',
        previews: [
          'radial-gradient(700px 700px at 35% 40%, rgba(212, 175, 55, 0.35), transparent 55%), radial-gradient(1000px 800px at 80% 70%, rgba(87, 166, 255, 0.35), transparent 60%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
          'radial-gradient(900px 900px at 75% 80%, rgba(212, 175, 55, 0.3), transparent 60%), radial-gradient(800px 700px at 25% 30%, rgba(87, 166, 255, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
        ],
      },
      {
        title: 'Game of the Goose',
        discipline: 'Game Design',
        href: '#',
        previews: [
          'radial-gradient(900px 900px at 25% 30%, rgba(87, 166, 255, 0.35), transparent 55%), radial-gradient(900px 900px at 75% 80%, rgba(212, 175, 55, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
          'radial-gradient(850px 700px at 60% 35%, rgba(212, 175, 55, 0.35), transparent 55%), radial-gradient(900px 900px at 30% 75%, rgba(87, 166, 255, 0.35), transparent 55%), linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
        ],
      },
    ],
    []
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [shuffleIndex, setShuffleIndex] = useState<number>(0);

  const activeIndex = selectedIndex !== null ? selectedIndex : hoveredIndex !== null ? hoveredIndex : 0;
  const selectedProject = projects[activeIndex];
  const isPreviewVisible = isActive && (hoveredIndex !== null || selectedIndex !== null);

  // Shuffle previews while a project is selected
  useEffect(() => {
    if (selectedIndex === null) {
      setShuffleIndex(0);
      return;
    }
    const id = setInterval(() => {
      setShuffleIndex((prev) => (prev + 1) % projects[selectedIndex].previews.length);
    }, 1600);
    return () => clearInterval(id);
  }, [selectedIndex, projects]);

  // Reset and unload when section is not active
  useEffect(() => {
    if (!isActive) {
      setHoveredIndex(null);
      setSelectedIndex(null);
      setShuffleIndex(0);
    }
  }, [isActive]);

  return (
    <section className="work-section" id="work">
      <div className="section-content">
        <div className="work-layout" onMouseLeave={() => setHoveredIndex(null)}>
          <div
            className={`work-preview ${isPreviewVisible ? 'visible' : ''}`}
            aria-hidden="true"
            style={{ backgroundImage: isPreviewVisible ? selectedProject.previews[Math.min(shuffleIndex, selectedProject.previews.length - 1)] : 'none' }}
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
                    className={`project-row project-card ${index === (selectedIndex ?? hoveredIndex ?? -1) ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex(null)}
                    onClick={() => setSelectedIndex((prev) => (prev === index ? null : index))}
                    aria-pressed={selectedIndex === index}
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