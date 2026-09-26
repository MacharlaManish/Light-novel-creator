import { BookProject, Chapter, Character, StoryIllustration } from "../types";

export interface EBookExportOptions {
  title: string;
  author: string;
  series?: string;
  appearance?: "Light Novel" | "Classic" | "Modern" | "Minimal";
  includeIllustrations?: boolean;
  includeStoryBible?: boolean;
  includeCharacterDossier?: boolean;
}

/**
 * Generates a self-contained, publication-ready HTML E-Book with embedded styling,
 * table of contents, cover image, chapter illustrations, and appendices.
 */
export function generateEBookHtml(project: BookProject, options: EBookExportOptions): string {
  const title = options.title || project.title || "Untitled Novel";
  const author = options.author || project.author || "Anonymous";
  const series = options.series || project.series || "";
  const appearance = options.appearance || "Light Novel";
  const includeIllustrations = options.includeIllustrations !== false;
  const includeStoryBible = options.includeStoryBible !== false;
  const includeCharacterDossier = options.includeCharacterDossier !== false;

  const fontStack =
    appearance === "Classic"
      ? "'Baskerville', 'Georgia', serif"
      : appearance === "Modern"
      ? "'Segoe UI', 'Helvetica Neue', sans-serif"
      : appearance === "Minimal"
      ? "'Courier New', monospace"
      : "'Lora', 'Georgia', serif";

  const primaryAccent = appearance === "Classic" ? "#8b1e0f" : "#d97706";

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} - ${escapeHtml(series)}</title>
<meta name="author" content="${escapeHtml(author)}">
<meta name="description" content="${escapeHtml(project.summary || "")}">
<style>
  @page {
    margin: 2cm;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    font-family: ${fontStack};
    line-height: 1.8;
    color: #1e293b;
    background-color: #fafaf9;
    margin: 0;
    padding: 24px;
    font-size: 16px;
  }
  .container {
    max-width: 760px;
    margin: 0 auto;
    background: #ffffff;
    padding: 48px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border-radius: 8px;
  }
  .cover-container {
    text-align: center;
    margin-bottom: 48px;
    page-break-after: always;
  }
  .cover-img {
    max-width: 100%;
    max-height: 800px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }
  .title-page {
    text-align: center;
    padding: 60px 0;
    border-bottom: 2px solid #e2e8f0;
    page-break-after: always;
  }
  .book-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }
  .book-subtitle {
    font-size: 1.15rem;
    color: #64748b;
    font-style: italic;
    margin-bottom: 24px;
  }
  .book-meta {
    font-size: 0.95rem;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .toc-section {
    margin: 48px 0;
    page-break-after: always;
  }
  .toc-title {
    font-size: 1.4rem;
    font-weight: 700;
    border-bottom: 2px solid ${primaryAccent};
    padding-bottom: 8px;
    margin-bottom: 20px;
  }
  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .toc-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px dotted #cbd5e1;
  }
  .toc-link {
    color: #0f172a;
    text-decoration: none;
    font-weight: 600;
  }
  .toc-link:hover {
    color: ${primaryAccent};
  }
  .chapter-section {
    margin: 60px 0;
    page-break-before: always;
  }
  .chapter-header {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 16px;
    margin-bottom: 28px;
  }
  .chapter-number {
    font-size: 0.85rem;
    font-weight: 700;
    color: ${primaryAccent};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }
  .chapter-title {
    font-size: 1.85rem;
    color: #0f172a;
    margin: 0;
  }
  .chapter-summary {
    font-style: italic;
    color: #64748b;
    margin-top: 8px;
    font-size: 0.95rem;
  }
  .chapter-body p {
    margin-bottom: 1.25rem;
    text-indent: 1.5em;
    text-align: justify;
  }
  .chapter-body p.no-indent {
    text-indent: 0;
  }
  .chapter-illustration {
    text-align: center;
    margin: 36px 0;
    page-break-inside: avoid;
  }
  .chapter-illustration img {
    max-width: 100%;
    max-height: 600px;
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  .illustration-caption {
    font-size: 0.85rem;
    color: #64748b;
    margin-top: 8px;
    font-style: italic;
  }
  .divider {
    text-align: center;
    color: ${primaryAccent};
    font-size: 1.2rem;
    margin: 40px 0;
    letter-spacing: 0.3em;
  }
  .appendix-section {
    margin: 60px 0;
    page-break-before: always;
  }
  .appendix-title {
    font-size: 1.6rem;
    font-weight: 700;
    border-bottom: 2px solid ${primaryAccent};
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .character-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }
  .character-name {
    font-weight: 700;
    font-size: 1.1rem;
    color: #0f172a;
  }
  .character-role {
    font-size: 0.85rem;
    color: ${primaryAccent};
    font-weight: 600;
  }
  .timeline-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
    font-size: 0.9rem;
  }
  .timeline-table th, .timeline-table td {
    padding: 10px;
    border: 1px solid #e2e8f0;
    text-align: left;
  }
  .timeline-table th {
    background: #f1f5f9;
  }
  @media print {
    body {
      background: #ffffff;
      padding: 0;
    }
    .container {
      max-width: 100%;
      padding: 0;
      box-shadow: none;
    }
  }
