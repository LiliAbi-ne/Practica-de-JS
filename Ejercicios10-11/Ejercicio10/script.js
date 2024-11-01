class Cliente {
    constructor(turno, nombre, movimiento) {
        this.turno = turno;
        this.nombre = nombre;
        this.movimiento = movimiento;
        this.horaLlegada = new Date();
    }

    tiempoEspera() {
        const ahora = new Date();
        const diferencia = ahora - this.horaLlegada;
        const segundosEspera = Math.floor(diferencia / 1000); 
        return segundosEspera;
    }
}

class Cola {
    constructor() {
        this.cola = [];
        this.turnoActual = 1;
        this.limite = 10; 
        this.interval = null;
    }

    agregarCliente(nombre, movimiento) {
        if (this.cola.length >= this.limite) {
            document.getElementById("mensaje").innerText = "La cola está llena. No se pueden añadir más clientes.";
            return;
        }

        const cliente = new Cliente(this.turnoActual++, nombre, movimiento);
        this.cola.push(cliente);
        this.actualizarVista();
        this.iniciarActualizacionTiempo(); 
    }

    atenderCliente() {
        if (this.cola.length === 0) {
            document.getElementById("mensaje").innerText = "No hay nadie en la fila para atender.";
            return;
        }

        const clienteAtendido = this.cola.shift(); 
        const tiempoEspera = clienteAtendido.tiempoEspera();
        document.getElementById("mensaje").innerText = `El cliente ${clienteAtendido.nombre} esperó ${tiempoEspera} segundos y ha sido atendido.`;

        if (this.cola.length === 0) {
            clearInterval(this.interval); 
        }

        this.actualizarVista();
    }

    iniciarActualizacionTiempo() {
        if (this.interval) return; 
        this.interval = setInterval(() => {
            this.actualizarVista();
        }, 1000); 
    }

    actualizarVista() {
        const tabla = document.getElementById("colaClientes");
        tabla.innerHTML = ""; 

        if (this.cola.length === 0) {
            const fila = document.createElement("tr");
            fila.innerHTML = `<td colspan="4" style="text-align: center;">No hay clientes en la cola.</td>`;
            tabla.appendChild(fila);
            return;
        }

        this.cola.forEach(cliente => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${cliente.turno}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.movimiento}</td>
                <td>${cliente.tiempoEspera()} segundos</td>
            `;
            tabla.appendChild(fila);
        });
    }
}

const bancoCola = new Cola();

document.getElementById("agregarCliente").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value;
    const movimiento = document.getElementById("movimiento").value;

    if (!nombre || !movimiento) {
        document.getElementById("mensaje").innerText = "Por favor, complete todos los campos.";
        return;
    }

    bancoCola.agregarCliente(nombre, movimiento);
    document.getElementById("mensaje").innerText = `Cliente ${nombre} añadido a la cola.`;
});

document.getElementById("atenderCliente").addEventListener("click", () => {
    bancoCola.atenderCliente();
});
