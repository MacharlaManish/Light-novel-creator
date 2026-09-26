import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { SAMPLE_NIZAM_PROJECT } from "../data/sampleStories";

describe("Sample Stories & Data Model Suite", () => {
  test("sample project has required book structure and metadata", () => {
    assert.ok(SAMPLE_NIZAM_PROJECT.id, "Project has valid ID");
    assert.ok(SAMPLE_NIZAM_PROJECT.title, "Project has valid title");
    assert.ok(SAMPLE_NIZAM_PROJECT.protagonistName, "Project has protagonist name");
    assert.ok(SAMPLE_NIZAM_PROJECT.setting, "Project has setting");
    assert.ok(SAMPLE_NIZAM_PROJECT.summary, "Project has summary");
    assert.equal(SAMPLE_NIZAM_PROJECT.isHistorical, true, "Is flagged as historical");
  });

  test("all chapters have sequential numbers and titles", () => {
    assert.ok(SAMPLE_NIZAM_PROJECT.chapters.length >= 6, "Has at least 6 chapters");

    SAMPLE_NIZAM_PROJECT.chapters.forEach((ch, idx) => {
      assert.equal(ch.number, idx + 1, `Chapter at index ${idx} should have number ${idx + 1}`);
      assert.ok(ch.title && ch.title.length > 0, `Chapter ${ch.number} has non-empty title`);
      assert.ok(ch.act, `Chapter ${ch.number} has assigned act`);
      assert.ok(ch.description || ch.content, `Chapter ${ch.number} has description or content`);
    });
  });

  test("characters list includes protagonist and diverse relationships", () => {
    assert.ok(SAMPLE_NIZAM_PROJECT.characters.length >= 3, "Has at least 3 characters");

    const protagonist = SAMPLE_NIZAM_PROJECT.characters.find(
      (c) => c.name === SAMPLE_NIZAM_PROJECT.protagonistName
    );
    assert.ok(protagonist, "Protagonist exists in characters array");
    assert.ok(protagonist?.role, "Protagonist has defined role");

    const hasRivalOrFamily = SAMPLE_NIZAM_PROJECT.characters.some(
      (c) => c.relationship === "Family" || c.relationship === "Rivals" || c.relationship === "Colonial Rival"
    );
    assert.ok(hasRivalOrFamily, "Has family or rival characters");
  });

  test("story bible timeline and technology trackers are populated", () => {
    assert.ok(SAMPLE_NIZAM_PROJECT.timeline.length >= 3, "Timeline has events");
    assert.ok(
      SAMPLE_NIZAM_PROJECT.timeline.some((e) => e.isDivergence),
      "Contains narrative divergence points"
    );

    assert.ok(SAMPLE_NIZAM_PROJECT.technologies.length >= 2, "Contains technologies");
    SAMPLE_NIZAM_PROJECT.technologies.forEach((t) => {
      assert.ok(t.name, "Technology has name");
      assert.ok(t.stage, "Technology has developmental stage");
      assert.ok(t.whyNeeded, "Technology has whyNeeded");
    });
  });
});
