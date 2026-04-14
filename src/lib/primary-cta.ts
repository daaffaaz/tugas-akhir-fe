import { cn } from "@/lib/utils";

/** Default: latar kuning, teks gelap; hover: latar hitam, teks kuning */
export const primaryGoldCtaBase =
  "bg-gold text-dark transition-colors duration-200 ease-out hover:bg-dark hover:text-gold";

/** Untuk `<button disabled>` agar hover tidak tetap “invert” */
export const primaryGoldCtaDisabled =
  "disabled:opacity-60 disabled:hover:bg-gold disabled:hover:text-dark";

export const primaryGoldCtaDisabledSoft =
  "disabled:opacity-50 disabled:hover:bg-gold disabled:hover:text-[#111827]";

export function primaryGoldCtaClass(...extra: (string | undefined)[]) {
  return cn(primaryGoldCtaBase, primaryGoldCtaDisabled, ...extra);
}

export function primaryGoldCtaClassSoftDisabled(
  ...extra: (string | undefined)[]
) {
  return cn(primaryGoldCtaBase, primaryGoldCtaDisabledSoft, ...extra);
}

/** Ikon gelap di samping teks: saat hover (bg hitam) jadi terang */
export const primaryCtaIconHover =
  "transition group-hover:brightness-0 group-hover:invert";