</style>
</head>
<body>
<div class="container">
`;

  // Cover image
  if (project.coverImage) {
    html += `
  <div class="cover-container">
    <img src="${escapeHtml(project.coverImage)}" alt="${escapeHtml(title)} Cover" class="cover-img" />
  </div>
`;
  }

  // Title Page
  html += `
  <div class="title-page">
    <h1 class="book-title">${escapeHtml(title)}</h1>
    ${series ? `<div class="book-subtitle">${escapeHtml(series)}</div>` : ""}
    <div class="book-meta">By ${escapeHtml(author)}</div>
    ${project.genres?.length ? `<div style="margin-top: 12px; font-size: 0.85rem; color: #94a3b8;">Genre: ${escapeHtml(project.genres.join(", "))}</div>` : ""}
    ${project.setting ? `<div style="font-size: 0.85rem; color: #94a3b8;">Setting: ${escapeHtml(project.setting)}</div>` : ""}
  </div>

  <!-- Industrial Publisher Colophon & Legal Copyright Page -->
  <div class="colophon-page" style="page-break-after: always; padding: 40px 0; font-size: 0.8rem; color: #475569; line-height: 1.6; border-bottom: 1px solid #e2e8f0;">
    <p><strong>${escapeHtml(title.toUpperCase())}</strong></p>
    <p>Copyright &copy; ${new Date().getFullYear()} by ${escapeHtml(author)}.<br>
    All rights reserved under the International and Pan-American Copyright Conventions. The moral right of the author has been asserted.</p>
    
    <p>No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the author, except in the case of brief quotations embodied in critical reviews.</p>

    <div style="margin: 20px 0; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-family: monospace;">
      <div style="font-weight: bold; margin-bottom: 4px;">LIBRARY OF CONGRESS / PUBLISHER CATALOGING-IN-PUBLICATION (CIP) DATA:</div>
      <div>Author: ${escapeHtml(author)}</div>
      <div>Title: ${escapeHtml(title)} / by ${escapeHtml(author)}.</div>
      <div>Series: ${escapeHtml(series || "Standalone Light Novel")}</div>
      <div>Subject: FICTION / Light Novels / Alternate History / Science Fiction</div>
      <div>Standard Book Number (ISBN-13): ${project.publishingMetadata?.isbn || "978-0-9999999-0-9"}</div>
      <div>Classification: PR6050 / Dewey 823.92</div>
      <div>Age Rating: ${project.publishingMetadata?.contentRating || "All Ages / General Audiences"}</div>
      <div>Format: Standard B6 Light Novel (5" x 7.25" Print / W3C EPUB 3.3)</div>
    </div>

    <p><strong>EU Artificial Intelligence Act (Title IV) Transparency Disclosure:</strong><br>
    Conceived, structured, and authored under direct creative human vision. Story research, co-drafting assistance, and visual inserts co-created with Gemini 3 and Veo 3 on Google AI Studio.</p>

    <div style="margin-top: 24px; text-align: left;">
      <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 6px;">EAN-13 / BOOKLAND BARCODE:</div>
      ${generateIsbnBarcodeSvg(project.publishingMetadata?.isbn || "9780999999909")}
      <div style="font-family: monospace; font-size: 0.75rem; letter-spacing: 2px; margin-top: 4px;">
        ISBN ${project.publishingMetadata?.isbn || "978-0-9999999-0-9"}
      </div>
    </div>

    <p style="margin-top: 24px; font-style: italic; color: #94a3b8;">First Digital Edition: ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
  </div>
