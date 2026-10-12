const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");

async function register(req, res) { //esto resulta un endpoint, una URL específica que hace una acción concreta y que meto en la API, req resulta require y res response
    const {firstname, lastname, email, password} = req.body; //obtenemos los datos de la petición

    if(!email) return res.status(400).send({msg: "El email es obligatorio"});
    if(!password) return res.status(400).send({msg: "La contraseña es obligatoria"});

    const user = new User({ //construimos el objeto usuario instanciando usuario
        firstname,
        lastname,
        email: email.toLowerCase(),
        role: "user",
        active: false
    });

    const salt = bcrypt.genSaltSync(10); //usamos la dependencia de bcrypt para generar la encriptación de 10 carácteres
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;

    try { //guardamos el usuario
        const userStorage = await user.save();
        res.status(200).send(userStorage);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al crear el usuario" });
    }
    //console.log(req.body);

    //res.status(200).send({ msg: "TODO OK" });
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ msg: "El email es obligatorio" });
    if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

    const emailLowerCase = email.toLowerCase();

    try {
        const userStore = await User.findOne({ email: emailLowerCase });

        if (!userStore) return res.status(404).send({ msg: "Usuario no encontrado" });
        if (!userStore.active) return res.status(401).send({ msg: "Usuario no autorizado o activo" });

        const check = await bcrypt.compare(password, userStore.password);
        if (!check) return res.status(400).send({ msg: "Fallo de Comparación" });

        res.status(200).send({
            access: jwt.createAccessToken(userStore),
            refresh: jwt.createRefreshToken(userStore)
        }); //listo, ahora sólo queda refrescar el token cuando cxaduque
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Error del Servidor" });
    }
}

async function refreshAccessToken(req, res) { //esto para obtener un token nuevo, esto se hace para que token cambie todo el rato, la cuenta se cierra automáticamente cuando caduca, de esa manera no sirve que te lo roben
    const {token} = req.body;

    if(!token) return res.status(400).send({ msg: "Token Requerido"});

    const {user_id} = jwt.decoded(token);

    try {
        const userStorage = await User.findOne({_id: user_id});

        res.status(200).send({
            accessToken: jwt.createAccessToken(userStorage)
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({msg: "Error del Servidor"});
    }
}

module.exports = {
    register,
    login,
    refreshAccessToken
};