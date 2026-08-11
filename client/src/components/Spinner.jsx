export default function Spinner({ className = 'h-8 w-8' }) {
  return (
    <svg className={`animate-spin text-saffron ${className}`} viewBox="0 0 24 24" fill="none" aria-label="در حال بارگذاری">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
