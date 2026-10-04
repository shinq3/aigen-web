(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const button = document.getElementById("contact-submit");
  const status = document.getElementById("contact-status");
  const success = document.getElementById("contact-success");
  let sending = false;
  let submissionId;
  // A CMS sandbox must never send a visitor inquiry while editing the site.
  if (window.origin === "null") {
    status.className = "preview-notice";
    status.textContent =
      "フォームのプレビューです。お問い合わせは公開サイトから送信できます。";
    return;
  }
  button.disabled = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    if (
      ![values.name, values.email, values.subject, values.message].every(
        (value) => String(value || "").trim(),
      )
    ) {
      status.className = "status error";
      status.textContent =
        "必須項目に内容を入力してください。空白だけでは送信できません。";
      return;
    }
    sending = true;
    button.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.className = "status";
    status.textContent = "送信しています…";
    try {
      submissionId ||= crypto.randomUUID();
      const response = await fetch(form.action, {
        method: "POST",
        credentials: "omit",
        redirect: "error",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          submissionId,
          consent: form.elements.consent.checked,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.accepted !== true) {
        const message =
          response.status === 404
            ? "現在フォームの受付を準備しています。時間をおいて、もう一度お試しください。"
            : response.status === 429
              ? "送信回数が多いため、10分ほどおいて再度お試しください。"
              : result.message ||
                "送信できませんでした。入力内容をご確認のうえ、もう一度お試しください。";
        throw new Error(message);
      }
      form.reset();
      form.hidden = true;
      document.querySelector(".form-heading").hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      status.className = "status error";
      status.textContent =
        error.name === "TypeError" || error.name === "TimeoutError"
          ? "通信できませんでした。入力内容は保持されています。接続を確認して、もう一度送信してください。"
          : error.message ||
            "送信できませんでした。時間をおいて再度お試しください。";
    } finally {
      sending = false;
      button.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
})();
