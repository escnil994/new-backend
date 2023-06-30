
const { Router } = require('express');
const { Schema, model } = require('mongoose');




const router = Router()




var utilsSchema = Schema({

})




router.get('/image/', async (req, res) =>{
	const Utils = model( 'Utils',utilsSchema);

	const images = await Utils.findById('648d333d2cfae1f24d5d8ac2')

	res.json({
		images
	})


})


const dcSchema = Schema({})
router.get('/dc/', async (req, res) =>{
	const Utils = model( 'dc', dcSchema)

	const dc = await Utils.find()

	res.json({
		dc
	})


})




module.exports = router