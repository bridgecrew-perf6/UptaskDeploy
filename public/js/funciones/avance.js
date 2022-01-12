const Swal = require('sweetalert2');

export const actualizarAvance = () => {
    //seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if (tareas.length) {
        //seleccionar las tareas completadas
        const tareasCompletadas = document.querySelectorAll('i.completo');
        //calcular avance
        const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
        //mostrar el avance
        const procentaje = document.querySelector('#procentaje');
        procentaje.style.width = avance + '%';

        if (avance === 100) {
            Swal.fire(
                'Proyecto Completado',
                'Felicidades haz terminado el proyecto sigue así',
                'success')
        }
    }
}