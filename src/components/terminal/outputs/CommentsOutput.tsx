import { useEffect, useRef, useState } from 'react'
import { useComments } from '../../../hooks/useComments'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

interface Props {
  mode: 'list' | 'post'
  name?: string
  message?: string
}

export default function CommentsOutput({ mode, name, message }: Props) {
  if (mode === 'post') {
    return <PostMode name={name} message={message} />
  }
  return <ListMode />
}

function ListMode() {
  const { comments, loading, error } = useComments()

  if (loading) return <span className="text-dim">loading comments...</span>
  if (error) return <span className="error-text">error: {error}</span>

  return (
    <div className="comments-output">
      <div className="output-divider">── guestbook ({comments.length} comments) ──</div>
      {comments.length === 0 ? (
        <div className="text-dim" style={{ padding: '4px 0' }}>no comments yet. be the first!</div>
      ) : (
        comments.map(c => (
          <div key={c.id} className="comment-entry">
            <div className="comment-header">
              <span className="comment-name">{c.name}</span>
              <span className="comment-time">{timeAgo(c.created_at)}</span>
            </div>
            <div className="comment-body">{c.message}</div>
          </div>
        ))
      )}
      <div className="output-divider">── end ──</div>
      <div className="text-dim">usage: comments post &lt;name&gt; &lt;message&gt;</div>
    </div>
  )
}

function PostMode({ name, message }: { name?: string; message?: string }) {
  const { postComment } = useComments()
  const posted = useRef(false)
  const [status, setStatus] = useState<'posting' | 'done' | 'error'>('posting')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (posted.current || !name || !message) return
    posted.current = true

    postComment(name, message).then(err => {
      if (err) {
        setErrorMsg(err)
        setStatus('error')
      } else {
        setStatus('done')
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!name || !message) {
    return <span className="error-text">usage: comments post &lt;name&gt; &lt;message&gt;</span>
  }

  if (status === 'posting') return <span className="text-dim">posting...</span>
  if (status === 'error') return <span className="error-text">error: {errorMsg}</span>

  return <span className="comment-success">comment posted!</span>
}
