const palabras = ["HOLA", "PALABRA", "LAVADORA", "COMPUTADORA", "HAMBURGUESA", "PUERTA", "ESTORNUDO", "COLMILLO", "GUITARRA", "SACO", "PULSERA", "GORRO", "ALFOMBRA", "MANTECA", "SALSA", "TUERCA", "CARNAVAL", "MANDARINA", "ORNITORRINCO", "CUERPO", "PELUCA", "CAMA", "CASA"]; // Array con todas las palabras posibles
const espacioLetras = document.getElementsByClassName("espacioLetras"); // Obtengo la div en la que se mostrarán los guiones
const letrasIncorrectas = document.getElementsByClassName("letrasIncorrectas"); //  Obtengo la div en la que se mostrarán las letras incorrectas
const medidaMain = document.getElementById("main"); // Tomo el elemento main para conocer sus medidas y ajustar el canvas de manera responsiva

// Obtengo el canvas en el que dibujaré el muñeco
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.canvas.width = 0;
ctx.canvas.height = 0;

let palabraSeleccionada;
let letrasUsadas;
let errores;
let aciertos;
let agrega = false; // Si "agrega == false", el juego toma una palabra aleatoria de la lista, si no, se usa la que el jugador ingresa

/*******************************  FUNCIONES UTILIZADAS DURANTE EL JUEGO **********************************/

/**
 ** Función que da inicio al juego y reinicia todas las variables a cero
 */
const iniciarJuego = () => {
    
    letrasUsadas = [];
    espacioLetras.innerHTML = "";
    letrasIncorrectas.innerHTML = "" ;
    errores = 0;
    aciertos = 0;
    document.getElementById("seccionJuego").style.display = "block"; // Muestro el panel de juego
    document.getElementById("seccionInicial").style.display = "none"; // Oculto el menú principal
    dibujarHorca(); // Dibujo la horca
    if (!agrega) {
        crearPalabraSecreta(); // Elijo una palabra aleatoria de my array de palabras
    } else {
        palabraSeleccionada = document.getElementById("palabraIngresada").value.toUpperCase().split(""); // Si el jugador ingresa una palabra, tomo esa
    }
    mostrarGuiones(); // Muestro los guiones para cada letra
    document.addEventListener("keydown", letterEvent); // Al presionar una tecla, se verificará si está o no en la palabra
}

/**
 * Función que reinicia el juego
 */
const reiniciar = () => {
    agrega = false
    borrarGuiones(); // Elimino la palabra anterior
    iniciarJuego(); // Doy inicio al juego nuevamente
    document.getElementById("mensaje_final").style.display = "none"; // Tomo el cuadro de mensaje para esconderlo al reiniciar el juego

}

/**
 * Función que termina el juego y muestra el mensaje correspondiente
 */
const finJuego = () => {
    document.removeEventListener("keydown", letterEvent) // Dejo de aceptar letras presionadas
    document.getElementById("mensaje_final").style.display = "block";
}

/**
 * Función que muestra las letras utilizadas durante el juego
 */
const addLetter = letter => {
    const letra = document.createElement("span"); // Creo una nueva "span" por cada letra presionada
    letra.classList.add("letraa");
    letra.innerHTML = letter.toUpperCase(); 
    letrasIncorrectas[0].appendChild(letra); // Muestro en pantalla la letra usada

}

/**
 * Función que muestra la letra correcta en su lugar correspondiente
 */
const letraCorrecta = letter => {
    const { children } = espacioLetras[0];
    for (let i = 0; i < children.length; i++) { // itero sobre cada span dentro de "espacioLetras" para mostrar la letra correcta
        if(children[i].innerHTML === letter) {
            children[i].classList.toggle("oculta"); // Cambio la clase "oculta" para mostrar la letra
            aciertos++; // Sumo un acierto
        }
    } 
    if (aciertos === palabraSeleccionada.length) {
        finJuego(); // Si acerté a todas las letras, terminó el juego
        let mensaje = document.getElementById("mensaje_fin");
        mensaje.innerHTML = "¡Felicidades, ganaste! la palabra era:"
        let sol = document.getElementById("solucion");
        sol.innerHTML = palabraSeleccionada.join("");
    }
}

/**
 * Función que dibuja progresivamente las partes del cuerpo a medida que se cometen errores
 */
