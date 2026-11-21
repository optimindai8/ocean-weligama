import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Waves, ExternalLink, ArrowRight } from "lucide-react";

/* ───── Inline formatting parser for bold, italic, and links ───── */
function renderInlineFormatting(text: string) {
  if (!text) return null;

  const tokens: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }

    const tokenStr = match[0];
    const key = `${match.index}-${tokenStr.slice(0, 8)}`;

    if (tokenStr.startsWith("**") && tokenStr.endsWith("**")) {
      tokens.push(
        <strong key={key} className="font-bold text-[#0B3D5E]">
          {tokenStr.slice(2, -2)}
        </strong>
      );
    } else if (tokenStr.startsWith("*") && tokenStr.endsWith("*")) {
      tokens.push(
        <em key={key} className="italic font-serif">
          {tokenStr.slice(1, -1)}
        </em>
      );
    } else if (tokenStr.startsWith("[") && tokenStr.includes("](")) {
      const linkMatch = tokenStr.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const linkUrl = linkMatch[2];
        tokens.push(
          <a
            key={key}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#D97706] hover:text-[#0B3D5E] font-semibold underline underline-offset-4 transition-colors"
          >
            <span>{linkText}</span>
            <ExternalLink className="w-3 h-3 inline-block" />
          </a>
        );
      } else {
        tokens.push(tokenStr);
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

/* ───── Types for Structured Story Blocks ───── */
export type StoryBlock =
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "heading"; level: number; text: string }
  | { type: "quote"; text: string }
  | { type: "lead_quote"; text: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "divider" }
  | { type: "paragraph"; text: string };

/* ───── Helper to split table row by pipes safely ───── */
function splitPipeRow(line: string): string[] {
  const parts = line.split("|").map((c) => c.trim());
  if (line.trim().startsWith("|") && parts.length > 0 && parts[0] === "") {
    parts.shift();
  }
  if (line.trim().endsWith("|") && parts.length > 0 && parts[parts.length - 1] === "") {
    parts.pop();
  }
  return parts;
}

