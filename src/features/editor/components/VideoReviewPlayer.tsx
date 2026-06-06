import { Maximize2, Pause, Play, Volume2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { RiskTimeline } from "./RiskTimeline";
import type { EditorFinding } from "../types";

export function VideoReviewPlayer({ currentTime, findings, activeId, onSelect }: { currentTime: string; findings: EditorFinding[]; activeId: string; onSelect: (id: string) => void }) {
  const [playing, setPlaying] = useState(false);
  return (
    <Card className="p-4">
      <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-line bg-gradient-to-br from-night via-violet/20 to-cyan/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,255,155,.2),transparent_24rem)]" />
        <button className="absolute inset-0 grid place-items-center" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause preview" : "Play preview"}>
          <span className="grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-black/35 backdrop-blur-xl">{playing ? <Pause /> : <Play />}</span>
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-white/58">
        <span>{currentTime} / 00:08:42</span>
        <div className="flex items-center gap-2"><Volume2 size={17} /><Maximize2 size={17} /></div>
      </div>
      <div className="mt-4"><RiskTimeline findings={findings} activeId={activeId} onSelect={onSelect} /></div>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play"}</Button>
      </div>
    </Card>
  );
}
