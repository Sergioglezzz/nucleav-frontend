"use client"

export default function ThemeScript() {
  const script = `
    (function() {
      try {
        var mode = localStorage.getItem('theme-mode');
        if (mode === 'light') {
          // document.documentElement.classList.add('light-theme');
          // document.documentElement.classList.remove('dark-theme');
          document.documentElement.setAttribute('data-color-scheme', 'light');
        } else {
          // document.documentElement.classList.add('dark-theme');
          // document.documentElement.classList.remove('light-theme');
           document.documentElement.setAttribute('data-color-scheme', 'dark');
        }
      } catch (e) {
        console.error('Error detecting theme', e);
      }
    })();
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
