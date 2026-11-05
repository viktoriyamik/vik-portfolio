/* SAKUstars portfolio: show the document viewer only when an actual PDF is served.
 * Prevents a missing /cases/*.pdf route from displaying the site HTML inside an iframe.
 */
(async () => {
  const section = document.getElementById('portfolio-pdf');
  const nav = document.querySelector('[data-pdf-nav]');
  const viewer = section?.querySelector('iframe[data-pdf-src]');
  if (!section || !viewer) return;
  const file = '/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf';
  try {
    const response = await fetch(file, {method:'HEAD', cache:'no-store'});
    const mime = response.headers.get('content-type') || '';
    if (!response.ok || !/^application\/(?:pdf|octet-stream)/i.test(mime)) return;
    section.hidden = false;
    if (nav) nav.hidden = false;
    viewer.src = viewer.dataset.pdfSrc;
  } catch (_) {
    // Keep links hidden instead of showing the website in a missing-PDF iframe.
  }
})();
