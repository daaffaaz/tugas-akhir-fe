import { AppBar } from "@/components/layout/AppBar";
import { Footer } from "@/components/layout/Footer";
import { CourseCatalogView } from "./course-catalog-view";

export default function CourseCatalogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-dark">
      <AppBar />
      <CourseCatalogView />
      <Footer />
    </div>
  );
}
