"use client"

export default function ThemeScript() {
  const script = `
    (function() {
      try {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const mode = localStorage.getItem('theme-mode') || (prefersDark ? 'dark' : 'light');

        // Aplicar el tema como clase (sin sobrescribir estilos inline)
        document.documentElement.setAttribute('data-color-scheme', mode);

        if (mode === 'dark') {
          document.documentElement.classList.add('dark-theme');
          document.body.classList.add('dark-theme');
        } else {
          document.documentElement.classList.remove('dark-theme');
          document.body.classList.remove('dark-theme');
        }
      } catch (e) {
        console.error('Error detecting theme', e);
      }
    })();
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