const wrongLetter = () => {
    switch(errores) {
        case 1:
            // Dibujo de la cabeza
            ctx.strokeStyle = "#0A3871";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(210, 120, 50, 0, Math.PI * 2, true)
            ctx.stroke();
            break;
        case 2:
            // Torso
            ctx.fillRect(200, 170, 20, 100);
            break;
        case 3:
            // Brazo Izq
            ctx.moveTo(200, 170);
            ctx.lineTo(170, 250);
            ctx.stroke();
            break;
        case 4: 
            // Brazo der
            ctx.moveTo(220, 170);
            ctx.lineTo(250, 250);
            ctx.stroke();
            break;
        case 5:
            // Pierna der
            ctx.moveTo(200, 270);
            ctx.lineTo(170, 350);
            ctx.stroke();
            break;
        case 6:
            // Pierna izq
            ctx.moveTo(220, 270);
            ctx.lineTo(250, 350);
            ctx.stroke();
            break;
    }
}

/**
 * Función que toma la letra presionada en el teclado
 */
const letterInput = letter => {
    if(palabraSeleccionada.includes(letter)) { // Verifico si mi letra está en la palabra o no
        letraCorrecta(letter);
    } else {
        errores++; //Aumento el contador de errores
        wrongLetter();
        if (errores == 6) {
            finJuego();
            let mensaje = document.getElementById("mensaje_fin");
            mensaje.innerHTML = "Fin del juego, ¡intentalo de nuevo! la palabra era:"
            let sol = document.getElementById("solucion");
            sol.innerHTML = palabraSeleccionada.join("");
        }
    }
    addLetter(letter); // Añado la letra a la lista de letras usadas
    letrasUsadas.push(letter);
    
}

const letterEvent = event => {
    let nuevaLetra = event.key.toUpperCase(); // Capturo la letra que fue presionada
    if (nuevaLetra.match(/^[a-z]$/i) && !letrasUsadas.includes(nuevaLetra)) { // Verifico que la tecla presionada sea una letra y que no haya sido usada ya
        letterInput(nuevaLetra); // Añado la nueva letra
    }
}

/**
 * Dibuja la "horca" en la que se irá dibujando nuestro muñeco
 */
const dibujarHorca = () => {
    ctx.canvas.width = 400; 
    ctx.canvas.height = 400;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0A3871";
    ctx.fillRect(0, ctx.canvas.width -20, ctx.canvas.width, 20); // Base de la horca
    ctx.fillRect(20, 0, 20, ctx.canvas.height); // Poste de la horca
    ctx.fillRect(20, 0, ctx.canvas.width/2, 20); // Travesaño de la horca
    ctx.fillRect(ctx.canvas.width/2, 20, 20, 50); // Cuerda
}

/**
 * Devuelve una palabra aleatoria de la lista de palabras posibles
 * @return {String} Palabra aleatoria seleccionada de la lista "palabras"
 */
const crearPalabraSecreta = () => {
    let i = Math.floor(Math.random() * palabras.length); // Obtengo un índice aleatorio para seleccionar una palabra de la lista
    palabraSeleccionada = palabras[i].split(""); // Obtengo una palabra aleatoria y la separo en caracteres
}

/**
 * Función que agrega cada letra de la palabra seleccionada aleatoriamente 
 */
const mostrarGuiones = () => {
    palabraSeleccionada.forEach(letter => {
        const letra = document.createElement("span"); // Creo una span
        letra.innerHTML = letter;
        letra.classList.add("letra"); // Agrego la clase "letra" a cada caracter
        letra.classList.add("oculta"); // Agrego la clase "oculta" a cada caracter
        espacioLetras[0].appendChild(letra) // Agrego a cada letra como un "hijo" de mi div "espacioLetras"
    })
}

/**
 * Elimina los guiones de la palabra anterior para dar lugar a una nueva palabra aleatoria
 */
const borrarGuiones = () => {
    for (let i = 0; i < palabraSeleccionada.length; i++) {
        espacioLetras[0].removeChild(espacioLetras[0].lastElementChild); // elimino la span
    }

    while (letrasIncorrectas[0].childElementCount > 0) {
        letrasIncorrectas[0].removeChild(letrasIncorrectas[0].lastElementChild); // Borro todas las letras que se usaron
    }
}

/************************************ FUNCIONES AGREGAR PALABRA NUEVA ***********************************/

/**
 * Función que cambia a la pantalla "agregar una palabra"
 */
const agregar = () => {
    document.getElementById("seccionAgregarPalabra").style.display = "block"; // Muestro el panel para agregar palabras
    document.getElementById("seccionInicial").style.display = "none"; // Oculto el menú principal
}

/**
 * Función que indica que el jugador desea agregar una palabra personalizada
 */
function agregarPalabra() {
    agrega = true;
    iniciarJuego();
}
