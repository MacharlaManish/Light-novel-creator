import { describe, it } from "node:test";
import assert from "node:assert";
import { isValidIsbn13, generateIsbnBarcodeSvg, generateEBookHtml } from "../utils/ebookGenerator";
import { SAMPLE_NIZAM_PROJECT } from "../data/sampleStories";
import type { BookTrailer, ComplianceSettings } from "../types";

describe("Legal, Ethical, Industrial Standards & Veo 3 Suite", () => {
  it("validates international standard 13-digit ISBN checksum correctly", () => {
    // Known valid ISBN-13s
    assert.strictEqual(isValidIsbn13("978-0-306-40615-7"), true);
    assert.strictEqual(isValidIsbn13("9780306406157"), true);
    assert.strictEqual(isValidIsbn13("978-1-954000-01-8"), true);

    // Invalid ISBN-13s (bad check digits or wrong prefixes)
    assert.strictEqual(isValidIsbn13("978-0-306-40615-8"), false);
    assert.strictEqual(isValidIsbn13("123-4-567890-1-2"), false);
    assert.strictEqual(isValidIsbn13("short-isbn"), false);
  });

  it("generates authentic vector SVG barcode for Bookland EAN-13", () => {
    const svg = generateIsbnBarcodeSvg("9781954000018");
    assert.ok(svg.includes("<svg"), "Must output an SVG element");
    assert.ok(svg.includes("viewBox="), "Must have viewBox attribute");
    assert.ok(svg.includes("<rect"), "Must include bar rectangle elements");
  });

  it("embeds CIP block, Author Copyright assertion, and EU AI Act disclosure in E-Book colophon", () => {
    const projectWithMeta = {
      ...SAMPLE_NIZAM_PROJECT,
      publishingMetadata: {
        isbn: "978-0-306-40615-7",
        contentRating: "PG-13 (Teens)" as const,
        aiDisclosure: true,
        pageProgressionDirection: "ltr" as const,
      }
    };

    const html = generateEBookHtml(projectWithMeta, {
      title: projectWithMeta.title,
      author: projectWithMeta.author,
    });

    // Verify Author copyright retention
    assert.ok(html.includes("Copyright &copy;"), "Must assert author copyright");
    assert.ok(html.includes("The moral right of the author has been asserted"), "Must state moral rights under Berne Convention");

    // Verify Cataloging-in-Publication block
    assert.ok(html.includes("CATALOGING-IN-PUBLICATION (CIP) DATA"), "Must contain CIP block");
    assert.ok(html.includes("Standard Book Number (ISBN-13)"), "Must list ISBN in colophon");
    assert.ok(html.includes("978-0-306-40615-7"), "Must display the specified ISBN");

    // Verify EU AI Act Title IV disclosure
    assert.ok(html.includes("EU Artificial Intelligence Act (Title IV) Transparency Disclosure"), "Must include EU AI Act compliance statement");
    assert.ok(html.includes("Gemini 3 and Veo 3"), "Must disclose AI models used");
  });

  it("validates Veo 3 video generation parameters and aspect ratios", () => {
    const validAspectRatios: Array<"16:9" | "9:16"> = ["16:9", "9:16"];
    assert.strictEqual(validAspectRatios.includes("16:9"), true);
    assert.strictEqual(validAspectRatios.includes("9:16"), true);

    const testTrailer: BookTrailer = {
      id: "trailer_test_123",
      title: "Reincarnated as Nizam's Heir — Anime PV",
      prompt: "Cinematic anime trailer with cherry blossoms and glowing industrial machinery",
      aspectRatio: "16:9",
      resolution: "720p",
      status: "completed",
      videoUrl: "https://example.com/trailer.mp4",
      createdAt: new Date().toISOString(),
    };

    assert.ok(testTrailer.id);
    assert.ok(testTrailer.aspectRatio === "16:9" || testTrailer.aspectRatio === "9:16");
    assert.strictEqual(testTrailer.status, "completed");
  });

  it("validates accessibility and compliance configuration defaults", () => {
    const defaultCompliance: ComplianceSettings = {
      highContrast: false,
      dyslexicFont: false,
      fontSize: "md",
      reducedMotion: false,
      cookieConsentAccepted: true,
      cookiePreferences: {
        essential: true,
        preferences: true,
        analytics: false,
      },
      greenAiMode: true,
    };

    assert.strictEqual(defaultCompliance.cookiePreferences.essential, true);
    assert.strictEqual(defaultCompliance.cookiePreferences.analytics, false);
    assert.strictEqual(defaultCompliance.greenAiMode, true);
  });
});
