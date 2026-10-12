const jwt = require("jsonwebtoken");
const {JWT_SECRET_KEY} = require("../constants");

function createAccessToken(user) { //esperamos el usuario
    //setear fecha de expiración
    const expToken = new Date();
    expToken.setHours(expToken.getHours() + 3); //le decimos que va a durar 3 horas

    //crear el payload, el objeto que va dentro del token
    const payload = {
        token_type: "access",
        user_id: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(expToken.getTime() / 1000)
    }; //iat fecha de creación del token, getTime para aplicar esa expiración, los envolvemos en math.floor / 1000 para que devuelva segundos y no milisegundos

    return jwt.sign(payload, JWT_SECRET_KEY); //esto genera el token
}

function createRefreshToken(user) {
    //setear fecha de expiración
    const expToken = new Date();
    //expToken.setMonth(expToken.getMonth() + 1); //le decimos que va a durar 1 mes, esto daría problemas de coherencia porque los meses no duran todos lo mismo:
    expToken.setTime(expToken.getTime() + 30 * 24 * 60 * 60 * 1000);

    //crear el payload, el objeto que va dentro del token
    const payload = {
        token_type: "refresh",
        user_id: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(expToken.getTime() / 1000)
    }; //iat fecha de creación del token, getTime para aplicar esa expiración

    return jwt.sign(payload, JWT_SECRET_KEY); //esto genera el token
}

function decoded(token) { //y esta para decodificar el token, para sacar sus datos
    return jwt.decode(token, JWT_SECRET_KEY, true); //el chat insiste en usar verify en lugar de decode por una cuestión de seguridad
}

//function decoded(token) {
//    try {
//        return jwt.verify(token, JWT_SECRET_KEY); // verifica firma y expiración
//    } catch {
//        return null; // token inválido o expirado
//    }
//}

module.exports = {
    createAccessToken,
    createRefreshToken,
    decoded
}