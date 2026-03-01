import skillsData from '../../data/skills.json';

interface Skill {
  name: string;
  usedIn: string[];
}

interface Category {
  category: string;
  skills: Skill[];
}

export default function SkillsGrid() {
  return (
    <div className="wn-skills">
      {(skillsData as Category[]).map(cat => (
        <div key={cat.category}>
          <div className="wn-skills-category">{cat.category}</div>
          <div className="wn-skills-list">
            {cat.skills.map(skill => (
              <span
                key={skill.name}
                className="wn-pill"
                title={`Used in: ${skill.usedIn.join(', ')}`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
