import projects from '../../../data/projects.json';

interface Project {
  title: string;
  discipline: string;
  description: string;
  tech: string[];
  github?: string;
}

const typed = projects as Project[];
const LABEL_WIDTH = 9;
const NAME_WIDTH = 20;

function pad(label: string) {
  return label.padEnd(LABEL_WIDTH);
}

function ProjectDetail({ p, i }: { p: Project; i: number }) {
  return (
    <div className="work-entry">
      <div className="work-header">
        <span className="work-index">[{i + 1}/{typed.length}]</span>{' '}
        <span className="work-name">{p.title}</span>
      </div>
      <div className="work-field">
        <span className="work-label">{pad('type')}</span>
        <span className="work-value">{p.discipline}</span>
      </div>
      <div className="work-field">
        <span className="work-label">{pad('desc')}</span>
        <span className="work-value">{p.description}</span>
      </div>
      <div className="work-field">
        <span className="work-label">{pad('stack')}</span>
        <span className="work-stack">{p.tech.join(' \u00b7 ')}</span>
      </div>
      <div className="work-field">
        <span className="work-label">{pad('repo')}</span>
        {p.github ? (
          <a
            href={`https://github.com/${p.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="work-repo-link"
          >
            github.com/{p.github}
          </a>
        ) : (
          <span className="work-private">private</span>
        )}
      </div>
    </div>
  );
}

function ProjectList() {
  return (
    <div className="work-output">
      {typed.map((p, i) => (
        <div key={p.title} className="work-list-row">
          <span className="work-list-index">[{i + 1}]</span>
          <span className="work-list-name">{p.title.padEnd(NAME_WIDTH)}</span>
          <span className="work-list-type">{p.discipline}</span>
        </div>
      ))}
      <div className="work-hint">
        type <span className="work-hint-cmd">work &lt;name|#&gt;</span> for details
      </div>
    </div>
  );
}

interface WorkOutputProps {
  query?: string;
}

export default function WorkOutput({ query }: WorkOutputProps) {
  if (!query) return <ProjectList />;

  const num = parseInt(query, 10);
  const match = !isNaN(num)
    ? typed[num - 1]
    : typed.find(p => p.title.toLowerCase() === query.toLowerCase());

  if (!match) {
    return <span className="error-text">project not found: {query}</span>;
  }

  const idx = typed.indexOf(match);
  return (
    <div className="work-output">
      <ProjectDetail p={match} i={idx} />
    </div>
  );
}
