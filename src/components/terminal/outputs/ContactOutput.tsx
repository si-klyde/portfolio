import contact from '../../../data/contact.json';

export default function ContactOutput() {
  return (
    <div>
      <div>
        <span className="output-label">email: </span>
        <a href={`mailto:${contact.email}`} className="contact-link">{contact.email}</a>
      </div>
      <div className="output-divider">---</div>
      {contact.socials.map(s => (
        <div key={s.label}>
          <span className="output-label">{s.label.toLowerCase()}: </span>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="contact-link">{s.url}</a>
        </div>
      ))}
      <div className="output-divider">---</div>
      <div>
        <span className="output-label">location: </span>
        <span className="output-value">{contact.location}</span>
      </div>
      <div>
        <span className="output-label">status: </span>
        <span className="output-value">{contact.availability}</span>
      </div>
    </div>
  );
}
