
class Cola {
    constructor() {
        this.items = [];
    }

    // Agregar un elemento a la cola
    enqueue(element) {
        this.items.push(element);
    }

    // Remover el primer elemento de la cola (FIFO)
    dequeue() {
        if (this.isEmpty()) {
            return "La cola está vacía";
        }
        return this.items.shift();
    }

    // Comprobar si la cola está vacía
    isEmpty() {
        return this.items.length === 0;
    }

    // Obtener el tamaño de la cola
    size() {
        return this.items.length;
    }

    // Vaciar la cola
    clear() {
        this.items = [];
    }
}


let carQueue = new Cola();
let totalPaintedCars = 0;
let totalTime = 0;
let maxCarsInQueue = 5;
let carInterval = 5000;
let timeUpdateInterval;


// Función para añadir coches a la cola
function addCarToQueue() {
    if (carQueue.size() >= maxCarsInQueue) {
        document.getElementById("gameMessage").innerText = "¡La cola está llena!";
        return;
    }

    // Nombres de colores 
    let colors = ['yellow', 'orange', 'red', 'green', 'blue', 'purple'];
    let randomColor = colors[Math.floor(Math.random() * colors.length)];

    let newCar = {
        id: carQueue.size() + 1,
        color: randomColor,
        arrivalTime: new Date().getTime()
    };

    carQueue.enqueue(newCar);  // Agregar coche a la cola
    updateCarQueueView();
}

// Función para mostrar la cola de coches visualmente 
function updateCarQueueView() {
    let carQueueDiv = document.getElementById("carQueue");
    carQueueDiv.innerHTML = "";

    carQueue.items.forEach(car => {
        let colorInSpanish = {
            yellow: 'Amarillo',
            orange: 'Naranja',
            red: 'Rojo',
            green: 'Verde',
            blue: 'Azul',
            purple: 'Morado'
        };

        let carDiv = document.createElement("div");
        carDiv.className = "car";
        carDiv.innerHTML = `<div class="label">${colorInSpanish[car.color]}</div><div class="time-waiting" id="waitTime-${car.id}">Esperando: 0s</div>`;
        carQueueDiv.appendChild(carDiv);
    });
}

// Función para pintar coches
function paintCar() {
    if (carQueue.isEmpty()) {
        document.getElementById("gameMessage").innerText = "¡No hay coches en la cola!";
        return;
    }

    let firstCar = carQueue.dequeue();  // Remover el primer coche de la cola (FIFO)
    let colorButtons = document.querySelectorAll(".color-btn");
    let selectedColor = Array.from(colorButtons).find(btn => btn.classList.contains("selected"));

    if (!selectedColor) {
        document.getElementById("gameMessage").innerText = "Selecciona un color antes de pintar.";
        return;
    }

    let chosenColor = selectedColor.dataset.color;  // El color seleccionado por el usuario

    if (chosenColor !== firstCar.color) {  // Comparar los colores en inglés
        document.getElementById("gameMessage").innerText = `¡Error! El coche necesita ser pintado de ${firstCar.color}.`;
    } else {
        let currentTime = new Date().getTime();
        let waitTime = Math.floor((currentTime - firstCar.arrivalTime) / 1000);
        document.getElementById("gameMessage").innerText = `¡Coche pintado de ${firstCar.color} correctamente! El cliente esperó ${waitTime} segundos.`;

        totalPaintedCars++;
        totalTime += waitTime;
        updateGameInfo();

        if (totalPaintedCars % 3 === 0 && carInterval > 2000) {
            carInterval -= 2000;
            clearInterval(carQueueInterval);
            startCarQueue();
        }
    }

    updateCarQueueView();
}

// Función para actualizar la información del juego (coches pintados y tiempo total)
function updateGameInfo() {
    document.getElementById("record").innerText = `Coches pintados: ${totalPaintedCars}`;
    document.getElementById("totalTime").innerText = `Tiempo total: ${totalTime} segundos`;
}

// Función para iniciar la cola de coches, que añade coches cada intervalo de tiempo
function startCarQueue() {
    carQueueInterval = setInterval(addCarToQueue, carInterval);
}

// Actualizar el tiempo de espera en tiempo real
function updateWaitTimes() {
    carQueue.items.forEach(car => {
        let currentTime = new Date().getTime();
        let waitTime = Math.floor((currentTime - car.arrivalTime) / 1000);
        document.getElementById(`waitTime-${car.id}`).innerText = `Esperando: ${waitTime}s`;
    });
}

// Seleccionar el color del coche y cambiar el color del botón de pintar y del coche en el SVG
document.querySelectorAll(".color-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".color-btn").forEach(btn => btn.classList.remove("selected"));
        this.classList.add("selected");

        let chosenColor = this.dataset.color;
        document.getElementById("paintCar").style.backgroundColor = chosenColor;

        // Cambiar el color del SVG del coche
        document.getElementById("carBody").style.stroke = chosenColor;
    });
});

// Event Listener para el botón de pintar coches
document.getElementById("paintCar").addEventListener("click", paintCar);

// Iniciar la cola de coches al cargar la página
startCarQueue();

// Iniciar la actualización de tiempos de espera en tiempo real cada segundo
timeUpdateInterval = setInterval(updateWaitTimes, 1000);
