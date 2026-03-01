import skills from '../../../data/skills.json';

const CAT_WIDTH = 22;
const NAME_WIDTH = 15;

function SkillsList() {
  return (
    <div className="skills-output">
      {skills.map((group, i) => (
        <div key={group.category} className="skills-list-row">
          <span className="skills-list-index">[{i + 1}]</span>
          <span className="skills-list-name">{group.category.padEnd(CAT_WIDTH)}</span>
          <span className="skills-list-count">{group.skills.length} tools</span>
        </div>
      ))}
      <div className="skills-hint">
        type <span className="skills-hint-cmd">skills &lt;name|#&gt;</span> for details
      </div>
    </div>
  );
}

interface SkillsOutputProps {
  query?: string;
}

export default function SkillsOutput({ query }: SkillsOutputProps) {
  if (!query) return <SkillsList />;

  const num = parseInt(query, 10);
  const match = !isNaN(num)
    ? skills[num - 1]
    : skills.find(g => g.category.toLowerCase().startsWith(query.toLowerCase()));

  if (!match) {
    return <span className="error-text">category not found: {query}</span>;
  }

  return (
    <div className="skills-output">
      <div className="skills-category">{match.category}</div>
      {match.skills.map(s => (
        <div key={s.name} className="skills-detail-row">
          <span className="skills-name">{s.name.padEnd(NAME_WIDTH)}</span>
          <span className="skills-used-label">used in: </span>
          <span className="skills-used-value">{s.usedIn.join(', ')}</span>
        </div>
      ))}
    </div>
  );
}
