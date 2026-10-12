<?php

namespace Model;

class Usuarios extends ActiveRecord {
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'email', 'password', 'token', 'confirmado'];

    public $id;
    public $nombre;
    public $email;
    public $password;
    public $password2;
    public $password_actual;
    public $password_nuevo;
    public $token;
    public $confirmado;


    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->password2 = $args['password2'] ?? '';
        $this->password_actual = $args['password_actual'] ?? '';
        $this->password_nuevo = $args['password_nuevo'] ?? '';
        $this->token = $args['token'] ?? '';
        $this->confirmado = $args['confirmado'] ?? 0;
    }

    public function validarLogin() {
        if(!$this->email) {
            self::$alertas['error'] [] = 'El Email es obligatorio';
        }   

        if(!filter_var($this->email, FILTER_VALIDATE_EMAIL)) { //filtros de php
            self::$alertas['error'] [] = 'Email no Válido';
        }   

        if(!$this->password) {
            self::$alertas['error'] [] = 'El Password es Obligatorio';
        }  

        return self::$alertas;
    }

    public function validarNuevaCuenta() {
        if(!$this->nombre) {
            self::$alertas['error'] [] = 'El Nombre es Obligatorio';
        }
        if(!$this->email) {
            self::$alertas['error'] [] = 'El Email es Obligatorio';
        }
        if(!$this->password) {
            self::$alertas['error'] [] = 'El Password es Obligatorio';
        }
        if(strlen($this->password) < 6) {
            self::$alertas['error'] [] = 'El Password debe contener al menos 6 Caracteres';
        }
        if($this->password !== $this->password2) {
            self::$alertas['error'] [] = 'Los Password no coinciden';
        }

        return self::$alertas;
    }

    public function validarEmail() {
        if(!$this->email) {
            self::$alertas['error'] [] = 'El Email es obligatorio';
        }   

        if(!filter_var($this->email, FILTER_VALIDATE_EMAIL)) { //filtros de php
            self::$alertas['error'] [] = 'Email no Válido';
        }   

        return self::$alertas;
    }

    public function validarPassword() {
        if(!$this->password) {
            self::$alertas['error'] [] = 'El Password es Obligatorio';
        }
        if(strlen($this->password) < 6) {
            self::$alertas['error'] [] = 'El Password debe contener al menos 6 Caracteres';
        }

        return self::$alertas;
    }

    public function validar_perfil() {
        if(!$this->nombre) {
            self::$alertas['error'] [] = 'El Nombre es Obligatorio';
        }
        if(!$this->email) {
            self::$alertas['error'] [] = 'El Email es Obligatorio';
        }
        return self::$alertas;
    }

    public function nuevo_password() : array {
        if(!$this->password_actual) {
            self::$alertas['error'] [] = 'El Password Actual no puede ir vacío';
        }
        if(!$this->password_nuevo) {
            self::$alertas['error'] [] = 'El Password Nuevo no puede ir vacío';
        }
        if(strlen($this->password_nuevo) < 6) {
            self::$alertas['error'] [] = 'El Password Nuevo debe contener al menos 6 Caracteres';
        }

        return self::$alertas;
    }

    public function comporbar_password() : bool {
        return password_verify($this->password_actual, $this->password); //al final esto lo que hace resulta comparar
    }

    public function hashPassword() : void {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    public function crearToken() : void {
        $this->token = uniqid(); //aquí se podría poner md5 y dentro uniqid para aumentar la seguridad, que genera uno de 32 caracteres, que hay que cambiarlo en la DB
    }

    
}