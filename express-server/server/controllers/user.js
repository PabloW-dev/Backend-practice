const bcrypt = require("bcryptjs");
const User = require("../models/user");
const image = require("../utils/image");

async function getMe(req, res) {
    //aquí ya tenemos el token porque llega mediante el middleware con el req.user
    //obtenemos el user id
    const { user_id } = req.user;
    //lo buscamos en la base de datos
    const response = await User.findById(user_id);
    //no usamos try catch porque ya está el middleware
    if(!response) {
        return res.status(400).send({msg: "Usuario no encontrado"});
    } else {
        res.status(200).send(response); //enviamos los datos del usuario
    }
}

async function getUsers(req, res) {
    //res.status(200).send({msg: "OK"}); //siempre antes de hacer nada vamos a comprobar que la ruta funciona

    //obtener la query, que esto se pasa en la URL
    const { active } = req.query;

    let response = null;

    if(active === undefined) {
        response = await User.find(); //devolvemos todos
    } else {
        response = await User.find({ active }); //como sólo me hace falta la llave me sirve así, ya que le voy a preguntar ambos
    }

    res.status(200).send(response); //ale ya los tenemos todos
}

async function createUser(req, res) {
    //res.status(200).send({msg: "OK"});

    //obtener los datos de post
    const {password} = req.body; //OJO: en INSOMNIA ahora no vale con un json porque vamos a mandar ficheros, así que hay que usar un FormData en el body, y luego mandamos los datos campo a campo rellenando con ejemplos, y el avatar le decimos que resulta de tipo File, pero el FormData de INSOMNIA hay que poder obtenerlo: hay que activarlo con un middleware
    //generamos los datos del usuario (una copia en memoria que recoge todos los datos del req):
    const user = new User({...req.body, active: false});

    //encriptamos la contraseña y la metemos en la copia de usuario:
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;
    
    //y ahora el avatar: como llega al fichero hay que procesarlo con una función, importada de utils
    if(req.files.avatar) {
        const imagePath = image.getFilePath(req.files.avatar); //esta lo que coge resulta la ruta de dónde está el fichero
        user.avatar = imagePath; //y la metemos al usuario
    }

    //guardamos
    try { //guardamos el usuario
        const userStorage = await user.save();
        res.status(201).send(userStorage);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al crear el usuario" });
    }
}

async function updateUser(req, res) {
    const { id } = req.params; //cogemos el id
    const userData = req.body; //pillamos todo el body del post

    //Password
    if(userData.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(userData.password, salt);
        userData.password = hashPassword;
    } else {
        delete userData.password; //para que si llega vacío no haga undefinned o cualquier cosa
    }
    //Avatar
    if(req.files.avatar) {
        const imagePath = image.getFilePath(req.files.avatar);
        userData.avatar = imagePath;
    }


    //actualizar
    try {
        await User.findByIdAndUpdate(id, userData);
        res.status(200).send({msg: "Actualización correcta"});
    } catch(error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al actualizar el usuario" });
    }
    
}

async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).send({msg: "Usuario Eliminado"});
    } catch(error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al eliminar el usuario" });
    }
}

module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser
};