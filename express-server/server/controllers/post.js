const Post = require("../models/post");
const image = require("../utils/image");

async function createPost(req, res) {
    const post = new Post(req.body);
    post.created_at = new Date();

    if(req.files?.miniature) {
        const imagePath = image.getFilePath(req.files.miniature);
        post.miniature = imagePath;
    }

    try {
        const postStorage = await post.save();
        res.status(201).send({postStorage});
    } catch (error) {
        console.log(error);
        return res.status(400).send({msg: "Error al crear el post"});
    }
}


function getPosts(req, res) { 
    const {page = 1, limit = 10} = req.query;

    const options = { 
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { created_at: "desc"}
    }; //le decimos que lo ordene en descendente

    
    Post.paginate({}, options)
        .then(function(posts) {
            res.status(200).send({posts});
        })
        .catch(function (error) {
            console.log(error);
            return res.status(400).send({msg: "Error al obtener los posts"});
        });
}


async function updatePost(req, res) {
    const {id} = req.params; //esto se define en la ruta y se manda con /param/
    const postData = req.body;

    if(req.files?.miniature) {
        const imagePath = image.getFilePath(req.files.miniature);
        postData.miniature = imagePath;
    }

    try {
        await Post.findByIdAndUpdate(id, postData);
        res.status(200).send({msg: "Actualización correcta"});
    } catch(error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al actualizar el post" });
    }
}


async function deletePost(req, res) {
    const { id } = req.params;

    try {
        await Post.findByIdAndDelete(id);
        res.status(200).send({msg: "Post Eliminado"});
    } catch(error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al eliminar el post" });
    }
}


function getPost(req, res) {
    const {path} = req.params;

    Post.findOne({path})
        .then(function(postStored) {
            if(!postStored) {
                console.log("No se encontró el post", path);
                return res.status(404).send({msg: "No se ha encontrado ningún post"});
            } else {
            res.status(200).send({postStored});
            }
        })
        .catch(function (error) {
            console.log(error);
            return res.status(500).send({msg: "Error del servidor"});
        });
}



module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    getPost
};