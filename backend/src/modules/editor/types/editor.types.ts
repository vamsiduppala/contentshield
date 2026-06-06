export type FindingStatus = "pending" | "beeped" | "muted" | "blurred" | "replaced" | "fixed" | "ignored";
export type EditorActionType = "beep" | "mute" | "blur" | "replace" | "fix" | "ignore" | "note" | "undo";
export type ExportFormat = "pdf" | "csv" | "premiere_markers" | "capcut_notes" | "json";

export const resolvedFindingStatuses: FindingStatus[] = ["beeped", "muted", "blurred", "replaced", "fixed", "ignored"];
