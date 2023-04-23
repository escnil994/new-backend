
const { Router } = require('express')
const { check } = require('express-validator')


const { getComments, getComment, createComment, autorizeComment, deleteComment } = require('../controllers/comment')
const { validateFields } = require('../middlewares/validate-fields')
const { ValidateJwt } = require('../middlewares/validate-jwt')


const router = Router()


router.get('/get-comments/:limit?', getComments)
router.get('/get-comment/:id', getComment)
router.post('/create-new-comment/', [
    check('name', 'El nombre es requerido').not().isEmpty().isLength({min:8}),
    check('email', 'El email debe ser válido').not().isEmpty().isEmail(),
    check('comment', 'Debe ingresar un comentario con al menos 12 caracteres').isLength({min:12}).not().isEmpty(),
    validateFields
], createComment)
router.put('/autorize-comment/:id?', autorizeComment)
router.delete('/delete-comment/:id', ValidateJwt, deleteComment)



module.exports = router