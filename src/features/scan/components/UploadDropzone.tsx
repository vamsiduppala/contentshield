import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "../../../lib/cn";
import type { MockUploadFile } from "../types";

const allowed = [".mp4", ".mov", ".mkv", ".webm"];

export function UploadDropzone({ onSelect, onError }: { onSelect: (file: MockUploadFile) => void; onError: (message: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const selectFile = (file?: File) => {
    if (!file) return;
    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!allowed.includes(ext)) {
      onError("Choose an MP4, MOV, MKV, or WEBM video file.");
      return;
    }
    if (file.size > 1024 * 1024 * 1500) {
      onError("Use a file under 1.5 GB for this demo scan.");
      return;
    }
    onSelect({ name: file.name, size: file.size, type: file.type || ext, file });
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files[0]); }}
      className={cn("group relative w-full overflow-hidden rounded-[2rem] border border-dashed border-line bg-white/[0.05] p-10 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan", dragging && "border-acid bg-acid/10 shadow-[0_0_80px_rgba(124,255,155,.16)]")}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-violet/10 opacity-0 transition group-hover:opacity-100" />
      <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 2.4, repeat: Infinity }} className="relative mb-8 grid h-20 w-20 place-items-center rounded-3xl border border-cyan/30 bg-cyan/10 text-cyan">
        <UploadCloud size={34} />
      </motion.span>
      <div className="relative">
        <h2 className="text-3xl font-semibold tracking-tight">Drop your video into the AI scan bay.</h2>
        <p className="mt-3 max-w-xl leading-7 text-white/55">Supports .mp4, .mov, .mkv, and .webm. Files upload directly to your private Backblaze bucket.</p>
        <p className="mt-6 text-sm font-semibold text-acid">Browse video file</p>
      </div>
      <input ref={inputRef} type="file" className="sr-only" accept=".mp4,.mov,.mkv,.webm" onChange={(event) => selectFile(event.target.files?.[0])} />
    </button>
  );
}
