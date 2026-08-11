import { Link } from 'react-router-dom'

export default function Logo({ light = true, className = '' }) {
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`} aria-label="رایحه — صفحهٔ نخست">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron font-display text-2xl leading-none text-ink shadow-glow transition-transform duration-500 group-hover:rotate-12">
        ر
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`font-display text-2xl ${light ? 'text-mist' : 'text-ink'}`}>رایحه</span>
        <span className={`text-[9px] tracking-widest2 ${light ? 'text-saffron' : 'text-saffron-dark'}`}>
          RAYEHEH · PARFUM
        </span>
      </span>
    </Link>
  )
}