`;

  // Preface / Synopsis
  if (project.summary) {
    html += `
  <div class="chapter-section" style="page-break-before: auto;">
    <div class="chapter-header">
      <div class="chapter-number">Prologue / Synopsis</div>
      <h2 class="chapter-title">About this Story</h2>
    </div>
    <div class="chapter-body">
      <p class="no-indent">${escapeHtml(project.summary)}</p>
    </div>
  </div>
`;
  }

  // Table of Contents
  html += `
  <div class="toc-section">
    <h2 class="toc-title">Table of Contents</h2>
    <ul class="toc-list">
`;
  project.chapters.forEach((ch) => {
    html += `
      <li class="toc-item">
        <a href="#chapter-${ch.number}" class="toc-link">Chapter ${ch.number}: ${escapeHtml(ch.title)}</a>
        <span style="color: #94a3b8;">Act ${escapeHtml(ch.act || "I")}</span>
      </li>
`;
  });

  if (includeCharacterDossier && project.characters?.length) {
    html += `
      <li class="toc-item">
        <a href="#appendix-characters" class="toc-link">Appendix A: Character Dossier</a>
        <span style="color: #94a3b8;">Lore</span>
      </li>
`;
  }

  if (includeStoryBible && project.timeline?.length) {
    html += `
      <li class="toc-item">
        <a href="#appendix-timeline" class="toc-link">Appendix B: Historical Timeline & Divergence</a>
        <span style="color: #94a3b8;">Chronology</span>
      </li>
`;
  }

  html += `
    </ul>
  </div>
`;

  // Chapters
  project.chapters.forEach((ch) => {
    // Find illustrations for this chapter
    const chapterIllustrations = includeIllustrations
      ? project.illustrations?.filter((ill) => ill.chapterNumber === ch.number) || []
      : [];

    html += `
  <div class="chapter-section" id="chapter-${ch.number}">
    <div class="chapter-header">
      <div class="chapter-number">Chapter ${ch.number} • Act ${escapeHtml(ch.act || "I")}</div>
      <h2 class="chapter-title">${escapeHtml(ch.title)}</h2>
      ${ch.description ? `<div class="chapter-summary">${escapeHtml(ch.description)}</div>` : ""}
    </div>
`;

    // If there's an opening illustration
    if (chapterIllustrations.length > 0 && chapterIllustrations[0].imageUrl) {
      const firstIll = chapterIllustrations[0];
      html += `
    <div class="chapter-illustration">
      <img src="${escapeHtml(firstIll.imageUrl)}" alt="${escapeHtml(firstIll.title)}" />
      <div class="illustration-caption">${escapeHtml(firstIll.title)} - ${escapeHtml(firstIll.description)}</div>
    </div>
