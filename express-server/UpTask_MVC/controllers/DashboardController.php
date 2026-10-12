<?php

namespace Controllers;

use Model\Proyectos;
use Model\Usuarios;
use MVC\Router;

class DashboardController {
    public static function index(Router $router) {

        session_start();

        isAuth();

        $id = $_SESSION['id'];

        $proyectos = Proyectos::belongsTo('propietarioId', $id);

        $router->render('dashboard/index', [
            'titulo' => 'Proyectos',
            'proyectos' => $proyectos
        ]);
    }

    public static function crear_proyecto(Router $router) {

        session_start();

        isAuth();
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $proyectos = new Proyectos($_POST);

            $alertas = $proyectos->validarProyecto();

            if(empty($alertas)) {
                //Generar una URL única
                $hash = md5(uniqid());
                $proyectos->url = $hash; //nunca usar md5 para hasehar un password, pero sí para URLs, porque siempre genera la misma cadena

                //almacenar al creador del proyecto (el usuario que está autenticado)
                $proyectos->propietarioId = $_SESSION['id'];


                //Guardar
                $proyectos->guardar();

                //Redireccionar al proyecto recién creado con su url
                header('Location: /proyecto?id=' . $proyectos->url);
            }
        }

        

        $router->render('dashboard/crear-proyecto', [
            'titulo' => 'Crear Proyecto',
            'alertas' => $alertas
        ]);
    }

    public static function proyecto(Router $router) {

        session_start();

        isAuth();

        //las siguientes líneas resultan para que otros usuarios no puedan ver el proyecto copiando y pegando la URL
        $token = $_GET['id'];

        if(!$token) header('Location: /dashboard');

        $proyectos = Proyectos::where('url', $token);
        $proyectos = $proyectos instanceof Proyectos ? $proyectos : new Proyectos((array)$proyectos);

        if($proyectos->propietarioId !== $_SESSION['id']) {
            if(!$token) header('Location: /dashboard');
        }
        


        $router->render('dashboard/proyecto', [
            'titulo' => $proyectos->proyecto
        ]);
    }

    public static function perfil(Router $router) {

        session_start();
        isAuth();

        $usuarios = Usuarios::find($_SESSION['id']);
        $usuarios = $usuarios instanceof Usuarios ? $usuarios : new Usuarios((array)$usuarios);
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuarios->sincronizar($_POST);


            $alertas = $usuarios->validar_perfil();

            if(empty($alertas)) {
                $existeUsuario = Usuarios::where('email', $usuarios->email);

                if($existeUsuario && $existeUsuario->id !== $usuarios->id) { //pero ahora si sólo cambio el nombre, me salta la alerta, por eso el &&
                    //Mensaje de error
                    Usuarios::setAlerta('error', 'Email no válido, ya pertenece a otra cuenta'); 
                } else {
                    //Guardar
                    $resultado = $usuarios->guardar(); //crea o actualiza, lo que hará resultará actualizarlo por id

                    if($resultado) {
                        Usuarios::setAlerta('exito', 'Guardado Correctamente');
                    
                        //Asignar el nombre nuevo
                        $_SESSION['nombre'] = $usuarios->nombre;
                    }
                }
            }
        }

        $alertas = Usuarios::getAlertas();

        $router->render('dashboard/perfil', [
            'titulo' => 'Perfil',
            'usuarios' => $usuarios,
            'alertas' => $alertas
        ]);
    }

    public static function cambiar_password(Router $router) {

        session_start();
        isAuth();

        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuarios = Usuarios::find($_SESSION['id']);
            $usuarios = $usuarios instanceof Usuarios ? $usuarios : new Usuarios((array)$usuarios);

            //Sincronizar con los datos del usuario
            $usuarios->sincronizar($_POST);

            $alertas = $usuarios->nuevo_password();

            if(empty($alertas)) {
                $resultado = $usuarios->comporbar_password();

                if($resultado) {
                    $usuarios->password = $usuarios->password_nuevo;
                    unset($usuarios->password_nuevo);
                    unset($usuarios->password_actual); //para que lo quite antes de guardar

                    $usuarios->hashPassword();

                    $resultado = $usuarios->guardar(); //crea o actualiza, lo que hará resultará actualizarlo por id

                    if($resultado) {
                        Usuarios::setAlerta('exito', 'Password Cambiado Correctamente');
                    }
                    
                } else {
                    Usuarios::setAlerta('error', 'Password Incorrecto'); 
                    
                }
            }
        }

        $alertas = Usuarios::getAlertas();

        $router->render('dashboard/cambiar-password', [
            'titulo' => 'Cambiar Password',
            'usuarios' => $usuarios,
            'alertas' => $alertas
        ]);
    }
}