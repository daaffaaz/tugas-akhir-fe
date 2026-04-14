const bookIcon =
  "https://www.figma.com/api/mcp/asset/84c7f18e-14ba-4f2c-b070-3de9f3b4dbc7";

type AuthBrandPanelProps = {
  badgeLabel: string;
  /** e.g. login: yellow bg overlay on right; register: solid dark left */
  variant: "login" | "register";
};

export function AuthBrandPanel({ badgeLabel, variant }: AuthBrandPanelProps) {
  if (variant === "register") {
    return (
      <div className="relative flex h-full min-h-screen flex-col justify-between overflow-hidden bg-[#231f0f] p-12 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          aria-hidden
        >
          <div className="absolute -left-8 bottom-[-51px] h-[614px] w-96 rounded-xl bg-dark blur-[50px]" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded bg-gold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bookIcon} alt="" className="h-4 w-[22px]" />
          </div>
          <span className="font-heading text-2xl font-extrabold tracking-tight">
            PersonaLearn
          </span>
        </div>
        <div className="relative z-10 max-w-lg space-y-6 pb-1">
          <div className="flex h-8 w-[232px] items-center justify-center rounded bg-gold">
            <span className="font-heading text-sm font-extrabold text-dark">
              {badgeLabel}
            </span>
          </div>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.1] tracking-tight">
            Desain Jalur Belajarmu Sendiri
          </h1>
          <p className="max-w-xl font-body text-lg font-medium leading-relaxed text-[#e5e5e0]/80">
            PersonaLearn membantu kamu mengkurasi materi terbaik dari berbagai
            platform MOOC menjadi satu jalur belajar yang terstruktur.
          </p>
        </div>
        <div className="relative z-10 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <p className="font-heading text-2xl font-extrabold tracking-tight">
            Coba sekarang dan rasakan manfaatnya
          </p>
          <p className="mt-1 font-body text-lg font-medium text-[#e5e5e0]/80">
            PersonaLearn
          </p>
        </div>
      </div>
    );
  }

  /* login: right column — gradient overlay on gold per Figma */
  return (
    <div
      className="relative flex h-full min-h-screen flex-col justify-between overflow-hidden p-12 text-white"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(26, 26, 26, 0.92) 0%, rgba(26, 26, 26, 0.92) 100%), linear-gradient(90deg, rgb(255, 206, 0) 0%, rgb(255, 206, 0) 100%)",
      }}
    >
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded bg-gold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bookIcon} alt="" className="h-4 w-[22px]" />
        </div>
        <span className="font-heading text-2xl font-extrabold tracking-tight">
          PersonaLearn
        </span>
      </div>
      <div className="relative z-10 max-w-lg space-y-6">
        <div className="inline-flex rounded bg-gold px-3 py-1">
          <span className="font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-dark">
            {badgeLabel}
          </span>
        </div>
        <h1 className="font-heading text-5xl font-extrabold leading-[1.1] tracking-tight">
          Desain Jalur Belajarmu Sendiri
        </h1>
        <p className="font-body text-lg font-medium leading-relaxed text-[#e5e5e0]/80">
          PersonaLearn membantu kamu mengkurasi materi terbaik dari berbagai
          platform MOOC menjadi satu jalur belajar yang terstruktur.
        </p>
      </div>
      <div className="relative z-10 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <p className="font-heading text-2xl font-extrabold tracking-tight">
          Coba sekarang dan rasakan manfaatnya
        </p>
        <p className="mt-1 font-body text-sm font-medium text-[#e5e5e0]/60">
          PersonaLearn
        </p>
      </div>
    </div>
  );
}
