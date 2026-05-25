// Smoke test: spawn the built server over stdio, list tools, call each one,
// and print a short pass/fail. No SDK needed — raw JSON-RPC over stdio.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const server = join(here, "..", "build", "index.js");
const proc = spawn("node", [server], { stdio: ["pipe", "pipe", "inherit"] });

let buf = "";
const pending = new Map();
proc.stdout.on("data", (d) => {
  buf += d.toString();
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
    if (!line) continue;
    try { const msg = JSON.parse(line); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } } catch {}
  }
});

let id = 0;
function rpc(method, params) {
  return new Promise((res) => {
    const myId = ++id;
    pending.set(myId, res);
    proc.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: myId, method, params }) + "\n");
  });
}

const cases = [
  ["niche_report", { niche: "skincare" }],
  ["niche_report", { niche: "skincare", focus: "format" }],
  ["niche_report", { focus: "trends" }],
  ["niche_report", { focus: "apps" }],
  ["study_videos", { niche: "skincare", limit: 4 }],
  ["study_videos", { query: "before-after" }],
  ["teardown", { video: "15s testimonial: girl checks mascara at 7pm, still perfect, link in bio" }],
  ["teardown", { product: "a matcha latte kit", niche: "food and beverage", model: "higgsfield" }],
  ["make_brief", { product: "a matcha latte kit", audience: "busy founders", objective: "first purchase" }],
  ["make_brief", { product: "a lash serum", niche: "ABG beauty", mode: "ideas", count: 4 }],
  ["make_brief", { product: "a lash serum", niche: "ABG beauty", mode: "hooks", count: 6 }],
  ["breakout_laws", {}],
  ["kill_the_slop", { copy: "Discover the revolutionary power of our product to elevate your routine. 🚀 Game-changing." }],
  ["get_status", {}],
];

(async () => {
  await rpc("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "smoke", version: "0" } });
  const list = await rpc("tools/list", {});
  const names = (list.result?.tools || []).map((t) => t.name);
  console.log(`\n[tools/list] ${names.length} tools: ${names.join(", ")}`);
  let pass = 0;
  for (const [name, args] of cases) {
    const r = await rpc("tools/call", { name, arguments: args });
    const text = r.result?.content?.[0]?.text || "";
    const ok = !r.result?.isError && text.length > 80;
    console.log(`\n${ok ? "✓ PASS" : "✗ FAIL"} ${name} (${text.length} chars)`);
    console.log(text.split("\n").slice(0, 6).map((l) => "   " + l).join("\n"));
    if (ok) pass++;
  }
  console.log(`\n=== ${pass}/${cases.length} skills passed ===`);
  proc.kill();
  process.exit(pass === cases.length ? 0 : 1);
})();
