(() => {
  // Resolve against this asset so the same files also work inside Web CMS previews.
  const formUrl = new URL("../contact/", document.currentScript.src);
  const currentUrl = new URL(window.location.href);
  if (
    currentUrl.pathname.includes("/cms/preview/") &&
    currentUrl.searchParams.has("token")
  ) {
    formUrl.pathname += "index.html";
    formUrl.searchParams.set("token", currentUrl.searchParams.get("token"));
  }
  const updateLinks = () => {
    document.querySelectorAll('a[href*="d-auchy.studio"]').forEach((link) => {
      const target = new URL(link.href, currentUrl);
      if (
        target.hostname !== "d-auchy.studio" ||
        !/^\/(?:ja\/|en\/|vi\/)?contact\/?$/.test(target.pathname)
      )
        return;
      link.href = formUrl.href;
      link.removeAttribute("target");
    });
  };
  updateLinks();
  // The existing site is rendered by React, including later language changes.
  new MutationObserver(updateLinks).observe(
    document.getElementById("root") || document.body,
    {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    },
  );
})();