/* ───── Main Story Parser: Identifies Tables, Quotes, Lists, Headings ───── */
export function parseStoryContent(content: string): StoryBlock[] {
  if (!content) return [];

  const text = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rawLines = text.split("\n");
  const blocks: StoryBlock[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 1. HTML Table Parser (<table ...> ... </table>)
    if (trimmed.toLowerCase().includes("<table")) {
      let tableHtml = "";
      while (i < rawLines.length) {
        tableHtml += rawLines[i] + "\n";
        if (rawLines[i].toLowerCase().includes("</table>")) {
          i++;
          break;
        }
        i++;
      }

      const headerMatches = [...tableHtml.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) =>
        m[1].replace(/<[^>]+>/g, "").trim()
      );
      const rowMatches = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];

      let headers = headerMatches;
      const rows: string[][] = [];

      for (const r of rowMatches) {
        const rowHtml = r[1];
        // If row has <th> and no headers were found earlier
        if (headers.length === 0 && rowHtml.toLowerCase().includes("<th")) {
          headers = [...rowHtml.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) =>
            m[1].replace(/<[^>]+>/g, "").trim()
          );
          continue;
        }

        const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) =>
          m[1].replace(/<[^>]+>/g, "").trim()
        );
        if (cells.length > 0) {
          rows.push(cells);
        }
      }

      if (headers.length > 0 || rows.length > 0) {
        blocks.push({ type: "table", headers, rows });
        continue;
      }
    }

    // 2. Markdown Table Parser (| col1 | col2 | ...)
    if (trimmed.includes("|") && splitPipeRow(trimmed).length >= 2) {
      const tableLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().includes("|")) {
        tableLines.push(rawLines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headers = splitPipeRow(tableLines[0]);
        let startRow = 1;

        // Check if second line is markdown separator: | --- | --- |
        if (tableLines[1].replace(/[|\s-:]/g, "").length === 0) {
          startRow = 2;
        }

        const rows: string[][] = [];
        for (let rIdx = startRow; rIdx < tableLines.length; rIdx++) {
          const cells = splitPipeRow(tableLines[rIdx]);
          if (cells.length > 0 && cells.some((c) => c.length > 0)) {
            rows.push(cells);
          }
        }

        if (headers.length > 0 || rows.length > 0) {
          blocks.push({ type: "table", headers, rows });
          continue;
        }
      } else if (tableLines.length === 1) {
        blocks.push({ type: "paragraph", text: tableLines[0] });
        continue;
      }
    }

    // 3. Tab-Separated Table Parser (from Excel, Google Sheets, Word)
    if (line.includes("\t")) {
      const tsvLines: string[] = [];
      while (i < rawLines.length && rawLines[i].includes("\t")) {
        tsvLines.push(rawLines[i]);
        i++;
      }

      if (tsvLines.length >= 2) {
        const headers = tsvLines[0].split("\t").map((c) => c.trim());
        const rows = tsvLines.slice(1).map((l) => l.split("\t").map((c) => c.trim()));
        blocks.push({ type: "table", headers, rows });
        continue;
      } else if (tsvLines.length === 1) {
        blocks.push({ type: "paragraph", text: tsvLines[0] });
        continue;
      }
    }

    // 4. Headings: #, ##, ###, ####
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // 5. Divider: --- or *** or ___
    if (/^[-*_]{3,}$/.test(trimmed)) {
      blocks.push({ type: "divider" });
      i++;
      continue;
    }

    // 6. Blockquote: > text
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith(">")) {
        quoteLines.push(rawLines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: quoteLines.join(" ") });
      continue;
    }

    // 7. Lists: - item, * item, • item, or 1. item
    if (/^[-*•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const isOrdered = /^\d+\.\s+/.test(trimmed);
      const items: string[] = [];
      while (i < rawLines.length) {
        const itemTrimmed = rawLines[i].trim();
        if (/^[-*•]\s+/.test(itemTrimmed)) {
          items.push(itemTrimmed.replace(/^[-*•]\s+/, ""));
          i++;
        } else if (/^\d+\.\s+/.test(itemTrimmed)) {
          items.push(itemTrimmed.replace(/^\d+\.\s+/, ""));
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: "list", items, ordered: isOrdered });
      continue;
    }

    // 8. Normal Paragraph (gather contiguous lines until another block type starts)
    let paragraphText = line;
    i++;
    while (i < rawLines.length && rawLines[i].trim()) {
      const nextTrimmed = rawLines[i].trim();
      if (
        nextTrimmed.startsWith("#") ||
        (nextTrimmed.includes("|") && splitPipeRow(nextTrimmed).length >= 2) ||
        nextTrimmed.includes("\t") ||
        nextTrimmed.startsWith(">") ||
        nextTrimmed.toLowerCase().startsWith("<table") ||
        /^[-*•]\s+/.test(nextTrimmed) ||
        /^\d+\.\s+/.test(nextTrimmed) ||
        /^[-*_]{3,}$/.test(nextTrimmed)
      ) {
        break;
      }
      paragraphText += "\n" + rawLines[i];
      i++;
    }

    blocks.push({ type: "paragraph", text: paragraphText.trim() });
  }

  // Refine: Check if the first block is a short heading (e.g. "Our Story")
  if (
    blocks.length > 0 &&
    blocks[0].type === "paragraph" &&
    blocks[0].text.length < 55 &&
    !blocks[0].text.endsWith(".") &&
    !blocks[0].text.includes("\n")
  ) {
    blocks[0] = { type: "heading", level: 2, text: blocks[0].text };
  }

  // Refine: If the first paragraph after a heading is short and evocative, mark as lead quote
  const firstParaIdx = blocks.findIndex((b) => b.type === "paragraph");
  if (firstParaIdx !== -1) {
    const para = blocks[firstParaIdx] as { type: "paragraph"; text: string };
    if (para.text.length < 140 && !para.text.includes("?") && !para.text.includes("\n")) {
      blocks[firstParaIdx] = { type: "lead_quote", text: para.text };
    }
  }

  return blocks;
}

