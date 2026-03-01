import experience from '../../../data/experience.json';

interface Role {
  title: string;
  period: string;
  length: string;
  bullets: string[];
}

interface Experience {
  company: string;
  type: string;
  duration: string;
  location: string;
  roles: Role[];
}

const typed = experience as Experience[];
const LABEL_WIDTH = 11;

function pad(label: string) {
  return label.padEnd(LABEL_WIDTH);
}

function ExperienceDetail({ exp, i }: { exp: Experience; i: number }) {
  return (
    <div className="exp-entry">
      <div className="exp-header">
        <span className="work-index">[{i + 1}/{typed.length}]</span>{' '}
        <span className="work-name">{exp.company}</span>
      </div>
      <div className="exp-field">
        <span className="exp-label">{pad('type')}</span>
        <span className="exp-value">{exp.type} · {exp.location}</span>
      </div>
      <div className="exp-field">
        <span className="exp-label">{pad('duration')}</span>
        <span className="exp-value">{exp.duration}</span>
      </div>
      <div className="exp-sep">─────────────────────────────</div>
      {exp.roles.map(role => (
        <div key={role.title} className="exp-role">
          <div className="exp-role-title">
            {role.title} <span className="work-index">({role.period})</span>
          </div>
          {role.bullets.map((b, j) => (
            <div key={j} className="exp-bullet">  - {b}</div>
          ))}
        </div>
      ))}
    </div>
  );
}


interface ExperienceOutputProps {
  query?: string;
}

export default function ExperienceOutput({ query }: ExperienceOutputProps) {
  if (!query) {
    return (
      <div className="exp-output">
        {typed.map((exp, i) => (
          <ExperienceDetail key={exp.company} exp={exp} i={i} />
        ))}
      </div>
    );
  }

  const num = parseInt(query, 10);
  const match = !isNaN(num)
    ? typed[num - 1]
    : typed.find(e => e.company.toLowerCase().includes(query.toLowerCase()));

  if (!match) {
    return <span className="error-text">company not found: {query}</span>;
  }

  const idx = typed.indexOf(match);
  return (
    <div className="exp-output">
      <ExperienceDetail exp={match} i={idx} />
    </div>
  );
}
