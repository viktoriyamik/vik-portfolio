/* Reveal optional portfolio media only when the server serves the expected file type.
   Avoid displaying the SPA homepage in a PDF iframe or a broken second video. */
(async () => {
  async function servesFile(url, mimePattern) {
    try {
      const response = await fetch(url, {method: 'HEAD', cache: 'no-store'});
      const type = response.headers.get('content-type') || '';
      return response.ok && mimePattern.test(type);
    } catch (_) {
      return false;
    }
  }

  const fireworks = document.getElementById('salut-animation');
  if (fireworks) {
    const videoUrl = '/cases/sakustars-2022/SAKUstars2022_AnimationAwardCeremonyWithSalut.mp4';
    if (await servesFile(videoUrl, /^(?:video\/mp4|application\/octet-stream)/i)) {
      fireworks.hidden = false;
    }
  }

  const section = document.getElementById('portfolio-pdf');
  const nav = document.querySelector('[data-pdf-nav]');
  const viewer = section?.querySelector('iframe[data-pdf-src]');
  if (!section || !viewer) return;
  const file = '/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf';
  if (await servesFile(file, /^application\/(?:pdf|octet-stream)/i)) {
    section.hidden = false;
    if (nav) nav.hidden = false;
    viewer.src = viewer.dataset.pdfSrc;
  }
})();
