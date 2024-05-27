const { loginByEmailService } = require("../services/login")
const { ErrorWithStatusCode, handleError } = require('./../../../middleware/errorHandler');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY

console.log(SECRET_KEY)

const loginByEmailController = async function(req, res){
    try {

        const { email, password } = await req.body

        const result = await loginByEmailService(email, password)

        if(!result) {
            throw new ErrorWithStatusCode("bad request !", 400)
        }

        const payload = {
            id : result.id,
            name : result.name,
            username : result.username,
            email : result.email,
            phone_number : result.phone_number,
            isVerified : result.isVerified,
            role : result.role
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        return res.json({
            status : true,
            message : 'success',
            data : {...payload, token}
        }).status(201)

    } catch (err) {
        handleError(err, res);
    }
}


module.exports = { loginByEmailController }