document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CARGAR Y APLICAR COLOR NEÓN ---
    const color = localStorage.getItem('themeColor') || '#2ecc71';
    document.documentElement.style.setProperty('--neon', color);
    document.documentElement.style.setProperty('--border', color + '33');

    // --- 2. CARGAR Y REPARAR RUTA DE FONDO ---
    let fondo = localStorage.getItem('themeBg') || 'assets/imagen/fondos/fondo.jpg';
    
    // Si la ruta viene solo el nombre (ej: "noche.jpg"), le ponemos el camino completo
    if (!fondo.includes('/')) {
        fondo = `assets/imagen/fondos/${fondo}`;
        localStorage.setItem('themeBg', fondo);
    }

    // --- 3. CARGAR FILTROS ---
    const dark = localStorage.getItem('themeDark') || 0.5;
    const blurVal = localStorage.getItem('themeBlurValue') || 0;

    // --- 4. APLICAR A CUALQUIER CONTENEDOR DE FONDO ---
    // Buscamos todos los posibles nombres que has usado en tus HTML
    const bg = document.querySelector('.bg-blur') || 
               document.getElementById('bg-image') || 
               document.getElementById('bg-container') ||
               document.querySelector('.bg-container');

    if (bg) {
        bg.style.backgroundImage = `url('${fondo}')`;
        bg.style.backgroundSize = "cover";
        bg.style.backgroundPosition = "center center";
        bg.style.backgroundAttachment = "fixed";
        // IMPORTANTE: brightness usa (1 - dark) para que 1 sea negro total y 0 sea original
        bg.style.filter = `brightness(${1 - dark}) blur(${blurVal}px)`;
        console.log("Fondo aplicado con éxito en:", bg.id || bg.className);
    } else {
        console.warn("No se encontró un contenedor de fondo válido en este HTML.");
    }
});

/**
 * FUNCIONES PARA GUARDAR (Ajustadas para ser universales)
 */

function setFondo(nombreArchivo) {
    // Si el nombre ya trae la ruta, la usamos, si no, la construimos
    const rutaCompleta = nombreArchivo.includes('assets/') ? 
                         nombreArchivo : `assets/imagen/fondos/${nombreArchivo}`;
                         
    localStorage.setItem('themeBg', rutaCompleta);
    
    // Aplicar al instante en la página actual
    const bg = document.querySelector('.bg-blur') || 
               document.getElementById('bg-image') || 
               document.getElementById('bg-container');
    if (bg) {
        bg.style.backgroundImage = `url('${rutaCompleta}')`;
    }
    console.log("Nuevo fondo guardado:", rutaCompleta);
}

// ... El resto de tus funciones (setColor, setFiltros, toggleFavorito) están perfectas
