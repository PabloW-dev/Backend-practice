const Newsletter = require("../models/newsletter");



async function suscribeEmail(req, res) {
    const {email} = req.body;

    if(!email) return res.status(400).send({msg: "Email obligatorio"});

    const newsletter = new Newsletter({
        email: email.toLowerCase()
    });

    try {
        await newsletter.save();
        res.status(201).send({msg: "Email registrado" });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "El email ya está registrado" });
    }
}


function getEmails(req, res) { 
    const {page = 1, limit = 10} = req.query;

    const options = { 
        page: parseInt(page),
        limit: parseInt(limit)
    }; //le decimos que lo ordene en descendente

    
    Newsletter.paginate({}, options)
        .then(function(newsletter) {
            res.status(200).send({newsletter});
        })
        .catch(function (error) {
            console.log(error);
            return res.status(400).send({msg: "Error al obtener los subcriptores"});
        });
}


async function deleteEmail(req, res) {
    const { id } = req.params;

    try {
        await Newsletter.findByIdAndDelete(id);
        res.status(200).send({msg: "Email Eliminado"});
    } catch(error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al eliminar el email" });
    }
}






module.exports = {
    suscribeEmail,
    getEmails,
    deleteEmail
};