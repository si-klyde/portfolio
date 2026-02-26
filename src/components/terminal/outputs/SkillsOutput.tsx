import skills from '../../../data/skills.json';

export default function SkillsOutput() {
  return (
    <div>
      {skills.map(group => (
        <div key={group.category} className="skill-group">
          <span className="skill-group-name">{group.category}</span>
          <div className="skill-tags-inline">
            {group.tags.map(tag => (
              <span key={tag} className="skill-tag">{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