/* ───── Luxury Responsive Table Component ───── */
export function LuxuryStoryTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  // Normalize row lengths to match header length
  const maxCols = Math.max(headers.length, ...rows.map((r) => r.length));
  const safeHeaders =
    headers.length > 0
      ? headers
      : Array.from({ length: maxCols }, (_, idx) => `Column ${idx + 1}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="my-8 sm:my-10 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-400/30 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.22)]"
      data-testid="story-table-container"
    >
      {/* Golden illumination bar matching hotel brand logo */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent z-10" />

      {/* Mobile Horizontal Scroll Hint */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-b border-amber-400/20 text-[10px] font-bold text-amber-900 uppercase tracking-wider">
        <span className="flex items-center gap-1.5 font-black text-[#0B3D5E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          Information Table
        </span>
        <span className="text-slate-500 font-medium">Scroll to view full table &rarr;</span>
      </div>

      {/* Horizontal Scroll Wrapper */}
      <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[540px]">
          {/* Header Row */}
          <thead>
            <tr className="bg-gradient-to-r from-[#0B3D5E] via-[#0D4B73] to-[#0B3D5E] text-white">
              {safeHeaders.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 sm:px-6 py-3.5 sm:py-4 text-[11px] sm:text-xs font-serif font-black tracking-wider uppercase text-amber-300 border-b border-amber-400/20 whitespace-nowrap"
                >
                  {renderInlineFormatting(header)}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-amber-50/50 transition-colors duration-150 odd:bg-white even:bg-slate-50/60"
              >
                {Array.from({ length: maxCols }).map((_, cIdx) => {
                  const cell = row[cIdx] || "";
                  const isFirstCol = cIdx === 0;

                  return (
                    <td
                      key={cIdx}
                      className={`px-4 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm leading-relaxed ${
                        isFirstCol
                          ? "font-semibold text-[#0B3D5E]"
                          : "font-normal text-slate-700"
                      }`}
                    >
                      {renderInlineFormatting(cell)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ───── Primary Story Content Renderer Component ───── */
export function StoryContentRenderer({ content }: { content: string }) {
  const blocks = useMemo(() => parseStoryContent(content), [content]);

  if (!blocks || blocks.length === 0) {
    return <p className="text-slate-500 italic">No content available.</p>;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "table":
            return (
              <LuxuryStoryTable
                key={idx}
                headers={block.headers}
                rows={block.rows}
              />
            );

          case "heading": {
            if (block.level === 1 || block.level === 2) {
              return (
                <h2
                  key={idx}
                  className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight leading-tight mt-8 mb-4 first:mt-0"
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <h3
                key={idx}
                className="text-xl sm:text-2xl font-serif font-bold text-[#0B3D5E] tracking-tight leading-snug mt-6 mb-3"
              >
                {block.text}
              </h3>
            );
          }

          case "lead_quote":
            return (
              <div
                key={idx}
                className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#FBBF24]/15 via-[#F59E0B]/8 to-transparent border-l-4 border-[#FBBF24] my-6 shadow-xs"
              >
                <p className="text-lg sm:text-xl font-serif italic text-[#0B3D5E] leading-relaxed">
                  "{block.text}"
                </p>
              </div>
            );

          case "quote":
            return (
              <blockquote
                key={idx}
                className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-l-4 border-[#F59E0B] my-6 italic text-[#0B3D5E] font-serif text-base sm:text-lg leading-relaxed"
              >
                {renderInlineFormatting(block.text)}
              </blockquote>
            );

          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <div key={idx} className="my-5">
                <ListTag
                  className={`space-y-2.5 pl-6 text-slate-800 text-base sm:text-[1.125rem] leading-relaxed ${
                    block.ordered
                      ? "list-decimal marker:text-[#0B3D5E] marker:font-bold"
                      : "list-disc marker:text-[#F59E0B]"
                  }`}
                >
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="pl-1">
                      {renderInlineFormatting(item)}
                    </li>
                  ))}
                </ListTag>
              </div>
            );
          }

          case "divider":
            return (
              <div
                key={idx}
                className="my-8 sm:my-10 flex items-center justify-center gap-4 text-[#F59E0B]/60 select-none"
              >
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#FBBF24]" />
                <Waves className="w-4 h-4 text-[#F59E0B]" />
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#FBBF24]" />
              </div>
            );

          case "paragraph":
          default:
            return (
              <p
                key={idx}
                className="text-base sm:text-[1.125rem] text-slate-800 leading-[2.15] font-sans font-normal selection:bg-[#FBBF24]/30"
              >
                {renderInlineFormatting(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}

/* ───── Clean Excerpt Helper: Strips Raw Tables & Markdown for Clean Card Teasers ───── */
export function cleanExcerpt(text: string): string {
  if (!text) return "";
  return text
    .replace(/<table[\s\S]*?<\/table>/gi, " ")
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (trimmed.includes("|") && splitPipeRow(trimmed).length >= 2) return false;
      if (trimmed.includes("\t")) return false;
      if (/^[-*_]{3,}$/.test(trimmed)) return false;
      if (trimmed.startsWith("#")) return false;
      return true;
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
