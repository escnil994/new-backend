
const { Router } = require('express')
const { check } = require('express-validator')


const { getPosts, getPost, createPost, updatePost, deletePost, uploadFiles } = require('../controllers/blog')
const { validateFields } = require('../middlewares/validate-fields')
const { ValidateJwt } = require('../middlewares/validate-jwt')


const router = Router()


router.get('/get-posts/:limit?', getPosts)
router.get('/get-post/:id', getPost)
router.post('/create-new-post/', ValidateJwt,[
check('title', 'EL titulo debe tener al menos 10 caracteres').not().isEmpty().isLength({min: 10}),
check('intro', 'La introduccion debe ser de al menos 15 caracteres').not().isEmpty().isLength({min: 15}),
check('content', 'La introduccion debe ser de al menos 50 caracteres').not().isEmpty().isLength({min: 50}),
check('url', 'La URL debe ser valida').isURL(),
validateFields
],createPost)
router.put('/update-post/:id', ValidateJwt, updatePost)

router.put('/upload-image/:id', ValidateJwt, uploadFiles)

router.delete('/delete-post/:id', ValidateJwt, deletePost)



module.exports = router

