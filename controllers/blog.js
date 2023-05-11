const { request, response } = require('express')
const fs = require('fs-extra')
const { isValidObjectId } = require('mongoose')
const Post = require('../models/Blog')
const { uploadImage, deleteImage } = require('../utils/cloudinary')
const Project = require("../models/project");




const getPosts = async (req, res) => {

    const limit = Number(req.query.limit) || 0

    const from = Number(req.query.from) || 0


    try {


        const posts = await Post.find().sort('date').skip(from).limit(limit)


        const total = await Post.count()



        if (posts) {
            return res.status(200).json({
                ok: true,
                posts,
                total
            })
        } else {
            return res.status(500).json({
                ok: false,
                msg: 'Error al obtener los posts'
            })
        }

    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Error, hable con el administrador'
        })
    }

}

const getPost = async (req = request, res = response) => {

    const { id } = req.params


    try {
        if (isValidObjectId(id)) {

            const postFound = await Post.findById(id)

            if (!postFound) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Este post no existe'
                })
            } else {
                return res.status(200).json({
                    ok: true,
                    post: postFound
                })
            }

        } else {
            return res.status(500).json({
                ok: false,
                msg: 'Este identificador no es invalido'
            })
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error, favor consultar con administrador'
        })
    }

}



const createPost = async (req = request, res = response) => {

    const data = req.body

    try {



        data.image = {
            public_id: "image-temp",
            secure_url: "https://res.cloudinary.com/dorqesogu/image/upload/v1660412426/portafolio/smqwt4ot8l2vlclfxcjm.jpg"
        }


        const postToSave = new Post(data)



        const postSaved = await postToSave.save()



        if (postSaved) {
            return res.status(200).json({
                ok: true,
                postSaved
            })
        } else {
            return res.status(500).json({
                ok: false,
                msg: 'No se pudo guardar este post'
            })
        }




    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            msg: 'Error desconocido, habla con el administrador'
        })
    }

}


const updatePost = async (req = request, res = response) => {

    const { title, intro, content, url, author } = req.body;

    const { id } = req.params

    if (isValidObjectId(id)) {

        const PostFound = await Post.findById(id);

        if (!PostFound) {
            return res.json({
                ok: false,
                msg: 'Post not found'
            })
        } else {

            await Post.findByIdAndUpdate(id, { title, intro, content, url, author })


            const postModified = await Post.findById(id);

            if (postModified) {
                return res.json({
                    ok: true,
                    project: postModified,
                    msg: 'Project has been updated'
                })
            } else {
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

const deletePost = async (req = request, res = response) => {
    const { id } = req.params


    try {

        if (isValidObjectId(id)) {

            const postFound = await Post.findById(id)

            if (postFound) {

                const postdeleted = await Post.findByIdAndDelete(id)

                deleteImage(postdeleted.public_id);


                if (postdeleted) {
                    return res.status(200).json({
                        ok: true,
                        postdeleted
                    })
                } else {
                    return res.status(200).json({
                        ok: true,
                        msg: 'Error al borrar este Post'
                    })
                }

            } else {
                return res.status(500).json({
                    ok: false,
                    msg: 'Este post no existe'
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



            const beforeUpdate = await Post.findById(id)

            console.log(beforeUpdate);

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



                const postToUpdate = await Post.findByIdAndUpdate({ _id: id }, data)


                if (postToUpdate) {

                    const postUpdated = await Post.findById(id)

                    await deleteImage(toDelete)

                    return await res.status(200).json({
                        ok: true,
                        msg: 'post image has been updated',
                        image: await postUpdated.image
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





module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    uploadFiles,
    deletePost
}