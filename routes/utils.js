
const { Router } = require('express')

const { model, Schema, default: mongoose } = require('mongoose')



const { contactToMe } = require('../controllers/contact')


const router = Router()




var utilsSchema = Schema({
	image_01: String,
	image_02: String

})



router.get('/image/', async (req, res) =>{
	const Utils = model( 'Utils',utilsSchema);

	const images = await Utils.findById('648d333d2cfae1f24d5d8ac2')

	res.json({
		images
	})


})




module.exports = router