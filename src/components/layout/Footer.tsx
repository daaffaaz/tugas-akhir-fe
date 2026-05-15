function BookIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="#1c1c1c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke="#1c1c1c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e0e0e0] bg-[#fafafa]">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-6 py-8 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded bg-gold">
            <BookIcon />
          </span>
          <span className="font-heading text-base font-extrabold tracking-tight text-dark">
            PersonaLearn
          </span>
        </div>
        <p className="font-body text-xs font-medium text-muted">
          © {new Date().getFullYear()} PersonaLearn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
