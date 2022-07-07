import { Localidad } from './modelos/localidad';
import { obtenerTipo, obtenerPrecioEntrada } from './utilidades';

export class Teatro {

    localidades: Localidad[];

    // el constructor se ejecuta cuando se crea un objeto de esta clase
    constructor() {
        this.localidades = [];

        for(let j=0; j<5; j++) { //j representa a la fila
            for(let i=0; i<10; i++) { // i representa columna
                this.localidades.push({
                    columna: i,
                    fila: j,
                    estaOcupada: false,
                    nombreReserva: undefined,
                    edadReserva: undefined,
                    telefonoReserva: undefined
                });        
            }
        }        
    }
   
    // opción 1
    verProgramacionActual() {
        console.log('Hoy representamos La cena de los idiotas, género: Comedia, Duración: 95');    
        console.log('En C/Sol 45, local de 300 metros, con 2 accesos');
        console.log('Precio: 30.0');                    
    }

    // opción 2
    mostrarLocalidades(): void {

        console.log('----------------------------');

        // va cambiando su valor desde 0 hasta 49 (ambos inclusive)
        let contador = 0;

        for(let j=0; j<5; j++) {

            let msg = '';

            for(let i=0; i<10; i++) {
                const localidad = this.localidades[contador];
                const fila = localidad.fila;
                const columna = localidad.columna;
                const ocupadaOLibre = (localidad.estaOcupada) 
                    ? 'O'  // O -> Ocupada
                    : 'L';  // L -> Libre

                msg += `${fila}.${columna} ${ocupadaOLibre} `; 
                contador++;          
            }

            console.log(msg);
            console.log('----------------------------');
        }     
        
        

    }

    // opción 3
    mostrarLocalidadesOcupadas(): void {

        const localidadesOcupadas = this.localidades.filter(
            localidad => localidad.estaOcupada);

        if(localidadesOcupadas.length === 0) {
            console.log('No hay localidades ocupadas'); 
            return;          
        }

        // en este punto del programa, sabemos que hay al menos una localidad ocupada
        for (const localidad of localidadesOcupadas) {

            const tipo = obtenerTipo(localidad.edadReserva);

            console.log(`${localidad.fila}.${localidad.columna} ${localidad.nombreReserva}, tlf: ${localidad.telefonoReserva}, Tipo: ${tipo}`);            
        }
    }

    // opción 4
    async venderLocalidad(rlp) {

        // solicitamos la fila
        const fila: string = await rlp.questionAsync(
            '¿En qué fila quieres sentarte (0-4)?\n');

        // validación de la fila
        const filaNumero = Number(fila);
        if((filaNumero < 0) || (filaNumero > 4)) {
            console.log('No existe la fila');
            return;
        }

        // solicitamos la columna
        const columna: string = await rlp.questionAsync(
            '¿Y en qué butaca (0-9)?\n');

        // validación de la columna
        const columnaNumero = +columna;
        if((columnaNumero < 0) || (columnaNumero > 9)) {
            console.log('No existe la butaca');
            return;
        }

        // solicitamos el nombre de la persona que reserva la localidad
        const nombre: string = await rlp.questionAsync(
            '¿Cómo se llama?\n');
        
        // validación del nombre
        if(nombre.length < 3) {
            console.log('Introduce al menos tres caracteres');
            return;            
        }

        // solicitamos el teléfono de la persona que reserva la localidad
        const telefono: string = await rlp.questionAsync(
            '¿Su teléfono?\n');

        // validación del teléfono (debe ser un número y tener exactamente 9 caracteres)
        const telefonoNumero = +telefono;
        if(isNaN(telefonoNumero)) {
            console.log('El teléfono no es un número');
            return;            
        }
        if(telefono.length !== 9) {
            console.log('El teléfono no es válido');
            return;
        }

        // solicitamos la edad de la persona que reserva la localidad
        const edad: string = await rlp.questionAsync(
            '¿Cuántos años tiene? (0-120)\n');

        const edadNumero = +edad;
        if((edadNumero < 0) || (edadNumero > 120)) {
            console.log('Edad incorrecta');            
            return;
        }

        // TODOS LOS DATOS SON CORRECTOS
        // verificamos si la localidad que quiere reservar la persona está ocupada o no
        const localidadAReservar = this.localidades.find(
            localidad => (
                (localidad.fila === filaNumero) && 
                (localidad.columna === columnaNumero)
            )
        )
        if(localidadAReservar.estaOcupada) {
            console.log('Localidad no está libre');
            return;
        }

        // en este punto del programa, todos los datos son correctos y, además, la localidad a reservar está libre
        localidadAReservar.estaOcupada = true;
        localidadAReservar.nombreReserva = nombre;
        localidadAReservar.edadReserva = edadNumero;
        localidadAReservar.telefonoReserva = telefonoNumero;

        const tipo = obtenerTipo(edadNumero);
        const precioEntrada = obtenerPrecioEntrada(tipo);

        console.log(`Se ha vendido la localidad ${fila}.${columna} a ${nombre} por ${precioEntrada} euros`);
        
    }

