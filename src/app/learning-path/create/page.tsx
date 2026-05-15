import { AppBar } from "@/components/layout/AppBar";
import { Footer } from "@/components/layout/Footer";
import { CreatePathForm } from "./create-path-form";

export default function CreateLearningPathPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#fcfcfc] font-body text-dark">
      <AppBar />
      <main className="relative flex flex-1 justify-center px-4 pb-32 pt-20 md:px-6 md:pt-24">
        <div
          className="pointer-events-none absolute -right-40 -top-10 size-96 rounded-full bg-gold/5 blur-[50px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-40 bottom-0 size-[500px] rounded-full bg-[#efefef]/30 blur-[60px]"
          aria-hidden
        />
        <div className="relative z-[1] flex w-full max-w-3xl flex-col items-center">
          <div className="mb-12 text-center">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-[#1a1c1e] md:text-5xl md:leading-[48px]">
              Apa yang kami bisa bantu?
            </h1>
            <p className="mt-4 max-w-xl font-body text-lg font-medium text-[#444749]">
              Masukkan topik di bawah agar kami dapat buat path untuk topiknya.
            </p>
          </div>
          <CreatePathForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
