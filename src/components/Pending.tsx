export function ImagePending({
  label,
  width,
  height,
  className = '',
  tone = 'light',
  src,
  alt,
}: {
  label: string
  width: number
  height: number
  className?: string
  tone?: 'light' | 'dark'
  /** once a real screenshot is available, pass its path here to swap the placeholder for the real image */
  src?: string
  alt?: string
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? label}
        width={width}
        height={height}
        className={className}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        loading="lazy"
      />
    )
  }

  return (
    <div
      className={`pending${tone === 'dark' ? ' pending-dark' : ''} caption-brand flex items-center justify-center p-4 text-center ${className}`}
      style={{ width: '100%', aspectRatio: `${width} / ${height}`, maxWidth: width }}
      role="img"
      aria-label={label}
    >
      {label}
    </div>
  )
}

export function TextPending({
  children,
  tone = 'light',
}: {
  children: React.ReactNode
  tone?: 'light' | 'dark'
}) {
  return (
    <span className={`pending${tone === 'dark' ? ' pending-dark' : ''} rounded px-1.5 py-0.5`}>
      {children}
    </span>
  )
}
