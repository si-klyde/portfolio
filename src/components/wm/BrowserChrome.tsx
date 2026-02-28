import type { ReactNode } from 'react';

interface BrowserChromeProps {
  url: string;
  tabTitle: string;
  tabFavicon?: string;
  onBack?: () => void;
  children: ReactNode;
}

export default function BrowserChrome({ url, tabTitle, tabFavicon, onBack, children }: BrowserChromeProps) {
  const urlParts = url.split('/');
  const domain = urlParts.slice(0, 1).join('/');
  const path = urlParts.length > 1 ? '/' + urlParts.slice(1).join('/') : '';

  return (
    <div className="browser-chrome">
      <div className="browser-tabs">
        <div className="browser-tab active">
          {tabFavicon && (
            <span className="browser-tab-favicon">{tabFavicon}</span>
          )}
          <span className="browser-tab-title">{tabTitle}</span>
          <span className="browser-tab-close">&times;</span>
        </div>
      </div>
      <div className="browser-toolbar">
        <div className="browser-nav">
          <button
            className="browser-nav-btn"
            disabled={!onBack}
            onClick={onBack}
          >
            &#8592;
          </button>
          <button className="browser-nav-btn" disabled>&#8594;</button>
          <button className="browser-nav-btn" disabled>&#8635;</button>
        </div>
        <div className="browser-url-bar">
          <span className="browser-url-lock">&#128274;</span>
          <span className="browser-url-text">
            {domain}
            {path && <span className="browser-url-path">{path}</span>}
          </span>
        </div>
        <div className="browser-toolbar-right">
          <span className="browser-toolbar-btn">&#9734;</span>
          <span className="browser-toolbar-btn">&#8942;</span>
        </div>
      </div>
      <div className="browser-viewport">
        {children}
      </div>
    </div>
  );
}
