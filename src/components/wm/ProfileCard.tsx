import aboutData from '../../data/about.json';

function highlightBio(text: string, highlights: string[]) {
  const parts: { text: string; hl: boolean }[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliest = -1;
    let matchedHl = '';

    for (const hl of highlights) {
      const idx = remaining.indexOf(hl);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        matchedHl = hl;
      }
    }

    if (earliest === -1) {
      parts.push({ text: remaining, hl: false });
      break;
    }

    if (earliest > 0) {
      parts.push({ text: remaining.slice(0, earliest), hl: false });
    }
    parts.push({ text: matchedHl, hl: true });
    remaining = remaining.slice(earliest + matchedHl.length);
  }

  return parts;
}

export default function ProfileCard() {
  const bio = highlightBio(aboutData.bio.text, aboutData.bio.highlight);

  return (
    <div className="wn-profile">
      <div className="wn-profile-header">
        <img
          src={aboutData.profileImage}
          alt={aboutData.name}
          className="wn-profile-avatar"
        />
        <div className="wn-profile-identity">
          <div className="wn-profile-name">{aboutData.name}</div>
          <div className="wn-profile-title">{aboutData.title}</div>
        </div>
      </div>

      <p className="wn-profile-bio">
        {bio.map((part, i) =>
          part.hl ? (
            <span key={i} className="wn-hl">{part.text}</span>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </p>

      <div className="wn-profile-meta">
        <div className="wn-meta-row">
          <span className="wn-meta-label">strengths</span>
          <span className="wn-meta-value">{aboutData.more.strengths}</span>
        </div>
        <div className="wn-meta-row">
          <span className="wn-meta-label">currently</span>
          <span className="wn-meta-value">{aboutData.more.currently}</span>
        </div>
        <div className="wn-meta-row">
          <span className="wn-meta-label">values</span>
          <span className="wn-meta-value">{aboutData.more.values}</span>
        </div>
      </div>

      <div className="wn-profile-likes">
        {aboutData.likes.map(like => (
          <span key={like} className="wn-pill">{like}</span>
        ))}
      </div>
    </div>
  );
}
