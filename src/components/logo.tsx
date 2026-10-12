export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M13.6 2 4.8 13.4h6.1L9.4 22l9.8-12.6h-6.3z" />
      <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M1.5 9.5h3.5M1 13.4h1.6M19.5 13.5H23" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <LogoMark className="size-6" />
      <span className="font-display text-[1.65rem] leading-none tracking-[-0.03em]">lightcash</span>
    </span>
  );
}
