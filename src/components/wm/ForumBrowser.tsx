import { useState } from 'react'
import BrowserChrome from './BrowserChrome'
import { useComments } from '../../hooks/useComments'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function ForumBrowser() {
  const { comments, loading, error, posting, postComment } = useComments()
  const [nameInput, setNameInput] = useState('')
  const [msgInput, setMsgInput] = useState('')
  const [postError, setPostError] = useState<string | null>(null)

  const canSubmit = nameInput.trim().length > 0 && msgInput.trim().length > 0 && !posting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setPostError(null)
    const err = await postComment(nameInput.trim(), msgInput.trim())
    if (err) {
      setPostError(err)
    } else {
      setNameInput('')
      setMsgInput('')
    }
  }

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
              guestbook. drop a message below.
            </div>
            <div className="forum-post-actions">
              <span className="forum-post-action">&#128172; {comments.length} Comments</span>
              <span className="forum-post-action">&#8593; Share</span>
              <span className="forum-post-action">&#9733; Save</span>
              <span className="forum-post-action">&#8943; &middot;&middot;&middot;</span>
            </div>

            <div className="forum-divider" />

            <div className="forum-comment-wrap">
              <div className="forum-comment-label">Comment as <span>guest</span></div>
              <input
                className="forum-name-input"
                type="text"
                placeholder="name"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                maxLength={50}
              />
              <textarea
                className="forum-comment-textarea"
                placeholder="What are your thoughts?"
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <div className="forum-comment-toolbar">
                {postError && <span className="forum-post-error">{postError}</span>}
                <button
                  className="forum-comment-submit"
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                >
                  {posting ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </div>

            <div className="forum-sort-bar">
              <span className="forum-sort-label">Sort By</span>
              <span className="forum-sort-active">New &#9662;</span>
            </div>

            <div className="forum-divider" />

            {loading && (
              <div className="forum-loading">
                <div className="forum-skeleton" />
                <div className="forum-skeleton forum-skeleton-short" />
              </div>
            )}

            {error && !loading && (
              <div className="forum-error">failed to load comments: {error}</div>
            )}

            {!loading && !error && comments.length === 0 && (
              <>
                <div className="forum-empty-state">
                  <span className="forum-empty-icon">&#128172;</span>
                  <span className="forum-empty-text">No Comments Yet</span>
                </div>
                <div className="forum-empty-sub">Be the first to share what you think!</div>
              </>
            )}

            {!loading && comments.map(c => (
              <div key={c.id} className="forum-comment">
                <div className="forum-comment-vote-col">
                  <span className="forum-vote-up forum-vote-sm">&#9650;</span>
                  <span className="forum-vote-down forum-vote-sm">&#9660;</span>
                </div>
                <div className="forum-comment-content">
                  <div className="forum-comment-meta">
                    <span className="forum-comment-author">{c.name}</span>
                    <span className="forum-meta-dot">&middot;</span>
                    <span className="forum-comment-age">{timeAgo(c.created_at)}</span>
                  </div>
                  <div className="forum-comment-text">{c.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserChrome>
  )
}
