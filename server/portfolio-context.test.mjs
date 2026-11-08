import test from "node:test";
import assert from "node:assert/strict";
import { CURRENT_CASES, CURRENT_PORTFOLIO_OWNER, selectCurrentCases, getCurrentPortfolioContext, currentCaseSources, shouldSearchArchive } from "./portfolio-context.mjs";

test("portfolio catalogue contains seven unique live case URLs", () => {
  assert.equal(CURRENT_PORTFOLIO_OWNER, "Viktoriya Lihvoinen");
  assert.equal(CURRENT_CASES.length, 7);
  assert.equal(new Set(CURRENT_CASES.map((c) => c.url)).size, 7);
  assert.ok(CURRENT_CASES.every((c) => c.url.startsWith("https://vik.ooo/case-studies/")));
});
test("broad portfolio question returns all seven current cases", () => {
  const found = selectCurrentCases("Tell me about your projects");
  assert.equal(found.length, 7);
  assert.ok(found.some((c) => c.slug === "accessbloom"));
  assert.ok(found.some((c) => c.slug === "sakustars-2022"));
});
test("specific projects retrieve the published case content", () => {
  const c = getCurrentPortfolioContext("What did Viktoriya design for SAKUstars?");
  assert.equal(c.selected[0].slug, "sakustars-2022");
  assert.match(c.detail, /WordPress/i);
  assert.match(c.overview, /Viktoriya Lihvoinen/);
});
test("accessibility chooses AccessBloom and sources its case page", () => {
  const selected = selectCurrentCases("Tell me about your accessibility checker");
  assert.ok(selected.some((c) => c.slug === "accessbloom"));
  assert.ok(currentCaseSources("", selected).some((s) => s.url.endsWith("/accessbloom/")));
});
test("older indexed PDF projects are still reachable", () => {
  assert.equal(shouldSearchArchive("Tell me about my Bachelor's thesis", []), true);
  assert.equal(shouldSearchArchive("Tell me about CleanPeer", selectCurrentCases("CleanPeer")), false);
});

test("responsible AI questions select LeaveReady rather than unrelated archives", () => {
  assert.ok(selectCurrentCases("How do you design responsible AI experiences?").some((c) => c.slug === "leaveready"));
});
