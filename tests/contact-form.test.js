import { readFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import test from "node:test";

const source = readFileSync(
  new URL("../client/assets/contact-form.js", import.meta.url),
  "utf8",
);
function fixture({
  origin = "https://www.aigen.tokyo",
  pathname = "/contact/",
  valid = true,
  fetchImpl,
} = {}) {
  let submit;
  const values = {
    name: "テスト",
    email: "test@example.invalid",
    company: "",
    subject: "動作確認",
    message: "テスト用入力",
    website: "",
  };
  const status = { textContent: "", className: "" };
  const button = { disabled: true };
  const success = {
    hidden: true,
    focused: false,
    focus() {
      this.focused = true;
    },
  };
  const heading = { hidden: false };
  const form = {
    action: "https://aigen.tokyo/api/public/web-cms/site/contact",
    elements: { consent: { checked: true } },
    hidden: false,
    resets: 0,
    reportValidity: () => valid,
    addEventListener: (_, listener) => {
      submit = listener;
    },
    setAttribute() {},
    removeAttribute() {},
    reset() {
      this.resets++;
    },
  };
  const calls = [];
  const elements = {
    "contact-form": form,
    "contact-submit": button,
    "contact-status": status,
    "contact-success": success,
  };
  vm.runInNewContext(source, {
    document: {
      getElementById: (id) => elements[id],
      querySelector: () => heading,
    },
    window: { origin, location: { pathname } },
    crypto: { randomUUID: () => "stable-submission-id" },
    AbortSignal,
    FormData: class {
      constructor() {
        return Object.entries(values);
      }
    },
    fetch: async (...args) => {
      calls.push(args);
      return fetchImpl
        ? fetchImpl(...args)
        : { ok: true, status: 202, json: async () => ({ accepted: true }) };
    },
  });
  return {
    values,
    form,
    button,
    success,
    status,
    heading,
    calls,
    get submit() {
      return submit;
    },
    send: () => submit({ preventDefault() {} }),
  };
}

test("uses JSON and shows confirmation only after durable acceptance", async () => {
  const f = fixture();
  await f.send();
  assert.equal(f.calls.length, 1);
  const options = f.calls[0][1];
  assert.equal(options.credentials, "omit");
  assert.equal(options.redirect, "error");
  assert.equal(JSON.parse(options.body).consent, true);
  assert.equal(f.form.resets, 1);
  assert.equal(f.form.hidden, true);
  assert.equal(f.heading.hidden, true);
  assert.equal(f.success.hidden, false);
  assert.equal(f.success.focused, true);
});

test("keeps user input and reuses the submission id after a network failure", async () => {
  let attempt = 0;
  const f = fixture({
    fetchImpl: async () => {
      if (attempt++ === 0) throw new TypeError("network");
      return { ok: true, status: 202, json: async () => ({ accepted: true }) };
    },
  });
  await f.send();
  assert.equal(f.form.resets, 0);
  assert.equal(f.success.hidden, true);
  assert.match(f.status.textContent, /入力内容は保持/);
  assert.equal(f.button.disabled, false);
  await f.send();
  assert.equal(
    JSON.parse(f.calls[0][1].body).submissionId,
    JSON.parse(f.calls[1][1].body).submissionId,
  );
});

test("blocks concurrent submissions while the first is pending", async () => {
  let finish;
  const f = fixture({
    fetchImpl: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  const first = f.send();
  await f.send();
  assert.equal(f.calls.length, 1);
  assert.equal(f.button.disabled, true);
  finish({ ok: true, status: 202, json: async () => ({ accepted: true }) });
  await first;
});

test("invalid and whitespace-only values never reach the API", async () => {
  const invalid = fixture({ valid: false });
  await invalid.send();
  assert.equal(invalid.calls.length, 0);
  const blank = fixture();
  blank.values.name = "  ";
  await blank.send();
  assert.equal(blank.calls.length, 0);
  assert.match(blank.status.textContent, /必須項目/);
});

test("does not claim success when the API rejects or returns an unrelated page", async () => {
  for (const response of [
    { ok: false, status: 429, json: async () => ({}) },
    {
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("HTML");
      },
    },
  ]) {
    const f = fixture({ fetchImpl: async () => response });
    await f.send();
    assert.equal(f.form.resets, 0);
    assert.equal(f.success.hidden, true);
    assert.equal(f.status.className, "status error");
  }
});

test("CMS sandbox preview stays disabled and has no submit handler", () => {
  const f = fixture({ origin: "null" });
  assert.equal(f.button.disabled, true);
  assert.equal(f.submit, undefined);
  assert.match(f.status.textContent, /プレビュー/);
});

test("standalone CMS preview also prevents visitor submissions", () => {
  const f = fixture({ pathname: "/api/plugins/web-cms/cms/preview/job/contact/index.html" });
  assert.equal(f.button.disabled, true);
  assert.equal(f.submit, undefined);
});
