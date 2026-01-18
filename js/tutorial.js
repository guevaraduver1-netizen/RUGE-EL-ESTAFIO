/**
 * SISTEMA DE TUTORIALES - RUGE EL ESTADIO
 * Activación: Inmediata al entrar al Index.html con sesión activa.
 */

const TutorialSystem = {
    steps: [
        { target: "#banner-central", title: "Resumen Táctico", msg: "Doble toque para ver el reporte de partidos del día." },
        { target: ".top-nav a.top-btn:nth-child(1)", title: "Noticias", msg: "Conoce marcadores en tiempo real de cualquier partido, informacion mas reciente del futbol de colombia, latam y europa con un sistema de coneccion de respaldo con un solo toque, para garantizar fluides y rapides en lo que quieres saber" },
        { target: ".top-btn-wrapper:nth-child(2)", title: "Opciones", msg: "Aqui encomtraras tus laminas favoritas, el rugido del hincha que es la musica para alentar a tu equipo favorito y tambien podras compartir esta app con la banda, para que todos puedan disfrutar en cualquier lugar de ese gol que combierte un grito en un rugido que alienta" },
        { target: ".top-btn-wrapper:nth-child(3)", title: "Usuario", msg: "puedes ver y personalizar tu cuenta de usuario, ver estadisticas del album, contarnos tus dudas y comentarios en la seccion de soporte, suscribirte a plataformas con ligas espesificas a tu gusto, saber como va el mundial 2026, cambiar tu comtraseña o cerrar tu sesion." },
        { target: ".bottom-nav .nav-item:nth-child(1)", title: "Álbum", msg: "Conoce mas de futbol contestando las trivias para desbloquear laminas de tus idolos favoritos y coleccionalos en tu seccion de favoritos" },
        { target: ".bottom-nav .nav-item:nth-child(2)", title: "Goles", msg: "Las jugadas mas recientes en un solo lugar" },
        { target: ".bottom-nav .nav-item:nth-child(3)", title: "Estilo", msg: "Personaliza el color, idioma, tipo de letra, imagen de fondo, opacidad y desenfoque de la app " },
        { target: ".bottom-nav .nav-item:nth-child(4)", title: "Partidos", msg: "minuto a minuto en tiempo real ingresando a las paginas oficiales, lo mas destacado de colombia y ligas europeas y disfruta cada jugada con los partidos en tiempo real en las emisoras de radio locales" }
    ],
    currentStep: 0,
    overlay: null,
    pointer: null,

    init() {
        const path = window.location.pathname.split("/").pop() || "index.html";
        if (path !== "index.html") return;

        const sesionActiva = localStorage.getItem('sesion_activa');
        const haVistoTutorial = localStorage.getItem('tutorial_visto_principal');

        if (sesionActiva && !haVistoTutorial) {
            const authOverlay = document.getElementById('auth-overlay');
            if (authOverlay && authOverlay.style.display !== 'none' && !authOverlay.classList.contains('auth-hidden')) {
                return;
            }
            this.createElements();
            setTimeout(() => this.showStep(), 1000);
        }
    },

    createElements() {
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'tutorial-overlay';
            document.body.appendChild(this.overlay);
        }
        if (!this.pointer) {
            this.pointer = document.createElement('div');
            this.pointer.className = 'tutorial-pointer';
            document.body.appendChild(this.pointer);
        }
    },

    showStep() {
        const stepData = this.steps[this.currentStep];
        const targetEl = document.querySelector(stepData.target);

        if (!targetEl) { this.next(); return; }

        this.overlay.style.display = 'block';
        this.pointer.style.display = 'block';
        
        document.querySelectorAll('.highlight-target').forEach(el => el.classList.remove('highlight-target'));
        targetEl.classList.add('highlight-target');

        const rect = targetEl.getBoundingClientRect();
        this.pointer.style.top = `${rect.top + (rect.height / 2)}px`;
        this.pointer.style.left = `${rect.left + (rect.width / 2)}px`;

        let tooltip = document.getElementById('active-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'tutorial-step';
            tooltip.id = 'active-tooltip';
            document.body.appendChild(tooltip);
        }

        // --- LÓGICA DE POSICIONAMIENTO ANTI-DESBORDE ---
        
        // 1. Posición Vertical con Freno Superior
        let topPos = rect.bottom + 25; 
        if (topPos > window.innerHeight - 320) {
            topPos = rect.top - 330; 
        }
        
        // Freno para que no se salga por arriba (Captura de pantalla solucionada)
        if (topPos < 10) topPos = 10;
        
        tooltip.style.top = `${topPos}px`;

        // 2. Posición Horizontal Inteligente
        const screenWidth = window.innerWidth;
        const tooltipWidth = Math.min(320, screenWidth * 0.9);
        let leftPos = (rect.left + rect.width / 2) - (tooltipWidth / 2);

        if (leftPos < 10) leftPos = 10;
        if (leftPos + tooltipWidth > screenWidth - 10) {
            leftPos = screenWidth - tooltipWidth - 10;
        }

        tooltip.style.left = `${leftPos}px`;

        tooltip.innerHTML = `
            <h4>${stepData.title}</h4>
            <p>${stepData.msg}</p>
            <div class="tutorial-btns">
                <button class="btn-skip" onclick="TutorialSystem.end()">Saltar</button>
                <button class="btn-tutorial" onclick="TutorialSystem.next()">
                    ${this.currentStep === this.steps.length - 1 ? 'ENTENDIDO' : 'SIGUIENTE'}
                </button>
            </div>
        `;
    },

    next() {
        this.currentStep++;
        if (this.currentStep < this.steps.length) {
            this.showStep();
        } else {
            this.end();
        }
    },

    end() {
        localStorage.setItem('tutorial_visto_principal', 'true');
        if (this.overlay) this.overlay.style.display = 'none';
        if (this.pointer) this.pointer.style.display = 'none';
        if (document.getElementById('active-tooltip')) document.getElementById('active-tooltip').remove();
        document.querySelectorAll('.highlight-target').forEach(el => el.classList.remove('highlight-target'));
    }
};

document.addEventListener('DOMContentLoaded', () => TutorialSystem.init());

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
            TutorialSystem.init();
        }
    });
});

const targetAuth = document.getElementById('auth-overlay');
if (targetAuth) {
    observer.observe(targetAuth, { attributes: true });
}
