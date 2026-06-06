import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { api } from "../../../lib/api";
import { defaultScanConfig } from "../data/mockScans";
import { FilePreviewCard } from "../components/FilePreviewCard";
import { ScanConfigPanel } from "../components/ScanConfigPanel";
import { UploadDropzone } from "../components/UploadDropzone";
import type { MockUploadFile, ScanConfig } from "../types";

export function NewScanPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<MockUploadFile | null>(null);
  const [config, setConfig] = useState<ScanConfig>(defaultScanConfig);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const startScan = async () => {
    if (!file?.file) {
      setError("Select a video before starting the AI scan.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const upload = await api.post("/videos/upload-url", {
        fileName: file.name,
        mimeType: file.file.type || "video/mp4",
        fileSizeBytes: file.file.size
      });

      const uploadResponse = await fetch(upload.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.file.type || "video/mp4" },
        body: file.file
      });
      if (!uploadResponse.ok) throw new Error(`Backblaze upload failed with ${uploadResponse.status}`);

      await api.post(`/videos/${upload.videoId}/confirm-upload`, {});
      const scan = await api.post("/scans", {
        videoId: upload.videoId,
        scanDepth: config.scanDepth.toLowerCase(),
        platformPreset: config.platform.toLowerCase(),
        contentType: config.contentType.toLowerCase(),
        language: config.language.toLowerCase(),
        enabledChecks: {
          speech: config.includeSpeech,
          ocr: config.includeOcr,
          captions: config.includeCaptions,
          context: config.includeSensitiveContext
        }
      });
      navigate(`/scan/processing/${scan.scanId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload or scan creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan">New Scan Job</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">Start an AI monetization safety scan.</h1>
            <p className="mt-4 max-w-2xl leading-8 text-white/56">Upload Video → Scan → Review Risks → Export Report. Module 2 stops at results summary.</p>
          </div>
          <Button onClick={startScan} disabled={!file || loading}>{loading ? "Uploading..." : "Start AI Scan"} <ArrowRight size={17} /></Button>
        </header>
        {error && <div className="mb-5 rounded-2xl border border-amber/30 bg-amber/10 p-4 text-sm text-amber">{error}</div>}
        <div className="grid gap-5 xl:grid-cols-[1fr_25rem]">
          <div className="space-y-5">
            <UploadDropzone onSelect={(selected) => { setFile(selected); setError(""); }} onError={setError} />
            {file ? <FilePreviewCard file={file} /> : (
              <Card className="p-5">
                <div className="flex gap-3 text-white/50"><ShieldCheck className="text-cyan" /> No video selected yet. Your file stays local in this mock UI.</div>
              </Card>
            )}
          </div>
          <ScanConfigPanel config={config} onChange={setConfig} />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
