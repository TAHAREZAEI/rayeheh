import { Link } from 'react-router-dom'

export default function EmptyState({ icon = '🫙', title, text, action, to = '/shop' }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-mist/10 bg-ink-light/40 px-8 py-16 text-center">
      <span className="text-5xl" aria-hidden="true">{icon}</span>
      <h3 className="font-display text-xl text-mist">{title}</h3>
      {text && <p className="max-w-md text-sm leading-7 text-mist/60">{text}</p>}
      {action && (
        <Link to={to} className="btn-gold mt-3">
          {action}
        </Link>
      )}
    </div>
  )
}
