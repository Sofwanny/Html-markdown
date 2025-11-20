function convertMarkdown() {
  const inputEl = document.querySelector("#markdown-input");
  const text = inputEl ? inputEl.value : "";

  function convertInline(str) {
    str = str.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
    str = str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    str = str.replace(/(\*\*|__)(.+?)\1/g, '<strong>$2</strong>');
    str = str.replace(/(\*|_)(.+?)\1/g, '<em>$2</em>');
    return str;
  }

  const lines = text.split(/\r?\n/);
  const outParts = lines.map(line => {
    const quoteMatch = line.match(/^\s*>\s+(.*)$/);
    if (quoteMatch) {
      const inner = convertInline(quoteMatch[1].trim());
      return `<blockquote>${inner}</blockquote>`;
    }

    const h3 = line.match(/^\s*#{3}\s+(.*)$/);
    if (h3) return `<h3>${convertInline(h3[1].trim())}</h3>`;

    const h2 = line.match(/^\s*#{2}\s+(.*)$/);
    if (h2) return `<h2>${convertInline(h2[1].trim())}</h2>`;

    const h1 = line.match(/^\s*#{1}\s+(.*)$/);
    if (h1) return `<h1>${convertInline(h1[1].trim())}</h1>`;

    return convertInline(line);
  });

  return outParts.join("");
}

(function setup() {
  const markdownInput = document.querySelector("#markdown-input");
  const htmlOutput = document.querySelector("#html-output");
  const preview = document.querySelector("#preview");

  function update() {
    const html = convertMarkdown();
    if (htmlOutput) htmlOutput.textContent = html;
    if (preview) preview.innerHTML = html;
  }

  if (markdownInput) {
    markdownInput.addEventListener("input", update);
  }

  document.addEventListener("DOMContentLoaded", update);
})();
