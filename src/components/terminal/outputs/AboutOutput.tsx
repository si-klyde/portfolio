import aboutData from '../../../data/about.json';

export default function AboutOutput() {
  return (
    <div>
      <div className="output-heading">{aboutData.name}</div>
      <div><span className="output-label">role: </span><span className="output-value">{aboutData.title}</span></div>
      <div><span className="output-label">focus: </span><span className="output-value">{aboutData.more.strengths}</span></div>
      <div><span className="output-label">status: </span><span className="output-value">{aboutData.more.currently}</span></div>
      <div><span className="output-label">values: </span><span className="output-value">{aboutData.more.values}</span></div>
      <div className="output-divider">---</div>
      <div>{aboutData.bio.text}</div>
      <div style={{ marginTop: 4 }}>{aboutData.more.paragraph}</div>
      <div className="output-divider">---</div>
      <div className="output-label">likes:</div>
      {aboutData.likes.map(like => (
        <div key={like}>  - {like}</div>
      ))}
    </div>
  );
}
