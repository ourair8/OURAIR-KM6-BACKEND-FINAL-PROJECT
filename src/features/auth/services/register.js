const prisma = require("../../../config/prisma.config")
const bcrypt = require("bcrypt")

const { ErrorWithStatusCode } = require('./../../../middleware/errorHandler');

const registerUser = async function(name, email, phoneNumber, password){

   try {

     const isEmailAlreadyExist = await prisma.users.findUnique({
        where : {
            email : email
        }
     })

     if(isEmailAlreadyExist) {
        throw new ErrorWithStatusCode("Email is already used", 409)
     }


     const isPhoneNumberAlreadyExist = await prisma.users.findFirst({
        where : {
            phone_number : phoneNumber
        }
     })

     if(isPhoneNumberAlreadyExist) {
        throw new ErrorWithStatusCode("Phone Number is already used", 409)
     }

     const hashedPassword = await bcrypt.hash(password, 10)

     const user = await prisma.users.create({
        data : {
            name : name,
            email : email,
            phone_number : phoneNumber,
            password : hashedPassword,
            createdAt : new Date()
        }
     })

     const otp = generateOTP()
     const currentTime = new Date();
     const expiredAt = new Date(currentTime.getTime() + 10 * 60000);

     const result = await prisma.oTP.create({
        data : {
            OTP : Number(otp),
            createdAt : new Date(),
            expiredAt : expiredAt,
            userId : user.id
        }
     })
   
     console.log(result)

     return result.OTP

   } catch (err) {

    throw err
   
   }
}


function generateOTP() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10); 
    }
    return otp;
}

module.exports = { registerUser };