import { BellOff, Check, EyeOff, MessageSquare, Pencil, VolumeX, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export function FixActionButtons({ onBeep, onMute, onBlur, onReplace, onFixed, onIgnore }: { onBeep: () => void; onMute: () => void; onBlur: () => void; onReplace: () => void; onFixed: () => void; onIgnore: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="secondary" onClick={onBeep}><BellOff size={16} /> Beep Audio</Button>
      <Button variant="secondary" onClick={onMute}><VolumeX size={16} /> Mute Segment</Button>
      <Button variant="secondary" onClick={onBlur}><EyeOff size={16} /> Blur Text</Button>
      <Button variant="secondary" onClick={onReplace}><Pencil size={16} /> Replace Word</Button>
      <Button variant="secondary" onClick={onFixed}><Check size={16} /> Mark Fixed</Button>
      <Button variant="secondary" onClick={onIgnore}><X size={16} /> Ignore</Button>
      <Button className="col-span-2" variant="secondary"><MessageSquare size={16} /> Add Note</Button>
    </div>
  );
}
