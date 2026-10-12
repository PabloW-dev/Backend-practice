const express = require("express");
const multiparty = require("connect-multiparty");
const UserController = require("../controllers/user");
const md_auth = require("../middlewares/authenticated");


const md_upload = multiparty({ uploadDir: "./uploads/avatar"}); //este middleware ya viene hecho
const api = express.Router();

api.get("/user/me", [md_auth.asureAuth], UserController.getMe);
api.get("/users", [md_auth.asureAuth], UserController.getUsers);
api.post("/user", [md_auth.asureAuth, md_upload], UserController.createUser);
api.patch("/user/:id", [md_auth.asureAuth, md_upload], UserController.updateUser); //patch para actualizar parcialmente los datos, si no usaríamos put y le mandamos el id
api.delete("/user/:id", [md_auth.asureAuth], UserController.deleteUser); //método delete





module.exports = api;