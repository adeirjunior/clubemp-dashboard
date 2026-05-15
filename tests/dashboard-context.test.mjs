import assert from "node:assert/strict";
import test from "node:test";
import {
  getActiveDashboardContext,
  getDashboardContextLabel,
  getDashboardContextPath,
} from "../lib/dashboard-context.mjs";

test("returns the matching active dashboard context when key exists", () => {
  const contexts = [
    { key: "admin", label: "Admin", path: "/" },
    { key: "company", label: "Empresa", path: "/" },
  ];

  assert.deepEqual(getActiveDashboardContext(contexts, "company"), contexts[1]);
});

test("falls back to the first context when the active key is missing", () => {
  const contexts = [
    { key: "admin", label: "Admin", path: "/" },
    { key: "company", label: "Empresa", path: "/" },
  ];

  assert.deepEqual(getActiveDashboardContext(contexts, "missing"), contexts[0]);
});

test("returns login path when context path is empty", () => {
  assert.equal(getDashboardContextPath({ path: "  " }), "/login");
});

test("returns label fallback when label is empty", () => {
  assert.equal(getDashboardContextLabel({ label: " " }), "Modo atual");
});
