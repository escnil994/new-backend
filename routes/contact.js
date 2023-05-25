
const { Router } = require('express')
const { check } = require('express-validator')


const { contactToMe } = require('../controllers/contact')
const { validateFields } = require('../middlewares/validate-fields')


const router = Router()


router.post('/contact-to-me/', [
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('email', 'El email debe ser válido').not().isEmpty().isEmail(),
    check('message', 'Debe ingresar un mensaje').not().isEmpty(),
    validateFields
], contactToMe)




module.exports = router