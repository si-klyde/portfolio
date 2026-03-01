import experienceData from '../../data/experience.json';

interface Role {
  title: string;
  period: string;
  length: string;
  bullets: string[];
}

interface Company {
  company: string;
  type: string;
  duration: string;
  location: string;
  roles: Role[];
}

export default function ExperiencePanel() {
  return (
    <div className="wn-experience">
      {(experienceData as Company[]).map(company => (
        <div key={company.company} className="wn-company">
          <div className="wn-company-header">
            <span className="wn-company-name">{company.company}</span>
            <span className="wn-badge">{company.type}</span>
          </div>
          <div className="wn-company-duration">{company.duration} &middot; {company.location}</div>

          {company.roles.map(role => (
            <div key={role.title} className="wn-role">
              <div className="wn-role-title">{role.title}</div>
              <div className="wn-role-period">{role.period} &middot; {role.length}</div>
              <div className="wn-role-bullets">
                {role.bullets.map((bullet, i) => (
                  <div key={i} className="wn-bullet">{bullet}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
