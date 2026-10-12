//en js las variables se pueden usar entre ellos así que se pueden mezclar, eso resulta un tema, así que hay que protejer las variables colocando un iife:

(function() {

    obtenerTareas();
    let tareas = [];
    let filtradas = [];

    //botón para mostrar el modal de agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click', function() {
        mostrarFormulario();
    }); //aquí hace falta un callback porque si ponemos sólo mostrarFormulario le va a pasar e en lugar de editar = false, porque además no le hace falta, ya que ya lo estamos escuchando dentro de la función

    //Filtros de búsqueda
    const filtros = document.querySelectorAll('#filtros input[type="radio"'); //traemos todos
    //filtros.addeventListener no va a funcionar porque en all no tira, hay que iterar
    filtros.forEach( radio => { //no interesa crear un array nuevo con map, sólo iterar
        radio.addEventListener('input', filtrarTareas);
    } )

    function filtrarTareas(e) {
        const filtro = e.target.value;

        if(filtro !== '') { //así no aplica al de todas
            filtradas = tareas.filter(tarea => tarea.estado === filtro); //trae las que resultan iguales al estado que estamos filtrando
        } else {
            filtradas = [];
        }

        mostrarTareas();
    }

    async function obtenerTareas() {
        try {
            const id = obtenerProyecto();
            const url = `/api/tareas?id=${id}`
            const respuesta = await fetch(url); //recordamos que fetch tiene GET por defecto, por eso no se lía con qué método llamar al hacer la petición al servidor de esa URL
            const resultado = await respuesta.json();
            //const { tareas } = resultado; //destructiring para acceder al array del objeto general que ha devuelto el json (resultado.tareas)
            tareas = resultado.tareas;
            mostrarTareas();
        } catch (error) {
            console.log(error);
        }
    }

    function mostrarTareas() {
        limpiarTareas(); //así lo llama cada vez que llamamos a mostrartareas y no duplica nada

        totalPendientes();
        totalCompletadas();

        const arrayTareas = filtradas.length ? filtradas : tareas; //si hay algo en filtradas, reasigna a lo que haya, pero falta el detalle de que si pendientes o completas está vacío, va a traer todas, por cómo está hecho esto, para ello creamos dos funciones arriba, totalPendientes y totalCompletadas

        if(arrayTareas.length === 0) { //primero vamos a contar el número de tareas que ha traido, si resulta 0:
            const contenedorTareas = document.querySelector('#listado-tareas');

            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No hay Tareas';
            textoNoTareas.classList.add('no-tareas');

            contenedorTareas.appendChild(textoNoTareas);
            return;
        }

        const estado = { //esto, diccionario
            0: 'Pendiente',
            1: 'Completada'
        }

        //si resulta cualquier otro número, siempre resulta un array, porque el json lo trae así, así que iteramos para sacar los objetos en tarea
        arrayTareas.forEach(tarea => { //esto lo podríamos hacer con un template string, pero como se va a mostrar nada más abrir la página, lo hacemos así
            const contenedorTarea = document.createElement('LI');
            contenedorTarea.dataset.tareaId = tarea.id; //le colocamos un atributo data-, recuerda los atributos personalizados de dataset, nos va a devolver algo como data-tarea-id
            contenedorTarea,classList.add('tarea'); //le metemos una clase

            const nombreTarea = document.createElement('P');
            nombreTarea.textContent = tarea.nombre;
            nombre.tarea.ondblclick = function() {
                mostrarFormulario(editar = true, {...tarea});
            }

            const opcionesDiv = document.createElement('DIV');
            opcionesDiv.classList.add('opciones');

            //botones
            const btnEstadoTarea = document.createElement('BUTTON');
            btnEstadoTarea.classList.add('estado-tarea');
            btnEstadoTarea.classList.add(`${estado[tarea.estado].toLowerCase()}`); //agregamos la clase de estado, Pendiente o Completada, tolowercase lo pone todo en minúscula para poder usarlo como clase
            btnEstadoTarea.dataset.estadoTarea = tarea.estado; //esto nos da data-tarea-estado y lo agrega como atributo
            btnEstadoTarea.textContent = estado[tarea.estado]; //le metemos el estado como botón, pero aparecerá como puros 0, así que arriba hacemos algo parecido a un diccionario /\ y metemos el estado entre corchetes, así le agrega el texto segñun 0 o 1 y no muestra los números
            btnEstadoTarea.ondblclick = function() { //recuerda que on tiene muchos eventos que se pueden usar, este resulta para doble click
                cambiarEstadoTarea({...tarea}); //lo pasamos como un objeto copia que se ha sacado del array gracias al ..., así modificamos la copia
            }

            const btnEliminarTarea = document.createElement('BUTTON');
            btnEliminarTarea.classList.add('eliminar-tarea');
            btnEliminarTarea.dataset.idTarea = tarea.id; //esto lo requerimos para que cada una tenga un id diferente y poder diferenciarlas para luego trabajar con ellas
            btnEliminarTarea.textContent = 'Eliminar';
            btnEliminarTarea.ondblclick = function() {
                confirmarEliminarTarea({...tarea});
            }

            opcionesDiv.appendChild(btnEstadoTarea);
            opcionesDiv.appendChild(btnEliminarTarea);

            contenedorTarea.appendChild(nombreTarea);
            contenedorTarea.appendChild(opcionesDiv);

            const listadoTareas = document.querySelector('#listado-tareas');
            listadoTareas.appendChild(contenedorTarea);
        });
    }

    function totalPendientes() {
        const totalPendientes = tareas.filter(tarea => tarea.estado === '0'); //trae las que tienen en estado 0
        const pendientesRadio = document.querySelector('#pendientes');
        
        if(totalPendientes.length === 0) {
            pendientesRadio.disabled = true; //ale, así ya no se puede pulsar el botón de pendientes xdddd
        } else {
            pendientesRadio.disabled = false;
        }
    }

    function totalCompletadas() {
        const totalCompletadas = tareas.filter(tarea => tarea.estado === '1'); //trae las que tienen en estado 0
        const completadasRadio = document.querySelector('#completadas');
        
        if(totalCompletadas.length === 0) {
            completadasRadio.disabled = true; //ale, así ya no se puede pulsar el botón de pendientes xdddd
        } else {
            completadasRadio.disabled = false;
        }
    }

    function mostrarFormulario(editar = false, tarea = {}) { //para saber si estamos editando o no y le pasamos un objeto vacío para que no muestre nada si no hay nombre (si no estamos editando)
        const modal = document.createElement('DIV');
        modal.classList.add('modal'); //no se recomienda hacer una función más reutilizable que esto, si hay más cambios, mejor dos
        modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>${editar ? 'Editar Tarea' : 'Añade una Nueva Tarea'}</legend>
                <div class="campo">
                    <label for="tarea">Tarea</label>
                    <input
                        type="text"
                        name="tarea"
                        placeholder="${tarea.nombre ? 'Edita la Tarea' : 'Añadir Tarea al Proyecto Actual'}"
                        id="tarea"
                        value="${tarea.nombre ? tarea.nombre : ''}"
                    />
                </div>
                <div class="opciones">
                    <input 
                        type="submit" 
                        class="submit-nueva-tarea" 
                        value="${tarea.nombre ? 'Guardar Cambios' : 'Añadir Tarea'}">
                    <button type="button" class="cerrar-modal">Cancelar</button>
                </div>
            </form>
        `; //un submit trata de enviar el formulario por default

        setTimeout(() => {
            const formulario = document.querySelector('formulario');
            formulario.classList.add('animar');
        }, 0);

        //delegation en JS: hemos generado una ventana modal, que va a tratar de identificar a qué le hemos dado click:

        //Si hacemos esto:
        //const btnCerrarModal = document.querySelector('.cerrar-modal');
        //btnCerrarModal.addEventListener('click', function(e) {

        //})
        //no va a funcionar porque está buscando algo que se va a generar dinámicamente, y para eso nos hace falta delegation. En el otro proyecto no pasaba porque hacíamos esto:

        //const servicio = document.createElement('DIV');
        //servicio.onclick = function

        //pero como resulta mucho HTML ya hemos usado innerHTML, ahí está el tema


        modal.addEventListener('click', function(e) {
            e.preventDefault(); //aquí le decimos que no haga nada
            
            if(e.target.classList.contains('cerrar-modal')) { //aquí le decimos que compruebe si tiene esa clase

                const formulario = document.querySelector('.formulario');
                formulario.classList.add('cerrar');
                setTimeout(() => {
                    modal.remove();
                }, 500); //aquí invertimos la animación, se puede seleccionar la clase porque JS tiene un orden para decidir qué se ejecuta primero, aquí en este caso ya existe la clase, así que se puede seleccionar, porque la otra parte tiene más prioridad, pilla Stack, heap y queue por orden. como settime out no se ejecuta en el stack, y le hemos dicho que la función esta sí, lo pilla bien
            }
            if(e.target.classList.contains('submit-nueva-tarea')) {
                const nombreTarea = document.querySelector('#tarea').value.trim(); //leemos lo que el usuario escribe, trim elimina los espacios al inicio y al final si el usuario escribe espacios que sobran

                if(nombreTarea === '') {
                    //Mostrar alerta de error
                    mostrarAlerta('El Nombre de la Tarea es Obligatorio', 'error', document.querySelector('.formulario legend'));
                    return;
                }

                if(editar) {
                    tarea.nombre = nombreTarea;
                    actualizarTarea(tarea); //pero esto da el problema de que el objeto a actualizar sólo va a tener el nombre, por la variable de trim que hemos hecho arriba, así que cambiamos el nombre de la variable de nombreTarea
                } else {
                    agregarTarea(nombreTarea); //aquí no pasa nada porque sólo le hace falta el nombre
                }
            }
        })

        document.querySelector('.dashboard').appendChild(modal);
    }

    function mostrarAlerta(mensaje, tipo, referencia) { //muestra un mensaje en la interfaz

        //Para que no se creen más alertas una vez ya hay una:
        const alertaPrevia = document.querySelector('.alerta');
        if(alertaPrevia) {
            alertaPrevia.remove();
        }

        const alerta = document.createElement('DIV');
        alerta.classList.add('alerta', tipo);
        alerta.textContent = mensaje;

        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling); //ahora, semánticamente no se puede poner un div dentro de un legend, así que hay que hacerlo evitando eso, en lugar de appendchild, se usa insertbefore, que requiere un padre y antes de qué hijo colocarlo, el padre lo podemos encontrar con parentElement, haciendo lo que se conoce como traversing the DOM, si lo ponemos antes ya se localiza dentro del padre, y la referencia el hijo del cuál va antes, en este caso el legend. Ahora, no hay un insertAfter (que ya podría), podemos crear nuestro propio insertAfter o hacer más traversing DOM con nextElementSibling, que busca al hermanico que está al lado, así que puedes decirle que coja de referencia el hermanico de al lado con referencia.nextElement.Sibling para que resulte como un insertAfter

        //eliminar la alerta después de 5 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

    //consultar el servidor para añadir una nueva tarea al proyecto actual, esto hace falta una API porque requiere interactuar con la DB
    async function agregarTarea(tarea) {
        //Contruir la petición
        const datos = new FormData();
        datos.append('nombre', tarea); //de esta manera podemos enviar datos nosotros mismos cuando el usuario envíe un POST, en este caso, le enviamos lo que el usuario ha escrito cuando llamamos al método en la otra función
        datos.append('proyectoId', obtenerProyecto());


        //hace falta usar async await porque hace falta que todo siga mientras hace la petición o envía los datos, ya que puede tardar, ya que fetch resulta asíncrono


        //usamos un try catch porque resulta crítico que no se detenga la ejecución del resto del programa si hay un error y podremos debuguearlo si hay alguno
        try {
            const url = 'http://localhost:3000/api/tareas';
            respuesta = await fetch(url, { //hacemos la petición al servidor de la url, como tiene una función asociada en el controller, este se encarga del resto
                method: 'POST', //le decimos que resulta POST porque fetch tiene GET por defecto
                body: datos
            });

            const resultado = await respuesta.json(); //para leer la respuesta del echo

            mostrarAlerta(resultado.mensaje, resultado.tipo, document.querySelector('.formulario legend'));

            if(resultado.tipo === 'exito') {
                const modal = document.querySelector('.modal');
                setTimeout(() => {
                    modal.remove();
                    //window.location.reload(); //recarga la ventana actual, pero hace una consulta extra
                }, 3000);

                //Agregar el objeto de tarea al global de tareas
                const tareaObj = { //este objeto tiene que resultar igual que el de la DB, así que en TareasCintrilller hay que pasarle todo el array en la respuesta de json
                    id: String(resultado.id), //lo convertimos a string
                    nombre: tarea,
                    estado: "0",
                    proyectoId: resultado.proyectoId
                }

                tareas = [...tareas, tareaObj]; //tomo una copia del array que tengo ahora mismo y le agrego el objeto nuevo, a estas alturas se ha rellenado el array previamente de sobra, o si está vacío da igual realmente, esto no modifica el original porque no tiene .push(), que sí lo modifica
                mostrarTareas(); //volvemos a regenerar todo, ahora no hace falta consultar la base de datos con cada cambio, sólo cuando se agrega la tarea... pero ahora mismo va a duplicar +1, si había 10, habrá 21, así que hay que limpiar
            }

        } catch(error) { //esto se ejecuta sólo si falla la conexión, por eso le ponemos la alerta arriba
            console.log(error);
        }
    }

    function cambiarEstadoTarea(tarea) { //como estamos iterando arriba, al hacer doble click le paso ese objeto en concreto en el que se ha hecho click
        const nuevoEstado = tarea.estado === "1" ? "0" : "1"; //si está como 1 entonces a 0, si está como 0, entonces a 1, apañao
        tarea.estado = nuevoEstado; //y lo asociamos a la tarea, pero hay que cambiar también la clase, además no se recomienda mutar los datos, menos cuando ni siquiera sabemos si aún no se han enviado a la base de datos, y resulta justo lo que estamos haciendo al cambiar el estado, y JS lo hace automático si hacemos esto, para apañar esto vamos arriba donde hemos llamado esta función y le ponemos {...tarea} para que saque una copia y deje el original tranquilo
        actualizarTarea(tarea);
    }

    async function actualizarTarea(tarea) {
        //aquí se envía al servidor
        const {estado, id, nombre} = tarea;

        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto()); //identificar que la persona que modifica el estado de una tarea resulta la persona que lo creó
        //comprobar los datos que se van a enviar
        //for( let valor of datos.values()) {
            //console.log(valor);
        //}
        try {
            const url = 'http://localhost:3000/api/tareas/actualizar'

            const respuesta = await fetch(url, { //como resulta post hay que especificarlo
                method: 'POST',
                body: datos
            });
            const resultado = await respuesta.json(); //con esto ya actualiza la etiqueta, pero aún hay que recargar para que lo muestre

            if(resultado.respuesta.tipo === 'exito') {
                Swal.fire(
                    resultado.respuesta.mensaje,
                    resultado.respuesta.mensaje,
                    'success'
                );

                const modal = document.querySelector('.modal');
                if(modal) {
                    modal.remove(); //un poco abrupto pero bueno
                }
                //y ahora que lo cambie sin recargar: identificar el id para saber qué tarea, después regenerar todo el html
                tareas = tareas.map(tareaMemoria => { //así map muestra las tareas que están en memoria
                    if(tareaMemoria.id === id) { //coparamos con la que he hecho click
                        tareaMemoria.estado = estado; //pero esto va a meterle undefinned en las demás tareas
                        tareaMemoria.nombre = nombre;
                    }

                    return tareaMemoria; //así lo devuelvo a tareas, el array copia, y deja de hacer los undefinned
                }); //itera en el array de tareas pero crea uno nuevo, así no muta

                mostrarTareas(); //y ahora sí, lo cambia la apariencia sin recargar
            }
        } catch (error) {
            console.log(error);
        }
    }

    function confirmarEliminarTarea({tarea}) {
        //const respuesta = confirm('Eliminar?'); //nativa de JS, te da true o false
        //pero mejor sweet alert que para eso está (recordando importarlo en proyecto.php):
        Swal.fire({
            title: '¿Eliminar Tarea?',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTarea(tarea);
            }
        });
    }

    async function eliminarTarea(tarea) {

        const {estado, id, nombre} = tarea;

        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());

        try {
            const url = 'http://localhost:3000/api/tareas/eliminar'

            const respuesta = await fetch(url, { //como resulta post hay que especificarlo
                method: 'POST',
                body: datos
            });
            const resultado = await respuesta.json(); //con esto ya actualiza la etiqueta, pero aún hay que recargar para que lo muestre

            if(resultado.resultado) {
                //mostrarAlerta(
                //    resultado.mensaje, 
                //    resultado.tipo, 
                //    document.querySelector('.contenedor-nueva-tarea')
                //);

                Swal.fire('Eliminado!', resultado.mensaje, 'success');

                //y ahora que lo cambie sin recargar: identificar el id para saber qué tarea, después regenerar todo el html
                tareas = tareas.filter(tareaMemoria => tareaMemoria.id !== tarea.id); //filter crea un array nuevo que sirve para sacar todos excepto uno o uno excepto los demás. Tanto filter como map dan implícito el return, pero antes hacía falta el if, por eso había que escribirlo, aquí no hace falta "trae todas las que resulten diferentes a la que hemos seleccionado", con === trae las que resultan iguales
                mostrarTareas(); //y ahora sí, lo cambia la apariencia sin recargar
            }
        } catch (error) {
            console.log(error);
        }
    }

    function obtenerProyecto() {
        const proyectoParams = new URLSearchParams(window.location.search); //esto para acceder a la URL, como la desconocemos, hay que hacerlo así, esto devuelve sólo lo que hay después del ? de la URL, si quisiera la URL completa le pongo href en lugar de search
        //no se peude iterar, porque como FormData, resulta un objeto, y no tenemos cómo iterarlo, pero fromEntries sí itera los objetos
        const proyecto = Object.fromEntries(proyectoParams.entries()); //entries nos trae los datos que tenemos en la otra variable, así leemos lo que hay en la URL, además nos da acceso a que no se puedan añadir cosas en la URL
        return proyecto.id; //devolvemos los datos, el id del proyecto, que resulta la extensíon de la URL
    }

    function limpiarTareas() {
        const listadoTareas = document.querySelector('#listado-tareas');
        //listadoTareas.innerHTML = ''; //esto lo limpiría pero va un poco lento

        while(listadoTareas.firstChild) { //mientras haya hijicos
            listadoTareas.removeChild(); //elimina el primero
        }
    }

})(); //este paréntesis hace que la función se ejecute inmediatamente, por eso se llaman IIFE, como sólo está puesta en la vista de proyecto, se ejecutará al mostrar esa vista