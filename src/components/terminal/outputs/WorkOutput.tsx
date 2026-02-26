import projects from '../../../data/projects.json';

export default function WorkOutput() {
  return (
    <div>
      {projects.map((p, i) => (
        <div key={p.title} className="project-entry">
          <div>
            <span className="project-title">{p.title}</span>
            <span className="project-discipline"> — {p.discipline}</span>
          </div>
          <div className="project-desc">{p.description}</div>
          <div className="project-tech">  [{p.tech.join(', ')}]</div>
          {i < projects.length - 1 && <div className="output-divider">---</div>}
        </div>
      ))}
    </div>
  );
}
