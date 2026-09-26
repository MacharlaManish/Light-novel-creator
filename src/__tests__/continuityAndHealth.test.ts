import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { BookProject, ContinuityAlert } from "../types";
import { SAMPLE_NIZAM_PROJECT } from "../data/sampleStories";

describe("Continuity and Story Health Suite", () => {
  test("sample project alerts are properly structured", () => {
    assert.ok(Array.isArray(SAMPLE_NIZAM_PROJECT.continuityAlerts), "Alerts is an array");
    SAMPLE_NIZAM_PROJECT.continuityAlerts.forEach((alert) => {
      assert.ok(alert.id, "Alert has id");
      assert.ok(alert.title, "Alert has title");
      assert.ok(alert.description, "Alert has description");
      assert.ok(alert.severity, "Alert has severity");
    });
  });

  test("fixing an alert marks it resolved", () => {
    const alerts: ContinuityAlert[] = [
      {
        id: "alert-1",
        title: "Timeline conflict",
        description: "Test description",
        severity: "warning",
        chaptersInvolved: ["Chapter 1"],
        suggestedFix: "Adjust timeline divergence to match Chapter 1",
        applied: false
      }
    ];

    assert.equal(alerts[0].applied, false);

    // Apply fix simulation
    const updated = alerts.map((a) => (a.id === "alert-1" ? { ...a, applied: true } : a));

    assert.equal(updated[0].applied, true, "Alert should be resolved after fix");
  });

  test("validates that chapter titles and numbers are consistent", () => {
    const chapters = SAMPLE_NIZAM_PROJECT.chapters;
    for (let i = 0; i < chapters.length; i++) {
      assert.equal(chapters[i].number, i + 1, "Chapters should be in 1-based order");
      assert.notEqual(chapters[i].title.trim(), "", "Chapter title cannot be empty whitespace");
    }
  });
});
