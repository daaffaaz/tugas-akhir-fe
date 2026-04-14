import { AppBar } from "@/components/layout/AppBar";
import { CourseCatalogView } from "./course-catalog-view";

export default function CourseCatalogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-dark">
      <AppBar />
      <CourseCatalogView />
      <footer className="mt-auto border-t border-[rgba(209,209,209,0.35)] bg-[#fdfdfd]">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-6 px-8 py-12 text-[11px] font-bold uppercase tracking-wide text-[#4a4a4a] md:flex-row md:items-center">
          <p>© 2024 PrecisionLearn IT. All rights reserved.</p>
          <div className="flex flex-wrap gap-8">
            <span className="cursor-pointer hover:text-dark">Legal</span>
            <span className="cursor-pointer hover:text-dark">Support</span>
            <span className="cursor-pointer hover:text-dark">Privacy policy</span>
            <span className="cursor-pointer hover:text-dark">Terms of service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
