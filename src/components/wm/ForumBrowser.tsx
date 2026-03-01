import BrowserChrome from './BrowserChrome';

export default function ForumBrowser() {
  return (
    <BrowserChrome
      url="reddit.com/r/clydedev/comments/welcome"
      tabTitle="r/clydedev - welcome"
      tabFavicon="&#129302;"
    >
      <div className="forum-page">
        <div className="forum-thread">
          <div className="forum-thread-sidebar">
            <span className="forum-vote-up">&#9650;</span>
            <span className="forum-vote-count">1</span>
            <span className="forum-vote-down">&#9660;</span>
          </div>
          <div className="forum-thread-main">
            <div className="forum-post-meta">
              <span className="forum-subreddit">r/clydedev</span>
              <span className="forum-meta-dot">&middot;</span>
              <span className="forum-meta-text">Posted by</span>
              <span className="forum-author">u/clyde</span>
              <span className="forum-time">&middot; just now</span>
            </div>
            <div className="forum-post-title">welcome &mdash; leave a comment</div>
            <div className="forum-post-body">
              guestbook. supabase integration coming soon &mdash; for now, enjoy the aesthetic.
            </div>
            <div className="forum-post-actions">
              <span className="forum-post-action">&#128172; 0 Comments</span>
              <span className="forum-post-action">&#8593; Share</span>
              <span className="forum-post-action">&#9733; Save</span>
              <span className="forum-post-action">&#8943; &middot;&middot;&middot;</span>
            </div>

            <div className="forum-divider" />

            <div className="forum-comment-wrap">
              <div className="forum-comment-label">Comment as <span>guest</span></div>
              <div className="forum-comment-box">What are your thoughts?</div>
              <div className="forum-comment-toolbar">
                <button className="forum-comment-submit" disabled>Comment</button>
              </div>
            </div>

            <div className="forum-sort-bar">
              <span className="forum-sort-label">Sort By</span>
              <span className="forum-sort-active">Best &#9662;</span>
            </div>

            <div className="forum-divider" />

            <div className="forum-empty-state">
              <span className="forum-empty-icon">&#128172;</span>
              <span className="forum-empty-text">No Comments Yet</span>
            </div>
            <div className="forum-empty-sub">Be the first to share what you think!</div>
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}
