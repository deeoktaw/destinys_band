type IconProps = { title?: string };

export function IconPlay({ title = 'Play' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  );
}

export function IconPause({ title = 'Pause' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M7 5h3.5v14H7V5zm6.5 0H17v14h-3.5V5z" />
    </svg>
  );
}

export function IconNext({ title = 'Next' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M6 6.5v11l8.5-5.5L6 6.5zM16.5 6H18v12h-1.5V6z" />
    </svg>
  );
}
