(() => {
  "use strict";

  const pricingCopy = {
    "AIユーザー": "1,000円 / 人月",
    "組織管理者": "3,000円 / 人月",
  };
  const workspaceLabels = new Set([
    "Workspaceユーザー",
    "Workspace User",
  ]);
  const note =
    "プラグイン利用料、利用用途によりプラットフォーム利用料、プラグイン開発料等別途発生する場合があります。";

  const directText = (element) =>
    Array.from(element.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent)
      .join("")
      .trim();

  const findPricingSection = () => {
    const heading = Array.from(document.querySelectorAll("h1, h2, h3")).find(
      (element) => element.textContent.trim() === "料金プラン",
    );
    return heading && heading.closest("section");
  };

  const findPlanCard = (label) => {
    let candidate = label.parentElement;
    while (candidate && candidate.tagName !== "SECTION") {
      const text = candidate.textContent;
      if (/(?:[\d,.]+円|¥[\d,.]+).*?\//.test(text) && candidate.children.length >= 3) {
        return candidate;
      }
      candidate = candidate.parentElement;
    }
    return null;
  };

  const updatePricing = () => {
    const section = findPricingSection();
    if (!section) return;

    for (const element of section.querySelectorAll("*")) {
      const text = element.textContent.trim();

      if (workspaceLabels.has(text)) {
        const card = findPlanCard(element);
        if (card) card.remove();
        continue;
      }

      if (Object.hasOwn(pricingCopy, text)) {
        const card = findPlanCard(element);
        if (!card) continue;
        const price = Array.from(card.querySelectorAll("*")).find((candidate) =>
          /(?:円|¥).*?(?:人月|user|mo)|[\d,.]+円\s*\/\s*人月/.test(
            directText(candidate),
          ),
        );
        if (price && price.textContent !== pricingCopy[text]) {
          price.textContent = pricingCopy[text];
        }
      }
    }

    const currentNote = Array.from(section.querySelectorAll("p")).find((element) =>
      /別途|別料金|priced separately/.test(element.textContent),
    );
    if (currentNote && currentNote.textContent !== note) {
      currentNote.textContent = note;
    }
  };

  const observer = new MutationObserver(updatePricing);
  observer.observe(document.getElementById("root"), {
    childList: true,
    subtree: true,
  });
  updatePricing();
})();
