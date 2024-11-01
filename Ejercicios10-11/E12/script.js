// Lista doblemente enlazada
class NodoAuto {
    constructor(placa, propietario, horaEntrada) {
        this.placa = placa;
        this.propietario = propietario;
        this.horaEntrada = horaEntrada;
        this.siguiente = null;
        this.anterior = null;
    }
}

class Estacionamiento {
    constructor() {
        this.cabeza = null;
        this.cola = null;
        this.totalAutos = 0;
    }

    agregarAuto(placa, propietario) {
        const horaEntrada = new Date();
        const nuevoAuto = new NodoAuto(placa, propietario, horaEntrada);

        if (this.cabeza === null) {
            this.cabeza = nuevoAuto;
            this.cola = nuevoAuto;
            nuevoAuto.siguiente = nuevoAuto;
            nuevoAuto.anterior = nuevoAuto;
        } else {
            nuevoAuto.anterior = this.cola;
            nuevoAuto.siguiente = this.cabeza;
            this.cola.siguiente = nuevoAuto;
            this.cabeza.anterior = nuevoAuto;
            this.cola = nuevoAuto;
        }

        this.totalAutos++;
        return `Auto con placas ${placa} registrado.`;
    }

    sacarAuto(placa) {
        if (this.cabeza === null) {
            return "No hay autos en el estacionamiento.";
        }

        let actual = this.cabeza;
        let encontrado = false;

        do {
            if (actual.placa === placa) {
                encontrado = true;
                break;
            }
            actual = actual.siguiente;
        } while (actual !== this.cabeza);

        if (!encontrado) {
            return "No se encontró el auto con esa placa.";
        }

        const autoSalida = actual;
        const horaSalida = new Date();
        const tiempoEstacionado = Math.floor((horaSalida - autoSalida.horaEntrada) / 1000); // En segundos
        const costo = tiempoEstacionado * 2.00;

        if (autoSalida === this.cabeza && autoSalida === this.cola) {
            this.cabeza = null;
            this.cola = null;
        } else {
            if (autoSalida === this.cabeza) {
                this.cabeza = this.cabeza.siguiente;
                this.cabeza.anterior = this.cola;
                this.cola.siguiente = this.cabeza;
            } else if (autoSalida === this.cola) {
                this.cola = this.cola.anterior;
                this.cola.siguiente = this.cabeza;
                this.cabeza.anterior = this.cola;
            } else {
                autoSalida.anterior.siguiente = autoSalida.siguiente;
                autoSalida.siguiente.anterior = autoSalida.anterior;
            }
        }

        this.totalAutos--;

        return {
            placa: autoSalida.placa,
            propietario: autoSalida.propietario,
            horaEntrada: autoSalida.horaEntrada,
            horaSalida,
            tiempoEstacionado,
            costo
        };
    }

    mostrarAutos() {
        if (this.cabeza === null) {
            return [];
        }

        const autos = [];
        let actual = this.cabeza;

        do {
            autos.push({
                placa: actual.placa,
                propietario: actual.propietario,
                horaEntrada: actual.horaEntrada
            });
            actual = actual.siguiente;
        } while (actual !== this.cabeza);

        return autos;
    }
}

// Instancia del estacionamiento
const estacionamiento = new Estacionamiento();

// Elementos del DOM
const entradaAutoBtn = document.getElementById('entradaAuto');
const salidaAutoBtn = document.getElementById('salidaAuto');
const mostrarAutosBtn = document.getElementById('mostrarAutos');
const mensajeSistema = document.getElementById('mensajeSistema');
const registrarEntradaBtn = document.getElementById('registrarEntrada');
const autosEnCola = document.getElementById('autosEnCola');
const autosParaSalir = document.getElementById('autosParaSalir');
const entradaForm = document.getElementById('entradaForm');
const listaAutos = document.getElementById('listaAutos');
const salidaForm = document.getElementById('salidaForm');

// Mostrar formularios
entradaAutoBtn.addEventListener('click', () => {
    entradaForm.style.display = 'block';
    listaAutos.style.display = 'none';
    salidaForm.style.display = 'none';
    mensajeSistema.innerHTML = '';
});

salidaAutoBtn.addEventListener('click', () => {
    const autos = estacionamiento.mostrarAutos();
    autosParaSalir.innerHTML = '';

    if (autos.length === 0) {
        autosParaSalir.innerHTML = '<li>No hay autos en el estacionamiento.</li>';
    } else {
        autos.forEach(auto => {
            const li = document.createElement('li');
            li.innerHTML = `Placa: ${auto.placa}, Propietario: ${auto.propietario}`;
            const btn = document.createElement('button');
            btn.innerHTML = "Sacar Auto";
            btn.classList.add('salida-auto-btn');
            btn.addEventListener('click', () => {
                const resultado = estacionamiento.sacarAuto(auto.placa);
                if (typeof resultado === 'string') {
                    mensajeSistema.innerHTML = resultado;
                } else {
                    mensajeSistema.innerHTML = `
                        Auto con placas ${resultado.placa} ha salido. 
                        Costo: $${resultado.costo.toFixed(2)} 
                        Tiempo estacionado: ${resultado.tiempoEstacionado} segundos.
                    `;
                }
            });
            li.appendChild(btn);
            autosParaSalir.appendChild(li);
        });
    }

    salidaForm.style.display = 'block';
    listaAutos.style.display = 'none';
    entradaForm.style.display = 'none';
    mensajeSistema.innerHTML = '';
});

mostrarAutosBtn.addEventListener('click', () => {
    const autos = estacionamiento.mostrarAutos();
    autosEnCola.innerHTML = '';

    if (autos.length === 0) {
        autosEnCola.innerHTML = '<li>No hay autos en el estacionamiento.</li>';
    } else {
        autos.forEach(auto => {
            const li = document.createElement('li');
            li.innerHTML = `Placa: ${auto.placa}, Propietario: ${auto.propietario}, Hora de entrada: ${auto.horaEntrada}`;
            autosEnCola.appendChild(li);
        });
    }

    listaAutos.style.display = 'block';
    entradaForm.style.display = 'none';
    salidaForm.style.display = 'none';
    mensajeSistema.innerHTML = '';
});

// Registrar la entrada del auto
registrarEntradaBtn.addEventListener('click', () => {
    const placa = document.getElementById('placa').value;
    const propietario = document.getElementById('propietario').value;

    if (placa === '' || propietario === '') {
        mensajeSistema.innerHTML = 'Por favor, ingrese todos los datos.';
        return;
    }

    const mensaje = estacionamiento.agregarAuto(placa, propietario);
    mensajeSistema.innerHTML = mensaje;
    document.getElementById('placa').value = '';
    document.getElementById('propietario').value = '';
});
