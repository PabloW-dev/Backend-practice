const Course = require("../models/course");
const image = require("../utils/image");

async function createCourse(req, res) {
    const course = new Course(req.body);

    if(req.files?.miniature) {
        const imagePath = image.getFilePath(req.files.miniature);
        course.miniature = imagePath;
    }
    

    try {
        const courseStorage = await course.save();
        res.status(201).send({courseStorage});
    } catch (error) {
        console.log(error);
        return res.status(400).send({msg: "Error al crear el curso"});
    }
}

function getCourses(req, res) { //esto hace falta paginarlo evidentemente
    //para hacer la paginación dinámica por el cliente vamos a cogerlas del query
    const {page = 1, limit = 10} = req.query;

    const options = { //añadimos las opciones de paginación
        page: parseInt(page),
        limit: parseInt(limit)
    }; //porque llega como un string

    //paginate ya hace el find por mí
    Course.paginate({}, options) //esto hace falta porque hay que hacerlo con promises de los coj
        .then(function(courses) {
            res.status(200).send({courses});
        })
        .catch(function (error) {
            console.log(error);
            return res.status(400).send({msg: "Error al obtener los cursos"});
        }); //ahora el res va a traer un objeto de JSON con docs(cuántos hay), total(de items de la tabla), limit(definido arriba), page(definida arriba) y pages(cuántas en total)
}


async function updateCourse(req, res) {
    const {id} = req.params; //esto se define en la ruta y se manda con /param/
    const courseData = req.body;
''
    if(req.files.miniature) {
        const imagePath = image.getFilePath(req.files.miniature);
        courseData.miniature = imagePath;
    }

    try {
        await Course.findByIdAndUpdate(id, courseData);
        res.status(200).send({msg: "Actualización correcta"});
    } catch(error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al actualizar el curso" });
    }
}


async function deleteCourse(req, res) {
    const { id } = req.params;

    try {
        await Course.findByIdAndDelete(id);
        res.status(200).send({msg: "Curso Eliminado"});
    } catch(error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al eliminar el curso" });
    }
}



module.exports = {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse
};