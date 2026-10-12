const mongoose = require("mongoose");
const app = require("./app");
const { 
    DB_USER, 
    DB_PASSWORD, 
    DB_HOST, 
    API_VERSION, 
    IP_SERVER 
} = require("./constants");

//Puerto:
const PORT = process.env.POST || 3977;

//mongoose.connect(
    //`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`, (error) => {
    //    if(error) throw error; //que resulta como un exit + un console.log, pero antes de hacer eso lo lanzará para ver si algún try catch puede recogerlo mediante stack unwinding (vamos que tiene que tenerlo en algo parecido a un árbol de funciones), para saber si algo acepta un callback mirar en la documentación si tiene "callback?" en las props
    //    console.log("La conexión con la base de datos ha sido exitosa");
    //}
//); PERO YA NO ACEPTA EL CALLBACK ASÍ QUE HACE FALTA ASYNC AWAIT

async function startServer() {
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`);
    app.listen(PORT, () => {
        console.log("######################");
        console.log("###### API REST ######");
        console.log("######################");
        console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
    }) //para que se levante el servidor
  } catch (error) {
    console.error('Error al conectar:', error);
  }
}

startServer();