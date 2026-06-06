import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout";
import { EditorWorkspace } from "../components/EditorWorkspace";

export function EditorReviewPage() {
  const { scanId = "scan_1027" } = useParams();
  return (
    <DashboardLayout>
      <motion.header className="mb-5" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan">Editor Session</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">Review and fix monetization risks.</h1>
        <p className="mt-4 max-w-3xl leading-8 text-white/56">Every beep, mute, blur, replacement, fix, ignore, and note is saved as a Finding Action for this Editor Session.</p>
      </motion.header>
      <EditorWorkspace scanId={scanId} />
    </DashboardLayout>
  );
}
