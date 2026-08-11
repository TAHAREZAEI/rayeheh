export default function SectionHeading({ eyebrow, title, center = false, light = true }) {
  return (
    <div className={center ? 'flex flex-col items-center text-center' : ''}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={`section-title mt-3 ${light ? '' : 'text-ink'}`}>{title}</h2>
    </div>
  )
}
