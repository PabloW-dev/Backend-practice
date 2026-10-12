<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\DashboardController;
use Controllers\LoginController;
use Controllers\TareasController;
use MVC\Router;
$router = new Router();


//Login + Crear Cuenta + Olvide + Restablecer + Confirmación
$router->get('/', [LoginController::class, 'login']);
$router->get('/logout', [LoginController::class, 'logout']);
$router->get('/crear', [LoginController::class, 'crear']);
$router->get('/olvide', [LoginController::class, 'olvide']);
$router->get('/restablecer', [LoginController::class, 'restablecer']);
$router->get('/mensaje', [LoginController::class, 'mensaje']);
$router->get('/confirmar', [LoginController::class, 'confirmar']);


$router->post('/', [LoginController::class, 'login']);
$router->post('/crear', [LoginController::class, 'crear']);
$router->post('/olvide', [LoginController::class, 'olvide']);
$router->post('/restablecer', [LoginController::class, 'restablecer']);


//Zona de proyectos
$router->get('/dashboard', [DashboardController::class, 'index']);
$router->get('/crear-proyecto', [DashboardController::class, 'crear_proyecto']);
$router->get('/perfil', [DashboardController::class, 'perfil']);
$router->get('/proyecto', [DashboardController::class, 'proyecto']);
$router->get('/cambiar-password', [DashboardController::class, 'cambiar_password']);


$router->post('/crear-proyecto', [DashboardController::class, 'crear_proyecto']);
$router->post('/perfil', [DashboardController::class, 'perfil']);
$router->post('/cambiar-password', [DashboardController::class, 'cambiar_password']);

//API para las tareas
$router->get('/api/tareas', [TareasController::class, 'index']);


$router->post('/api/tareas', [TareasController::class, 'crear']); //estos request y URL se van a llamar desde el método agregarTarea del JS
$router->post('/api/tareas/actualizar', [TareasController::class, 'actualizar']);
$router->post('/api/tareas/eliminar', [TareasController::class, 'eliminar']);


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();