<?php

namespace Controllers;

use Classes\Email;
use Model\Usuarios;
use MVC\Router;

class LoginController {
    public static function login(Router $router) {

        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario = new Usuarios($_POST);

            $alertas = $usuario->validarLogin();

            if(empty($alertas)) {
                $usuario = Usuarios::where('email', $usuario->email);
                $usuario = $usuario instanceof Usuarios ? $usuario : new Usuarios((array)$usuario);

                if(!$usuario || !$usuario->confirmado) {
                    Usuarios::setAlerta('error', 'El Usuario no Existe o no está Confirmado');
                } else {
                    if(password_verify($_POST['password'], $usuario->password)) {
                        session_start();

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                        header('Location: /dashboard');
                    } else {
                        Usuarios::setAlerta('error', 'Password Incorrecto');
                    }
                }


            }
        }

        $alertas = Usuarios::getAlertas();

        $router->render('/auth/login', [
            'titulo' => 'Iniciar Sesión',
            'alertas' => $alertas
        ]);
    }

    public static function logout() {
        session_start();
        $_SESSION = [];
        header('Location: /');
    }

    public static function crear(Router $router) {

        $usuario = new Usuarios;
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);

            $alertas = $usuario->validarNuevaCuenta();
            
            if(empty($alertas)) {
                $existeUsuario = Usuarios::where('email', $usuario->email);
                if($existeUsuario) {
                    Usuarios::setAlerta('error', 'El Usuario ya está registrado');
                    $alertas = Usuarios::getAlertas();
                } else {
                    $usuario->hashPassword();

                    //Eliminar password2
                    unset($usuario->password2); //recordamos que estmoas dentro de post, aquí le hemos pasado los datos que ha metido el usuario :)

                    //Crear el token
                    $usuario->crearToken();

                    //Crear un nuveo usuario
                    $resultado = $usuario->guardar();

                    //enviar Email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);

                    $email->enviarConfirmacion();

                    if($resultado) {
                        header('Location: /mensaje');
                    }
                }
            }
        }

        $router->render('/auth/crear', [
            'titulo' => 'Crea tu Cuenta en UpTask',
            'alertas' => $alertas,
            'usuario' => $usuario
        ]);
    }

    public static function olvide(Router $router) {

        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario = new Usuarios($_POST);
            $alertas = $usuario->validarEmail();

            if(empty($alertas)) {
                $usuario = Usuarios::where('email', $usuario->email);
                $usuario = $usuario instanceof Usuarios ? $usuario : new Usuarios((array)$usuario);

                if($usuario && $usuario->confirmado === "1") {
                    $usuario->crearToken();
                    unset($usuario->password2);

                    $usuario->guardar();

                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);

                    $email->enviarInstrucciones();

                    Usuarios::setAlerta('exito', 'Hemos enviado las instrucciones a tu email');
                } else {
                    Usuarios::setAlerta('error', 'El Usuario no existe o no está confirmado');
                                     
                }

            }
        }

        $alertas = Usuarios::getAlertas();   

        $router->render('/auth/olvide', [
            'titulo' => 'Olvidé mi Password',
            'alertas' => $alertas
        ]);
    }

    public static function restablecer(Router $router) {

        $token = s($_GET['token']);
        $mostrar = true;
        $alertas = [];

        if(!$token) header('Location: /');

        $usuario = Usuarios::where('token', $token);
        $usuario = $usuario instanceof Usuarios ? $usuario : new Usuarios((array)$usuario);

        if(empty($usuario)) {
            Usuarios::setAlerta('error', 'Token No Válido');
            $mostrar = false;
        }

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);

            $alertas = $usuario->validarPassword();

            if(empty($alertas)) {
                $usuario->hashPassword();

                $usuario->token = null;

                $resultado = $usuario->guardar();

                if($resultado) {
                    header('Location: /');
                }
            }
        }

        $alertas = Usuarios::getAlertas();

        $router->render('/auth/restablecer', [
            'titutlo' => 'Restablecer Password',
            'alertas' => $alertas,
            'mostrar' => $mostrar
        ]);
    }

    public static function mensaje(Router $router) {
        
        $router->render('/auth/mensaje', [
            'titutlo' => 'Cuenta Creada Exitosamente'
        ]);
    }

    public static function confirmar(Router $router) {
        $token = $_GET['token'];

        if(!$token) header('Location: /');

        $usuario = Usuarios::where('token', $token);
        $usuario = $usuario instanceof Usuarios ? $usuario : new Usuarios((array)$usuario);

        if(empty($usuario)) {
            Usuarios::setAlerta('error', 'Token No Válido');
        } else {
            $usuario->confirmado = 1;
            $usuario->token = null;
            unset($usuario->password2);

            $usuario->guardar();

            Usuarios::setAlerta('exito', 'Cuenta Confirmada Correctamente');
        }

        $alertas = Usuarios::getAlertas();
        
        $router->render('/auth/confirmar', [
            'titutlo' => 'Confirmar Cuenta',
            'alertas' => $alertas
        ]);
    }
}