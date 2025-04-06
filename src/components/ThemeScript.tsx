'use client'

export default function ThemeScript() {
  const script = `
    (function() {
      try {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const mode = localStorage.getItem('theme-mode') || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-color-scheme', mode);
      } catch (e) {
        console.error('Error detecting theme', e);
      }
    })();
  `;

  return (
    <script dangerouslySetInnerHTML={{ __html: script }} />
  );
}
