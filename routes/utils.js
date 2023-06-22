
const { Router } = require('express')

const { model, Schema, default: mongoose } = require('mongoose')



const { contactToMe } = require('../controllers/contact')


const router = Router()




var utilsSchema = Schema({

})

var skillsSchema = Schema({
	

})


router.get('/image/', async (req, res) =>{
	const Utils = model( 'Utils',utilsSchema);

	const images = await Utils.findById('648d333d2cfae1f24d5d8ac2')

	res.json({
		images
	})


})


router.get('/skills/', async (req, res) =>{
	const Utils = model( 'Skills',skillsSchema);

	const skills = await Utils.find()

	res.json({
		skills
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