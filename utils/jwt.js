
const jwt = require('jsonwebtoken')

const generateJWT = (id, name, email) => {

    const payload = { id, name, email }

    return new Promise((resolve, reject) => {

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (error, token) => {

            if (error) {
                console.log(error)
                reject(error)
            } else {
                //Everything is OK 
                resolve( token )
            }
        })



    })



}

const convertToken = (token) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}



module.exports = {
    generateJWT,
    convertToken
}