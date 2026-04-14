import Link from "next/link";

const socialGlobe =
  "https://www.figma.com/api/mcp/asset/b7201899-0003-4598-9f5e-1af229528bab";
const socialShare =
  "https://www.figma.com/api/mcp/asset/ab0a2ee4-2697-4578-acba-184c55e4f210";

export function Footer() {
  return (
    <footer className="border-t border-[#d1d1d1] bg-[#fafafa]">
      <div className="mx-auto max-w-[1280px] px-6 pb-12 pt-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4 pb-5">
            <p className="font-body text-xl font-bold text-dark">
              ScholarIT Academic Archive
            </p>
            <p className="max-w-xs font-body text-sm text-muted">
              Membangun infrastruktur pembelajaran berbasis AI tercanggih untuk
              generasi pemimpin IT masa depan
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="pb-2 font-body text-sm font-bold text-dark">
                Platform
              </p>
              <ul className="space-y-3 pt-3">
                <li>
                  <Link
                    href="#"
                    className="font-body text-sm text-muted hover:text-dark"
                  >
                    Jalur Belajar
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="font-body text-sm text-muted hover:text-dark"
                  >
                    Sertifikasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="font-body text-sm text-muted hover:text-dark"
                  >
                    Institusi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="pb-2 font-body text-sm font-bold text-dark">
                Legal
              </p>
              <ul className="space-y-3 pt-3">
                <li>
                  <Link
                    href="#"
                    className="font-body text-sm text-muted hover:text-dark"
                  >
                    Ketentuan Layanan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="font-body text-sm text-muted hover:text-dark"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="pb-2 font-body text-sm font-bold text-dark">
                Hubungi
              </p>
              <ul className="space-y-3 pt-3">
                <li>
                  <Link
                    href="#"
                    className="font-body text-sm text-muted hover:text-dark"
                  >
                    Dukungan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="font-body text-sm text-muted hover:text-dark"
                  >
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[#d1d1d1] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="font-body text-sm text-muted">© 2026 PersonaLearn</p>
            <div className="flex gap-6">
              <a href="#" className="size-5" aria-label="Bahasa">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={socialGlobe} alt="" className="size-5" />
              </a>
              <a href="#" className="size-5" aria-label="Bagikan">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={socialShare} alt="" className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
