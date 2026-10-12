const mobileMenuBtn = document.querySelector('#mobile-menu');
const cerrarMenuBtn = document.querySelector('#cerrar-menu');
const sidebar = document.querySelector('.sidebar');

if(mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.add('mostrar'); //toggle ya automatiza el agregar y quitar
    })
}

if(cerrarMenuBtn) {
    cerrarMenuBtn.addEventListener('click', function() {
        sidebar.classList.add('ocultar');
        setTimeout(() => {
            sidebar.classList.remove('mostrar');
            sidebar.classList.remove('ocultar');
        }, 1000);
    })
}

//Elimina la clase de mostrar en un tamaño de tablet o mayores
const anchoPantalla = document.body.clientWidth;

window.addEventListener('resize', function() { //resize resulta cuando cambia el tamaño de la ventana, ya resulte por click + desplazamiento del ratón o por cualquier otra cosa
    const anchoPantalla = document.body.clientWidth; //la ponemos otra vez porque hay que reevaluar todo el rato
    if(anchoPantalla >= 768) {
        sidebar.classList.remove('mostrar');
    }
})