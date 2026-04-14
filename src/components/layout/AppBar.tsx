import Link from "next/link";

const imgUserProfile =
  "https://www.figma.com/api/mcp/asset/6f86e31f-7eaa-42bd-88e3-a103780b30a3";

export function AppBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f0f0f0] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between py-4 pl-6 pr-6">
        <Link
          href="/"
          className="font-heading text-xl font-extrabold tracking-tight text-dark"
        >
          PersonaLearn
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <Link
            href="#"
            className="font-heading text-base font-semibold text-[#4a4a4a]"
          >
            Learning Path
          </Link>
          <Link
            href="#"
            className="font-heading text-base font-semibold text-[#4a4a4a]"
          >
            Courses
          </Link>
        </nav>
        <div className="flex items-center">
          <div className="size-8 overflow-hidden rounded-full border border-[#e0e0e0] bg-[#f0f0f0] p-px">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUserProfile}
              alt="Profil pengguna"
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
