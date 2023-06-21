const User = require("../models/User");
const bcrypt = require('bcryptjs');


const { generateJWT, convertToken } = require("../utils/jwt");


const { send, passwordUpdated } = require('../utils/utils')
const {isValidObjectId} = require("mongoose");
const {request} = require("express");




const newUser = async (req, res) => {

    const { name, email, password, role } = req.body


    try {

        const user = await User.findOne({ email })

        if (user) {
            return res.status(500).json({
                ok: false,
                msg: 'Email is already in use'
            })
        }

        const userDB = new User(req.body)

        const salt = bcrypt.genSaltSync()

        userDB.password = bcrypt.hashSync(password, salt)



        ///Generate JWT
        const token = await generateJWT(userDB.id, name)


        await userDB.save()

        return res.status(201).json({
            ok: true,
            msg: 'usuario creado exitosamente',
            user: userDB

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error talk to admin about it!'
        })

    }



}

const loginUser = async (req, res) => {

    const { email, password } = req.body

    try {

        const dbUser = await User.findOne({ email });

        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'Este usuario no existe'
            })
        }


        const validPassword = bcrypt.compareSync(password, dbUser.password)


        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Incorrect Password'
            })
        }

        const user = await User.findById(dbUser._id, '_id email name role')

        const token = await generateJWT(dbUser.id, dbUser.name)

        return res.status(200).json({
            ok: true,
            msg: 'Sesión iniciada correctamente',
            user,
            token,
        })



    }
    catch (e) {
        console.log(e)
        return res.json({
            ok: false,
            msg: 'Error, talk to the admin'
        })

    }






}

const revalidateToken = async (req, res) => {

    const uid = req.id

    const token = await generateJWT(uid)

    const user = await User.findById(uid)

    if (!user) {
        return res.status(404).json({
            ok: false,
            msg: 'User not found'
        })
    }

    return res.status(200).json({
        ok: true,
        msg: 'revalidate token is ok ',
        token,
        user
    })
}


const getUser = async (req, res) => {
    const { id } = req.params

    if (isValidObjectId(id)) {
        const user = await User.findById(id)


        if (user) {
            return res.status(200).json({
                ok: true,
                name: user.name
            })
        } else {
            return res.status(404).json({
                ok: false,
                msg: 'User not found!'
            })
        }

    } else {
        return res.status(500).json({
            ok: false,
            msg: 'ID no valido'
        })
    }
}

const changePassword = async (req, res) => {

    const { token, password, password1, password2 } = req.body

    const idToken = convertToken(token)


    const userFound = await User.findById(idToken.id)


    const validPassword = bcrypt.compareSync(password, userFound.password)




    if (!validPassword) {
        return res.status(500).json({
            ok: false,
            msg: 'La contraseña ingresada no es correcta, intenta de nuevo'
        })
    } 
    

    else {

        const salt = bcrypt.genSaltSync()



        if (password1 === password2) {  
            const passToChange  = bcrypt.hashSync(password2, salt)

            const passUpdated = await User.findByIdAndUpdate({_id: userFound.id}, {password: passToChange})

            if (passUpdated) {


                send(userFound.email, 'Alert!!!, Password Updated', passwordUpdated(passUpdated))

                return res.status(200).json({
                    ok: true,
                    msg: 'Password has been Updated', 
                    passUpdated
                })
            }

        }else{
            return res.json({
                ok: false,
                msg: 'Las contraseñas no coinciden'
            })
        }

    }



}


const resetPassword =  async(req, res) => {

    const {id} = req.params

    const { password1, password2 } = req.body

    if (isValidObjectId(id)) {
        try {

            const salt = bcrypt.genSaltSync()



        if (password1 === password2) {  
            const passToChange  = bcrypt.hashSync(password2, salt)

            const passUpdated = await User.findByIdAndUpdate({_id: id}, {password: passToChange})

            if (passUpdated) {

                send(passUpdated.email, 'Alert!!!, Password Updated', passwordUpdated(passUpdated))

                return res.status(200).json({
                    ok: true,
                    msg: 'Password has been Updated', 
                    passUpdated
                })
            }

        }else{
            return res.json({
                ok: false,
                msg: 'Las contraseñas no coinciden'
            })
        }

            

        } catch (error) {
            
        }
        
    }else{
        return res.json({
            ok: false,
            msg: 'El ID no es valido'
        })
    }

}



const getInfo = async (request, response) => {

    try{
        const info =await User.findById('641ca221790a4745274d69e0');


        if (info){
            return response.status(200).json({
                ok: true,
                user: info
            })
        }
        return  response.status(500).json({
            ok: false,
            msg: 'There is not user'
        })
    }

    catch(error){

        return  response.status(500).json({
            ok: false,
            msg: 'Unknown Error, Talk to the admin '
        })
    }

}


const ValidateToken = async (req, res) => {

    try{
    const {'x-token': token} =  await  req.headers

    const tokenInfo = await convertToken(token)


    const uid = tokenInfo.id

    const newToken = await generateJWT(uid)

    const user = await User.findById(uid)

    if (!user) {
        return res.status(404).json({
            ok: false,
            msg: 'User not found'
        })
    }

    const {name, email, id} = await  user

    return res.status(200).json({
        ok: true,
        msg: 'Token is valid',
        token: newToken,
        name,
        email,
        id
    })
        } catch (e) {
        return res.status(500).json({
            ok: false,
            msg: 'Unknown Error, Talk to the admin'
        })
    }

}


module.exports = {
    newUser,
    loginUser,
    revalidateToken,
    getUser,
    changePassword,
    resetPassword,
    ValidateToken
}
