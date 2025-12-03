import test from "node:test";
import assert from "node:assert/strict";
import { createEmptyState } from "../src/state.js";

test("createEmptyState returns empty items", () => {
  const s = createEmptyState();
  assert.equal(Array.isArray(s.items), true);
  assert.equal(s.items.length, 0);
});