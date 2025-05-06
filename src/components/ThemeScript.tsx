"use client"

export default function ThemeScript() {
  const script = `
    (function() {
      try {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const mode = localStorage.getItem('theme-mode') || (prefersDark ? 'dark' : 'light');
        
        // Aplicar el tema inmediatamente para evitar el flash
        document.documentElement.setAttribute('data-color-scheme', mode);
        
        // Aplicar clase al body para estilos inmediatos
        if (mode === 'dark') {
          document.documentElement.classList.add('dark-theme');
          document.body.classList.add('dark-theme');
          
          // Aplicar colores de fondo y texto inmediatamente
          document.body.style.backgroundColor = '#0f1214';
          document.body.style.color = '#f6f7f8';
        } else {
          document.documentElement.classList.remove('dark-theme');
          document.body.classList.remove('dark-theme');
          
          // Aplicar colores de fondo y texto inmediatamente
          document.body.style.backgroundColor = '#f5f5f3';
          document.body.style.color = '#000000';
        }
      } catch (e) {
        console.error('Error detecting theme', e);
      }
    })();
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
