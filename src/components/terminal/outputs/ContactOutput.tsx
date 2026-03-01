import contact from '../../../data/contact.json';

const LABEL_WIDTH = 11;

function pad(label: string) {
  return label.padEnd(LABEL_WIDTH);
}

export default function ContactOutput() {
  return (
    <div className="contact-output">
      <div className="contact-row">
        <span className="contact-label">{pad('email')}</span>
        <a href={`mailto:${contact.email}`} className="contact-link">{contact.email}</a>
      </div>
      {contact.socials.map((s, i) => (
        <div key={`${s.label}-${i}`} className="contact-row">
          <span className="contact-label">{pad(s.label.toLowerCase())}</span>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="contact-link">
            {s.url.replace(/^https?:\/\//, '')}
          </a>
        </div>
      ))}
      <div className="contact-row">
        <span className="contact-label">{pad('location')}</span>
        <span className="contact-value">{contact.location}</span>
      </div>
      <div className="contact-row">
        <span className="contact-label">{pad('status')}</span>
        <span className="contact-value">{contact.availability}</span>
      </div>
    </div>
  );
}
