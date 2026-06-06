import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const port = Number(process.env.PORT || 4173);

const scans = [
  { id: "scan_1027", title: "Border Conflict Explainer - Final Cut", score: 67, verdict: "high_risk", riskCount: 14, status: "completed", createdAt: "2026-06-05T16:25:00.000Z" },
  { id: "scan_1019", title: "Podcast Episode 41 - Creator Burnout", score: 91, verdict: "safe", riskCount: 3, status: "completed", createdAt: "2026-06-04T11:10:00.000Z" },
  { id: "scan_1008", title: "Gaming News Weekly", score: 78, verdict: "limited_risk", riskCount: 8, status: "completed", createdAt: "2026-06-02T19:45:00.000Z" }
];

const findings = [
  { id: "finding_1", timestamp: "00:01:14", phrase: "war", source: "speech", category: "violence_war", severity: "high", suggestion: "conflict", confidence: 96, status: "pending" },
  { id: "finding_2", timestamp: "00:03:22", phrase: "dead bodies", source: "onscreen_text", category: "death_tragedy", severity: "critical", suggestion: "casualties", confidence: 91, status: "pending" },
  { id: "finding_3", timestamp: "00:05:40", phrase: "assault", source: "caption", category: "violence_war", severity: "high", suggestion: "attack incident", confidence: 88, status: "pending" }
];

function json(response, data, status = 200) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data, null, 2));
}

function envelope(data) {
  return { success: true, data };
}

function api(request, response, url) {
  if (url.pathname === "/api/v1/health") return json(response, envelope({ api: "ok", mockAiMode: true, storageProvider: "local-preview" }));
  if (url.pathname === "/api/v1/dashboard/summary") return json(response, envelope({
    totalScans: scans.length,
    averageSafetyScore: 79,
    highRiskVideos: 1,
    recentScans: scans,
    monthlyScanUsage: { used: 92, limit: 150 },
    riskTrend: [{ date: "Mon", score: 72 }, { date: "Tue", score: 78 }, { date: "Wed", score: 86 }],
    mostCommonRiskCategories: ["violence_war", "death_tragedy", "political"]
  }));
  if (url.pathname === "/api/v1/videos/upload-url" && request.method === "POST") return json(response, envelope({ videoId: "video_preview", uploadUrl: "https://local-preview/upload", storageKey: "preview/video.mp4", expiresIn: 900 }));
  if (url.pathname.includes("/confirm-upload")) return json(response, envelope({ id: "video_preview", status: "ready" }));
  if (url.pathname === "/api/v1/scans" && request.method === "POST") return json(response, envelope({ scanId: "scan_1027", status: "queued" }));
  if (url.pathname === "/api/v1/scans/history") return json(response, envelope({ items: scans, page: 1, limit: 20, total: scans.length }));
  if (url.pathname.endsWith("/status")) return json(response, envelope({
    status: "processing",
    progressPercent: 76,
    currentStage: "detect_risk",
    processingSteps: ["prepare_video", "extract_audio", "transcribe_speech", "scan_ocr", "parse_captions", "detect_risk"].map((name) => ({ name, status: "completed" })),
    logs: [{ level: "info", message: "Mock AI scan running" }],
    estimatedCompletionSeconds: 45
  }));
  if (url.pathname.endsWith("/results")) return json(response, envelope({
    scan: scans[0],
    video: { originalFileName: "border-conflict-final.mp4", durationSeconds: 522 },
    safetyScore: 67,
    verdict: "high_risk",
    categories: [
      { category: "violence_war", findingCount: 6, highestSeverity: "high", confidenceAverage: 94 },
      { category: "death_tragedy", findingCount: 2, highestSeverity: "critical", confidenceAverage: 91 }
    ],
    findings,
    aiSummary: "This video contains advertiser-sensitive terms related to conflict, death, and political violence.",
    exportOptions: ["csv", "pdf", "editor-notes"]
  }));
  if (url.pathname.includes("/editor/") && url.pathname.endsWith("/session")) return json(response, envelope({
    session: { id: "editor_session_preview", status: "in_progress", completionPercentage: 0 },
    findings,
    transcriptSegments: findings.map((finding) => ({ startTime: finding.timestamp, text: `Transcript contains ${finding.phrase} in context.` })),
    progress: { totalFindings: findings.length, pendingCount: findings.length, completionPercentage: 0, canCompleteReview: false }
  }));
  if (url.pathname.includes("/editor/") && url.pathname.endsWith("/summary")) return json(response, envelope({ originalSafetyScore: 67, updatedEstimatedSafetyScore: 88, unresolvedRiskCount: 0, actions: [], notes: [] }));
  if (url.pathname.includes("/editor/") && url.pathname.includes("/exports")) return json(response, envelope({ exportJobId: "export_preview", status: "completed", downloadUrl: "https://local-preview/export.pdf" }));
  return json(response, { success: false, error: { code: "NOT_FOUND", message: "Preview API route not found" } }, 404);
}

