function getFilePath(file) {
    const filePath = file.path; //pillamos el path, pero va a tener uploads por la estructura de carpetas, por tanto:
    const fileSplit = filePath.split("/"); //hay que decirselo así porque no puedo decirle que me borre uploads porque puede haber errores, de esta manera me lo parte por cada / quitándolas
    return `${fileSplit[1]}/${fileSplit[2]}`; //y nos saltamos la posición 0 porque resulta lo que queremos quitar
}

module.exports = {
    getFilePath
}