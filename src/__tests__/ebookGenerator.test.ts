import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  generateEBookHtml,
  generateEBookMarkdown,
  generateEBookWordDocument,
  generateEBookPlainText
} from "../utils/ebookGenerator";
import { SAMPLE_NIZAM_PROJECT } from "../data/sampleStories";

describe("E-Book Generator Suite", () => {
  const testOptions = {
    title: "Reincarnated as the Nizam's Heir",
    author: "Test Author",
    series: "Volume 1: The Steam & Steel Awakening",
    appearance: "Light Novel" as const,
    includeIllustrations: true,
    includeStoryBible: true,
    includeCharacterDossier: true
  };

  test("generates valid HTML e-book with Title, Author and Series", () => {
    const html = generateEBookHtml(SAMPLE_NIZAM_PROJECT, testOptions);

    assert.ok(html.includes("<!DOCTYPE html>"), "Should contain DOCTYPE");
    assert.ok(html.includes("Reincarnated as the Nizam&#039;s Heir") || html.includes("Reincarnated as the Nizam's Heir"), "Should contain title");
    assert.ok(html.includes("Test Author"), "Should contain author");
    assert.ok(html.includes("Volume 1: The Steam &amp; Steel Awakening") || html.includes("Volume 1: The Steam & Steel Awakening"), "Should contain series");
  });

  test("HTML e-book contains Table of Contents with jump links to every chapter", () => {
    const html = generateEBookHtml(SAMPLE_NIZAM_PROJECT, testOptions);

    assert.ok(html.includes("Table of Contents"), "Should have Table of Contents heading");

    SAMPLE_NIZAM_PROJECT.chapters.forEach((ch) => {
      assert.ok(
        html.includes(`href="#chapter-${ch.number}"`),
        `Should link to chapter ${ch.number}`
      );
      assert.ok(
        html.includes(`id="chapter-${ch.number}"`),
        `Should have target anchor for chapter ${ch.number}`
      );
    });
  });

  test("HTML e-book includes character dossier and timeline appendices when enabled", () => {
    const html = generateEBookHtml(SAMPLE_NIZAM_PROJECT, testOptions);

    assert.ok(html.includes("Appendix A: Character Dossier"), "Should have Character Dossier");
    assert.ok(html.includes("Mir Osman Ali Khan"), "Should list protagonist");
    assert.ok(html.includes("Appendix B: Historical Timeline &amp; Divergences") || html.includes("Appendix B: Historical Timeline & Divergences"), "Should have Timeline");
  });

  test("HTML e-book respects disabled appendices", () => {
    const html = generateEBookHtml(SAMPLE_NIZAM_PROJECT, {
      ...testOptions,
      includeCharacterDossier: false,
      includeStoryBible: false
    });

    assert.ok(!html.includes("Appendix A: Character Dossier"), "Should omit character dossier");
    assert.ok(!html.includes("Appendix B: Historical Timeline"), "Should omit timeline");
  });

  test("generates structured Markdown with frontmatter and table of contents", () => {
    const md = generateEBookMarkdown(SAMPLE_NIZAM_PROJECT, testOptions);

    assert.ok(md.startsWith("---"), "Should have YAML frontmatter start");
    assert.ok(md.includes('title: "Reincarnated as the Nizam\'s Heir"'), "Frontmatter contains title");
    assert.ok(md.includes("## Table of Contents"), "Markdown has Table of Contents");
    assert.ok(md.includes("## Chapter 1:"), "Markdown has Chapter 1 heading");
  });

  test("generates formatted Word (.doc) document and plain text", () => {
    const doc = generateEBookWordDocument(SAMPLE_NIZAM_PROJECT, testOptions);
    const txt = generateEBookPlainText(SAMPLE_NIZAM_PROJECT, testOptions);

    assert.ok(doc.includes("REINCARNATED AS THE NIZAM'S HEIR"), "Word doc has uppercase title");
    assert.ok(doc.includes("CHAPTER 1:"), "Word doc has Chapter 1");
    assert.equal(typeof txt, "string");
    assert.ok(txt.length > 500, "Text document has substantial content");
  });
});