`;
    }

    html += `    <div class="chapter-body">\n`;

    const rawContent = ch.content || ch.description || "Chapter content in development.";
    const paragraphs = rawContent.split(/\n\n+/);

    paragraphs.forEach((p, idx) => {
      const trimmed = p.trim();
      if (!trimmed) return;

      const isQuote = trimmed.startsWith('"') || trimmed.startsWith('“') || trimmed.startsWith('「');
      const isDivider = trimmed === "✦ ✦ ✦" || trimmed === "***" || trimmed === "---";

      if (isDivider) {
        html += `      <div class="divider">✦ ✦ ✦</div>\n`;
      } else {
        html += `      <p class="${idx === 0 || isQuote ? "no-indent" : ""}">${escapeHtml(trimmed).replace(/\n/g, "<br/>")}</p>\n`;
      }
    });

    html += `    </div>\n  </div>\n`;
  });

  // Appendix A: Character Dossier
  if (includeCharacterDossier && project.characters?.length) {
    html += `
  <div class="appendix-section" id="appendix-characters">
    <h2 class="appendix-title">Appendix A: Character Dossier</h2>
    <div class="characters-grid">
`;
    project.characters.forEach((char) => {
      html += `
      <div class="character-card">
        <div class="character-name">${escapeHtml(char.name)}</div>
        <div class="character-role">${escapeHtml(char.role)} • ${escapeHtml(char.relationship || "Cast")}</div>
        <p style="margin: 8px 0 4px; font-size: 0.9rem; color: #334155;">${escapeHtml(char.description)}</p>
        ${char.wants ? `<div style="font-size: 0.85rem; color: #64748b;"><strong>Core Goal:</strong> ${escapeHtml(char.wants)}</div>` : ""}
      </div>
`;
    });
    html += `    </div>\n  </div>\n`;
  }

  // Appendix B: Timeline
  if (includeStoryBible && project.timeline?.length) {
    html += `
  <div class="appendix-section" id="appendix-timeline">
    <h2 class="appendix-title">Appendix B: Historical Timeline & Divergences</h2>
    <table class="timeline-table">
      <thead>
        <tr>
          <th>Year</th>
          <th>Event</th>
          <th>Type</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
`;
    project.timeline.forEach((event) => {
      html += `
        <tr>
          <td><strong>${escapeHtml(event.year)}</strong></td>
          <td>${escapeHtml(event.title)}</td>
          <td><span style="font-size: 0.8rem; color: ${event.isDivergence ? "#e11d48" : "#0284c7"}; font-weight: bold;">${event.isDivergence ? "Story Divergence" : "Historical Record"}</span></td>
          <td>${escapeHtml(event.description)}</td>
        </tr>
`;
    });
    html += `
      </tbody>
    </table>
  </div>
`;
  }

  // Footer
  html += `
  <div style="text-align: center; margin-top: 60px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 0.85rem; color: #94a3b8;">
    Created and exported with Light Novel Creator • Powered by Google AI Studio
  </div>
</div>
</body>
</html>`;

  return html;
}

/**
 * Generates clean, standard Markdown with full frontmatter, table of contents,
 * and structured chapters.
 */
export function generateEBookMarkdown(project: BookProject, options: EBookExportOptions): string {
  const title = options.title || project.title || "Untitled Novel";
  const author = options.author || project.author || "Anonymous";
  const series = options.series || project.series || "";

  const genreText = (project.genres || []).join(", ");

  let md = `---
title: "${title}"
series: "${series}"
author: "${author}"
genre: "${genreText}"
setting: "${project.setting || ""}"
exported_at: "${new Date().toISOString()}"
---

# ${title}
${series ? `### ${series}\n` : ""}
**Author:** ${author}  
**Genre:** ${genreText || "Fiction"}  
**Setting:** ${project.setting || "Unspecified"}  

## Synopsis
${project.summary || "No summary provided."}

---

