const jwt = require("../utils/jwt");

function asureAuth(req, res, next) { //next le dice al sistema si puede continuar con la función siguiente
    
    //return res.status(500).send({msg: "MD bloquea" });

    if(!req.headers.authorization) {
        return res.status(403).send({msg: "La petición no tiene la cabecera de autenticación"});
    } //accedemos al token del usuario mediante los headers

    const token = req.headers.authorization.replace("Bearer ", ""); //sustituimos Bearer de la petición de insomnia por nada, y así ya tenemos el token

    try {
        const payload = jwt.decoded(token); //decodificamos el token

        const { exp } = payload; //sacamos la fecha de expiración
        const currentData = new Date().getTime(); //sacamos la fecha actual

        if(exp <= currentData) { //comprobamos si el token ha expirado
            return res.status(400).send({msg: "El Token ha expirado"});
        }

        req.user = payload; //si no, pues metemos el token en el user
        next(); //y le decimos que siga con la siguiente función
    } catch {
        return res.status(400).send({msg: "Token no válido"});
    }
}

module.exports = {
    asureAuth
};