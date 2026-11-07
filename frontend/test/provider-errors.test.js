import assert from "node:assert/strict";
import test from "node:test";
import { isProviderTimeout } from "../../supabase/functions/generate-plan/provider-errors.js";

test("recognizes provider timeouts without classifying other errors as timeouts", () => {
  const timeout = new Error("The operation timed out");
  timeout.name = "TimeoutError";

  assert.equal(isProviderTimeout(timeout), true);
  assert.equal(isProviderTimeout(new Error("Invalid JSON response")), false);
  assert.equal(isProviderTimeout(null), false);
});
