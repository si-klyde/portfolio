import { useState } from 'react';
import BrowserChrome from './BrowserChrome';
import projects from '../../data/projects.json';
import about from '../../data/about.json';

type View = { kind: 'list' } | { kind: 'detail'; index: number };

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Python: '#3572a5',
  Dockerfile: '#384d54',
  React: '#61dafb',
  'Next.js': '#61dafb',
  Express: '#f1e05a',
  'Node.js': '#f1e05a',
  Solidity: '#aa6746',
  Flask: '#3572a5',
  FastAPI: '#3572a5',
  PostgreSQL: '#336791',
  Redis: '#d82c20',
  Firebase: '#ffca28',
  Docker: '#2496ed',
  WebSocket: '#61dafb',
  'Tailwind CSS': '#38bdf8',
  OpenAI: '#10a37f',
  Pinecone: '#0ea47a',
  Selenium: '#43b02a',
  'Google Cloud STT/TTS': '#4285f4',
  'twitterapi.io': '#1da1f2',
  ThreadPoolExecutor: '#3572a5',
};

interface FileEntry {
  name: string;
  icon: string;
  msg: string;
  age: string;
}

function getFileTree(tech: string[]): FileEntry[] {
  const primary = tech[0];
  const entries: FileEntry[] = [];

  if (tech.includes('Docker')) {
    entries.push({ name: 'Dockerfile', icon: '🐳', msg: 'containerize app', age: '2 months ago' });
  }
  if (tech.includes('React') || tech.includes('Next.js')) {
    entries.push({ name: 'src/', icon: '📁', msg: 'refactor components', age: '3 weeks ago' });
  }
  if (tech.includes('Python') || tech.includes('FastAPI') || tech.includes('Flask')) {
    entries.push({ name: 'app/', icon: '📁', msg: 'add route handlers', age: '4 weeks ago' });
  }
  if (tech.includes('Solidity')) {
    entries.push({ name: 'contracts/', icon: '📁', msg: 'upgrade escrow logic', age: '1 month ago' });
  }
  if (tech.includes('Express') || tech.includes('Node.js')) {
    entries.push({ name: 'package.json', icon: '📦', msg: 'bump dependencies', age: '2 weeks ago' });
  }
  if (tech.includes('PostgreSQL')) {
    entries.push({ name: 'migrations/', icon: '📁', msg: 'add index', age: '5 weeks ago' });
  }

  if (primary === 'Python' || tech.includes('FastAPI') || tech.includes('Flask')) {
    entries.push({ name: 'requirements.txt', icon: '📄', msg: 'pin versions', age: '3 weeks ago' });
  } else {
    entries.push({ name: 'tsconfig.json', icon: '📄', msg: 'strict mode', age: '2 months ago' });
  }

  entries.push({ name: '.env.example', icon: '📄', msg: 'add template', age: '2 months ago' });
  entries.push({ name: 'README.md', icon: '📄', msg: 'update docs', age: '1 week ago' });

  return entries.slice(0, 5);
}

function fileIcon(name: string): string {
  if (name.endsWith('/')) return '📁';
  if (name === 'Dockerfile' || name === 'docker-compose.yml') return '🐳';
  if (name === 'package.json' || name === 'requirements.txt') return '📦';
  if (name === 'LICENSE') return '📜';
  return '📄';
}

interface LangEntry { name: string; pct: number; color: string }

function getLangEntries(p: typeof projects[number]): LangEntry[] {
  if (p.languages) {
    const total = Object.values(p.languages).reduce((a, b) => a + b, 0);
    return Object.entries(p.languages).map(([name, bytes]) => ({
      name,
      pct: (bytes / total) * 100,
      color: LANG_COLORS[name] ?? '#8b949e',
    }));
  }
  return p.tech.map(t => ({
    name: t,
    pct: 100 / p.tech.length,
    color: LANG_COLORS[t] ?? '#8b949e',
  }));
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-');
}

