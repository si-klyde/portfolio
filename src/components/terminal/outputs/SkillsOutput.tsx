import skills from '../../../data/skills.json';

const NAME_WIDTH = 15;

function SkillCategory({ group }: { group: typeof skills[number] }) {
  return (
    <>
      <div className="skills-category">{group.category}</div>
      {group.skills.map(s => (
        <div key={s.name} className="skills-detail-row">
          <span className="skills-name">{s.name.padEnd(NAME_WIDTH)}</span>
          <span className="skills-used-label">used in: </span>
          <span className="skills-used-value">{s.usedIn.join(', ')}</span>
        </div>
      ))}
    </>
  );
}

interface SkillsOutputProps {
  query?: string;
}

export default function SkillsOutput({ query }: SkillsOutputProps) {
  if (!query) {
    return (
      <div className="skills-output">
        {skills.map(group => (
          <SkillCategory key={group.category} group={group} />
        ))}
      </div>
    );
  }

  const num = parseInt(query, 10);
  const match = !isNaN(num)
    ? skills[num - 1]
    : skills.find(g => g.category.toLowerCase().startsWith(query.toLowerCase()));

  if (!match) {
    return <span className="error-text">category not found: {query}</span>;
  }

  return (
    <div className="skills-output">
      <SkillCategory group={match} />
    </div>
  );
}
