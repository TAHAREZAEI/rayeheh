/** مهر طلاییِ برند — امضای نهایی هر بخش */
export default function Seal({ className = '', size = 'md' }) {
  const dim = size === 'lg' ? 'w-24 h-24' : size === 'sm' ? 'w-12 h-12' : 'w-16 h-16'
  return (
    <div
      className={`seal-ring flex items-center justify-center ${dim} ${className} animate-spin-slow`}
      aria-hidden="true"
    >
      <span
        className={`flex items-center justify-center rounded-full bg-saffron font-display text-ink ${
          size === 'lg' ? 'w-16 h-16 text-3xl' : size === 'sm' ? 'w-8 h-8 text-base' : 'w-10 h-10 text-xl'
        }`}
      >
        ر
      </span>
    </div>
  )
}
