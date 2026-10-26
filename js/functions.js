
let turno = false; // false = Marilu (X), true = Zaynie (O)
let contador = 0;
let partidaTerminada = false;

const combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function obtenerBotones() {
    return [...document.querySelectorAll(".casilla")];
}

function actualizarTurno() {
    const jugadorMari = document.getElementById("jugadorMari");
    const jugadorZaynie = document.getElementById("jugadorZaynie");

    jugadorMari.classList.toggle("activo", !turno);
    jugadorZaynie.classList.toggle("activo", turno);
}

function mostrarMensaje(texto, tipo = "") {
    const contenedor = document.getElementById("ganador");
    const mensaje = document.getElementById("mensaje");
    const icono = contenedor.querySelector(".estado-icono");

    mensaje.textContent = texto;

    contenedor.classList.remove("es-ganador", "es-empate");

    if (tipo === "ganador") {
        contenedor.classList.add("es-ganador");
        icono.textContent = "★";
    } else if (tipo === "empate") {
        contenedor.classList.add("es-empate");
        icono.textContent = "✳";
    } else {
        icono.textContent = "✳";
    }
}

function activo(boton) {
    if (partidaTerminada || boton.disabled) {
        return;
    }

    const jugadorActual = turno ? "Zaynie" : "Marilu";
    const imagen = turno ? "./img/Z.png" : "./img/x.png";

    // Colocar el símbolo del jugador actual.
    boton.style.backgroundImage = `url("${imagen}")`;
    boton.dataset.jugador = jugadorActual;
    boton.disabled = true;
    boton.setAttribute(
        "aria-label",
        `Casilla ${Number(boton.dataset.index) + 1}: ${jugadorActual}`
    );

    contador++;

    // Comprobar el resultado antes de cambiar de turno.
    const resultado = verificar();

    if (resultado) {
        return;
    }

    // Si el tablero se llena y nadie gana, hay empate.
    if (contador === 9) {
        partidaTerminada = true;
        bloquear();

        mostrarMensaje(
            "¡Empate! Esta partida terminó en igualdad.",
            "empate"
        );

        return;
    }

    turno = !turno;
    actualizarTurno();

    const siguienteJugador = turno ? "Zaynie" : "Marilu";

    mostrarMensaje(`Es el turno de ${siguienteJugador}. ¡Mucha suerte!`);
}

function verificar() {
    const botones = obtenerBotones();

    for (const combinacion of combinacionesGanadoras) {
        const [a, b, c] = combinacion;

        const jugador = botones[a].dataset.jugador;

        if (
            jugador &&
            jugador === botones[b].dataset.jugador &&
            jugador === botones[c].dataset.jugador
        ) {
            partidaTerminada = true;

            // Resaltar las tres casillas de la combinación ganadora.
            combinacion.forEach(indice => {
                botones[indice].classList.add("ganadora");
            });

            bloquear();

            mostrarMensaje(
                `¡${jugador} ha ganado la partida!`,
                "ganador"
            );

            return true;
        }
    }

    return false;
}

function bloquear() {
    obtenerBotones().forEach(boton => {
        boton.disabled = true;
    });
}

function reiniciar() {
    turno = false;
    contador = 0;
    partidaTerminada = false;

    obtenerBotones().forEach((boton, indice) => {
        boton.disabled = false;
        boton.style.backgroundImage = "";
        boton.removeAttribute("data-jugador");
        boton.classList.remove("ganadora");

        boton.setAttribute("aria-label", `Casilla ${indice + 1}`);
    });

    actualizarTurno();

    mostrarMensaje("Es el turno de Marilu. ¡Mucha suerte!");
}

// Preparar el marcador al cargar la página.
document.addEventListener("DOMContentLoaded", () => {
    actualizarTurno();
    mostrarMensaje("Es el turno de Marilu. ¡Mucha suerte!");
});
