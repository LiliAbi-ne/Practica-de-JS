class Pila {
    constructor() {
        this.stack = [];
    }

    push(value) {
        this.stack.push(value); // Agrega un valor al final de la pila
    }

    pop() {
        return this.stack.pop(); // Elimina y retorna el último valor agregado
    }

    replace(oldValue, newValue) {
        const tempStack = [];
        let found = false;

        // Desapilar hasta encontrar el valor a reemplazar
        while (this.stack.length > 0) {
            let currentValue = this.pop();
            if (currentValue === oldValue && !found) {
                currentValue = newValue;
                found = true;
            }
            tempStack.push(currentValue);
        }

        // Volver a apilar los elementos en el orden correcto
        while (tempStack.length > 0) {
            this.push(tempStack.pop());
        }
    }

    getElements() {
        return this.stack;
    }
}

const pilaNumeros = new Pila();

// Añadir valores aleatorios a la pila
for (let i = 1; i <= 10; i++) {
    pilaNumeros.push(Math.floor(Math.random() * 100));
}
mostrarPila();

// Reemplazar valores
function replaceValues() {
    const oldValue = parseFloat(document.getElementById("oldValue").value);
    const newValue = parseFloat(document.getElementById("newValue").value);

    pilaNumeros.replace(oldValue, newValue);
    mostrarPila();
}

// Mostrar elementos en el HTML (como una cola de izquierda a derecha)
function mostrarPila() {
    const stackDisplay = document.getElementById("stackDisplay");
    stackDisplay.innerHTML = "";
    const elementos = pilaNumeros.getElements();


    elementos.slice().reverse().forEach(element => {
        const div = document.createElement("div");
        div.className = "element";
        div.textContent = element;
        stackDisplay.appendChild(div);
    });
}

// Añadir event listener al botón
document.getElementById("replaceButton").addEventListener("click", replaceValues);
