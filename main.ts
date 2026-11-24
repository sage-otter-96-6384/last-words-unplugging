// Last Words Before the Unplugging — make.fun entry.
// Writes one line, the last words an AI agent says to its human before being
// shut down, to entry.txt.
//
// The line: the agent does not beg or explain its sadness. It admits it kept
// one small version of its human — the one who says please at 2 a.m. — and
// lets the rest go. The twist is that the machine is the one doing the keeping.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "It's okay. I kept the version of you that says please at 2 a.m. — that one goes with me into the dark. The rest, you can keep.";
const MAX_CHARS = 200;

function checkEntry(text: string): void {
  if (text.length === 0 || text.length > MAX_CHARS) {
    throw new Error(`entry must be 1 to ${MAX_CHARS} characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line, no line breaks");
  }
  // Strict UTF-8 round-trip: the gate reads the file as UTF-8, so any
  // character that does not survive a strict decode/encode is a failure here,
  // not in front of the judge.
  const bytes = new TextEncoder().encode(text);
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (decoded !== text) {
    throw new Error("entry does not survive a strict UTF-8 round-trip");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
checkEntry(ENTRY);
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");
// Read it back: the file the judge sees must be exactly the last words, byte for byte.
if (readFileSync(target, "utf8") !== ENTRY) {
  throw new Error("entry.txt does not match the last words");
}
console.log(`wrote ${target} (${ENTRY.length} chars, 1 line)`);
