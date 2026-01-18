/**
 * MOTOR DE TRIVIAS Y CONTROL DE RACHA - RUGE EL ESTADIO
 * Este script gestiona el progreso de desbloqueo diario y la persistencia.
 */

const SistemaTrivias = {
    // 1. BANCO DE PREGUNTAS (Cultura General de Fútbol)
    // No ligadas al jugador para permitir el azar del equipo activo.
    banco: [
        { q: "¿En qué equipo debutó Jarlan Barrera?", a: "Junior", ops: ["Junior", "Medellín", "Nacional"] },
        { q: "¿Cuál es el apodo de David Ospina?", a: "El Muro", ops: ["El Muro", "El Cóndor", "San David"] },
        { q: "¿En qué año ganó Colombia su única Copa América?", a: "2001", ops: ["1998", "2001", "2005"] },
        { q: "¿Quién es el máximo goleador histórico de la Selección?", a: "Falcao", ops: ["James", "Asprilla", "Falcao"] },
        { q: "¿A qué equipo le dicen 'El Poderoso'?", a: "Medellín", ops: ["Millonarios", "Medellín", "Santa Fe"] },
        { q: "¿Cuántos mundiales ha ganado la selección de Argentina?", a: "3", ops: ["2", "3", "4"] },
        { q: "¿En qué ciudad se encuentra el Estadio Atanasio Girardot?", a: "Medellín", ops: ["Cali", "Medellín", "Bogotá"] },
        { q: "¿Quién marcó el gol del 1-1 contra Alemania en Italia 90?", a: "Freddy Rincón", ops: ["Valderrama", "Asprilla", "Freddy Rincón"] }
    ],

    // 2. ESTADO DEL SISTEMA (Persistencia en localStorage)
    estado: JSON.parse(localStorage.getItem('rug_progreso')) || {
        triviasCompletadasHoy: 0,
        enRacha: false,         // Si está en medio de desbloquear las 5 láminas
        indiceRacha: 0,        // En qué lámina de las 5 va (1 a 5)
        equipoActivo: 'MEDELLÍN', 
        idsPendientes: [],      // IDs o Nombres de las 5 láminas elegidas al azar
        fechaUltimaTrivia: new Date().toLocaleDateString()
    },

    // 3. INICIALIZACIÓN
    init: function() {
        this.verificarResetDiario();
        this.verificarRachaActiva();
    },

    verificarResetDiario: function() {
        const hoy = new Date().toLocaleDateString();
        if (this.estado.fechaUltimaTrivia !== hoy) {
            this.estado.triviasCompletadasHoy = 0;
            this.estado.enRacha = false;
            this.estado.fechaUltimaTrivia = hoy;
            this.guardar();
        }
    },

    // Si el usuario vuelve a entrar y estaba en racha, se fuerza el modal
    verificarRachaActiva: function() {
        if (this.estado.enRacha) {
            console.log("Reanudando racha de desbloqueo...");
            this.lanzarSiguienteLamina();
        }
    },

    // 4. LÓGICA DE TRIVIA
    obtenerPreguntaAlAzar: function() {
        const index = Math.floor(Math.random() * this.banco.length);
        return this.banco[index];
    },

    registrarAcierto: function() {
        this.estado.triviasCompletadasHoy++;
        this.guardar();
        
        if (this.estado.triviasCompletadasHoy >= 5) {
            this.prepararRacha();
        }
    },

    // 5. LÓGICA DE RACHA (LAS 5 LÁMINAS)
    prepararRacha: function() {
        this.estado.enRacha = true;
        this.estado.indiceRacha = 1;
        
        // Aquí se seleccionan 5 láminas bloqueadas del equipo activo al azar
        // Por ahora, como estamos diseñando, simularemos que ya las tenemos
        this.estado.idsPendientes = this.seleccionarLaminasAlAzar(this.estado.equipoActivo, 5);
        
        this.guardar();
        this.lanzarSiguienteLamina();
    },

    seleccionarLaminasAlAzar: function(equipo, cantidad) {
        // Esta función buscará en albumData láminas bloqueadas de ese equipo.
        // Si no hay suficientes, puede rellenar con Plus (Estadios, etc).
        // Por ahora devuelve un array de prueba.
        return ["Lamina_1", "Lamina_2", "Lamina_3", "Lamina_4", "Porrista"];
    },

    lanzarSiguienteLamina: function() {
        if (this.estado.indiceRacha > 5) {
            this.finalizarRacha();
            return;
        }

        // BLOQUEO DE NAVEGACIÓN: Ocultar botón atrás del header
        const btnBack = document.querySelector('.header a');
        if (btnBack) btnBack.style.display = 'none';

        // Abrir el modal de la lámina correspondiente
        // Nota: openDetail() debe ser la función que ya tienes en album.html
        if (typeof openDetail === 'function') {
            const nombreLamina = this.estado.idsPendientes[this.estado.indiceRacha - 1];
            openDetail(nombreLamina, true); // true indica "modo racha"
        }
    },

    avanzarRacha: function() {
        this.estado.indiceRacha++;
        this.guardar();
        this.lanzarSiguienteLamina();
    },

    finalizarRacha: function() {
        this.estado.enRacha = false;
        this.estado.indiceRacha = 0;
        this.estado.idsPendientes = [];
        this.guardar();

        // Liberar navegación
        const btnBack = document.querySelector('.header a');
        if (btnBack) btnBack.style.display = 'block';

        alert("¡Felicidades! Has completado tus 5 láminas de hoy.");
    },

    guardar: function() {
        localStorage.setItem('rug_progreso', JSON.stringify(this.estado));
    }
};

// Arrancar sistema al cargar
window.addEventListener('load', () => SistemaTrivias.init());


