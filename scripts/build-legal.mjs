import { mkdir, readFile, writeFile } from "node:fs/promises";

const documents = [
  { slug: "privacy", file: "privacy-policy.md", title: "プライバシーポリシー", description: "株式会社コトリノが提供するAIGen Oneの個人情報の取扱い、AI・外部連携、開示・削除の窓口について。" },
  { slug: "terms", file: "terms-of-service.md", title: "利用規約", description: "株式会社コトリノが提供するAIGen Oneの利用条件、業務データ・AI出力の扱い、契約・解約について。" },
];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function inline(value) {
  // Only known link schemes are rendered; raw HTML in the source stays text.
  return value.split(/(\[[^\]]+\]\((?:https:\/\/[^\s)]+|mailto:[^\s)]+|\/(?:privacy|terms)\/)\))/g).map((part) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    return link ? `<a href="${escapeHtml(link[2])}">${escapeHtml(link[1])}</a>` : escapeHtml(part);
  }).join("");
}

for (const document of documents) {
  const source = await readFile(new URL(`../content/legal/${document.file}`, import.meta.url), "utf8");
  const headings = [];
  const body = source.trim().split(/\n\s*\n/).filter((block) => !block.startsWith("# ")).map((block) => {
    if (block.startsWith("## ")) {
      const title = block.slice(3);
      headings.push(title);
      return `<h2 id="section-${headings.length}">${escapeHtml(title)}</h2>`;
    }
    if (block.startsWith("- ")) return `<ul>${block.split("\n").map((line) => `<li>${inline(line.slice(2))}</li>`).join("")}</ul>`;
    return `<p>${inline(block.replaceAll("\n", " "))}</p>`;
  }).join("\n");
  const navigation = documents.map((item) => `<a href="/${item.slug}/"${item.slug === document.slug ? ' aria-current="page"' : ""}>${item.title}</a>`).join("\n");
  const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${document.title} | AIGen One</title>
  <meta name="description" content="${document.description}">
  <link rel="canonical" href="https://www.aigen.tokyo/${document.slug}/">
  <link rel="stylesheet" href="/legal.css?v=20261029">
</head>
<body id="top">
  <a class="skip-link" href="#main-content">本文へ移動</a>
  <header class="site-header"><div class="header-inner">
    <a class="logo" href="/ja">AiGen-One.</a>
    <a href="/ja">製品サイトへ戻る <span aria-hidden="true">↗</span></a>
  </div></header>
  <div class="legal-layout">
    <aside class="legal-sidebar">
      <p class="eyebrow">LEGAL</p>
      <nav class="document-nav" aria-label="規約・ポリシー">${navigation}</nav>
      <details class="table-of-contents"><summary>この文書の目次</summary>
        <ol>${headings.map((heading, index) => `<li><a href="#section-${index + 1}">${escapeHtml(heading)}</a></li>`).join("")}</ol>
      </details>
    </aside>
    <main id="main-content" class="legal-document">
      <p class="eyebrow">AIGEN ONE</p>
      <h1>${document.title}</h1>
      ${body}
      <a class="back-top" href="#top">ページの先頭へ戻る ↑</a>
    </main>
  </div>
  <footer class="site-footer"><div class="footer-inner">
    <div><a class="logo" href="/ja">AiGen-One.</a><p>運営：株式会社コトリノ</p></div>
    <nav aria-label="フッターナビゲーション">${navigation}<a href="/contact/?lang=ja">お問い合わせ</a></nav>
  </div></footer>
</body>
</html>
`;
  const target = new URL(`../client/public/${document.slug}/`, import.meta.url);
  await mkdir(target, { recursive: true });
  await writeFile(new URL("index.html", target), html);
}
console.log("Generated /privacy/ and /terms/ from content/legal.");