const html = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ContentShield AI Local Preview</title>
  <style>
    :root{--void:#050712;--night:#090d1f;--line:rgba(255,255,255,.12);--acid:#7cff9b;--cyan:#55d6ff;--violet:#9a7cff;--amber:#ffd38a}
    *{box-sizing:border-box} body{margin:0;font-family:Inter,Segoe UI,system-ui,sans-serif;background:radial-gradient(circle at 20% 0,rgba(124,255,155,.16),transparent 28rem),radial-gradient(circle at 80% 20%,rgba(154,124,255,.2),transparent 30rem),var(--void);color:white}
    a{color:inherit;text-decoration:none}.shell{display:grid;grid-template-columns:17rem 1fr;min-height:100vh}.side{border-right:1px solid var(--line);background:rgba(255,255,255,.04);padding:1rem;position:sticky;top:0;height:100vh}.brand{font-weight:800;margin:1rem 0 2rem}.nav a{display:block;padding:.85rem 1rem;border-radius:1rem;color:rgba(255,255,255,.58);margin:.2rem 0}.nav a:hover,.nav a.active{background:rgba(124,255,155,.12);color:var(--acid)}main{padding:2rem}.hero{max-width:78rem}.eyebrow{color:var(--cyan);text-transform:uppercase;letter-spacing:.22em;font-size:.8rem;font-weight:800}.h1{font-size:clamp(2.7rem,6vw,6rem);line-height:.95;margin:.5rem 0}.muted{color:rgba(255,255,255,.58);line-height:1.7}.grid{display:grid;gap:1rem}.cols4{grid-template-columns:repeat(4,minmax(0,1fr))}.cols3{grid-template-columns:2fr 1.2fr 1fr}.card{border:1px solid var(--line);background:rgba(255,255,255,.06);border-radius:1.5rem;padding:1.25rem;box-shadow:0 28px 90px rgba(0,0,0,.3);backdrop-filter:blur(20px)}.btn{display:inline-flex;align-items:center;gap:.5rem;border:0;border-radius:999px;padding:.8rem 1.1rem;background:var(--acid);color:var(--void);font-weight:800;cursor:pointer}.btn.secondary{background:rgba(255,255,255,.08);color:white;border:1px solid var(--line)}.metric strong{display:block;font-size:2.5rem;margin:.5rem 0}.score{font-size:5rem;color:var(--acid);font-weight:900}.badge{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:.35rem .65rem;color:var(--cyan);font-size:.8rem}.table{width:100%;border-collapse:collapse}.table th,.table td{padding:.8rem;border-top:1px solid var(--line);text-align:left}.timeline{height:3rem;background:rgba(255,255,255,.09);border-radius:999px;position:relative}.marker{position:absolute;top:50%;width:1rem;height:1rem;border-radius:50%;transform:translateY(-50%);background:var(--amber);box-shadow:0 0 25px rgba(255,211,138,.6)}.video{aspect-ratio:16/9;border-radius:1.4rem;background:linear-gradient(135deg,rgba(85,214,255,.22),rgba(154,124,255,.25));display:grid;place-items:center;font-size:3rem}.hidden{display:none}@media(max-width:900px){.shell{grid-template-columns:1fr}.side{position:static;height:auto}.cols4,.cols3{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    const scans=${JSON.stringify(scans)}; const findings=${JSON.stringify(findings)};
    const app=document.getElementById('app');
    function nav(){return '<aside class="side"><div class="brand">ContentShield AI</div><nav class="nav"><a href="/">Landing</a><a href="/dashboard">Dashboard</a><a href="/scan/new">New Scan</a><a href="/scan/processing/scan_1027">Processing</a><a href="/scan/results/scan_1027">Results</a><a href="/scan/history">History</a><a href="/scan/editor/scan_1027">Editor Review</a><a href="/scan/editor/scan_1027/summary">Editor Summary</a><a href="/api/v1/health">API Health</a></nav></aside>'}
    function layout(content){app.innerHTML='<div class="shell">'+nav()+'<main>'+content+'</main></div>'}
    function landing(){app.innerHTML='<main><section class="hero"><p class="eyebrow">Local full-stack preview</p><h1 class="h1">Protect Creator Revenue Before YouTube Flags Your Video.</h1><p class="muted">Frontend routes and Backend Module 2/3 mock API contracts are running together locally.</p><p><a class="btn" href="/dashboard">Open Dashboard</a> <a class="btn secondary" href="/api/v1/dashboard/summary">Test API</a></p></section></main>'}
    function dashboard(){layout('<p class="eyebrow">AI command center</p><h1 class="h1">Welcome to ContentShield AI.</h1><div class="grid cols4">'+[['Total Scans',3],['Average Safety Score',79],['High-Risk Videos',1],['Fix Suggestions',25]].map(m=>'<div class="card metric"><span>'+m[0]+'</span><strong>'+m[1]+'</strong><p class="muted">Mock data live</p></div>').join('')+'</div><h2>Recent Scans</h2>'+scans.map(s=>'<div class="card"><b>'+s.title+'</b><p class="muted">Score '+s.score+' · '+s.riskCount+' risks</p><a class="btn secondary" href="/scan/results/'+s.id+'">View Results</a></div>').join(''))}
    function newScan(){layout('<p class="eyebrow">New Scan Job</p><h1 class="h1">Start an AI monetization safety scan.</h1><div class="card"><h2>Drop your video into the AI scan bay</h2><p class="muted">Supports .mp4, .mov, .mkv, .webm. No real upload in preview.</p><input type="file" accept=".mp4,.mov,.mkv,.webm"><p><a class="btn" href="/scan/processing/scan_1027">Start AI Scan</a></p></div>')}
    function processing(){layout('<p class="eyebrow">AI processing dashboard</p><h1 class="h1">ContentShield AI is scanning your draft.</h1><div class="card"><div class="score">76%</div><p class="muted">Extracting audio → Transcribing speech → Reading on-screen text → Detecting sensitive language</p><div class="timeline"><span class="marker" style="left:20%"></span><span class="marker" style="left:55%"></span><span class="marker" style="left:78%"></span></div><p><a class="btn" href="/scan/results/scan_1027">View Results</a></p></div>')}
    function results(){layout('<p class="eyebrow">Results summary</p><h1 class="h1">Border Conflict Explainer</h1><div class="grid cols3"><div class="card"><div class="score">67</div><p>Monetization Safety Score · High Risk</p></div><div class="card"><h3>AI Summary</h3><p class="muted">This video contains advertiser-sensitive terms related to conflict, death, and political violence.</p></div><div class="card"><a class="btn" href="/scan/editor/scan_1027">Continue to Editor Review</a></div></div><h2>Risk Findings</h2><table class="table"><tr><th>Time</th><th>Phrase</th><th>Source</th><th>Severity</th><th>Suggestion</th></tr>'+findings.map(f=>'<tr><td>'+f.timestamp+'</td><td>'+f.phrase+'</td><td>'+f.source+'</td><td>'+f.severity+'</td><td>'+f.suggestion+'</td></tr>').join('')+'</table>')}
    function history(){layout('<p class="eyebrow">Scan history</p><h1 class="h1">Every scan in one place.</h1>'+scans.map(s=>'<div class="card"><b>'+s.title+'</b><p class="muted">'+s.verdict+' · score '+s.score+'</p><a class="btn secondary" href="/scan/results/'+s.id+'">View Results</a></div>').join(''))}
    function editor(){layout('<p class="eyebrow">Editor Session</p><h1 class="h1">Review and fix monetization risks.</h1><div class="grid cols3"><div class="card"><div class="video">▶</div><h3>Risk Timeline</h3><div class="timeline">'+findings.map((f,i)=>'<span class="marker" style="left:'+(20+i*25)+'%"></span>').join('')+'</div></div><div class="card"><h2>Transcript Review</h2>'+findings.map(f=>'<p><span class="badge">'+f.timestamp+'</span> Transcript contains <mark>'+f.phrase+'</mark> in context.</p>').join('')+'</div><div class="card"><h2>Finding Inspector</h2><p class="muted">Apply edit-decision instructions only.</p><button class="btn secondary">Beep</button> <button class="btn secondary">Mute</button> <button class="btn secondary">Blur</button> <button class="btn secondary">Replace</button><p><a class="btn" href="/scan/editor/scan_1027/summary">Finish Review</a></p></div></div>')}
    function summary(){layout('<p class="eyebrow">Review Complete</p><h1 class="h1">Your video is safer for upload.</h1><div class="grid cols4"><div class="card metric"><span>Original Score</span><strong>67</strong></div><div class="card metric"><span>Updated Score</span><strong>88</strong></div><div class="card metric"><span>Resolved</span><strong>14</strong></div><div class="card metric"><span>Remaining</span><strong>0</strong></div></div><div class="card"><h2>Exports</h2><button class="btn secondary">PDF</button> <button class="btn secondary">CSV</button> <button class="btn secondary">Premiere Markers</button> <button class="btn secondary">CapCut Notes</button></div>')}
    const path=location.pathname;
    if(path==='/') landing(); else if(path==='/dashboard') dashboard(); else if(path==='/scan/new') newScan(); else if(path.includes('/processing')) processing(); else if(path.includes('/results')) results(); else if(path.includes('/history')) history(); else if(path.includes('/editor')&&path.includes('/summary')) summary(); else if(path.includes('/editor')) editor(); else landing();
  </script>
</body>
</html>`;

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://localhost:${port}`);
  if (url.pathname.startsWith("/api/v1/")) return api(request, response, url);
  if (url.pathname.startsWith("/src/") || url.pathname.startsWith("/backend/")) {
    try {
      const file = await readFile(join(process.cwd(), url.pathname.slice(1)));
      const type = extname(url.pathname) === ".ts" || extname(url.pathname) === ".tsx" ? "text/plain" : "text/plain";
      response.writeHead(200, { "Content-Type": type });
      response.end(file);
      return;
    } catch {}
  }
  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(html);
});

server.listen(port, () => {
  console.log(`ContentShield AI local preview running at http://localhost:${port}`);
  console.log(`Mock API health: http://localhost:${port}/api/v1/health`);
});
