const jwt = require("jsonwebtoken");


const ValidateJwt  = (req, res, next) => {
    const token = req.header('x-token')



    if ( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'There is not token'
        })
    }

    try{

        const { id } = jwt.verify(token, process.env.SECRET_JWT_SEED)

        req.id = id
        next()

    }catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        })
    }


}






module.exports = {
    ValidateJwt
}
