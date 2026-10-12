const express = require("express"); //esto resulta una API, un putno de comunicación entre dos programas, en este caso que el front react se comunique con el back para pedir y enviar datos, resulta un sitio en la web que recibe las peticiones
const bodyParser = require("body-parser");
const cors = require("cors");
const {API_VERSION} = require("./constants");

const app = express(); //iniciamos express

//Import routings -> 
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const menuRoutes = require("./router/menu");
const courseRoutes = require("./router/course");
const postRoutes = require("./router/post");
const newsletterRoutes = require("./router/newsletter");

//Configure Body Parse -> para poder mandar contenido json en el body al servidor
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Configure static folder -> ahora se pueden meter imágenes en el servidor
app.use(express.static("uploads"));

//Configure Header HTTP - CORS -> para que el servidor no bloquee las peticiones desde el cliente
app.use(cors());

//Configure routings
app.use(`/api/${API_VERSION}`, authRoutes); //le decimos a express que todas las rutas que empiezan por lo que hay en la variable las maneja authRoutes
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, courseRoutes);
app.use(`/api/${API_VERSION}`, postRoutes);
app.use(`/api/${API_VERSION}`, newsletterRoutes);

module.exports = app;