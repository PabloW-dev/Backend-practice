<?php

namespace Controllers;

use Model\Proyectos;
use Model\Tareas;
use MVC\Router;

class TareasController {
    public static function index() { //no hace falta router porque el router sólo le hace render a las vistas, pero una API no requiere vistas
        $proyectoId = $_GET['id'];

        if(!$proyectoId) {
            header('Location: /dashboard');
        }

        $proyectos = Proyectos::where('url', $proyectoId);
        $proyectos = $proyectos instanceof Proyectos ? $proyectos : new Proyectos((array)$proyectos);

        session_start();

        if(!$proyectos || $proyectos->propietarioId !== $_SESSION['id']) header('Location: /404');

        $tareas = Tareas::belongsTo('proyectoId', $proyectos->id);

        echo json_encode(['tareas' => $tareas]);

    }

    public static function crear() {

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start(); //necesitamos saber si el proyecto que se está solicitando crear pertenece a la persona que está autenticada, no sólo si lo está o no, para eso podemos leer en $_SESSION el id del usuario y compararlo, pero primero hay que comparar la url

            $proyectoId = $_POST['proyectoId']; //obtenemos la url, que resulta única en la tabla, de esta manera podemos encontrar la línea donde está el id del usuario

            $proyectos = Proyectos::where('url', $proyectoId); //comparamos la información de la talba con la que le hemos pasado con el $_POST
            $proyectos = $proyectos instanceof Proyectos ? $proyectos : new Proyectos((array)$proyectos);

            if(!$proyectos || $proyectos->propietarioId !== $_SESSION['id']) { //le decimos al mismo tiempo si el proyecto no existe o si el propietario id de la url no coincide con el id de $_SESSION, que no hace falta pasárselo porque ya está en $_SESSION en el momento en que el usuario se loguea, muestre error
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al agregar la tarea'
                ];
                echo json_encode($respuesta);
                return;
            }

            //Todo bien, instanciar y crear la tarea
            $tareas = new Tareas($_POST); //tiene el nombre de la tarea y el proyectoId, el resto de los campos los añade automáticamente porque hemos instanciado el modelo
            $tareas->proyectoId = $proyectos->id; //reasignamos la variable, porque antes de esto en esta casilla estaba la URL, y ya no nos hace falta porque no queremos ni guardarla y ya hemos pasado la validación
            $resultado = $tareas->guardar(); //crea o actualiza según lo que toque, crear nos da el id, que resulta justo lo que falta

            $respuesta = [ //para que muestre la alerta de éxito
                'tipo' => 'exito',
                'id' => $resultado['id'],
                'mensaje' => 'Tarea Creada Correctamente',
                'proyectoId' => $proyectos->id
            ];
            echo json_encode($respuesta);

            //si en el json_encode ponemos $_POST, retornamos los datos que hemos metido en FormData al llamar el método, si le ponemos $proyectos y el proyecto no existe, devuelve null, por eso hemos creado la respuesta de error arriba
        }
    }

    public static function actualizar() {
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            //Validar que el proyecto existe
            $proyectos = Proyectos::where('url', $_POST['proyectoId']);
            $proyectos = $proyectos instanceof Proyectos ? $proyectos : new Proyectos((array)$proyectos);

            session_start();

            if(!$proyectos || $proyectos->propietarioId !== $_SESSION['id']) { //le decimos al mismo tiempo si el proyecto no existe o si el propietario id de la url no coincide con el id de $_SESSION, que no hace falta pasárselo porque ya está en $_SESSION en el momento en que el usuario se loguea, muestre error
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al actualizar la tarea'
                ];
                echo json_encode($respuesta);
                return;
            }

            $tareas = new Tareas($_POST);
            $tareas->proyectoId = $proyectos->id; //modificamos para no meterle la url

            $resultado = $tareas->guardar();
            if($resultado) {
                $respuesta = [ //para que muestre la alerta de éxito
                    'tipo' => 'exito',
                    'id' => $tareas->id,
                    'proyectoId' => $proyectos->id,
                    'mensaje' => 'Actualizado Correctamente'
                ];
                echo json_encode(['respuesta' => $respuesta]);
            }
        }
    }

    public static function eliminar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $proyectos = Proyectos::where('url', $_POST['proyectoId']);
            $proyectos = $proyectos instanceof Proyectos ? $proyectos : new Proyectos((array)$proyectos);

            session_start();

            if(!$proyectos || $proyectos->propietarioId !== $_SESSION['id']) { //le decimos al mismo tiempo si el proyecto no existe o si el propietario id de la url no coincide con el id de $_SESSION, que no hace falta pasárselo porque ya está en $_SESSION en el momento en que el usuario se loguea, muestre error
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al eliminar la tarea'
                ];
                echo json_encode($respuesta);
                return;
            }

            $tareas = new Tareas($_POST);
            $resultado = $tareas->eliminar();
            
            $resultado = [ //para que muestre la alerta de éxito
                'resultado' => $resultado,
                'mensaje' => 'Eliminado Correctamente',
                'tipo' => 'exito'
            ];
            echo json_encode($resultado);
            
        }
    }
}