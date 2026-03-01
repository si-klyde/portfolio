import contactData from '../../data/contact.json';

const ICON_MAP: Record<string, string> = {
  GitHub: '>',
  LinkedIn: 'in',
  Twitter: '~',
};

export default function ContactCard() {
  return (
    <div className="wn-contact">
      <a href={`mailto:${contactData.email}`} className="wn-contact-row">
        <span className="wn-contact-icon">@</span>
        <span className="wn-contact-label">email</span>
        <span className="wn-contact-value">{contactData.email}</span>
      </a>

      {contactData.socials.map((s, i) => (
        <a
          key={`${s.label}-${i}`}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="wn-contact-row"
        >
          <span className="wn-contact-icon">{ICON_MAP[s.label] ?? '#'}</span>
          <span className="wn-contact-label">{s.label}</span>
          <span className="wn-contact-value">{s.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
        </a>
      ))}

      <hr className="wn-contact-divider" />

      <div className="wn-contact-row">
        <span className="wn-contact-icon">+</span>
        <span className="wn-contact-label">location</span>
        <span className="wn-contact-value">{contactData.location}</span>
      </div>

      <div className="wn-contact-row">
        <span className="wn-contact-icon">
          <span className="wn-status-dot" />
        </span>
        <span className="wn-contact-label">status</span>
        <span className="wn-contact-value">{contactData.availability}</span>
      </div>
    </div>
  );
}
