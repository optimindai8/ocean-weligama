import fs from "fs";
import path from "path";

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git", ".gemini", "brain"].includes(f.name)) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|html)$/i.test(f.name)) out.push(p);
  }
  return out;
}

const files = walk("artifacts/ocean-weligama/src").concat(["artifacts/ocean-weligama/index.html"]);
const mediaRegex = /["'`](?:\/)([^"'`\s]+\.(?:mp4|jpg|jpeg|png|webp|svg))["'`]/gi;

let unmigratedCount = 0;
files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  let match;
  while ((match = mediaRegex.exec(content)) !== null) {
    const raw = match[1];
    if (
      !raw.startsWith("images/") &&
      !raw.startsWith("videos/") &&
      !raw.startsWith("icons/") &&
      !raw.startsWith("thumbnails/")
    ) {
      console.log(`[Unmigrated] in ${file}: /${raw}`);
      unmigratedCount++;
    }
  }
});

console.log(`Audit complete. Unmigrated root media files: ${unmigratedCount}`);
