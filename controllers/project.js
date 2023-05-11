const { request, response } = require('express')
const Project = require('../models/project')
const { uploadImage, deleteImage } = require("../utils/cloudinary");
const fs = require("fs-extra");
const { isValidObjectId } = require('mongoose');



const getProjects = async (req, res = response) => {

    const limit = Number(req.query.limit) || 0

    const from = Number(req.query.from) || 0

    try {
        
        const getProjects = await Project.find().sort('date').limit(limit).skip(from)
        


        if (getProjects) {
            return res.status(200).json({
                ok: true,
                projects: getProjects,
                total: await Project.count()
            })
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'No se pudieron obtener el listado de proyectos'
            })

        }

    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error, talk to the admin'
        })
    }
}

const getProject = async (req = request, res = response) => {

    const { id } = req.params


    try {
        if (isValidObjectId(id)) {

            const projectFound = await Project.findById(id)

            if (!projectFound) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Este project no existe'
                })
            } else {
                return res.status(200).json({
                    ok: true,
                    project: projectFound
                })
            }

        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Este ID no es válido',
            })
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error, favor consultar con administrador'
        })
    }
}

const createProject = async (req = request, res = response) => {

    const data = req.body


    try {

        data.image = {
            public_id: "image-temp",
            secure_url: "https://res.cloudinary.com/dorqesogu/image/upload/v1660412426/portafolio/smqwt4ot8l2vlclfxcjm.jpg"
        }


        const newProject = new Project(data)

        const createNewProject = await newProject.save()

        if (createNewProject) {
            return res.status(200).json({
                ok: true,
                project: createNewProject
            })
        } else {
            return res.status(500).json({
                ok: false,
                msg: 'Error no se pudo crear el proyecto'
            })
        }


    } catch (error) {
        console.log(error)
        return res.status(404).json({
            ok: false,
            msg: 'Error, talk to the admin'
        })
    }


}

const updateProject = async (req = request, res = response) => {
    const { title, content, video, url, gitHub, more } = req.body;

    const { id } = req.params

    if (isValidObjectId(id)) {

        const projectFound = await Project.findById(id);

        if (!projectFound) {
            return res.json({
                ok: false,
                msg: 'Project not found'
            })
        } else {

            await Project.findByIdAndUpdate( id , { title, content, video, url, gitHub, more })


            const projectModified = await Project.findById(id);

            if (projectModified) {
                return res.json({
                    ok: true,
                    project: projectModified,
                    msg: 'Project has been updated'
                })
            } else{
                return res.json({
                    ok: false,
                    msg: 'Project not updated'
                })

            }


        }

    } else {
        return res.json({
            ok: false,
            msg: 'Provide a correct project ID!'
        })
    }



}



const deleteProject =  async (req = request, res = response) => {

    const { id } = req.params


    try {

        if (isValidObjectId(id)) {

            const projectFound = await Project.findById(id)

            if (projectFound) {

                const projectdeleted = await Project.findByIdAndDelete(id)


                deleteImage(projectdeleted.public_id)

                if (projectdeleted) {
                    return res.status(200).json({
                        ok: true,
                        projectdeleted
                    })
                } else {
                    return res.status(200).json({
                        ok: true,
                        msg: 'Error al borrar este proyecto'
                    })
                }

            } else {
                return res.status(500).json({
                    ok: false,
                    msg: 'Este proyecto no existe'
                })
            }



        } else {
            return res.status(500).json({
                ok: false,
                msg: 'Este identificador no es invalido'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(404).json({
            ok: false,
            msg: 'Error desconocido, hable con el administrador'
        })
    }




}

const uploadFiles = async (req, res) => {

    const data = req.body

    const { id } = req.params



    if (isValidObjectId(id)) {

        try {



            const beforeUpdate = await Project.findById(id)

            if (!beforeUpdate || beforeUpdate == null) {
                return res.json({
                    ok: false,
                    msg: 'Este ID no existe'
                })
            }
            const toDelete = beforeUpdate.image.public_id



            if (req.files && req.files !== null) {

                const result = await uploadImage(req.files.file.tempFilePath)




                data.image = {
                    public_id: result.public_id,
                    secure_url: result.secure_url
                }

                await fs.unlink(req.files.file.tempFilePath)



                const projectToUpdate = await Project.findByIdAndUpdate({ _id: id }, data)


                if (projectToUpdate) {

                    const projectUpdated = await Project.findById(id)

                    await deleteImage(toDelete)

                    return await res.status(200).json({
                        ok: true,
                        msg: 'project image has been updated',
                        image: await projectUpdated.image
                    })
                }
                else {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Image could not been updated'
                    })
                }
            }
            else {
                return res.status(500).json({
                    ok: false,
                    msg: 'Must select one file at least'
                })
            }


        } catch (error) {
            console.log(error);

            return res.status(400).json({
                ok: false,
                msg: 'Unknown error, talk to the admin'
            })

        }



    } else {

        return res.status(500).json({
            ok: false,
            msg: 'El id no es valido'
        })

    }







}


const searchProject = (request, response) => {
    const search = request.params.search;

    Project.find({
        "$or": [
            { "title": { "$regex": search, "$options": "i" } },
            { "content": { "$regex": search, "$options": "i" } }
        ]
    }).sort([['date', 'descending']]).exec((err, projects) => {
        if (err) {
            return;
        }
        if (!projects || projects.length <= 0) {
            return;
        }
        return response.status(200).send({
            status: "success",
            projects
        })
    });
}




module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    uploadFiles,
    searchProject
}