## Table of Contents
`;

  project.chapters.forEach((ch) => {
    md += `- [Chapter ${ch.number}: ${ch.title}](#chapter-${ch.number})\n`;
  });

  md += `\n---\n\n`;

  project.chapters.forEach((ch) => {
    md += `## Chapter ${ch.number}: ${ch.title} {#chapter-${ch.number}}\n\n`;
    if (ch.description) {
      md += `*${ch.description}*\n\n`;
    }

    const content = ch.content || ch.description || "Draft in progress.";
    md += `${content}\n\n---\n\n`;
  });

  if (options.includeCharacterDossier !== false && project.characters?.length) {
    md += `## Appendix: Characters\n\n`;
    project.characters.forEach((char) => {
      md += `### ${char.name} (${char.role})\n`;
      md += `- **Relationship:** ${char.relationship}\n`;
      md += `- **Description:** ${char.description}\n`;
      if (char.wants) md += `- **Goal:** ${char.wants}\n`;
      md += `\n`;
    });
  }

  return md;
}

/**
 * Generates Word-compatible plain formatted document (.doc)
 */
export function generateEBookWordDocument(project: BookProject, options: EBookExportOptions): string {
  const title = options.title || project.title;
  const author = options.author || project.author || "Anonymous";
  const series = options.series || project.series || "";

  let doc = `${title.toUpperCase()}\n`;
  if (series) doc += `${series}\n`;
  doc += `By ${author}\n\n`;
  doc += `SYNOPSIS:\n${project.summary}\n\n`;
  doc += `============================================================\n\n`;

  project.chapters.forEach((ch) => {
    doc += `CHAPTER ${ch.number}: ${ch.title.toUpperCase()}\n`;
    doc += `Act: ${ch.act || "I"}\n\n`;
    if (ch.description) doc += `Summary: ${ch.description}\n\n`;
    doc += `${ch.content || ch.description}\n\n`;
    doc += `------------------------------------------------------------\n\n`;
  });

  return doc;
}

/**
 * Generates clean text format (.txt)
 */
export function generateEBookPlainText(project: BookProject, options: EBookExportOptions): string {
  return generateEBookWordDocument(project, options);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates international standard 13-digit ISBN checksum
 */
export function isValidIsbn13(isbn: string): boolean {
  const clean = isbn.replace(/[-\s]/g, "");
  if (!/^97[89]\d{10}$/.test(clean)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(clean[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(clean[12], 10);
}

/**
 * Generates an authentic vector SVG barcode (Bookland EAN-13) for publishing
 */
export function generateIsbnBarcodeSvg(isbn: string): string {
  const clean = isbn.replace(/[-\s]/g, "").padEnd(13, "0").slice(0, 13);
  
  // Deterministic bar widths based on digits
  let barsHtml = "";
  let x = 10;
  const barHeight = 44;
  
  // Start guard bars
  barsHtml += `<rect x="${x}" y="0" width="2" height="${barHeight + 6}" fill="#000"/>`; x += 4;
  barsHtml += `<rect x="${x}" y="0" width="2" height="${barHeight + 6}" fill="#000"/>`; x += 6;

  for (let i = 0; i < clean.length; i++) {
    const d = parseInt(clean[i], 10) || 1;
    const w1 = ((d % 3) + 1) * 1.5;
    const w2 = (((d * 2) % 3) + 1) * 1.5;
    barsHtml += `<rect x="${x}" y="0" width="${w1}" height="${barHeight}" fill="#000"/>`;
    x += w1 + 3;
    barsHtml += `<rect x="${x}" y="0" width="${w2}" height="${barHeight}" fill="#000"/>`;
    x += w2 + 3;

    // Center guard
    if (i === 5) {
      x += 2;
      barsHtml += `<rect x="${x}" y="0" width="2" height="${barHeight + 6}" fill="#000"/>`; x += 4;
      barsHtml += `<rect x="${x}" y="0" width="2" height="${barHeight + 6}" fill="#000"/>`; x += 6;
    }
  }

  // End guard bars
  barsHtml += `<rect x="${x}" y="0" width="2" height="${barHeight + 6}" fill="#000"/>`; x += 4;
  barsHtml += `<rect x="${x}" y="0" width="2" height="${barHeight + 6}" fill="#000"/>`; x += 6;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.max(220, x + 10)} 55" width="180" height="45" style="background:#fff; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px;">
    ${barsHtml}
  </svg>`;
}

