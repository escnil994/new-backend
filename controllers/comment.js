const { request, response } = require('express')
const { Result } = require('express-validator')
const { isValidObjectId } = require('mongoose')
const Comment = require('../models/Comment')
const { contenido, send, contentHTML } = require('../utils/utils')





const getComment = async (req = request, res = response) => {

    const { id } = req.params


    if (isValidObjectId(id)) {
        const comment = await Comment.findById(id)


        if (comment) {
            return res.status(200).json({
                ok: true,
                comment
            })

        }

        return res.status(400).json({
            ok: false,
            msg: 'Este identificador de comentario no es válido'
        })



    } else {
        return res.status(400).json({
            ok: false,
            msg: 'Este identificador de comentario no es válido'
        })
    }

}

const getComments = async (req = request, res = response) => {

    var limit = await req.params.limit


    try {

        let comments
        if (limit === 'yes'){
            comments = await Comment.find({}).sort('-date').limit(2)
        }else{
            comments = await Comment.find({}).sort('-date');
        }

        if (!comments) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al recuperar los comentarios'
            })
        } else {
            if (comments.length == 0) {
                return res.status(200).json({
                    ok: true,
                    msg: 'No hay comentarios en este momento'
                })
            }
            else {
                return res.status(200).json({
                    ok: true,
                    comments
                })
            }


        }

    }catch (e) {
        return res.status(500).json({
            ok: false,
            msg: "Unknown Error, talk to the admin"
        })

    }




}

const createComment = async (req = request, res = response) => {

    const { name, email, comment } = req.body

    try {

        if (name && email && comment) {


            const existComment = await Comment.findOne({email})


            if (existComment) {

                const calcDay = 1000 * 60 * 60 * 24;

                const nowToday = new Date()

                const commentDate = existComment.date

                const time = ((nowToday - commentDate) / calcDay).toPrecision(4)

                if (time < 1) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Lo siento, pero solo puedes comentar una vez cada 24 horas'
                    })
                }


            }


            const newComment = new Comment(req.body)

            const commentSaved = await newComment.save()


            if (!commentSaved) {
                return res.status(404).json({
                    ok: false,
                    msg: 'El comentario no ha podido guardarse'
                });
            } else {
                send(commentSaved.email, 'Gracias por tu commentario!!!', contentHTML(commentSaved))
                send('escnil994@nilson-escobar.com', 'ALERTA, NUEVO COMENTARIO', contenido(commentSaved))

                return res.status(200).json({
                    ok: true,
                    comment: commentSaved
                });
            }


        }
    }catch (e){
        console.log(e)
    }
}


const autorizeComment = async (req = request, res = response) => {

    const { id } = req.params


    if (isValidObjectId(id)) {
        const comment = await Comment.findById(id)


        if (comment) {

            if (comment.allowed) {
                return res.status(200).json({
                    ok: false,
                    msg: 'Este link ya ha sido utilizado'
                })
            }


            const commentUpdated = await Comment.findByIdAndUpdate({ _id: id }, { allowed: true })

            if (commentUpdated) {
                return res.status(200).json({
                    ok: true,
                    msg: 'El comentario de: ' + commentUpdated.name + ', ha sido aprobado correctamente'
                })
            }
            else {
                res.status(500).json({
                    ok: false,
                    msg: 'El comentario de : ' + commentUpdated.name + ', no se pudo actualizar'
                })
            }
        }
        else {
            return res.status(400).json({
                ok: false,
                msg: 'Este comentario no existe'
            })
        }

    }
    else {

        return res.status(500).json({
            ok: false,
            msg: 'El id no es valido'
        })
    }






}

const deleteComment = async (req = request, res = response) => {

    const { id } = req.params


    if (isValidObjectId(id)) {

        const commentFound = await Comment.findById(id)

        if (!commentFound) {
            res.status(500).json({
                ok: false,
                msg: 'El comentario no existe'
            })
        }


        const commentToDelete = await Comment.findByIdAndDelete(id)


        if (commentToDelete) {
            return res.status(200).json({
                ok: true,
                commentToDelete
            })
        }
        else {
            return res.status(404).json({
                ok: false,
                msg: 'No se pudo borrar este comentario '
            })

        }

    } else {
        res.status(400).json({
            ok: false,
            msg: 'El ID no es valido'
        })
    }

}




module.exports = {
    getComments,
    getComment,
    createComment,
    autorizeComment,
    deleteComment
}