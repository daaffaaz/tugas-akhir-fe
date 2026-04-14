import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { primaryCtaIconHover, primaryGoldCtaBase } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

const imgHero =
  "https://www.figma.com/api/mcp/asset/3b36dc2d-b5f6-4066-94e1-512d303ebc3e";
const imgFeatureBg =
  "https://www.figma.com/api/mcp/asset/05419962-4c46-4b83-9470-8bf68ef24a78";
const imgArrowCta =
  "https://www.figma.com/api/mcp/asset/466f9fb2-2fd0-4c5a-8ee1-e103564f260b";
const imgIconShield =
  "https://www.figma.com/api/mcp/asset/ae50cdc2-5b98-4827-9984-2c5788e5179a";
const imgIconPeople =
  "https://www.figma.com/api/mcp/asset/263d8da6-c439-4221-aaed-6e0474c4b964";
const imgIconBrain =
  "https://www.figma.com/api/mcp/asset/f5f46ef1-bdb2-4e32-93cb-5bc5370a8b02";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-body text-dark">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="border-b border-transparent bg-white pb-16 pt-24 md:pb-32 md:pt-28">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col gap-4">
              <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-dark md:text-[56px] md:leading-[70px] md:tracking-[-0.05em]">
                <span className="block">Susun Jalur Belajarmu</span>
                <span className="block bg-gradient-to-r from-gold to-[#ca0] bg-clip-text text-transparent">
                  Raih Karier Impian
                </span>
              </h1>
              <p className="max-w-lg pt-1 font-body text-lg text-muted md:text-xl md:leading-[32.5px]">
                Hentikan kebimbangan memilih kursus. Dapatkan rekomendasi
                learning path yang dirancang khusus berdasarkan kemampuan dan
                target karier spesifikmu.
              </p>
              <div className="pt-6">
                <Link
                  href="/register"
                  className={cn(
                    primaryGoldCtaBase,
                    "group inline-flex items-center gap-2 rounded px-8 py-[18px] font-body text-lg font-bold",
                  )}
                >
                  Mulai Sekarang
                  <Image
                    src={imgArrowCta}
                    alt=""
                    width={16}
                    height={16}
                    className={cn("size-4", primaryCtaIconHover)}
                    unoptimized
                  />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-64 rounded-xl bg-[rgba(255,241,184,0.3)] blur-[32px]"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-lg border border-[rgba(209,209,209,0.1)] bg-white p-[17px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="relative aspect-[550/353] w-full overflow-hidden">
                  <Image
                    src={imgHero}
                    alt="Ilustrasi pembelajaran"
                    fill
                    className="object-contain object-center"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value proposition + bento */}
        <section className="bg-[#fafafa] py-16 md:py-24">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-dark md:text-4xl md:leading-10 md:tracking-[-0.025em]">
                Sering Merasa Tersesat di Tengah Ribuan Kursus Online?
              </h2>
            </div>
            <p className="mx-auto max-w-2xl text-center font-body text-lg text-muted md:text-lg md:leading-7">
              Kami memahami bahwa Information Overload adalah hambatan nyata.
              PersonaLearn hadir bukan hanya untuk memberikan daftar kursus,
              tetapi membangun infrastruktur belajar yang dipersonalisasi sesuai
              profil unikmu
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:grid-rows-[auto_auto]">
              {/* Large card — spans 8 cols row 1 */}
              <div className="relative overflow-hidden rounded-lg bg-white p-10 md:col-span-8 md:row-start-1">
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 w-1/5 skew-x-[-12deg] bg-[rgba(255,206,0,0.05)]"
                  aria-hidden
                />
                <div className="relative max-w-xl">
                  <div className="mb-6 flex size-12 items-center justify-center rounded bg-[#fff1b8]">
                    <Image
                      src={imgIconBrain}
                      alt=""
                      width={24}
                      height={25}
                      className="h-[25px] w-6"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-body text-3xl font-bold text-dark">
                    Belajar Lebih Cerdas dengan Personalisasi AI
                  </h3>
                  <p className="mt-4 max-w-md font-body text-lg text-muted md:leading-7">
                    Algoritma kami menganalisis keahlianmu saat ini dan
                    mengidentifikasi celah kompetensi secara dinamis. Tidak ada
                    lagi pengulangan materi yang sudah kamu kuasai.
                  </p>
                  
                </div>
              </div>

              {/* Small dark card — 4 cols row 1 */}
              <div className="relative min-h-[280px] rounded-lg bg-dark p-10 text-white md:col-span-4 md:row-start-1">
                <Image
                  src={imgIconShield}
                  alt=""
                  width={24}
                  height={30}
                  className="mb-6 h-[30px] w-6"
                  unoptimized
                />
                <h3 className="font-body text-2xl font-bold">
                  Kredibilitas Institusi & Industri
                </h3>
                <p className="mt-4 font-body text-base leading-relaxed text-white/80">
                  Setiap jalur belajar dikurasi dari platform MOOC ternama
                  (Coursera, Udemy, ICEI) untuk memastikan sertifikasi yang kamu
                  ambil memiliki bobot di pasar kerja internasional.
                </p>
              </div>

              {/* Medium grey — 4 cols row 2 */}
              <div className="min-h-[260px] rounded-lg bg-[#ebebeb] p-10 md:col-span-4 md:row-start-2">
                <Image
                  src={imgIconPeople}
                  alt=""
                  width={36}
                  height={18}
                  className="mb-6 h-[18px] w-9"
                  unoptimized
                />
                <h3 className="font-body text-2xl font-bold text-dark">
                  Kontrol Penuh Jalur Belajarmu
                </h3>
                <p className="mt-4 font-body text-base text-muted md:leading-6">
                  Merasa sudah menguasai materi tertentu? kamu bisa memodifikasi
                  jalur belajarmu secara instan, pegang kendali penuh atas
                  efisiensi waktu belajarmu.
                </p>
              </div>

              {/* Wide image card — 8 cols row 2 */}
              <div className="relative min-h-[280px] overflow-hidden rounded-lg p-10 md:col-span-8 md:row-start-2">
                <div className="absolute inset-0">
                  <Image
                    src={imgFeatureBg}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 768px) 66vw, 100vw"
                    unoptimized
                  />
                  <div
                    className="absolute inset-0 bg-white mix-blend-saturation"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 bg-[rgba(26,26,26,0.85)]"
                    aria-hidden
                  />
                </div>
                <div className="relative z-10 flex max-w-md flex-col gap-4">
                  <h3 className="font-body text-2xl font-bold text-white md:text-[28px] md:leading-9">
                    Kurasi Materi Berbasis Kompetensi
                  </h3>
                  <p className="font-body text-lg text-white/70 md:leading-7">
                    Tidak perlu lagi membandingkan puluhan silabus secara manual.
                    Sistem kami memilihkan materi yang paling relevan dengan
                    standar industri dan target karier spesifik Anda.
                  </p>
                  <Link
                    href="#"
                    className={cn(
                      primaryGoldCtaBase,
                      "mt-2 inline-flex w-fit rounded px-6 py-2 font-body text-base font-bold",
                    )}
                  >
                    Lihat Daftar Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-6 md:grid-cols-4 md:gap-8">
            {[
              { value: "3+", label: "Integrasi Platform" },
              { value: "120+", label: "Courses" },
              { value: "20+", label: "Jalur belajar" },
              { value: "<3 mins", label: "AI Response" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-2 text-center">
                <p className="font-heading text-4xl font-extrabold tracking-tight text-dark md:text-5xl md:tracking-[-0.05em]">
                  {s.value}
                </p>
                <p className="font-body text-base font-bold uppercase tracking-widest text-gold">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
