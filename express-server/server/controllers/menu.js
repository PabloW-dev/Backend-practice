const Menu = require("../models/menu");

async function createMenu(req, res) {
    const menu = new Menu(req.body);

    try {
        const menuStored = await menu.save();
        res.status(201).send(menuStored);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al crear el menú" });
    }
}

async function getMenus(req, res) {
    //res.status(200).send({msg: "OK"}); //siempre antes de hacer nada vamos a comprobar que la ruta funciona
    
    //obtener la query, que esto se pasa en la URL
    const { active } = req.query; //esto se define como ?active=true/false
    
    let response = null;
    
    if(active === undefined) {
        response = await Menu.find().sort({ order: "asc"}); //devolvemos todos y con el sort le decimos que lo ordene de forma ascendente
    } else {
        response = await Menu.find({ active }).sort({ order: "asc"}); //como sólo me hace falta la llave me sirve así, ya que le voy a preguntar ambos
    }

    if(!response) {
        return res.status(400).send({msg: "No se ha encontrado ningún menú"});
    } else {
        res.status(200).send(response);
    }
}

async function updateMenu(req, res) {
    const {id} = req.params; //esto se define en la ruta y se manda con /param/
    const menuData = req.body;

    try {
        await Menu.findByIdAndUpdate(id, menuData);
        res.status(200).send({msg: "Actualización correcta"});
    } catch(error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al actualizar el menú" });
    }
}


async function deleteMenu(req, res) {
    const { id } = req.params;

    try {
        await Menu.findByIdAndDelete(id);
        res.status(200).send({msg: "Menu Eliminado"});
    } catch(error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al eliminar el menú" });
    }
}


module.exports = {
    createMenu,
    getMenus,
    updateMenu,
    deleteMenu
};