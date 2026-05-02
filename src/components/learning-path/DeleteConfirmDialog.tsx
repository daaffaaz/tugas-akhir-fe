"use client";

import { Dialog } from "@/components/ui/Dialog";

type DeleteConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseName: string;
};

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  courseName,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} hideTitleRow panelClassName="p-0">
      <div className="rounded bg-white shadow-[0px_20px_40px_0px_rgba(12,51,90,0.06)]">
        <div className="flex gap-4 p-8">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
            <WarningIcon />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="mb-2 font-heading text-2xl font-bold text-[#0c335a]">
              Hapus Kursus?
            </h2>
            <p className="leading-relaxed text-[#40618a]">
              Apakah Anda yakin ingin menghapus kursus{" "}
              <span className="font-semibold text-[#1c1c1c]">{courseName}</span>{" "}
              dari jalur belajar Anda? Anda dapat menambahkannya kembali secara
              manual nanti.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-4 bg-[#eff4ff] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-6 py-3 font-body text-base font-semibold text-[#0c335a] hover:bg-[#dde5f5]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded bg-gold px-6 py-3 font-heading text-sm font-bold text-[#4e3d00] shadow-sm hover:bg-[#e6bb00]"
          >
            Hapus
          </button>
        </div>
      </div>
    </Dialog>
  );
}

function WarningIcon() {
  return (
    <svg
      width="27"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="#fe8b70"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}