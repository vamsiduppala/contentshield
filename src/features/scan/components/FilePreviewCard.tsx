import { FileVideo } from "lucide-react";
import { formatBytes } from "../../../lib/formatters";
import { Card } from "../../../components/ui/Card";
import type { MockUploadFile } from "../types";

export function FilePreviewCard({ file }: { file: MockUploadFile }) {
  const format = file.name.split(".").pop()?.toUpperCase() || "MP4";
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-acid/30 bg-acid/10 text-acid"><FileVideo size={22} /></span>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{file.name}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/50">
            <span>{formatBytes(file.size)}</span>
            <span>Duration: 08:24</span>
            <span>{format}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
