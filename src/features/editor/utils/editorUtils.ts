import type { EditorFinding, EditorSummary, FindingStatus } from "../types";

const replacements: Record<string, string[]> = {
  war: ["conflict", "military conflict", "regional crisis"],
  "dead bodies": ["casualties", "people killed", "victims"],
  assault: ["attack incident", "violent incident", "physical attack"],
  weapon: ["armed equipment", "object", "equipment"],
  "regime collapse": ["government change", "leadership crisis", "political shift"]
};

const reasons: Record<string, string> = {
  violence_war: "Advertisers often treat direct conflict language as sensitive, especially near graphic or political context.",
  death_tragedy: "Death-related visual or textual references can trigger limited-ad suitability review.",
  weapons: "Weapon terms can increase monetization review risk when paired with conflict coverage.",
  political: "Political crisis framing may require softer wording for broad advertiser suitability."
};

export function buildEditorFindings(): EditorFinding[] {
  return [];
}

export function isResolved(status: FindingStatus) {
  return status !== "pending";
}

export function getCompletion(findings: EditorFinding[]) {
  if (!findings.length) return 100;
  return Math.round((findings.filter((finding) => isResolved(finding.status)).length / findings.length) * 100);
}

export function getEditorSummary(findings: EditorFinding[], originalScore = 67): EditorSummary {
  const count = (status: FindingStatus) => findings.filter((finding) => finding.status === status).length;
  const resolved = findings.filter((finding) => isResolved(finding.status)).length;
  return {
    originalScore,
    updatedScore: Math.min(96, originalScore + resolved * 5),
    resolved,
    remaining: findings.length - resolved,
    beeped: count("beeped"),
    muted: count("muted"),
    blurred: count("blurred"),
    replaced: count("replaced"),
    fixed: count("fixed"),
    ignored: count("ignored")
  };
}

function transcriptFor(phrase: string) {
  const snippets: Record<string, string> = {
    war: "The war situation became worse after several attacks near the border.",
    "dead bodies": "The screen shows dead bodies near the border as the narrator explains the aftermath.",
    assault: "Officials described the assault as a serious attack incident during the night.",
    weapon: "The report mentions a weapon recovered near the scene.",
    "regime collapse": "Analysts warned that a regime collapse could change the region quickly."
  };
  return snippets[phrase] || `The transcript includes ${phrase} in a sensitive context.`;
}

function addSeconds(timestamp: string, seconds: number) {
  const [hours, minutes, secs] = timestamp.split(":").map(Number);
  const total = hours * 3600 + minutes * 60 + secs + seconds;
  const h = Math.floor(total / 3600).toString().padStart(2, "0");
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(total % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}