export default function GitHubBrowser() {
  const [view, setView] = useState<View>({ kind: 'list' });

  if (view.kind === 'detail') {
    const p = projects[view.index];
    const repoPath = p.github ?? `private/${slugify(p.title)}`;
    const owner = repoPath.split('/')[0];
    const repo = repoPath.split('/').slice(1).join('/') || slugify(p.title);
    const isPublic = !!p.github;
    const stats = p.stats ?? { stars: 0, forks: 0, watchers: 0 };

    const fileEntries: FileEntry[] = p.files
      ? p.files.map(f => ({ name: f.name, icon: fileIcon(f.name), msg: f.msg, age: f.age }))
      : getFileTree(p.tech);

    const langs = getLangEntries(p);

    return (
      <BrowserChrome
        url={`github.com/${repoPath}`}
        tabTitle={`${owner}/${repo}`}
        tabFavicon="&#9783;"
        onBack={() => setView({ kind: 'list' })}
      >
        <div className="gh-page">
          <div className="gh-detail-nav">
            <span className="gh-breadcrumb">
              <span className="gh-breadcrumb-owner">{owner}</span>
              <span className="gh-breadcrumb-sep">/</span>
              <span className="gh-breadcrumb-repo">{repo}</span>
            </span>
            <span className="gh-visibility-badge">
              {isPublic ? 'Public' : 'Private'}
            </span>
            <div className="gh-action-buttons">
              <span className="gh-action-btn">&#9734; Star <span className="gh-action-count">{stats.stars}</span></span>
              <span className="gh-action-btn">&#9095; Fork <span className="gh-action-count">{stats.forks}</span></span>
              <span className="gh-action-btn">&#9673; Watch <span className="gh-action-count">{stats.watchers}</span></span>
            </div>
          </div>

          <div className="gh-detail-tabs">
            <span className="gh-detail-tab active">&#128196; Code</span>
            <span className="gh-detail-tab">&#9675; Issues <span className="gh-tab-count">0</span></span>
            <span className="gh-detail-tab">&#8644; Pull requests <span className="gh-tab-count">0</span></span>
          </div>

          <div className="gh-detail-content">
            <div className="gh-detail-main">
              <div className="gh-file-tree">
                <div className="gh-file-tree-header">
                  <span className="gh-branch-label">&#9095; {p.defaultBranch ?? 'main'}</span>
                </div>
                <table className="gh-file-tree-table">
                  <tbody>
                    {fileEntries.map(f => (
                      <tr key={f.name} className="gh-file-tree-row">
                        <td className="gh-file-tree-icon">{f.icon}</td>
                        <td className="gh-file-tree-name">{f.name}</td>
                        <td className="gh-file-tree-msg">{f.msg}</td>
                        <td className="gh-file-tree-age">{f.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="gh-readme-section">
                <div className="gh-readme-header">README.md</div>
                <div className="gh-readme-body">
                  <h2>{p.title}</h2>
                  <p>{p.readme?.tagline ?? p.description}</p>
                  {p.readme?.body && <p>{p.readme.body}</p>}

                  {p.readme?.sections && p.readme.sections.length > 0 && (
                    <>
                      <h3>Key Features</h3>
                      {p.readme.sections.map(s => (
                        <div key={s.heading} className="gh-readme-feature">
                          <h4>{s.heading}</h4>
                          <p>{s.text}</p>
                        </div>
                      ))}
                    </>
                  )}

                  {p.features.length > 0 && (!p.readme?.sections || p.readme.sections.length === 0) && (
                    <>
                      <h3>Features</h3>
                      <ul>
                        {p.features.map(f => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {p.readme?.techTable && p.readme.techTable.length > 0 ? (
                    <>
                      <h3>Tech Stack</h3>
                      <table className="gh-readme-tech-table">
                        <tbody>
                          {p.readme.techTable.map(([layer, tech]) => (
                            <tr key={layer}>
                              <td><strong>{layer}</strong></td>
                              <td>{tech}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <>
                      <h3>Tech Stack</h3>
                      <ul>
                        {p.tech.map(t => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {p.role && (
                    <p className="gh-readme-role">Role: {p.role}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="gh-detail-sidebar">
              <div className="gh-sidebar-section">
                <span className="gh-about-heading">About</span>
                <p className="gh-detail-desc">{p.description}</p>
                <div className="gh-detail-topics">
                  {p.tech.map(t => (
                    <span key={t} className="gh-topic-tag">{t.toLowerCase()}</span>
                  ))}
                </div>
                <span className="gh-discipline-badge">{p.discipline}</span>
              </div>

              <div className="gh-sidebar-section">
                <span className="gh-about-heading">Languages</span>
                <div className="gh-lang-bar">
                  {langs.map(l => (
                    <span
                      key={l.name}
                      className="gh-lang-bar-segment"
                      style={{ width: `${l.pct}%`, backgroundColor: l.color }}
                    />
                  ))}
                </div>
                <div className="gh-lang-legend">
                  {langs.map(l => (
                    <span key={l.name} className="gh-lang-legend-item">
                      <span
                        className="gh-lang-dot"
                        style={{ backgroundColor: l.color }}
                      />
                      {l.name}
                      <span className="gh-lang-pct">{l.pct.toFixed(1)}%</span>
                    </span>
                  ))}
                </div>
              </div>

              {isPublic && (
                <div className="gh-sidebar-section">
                  <span className="gh-about-heading">Links</span>
                  <a
                    className="gh-sidebar-link"
                    href={`https://github.com/${p.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    &#128279; github.com/{p.github}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </BrowserChrome>
    );
  }

  return (
    <BrowserChrome
      url="github.com/si-klyde"
      tabTitle="si-klyde (Clyde Baclao)"
      tabFavicon="&#9783;"
    >
      <div className="gh-page">
        <div className="gh-profile-header">
          <img
            className="gh-avatar"
            src={about.profileImage}
            alt={about.name}
          />
          <div className="gh-profile-info">
            <span className="gh-display-name">{about.name}</span>
            <span className="gh-username">si-klyde</span>
          </div>
        </div>

        <div className="gh-tab-bar">
          <span className="gh-tab active">
            Repositories
            <span className="gh-tab-count">{projects.length}</span>
          </span>
          <span className="gh-tab">Stars</span>
        </div>

        <div className="gh-repo-list">
          {projects.map((p, i) => (
            <div
              key={p.title}
              className="gh-repo-item"
              onClick={() => setView({ kind: 'detail', index: i })}
            >
              <div className="gh-repo-name-row">
                <span className="gh-repo-name">{p.title}</span>
                <span className="gh-repo-visibility">
                  {p.github ? 'Public' : 'Private'}
                </span>
              </div>
              <div className="gh-repo-desc">{p.description}</div>
              <div className="gh-repo-meta">
                <span className="gh-repo-lang">
                  <span className="gh-lang-dot" data-lang={p.tech[0]} />
                  {p.tech[0]}
                </span>
                <span className="gh-repo-stars">&#9734; {p.stats?.stars ?? 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrowserChrome>
  );
}