    // opción 5
    async cancelarLocalidad(rlp) {
        
        // solicitamos la fila
        const fila: string = await rlp.questionAsync(
            '¿Fila (0-4)?\n');

        // validación de la fila
        const filaNumero = Number(fila);
        if((filaNumero < 0) || (filaNumero > 4)) {
            console.log('No existe la fila');
            return;
        }

        // solicitamos la columna
        const columna: string = await rlp.questionAsync(
            '¿Butaca (0-9)?\n');

        // validación de la columna
        const columnaNumero = +columna;
        if((columnaNumero < 0) || (columnaNumero > 9)) {
            console.log('No existe la butaca');
            return;
        }

        // buscar la localidad que tenga la fila y la columna introducidas por el usuario
        const localidadEncontrada = 
         this.localidades.find(localidad => 
            (filaNumero === localidad.fila) &&
            (columnaNumero === localidad.columna)  
         );
        
        if(!localidadEncontrada.estaOcupada) {
            console.log('Localidad no ocupada');
            return;
        }
        
        console.log(`${localidadEncontrada.nombreReserva} ha cancelado su reserva`);        
        
        // cancela la localidad
        localidadEncontrada.nombreReserva = undefined;
        localidadEncontrada.estaOcupada = false;
        localidadEncontrada.edadReserva = undefined;
        localidadEncontrada.telefonoReserva = undefined;

    }

    // opción 6
    async consultarLocalidad(rlp) {

        // solicitamos la fila
        const fila: string = await rlp.questionAsync(
            '¿Fila (0-4)?\n');

        // validación de la fila
        const filaNumero = Number(fila);
        if((filaNumero < 0) || (filaNumero > 4)) {
            console.log('No existe la fila');
            return;
        }

        // solicitamos la columna
        const columna: string = await rlp.questionAsync(
            '¿Butaca (0-9)?\n');

        // validación de la columna
        const columnaNumero = +columna;
        if((columnaNumero < 0) || (columnaNumero > 9)) {
            console.log('No existe la butaca');
            return;
        }

        // buscar la localidad que tenga la fila y la columna introducidas por el usuario
        const localidadEncontrada = 
         this.localidades.find(localidad => 
            (filaNumero === localidad.fila) &&
            (columnaNumero === localidad.columna)  
         );

         // si la localidad no está ocupada
        if(!localidadEncontrada.estaOcupada) {
            console.log('Localidad libre');
            return;
        }

        const tipo = obtenerTipo(localidadEncontrada.edadReserva);
        const precio = obtenerPrecioEntrada(tipo);
        
        console.log(`Localidad ocupada por ${localidadEncontrada.nombreReserva}, tlf: ${localidadEncontrada.telefonoReserva}, Tipo: ${tipo}, Precio: ${precio}`);
    }

    // opción 7
    calcularRecaudacion() {

        let recaudacion = 0;

        // forEach
        this.localidades.forEach(localidad => {

            // si la localidad está ocupada, entonces calculamos el precio y lo sumamos a la recaudación
            if(localidad.estaOcupada) {

                const tipo = obtenerTipo(localidad.edadReserva);
                const precio = obtenerPrecioEntrada(tipo);
                recaudacion += precio;
            }
        })

        console.log(`Recaudación: ${recaudacion} euros`);
        
    }
}