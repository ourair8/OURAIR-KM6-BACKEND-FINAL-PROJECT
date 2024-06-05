'use strict'

const prisma = require("../../../config/prisma.config")
const bcrypt = require("bcrypt")

const { ErrorWithStatusCode } = require('./../../../middleware/errorHandler');

const registerUser = async function(name, phoneNumber, email, password){
    
   try {

     const isEmailAlreadyExist = await prisma.users.findUnique({
        where : {
            email : email
        }
     })

     if(isEmailAlreadyExist) {
        throw new ErrorWithStatusCode("Alamat email sudah digunakan", 409)
     }


     const isPhoneNumberAlreadyExist = await prisma.users.findFirst({
        where : {
            phone_number : phoneNumber
        }
     })

     if(isPhoneNumberAlreadyExist) {
        throw new ErrorWithStatusCode("Nomor telepon sudah digunakan", 409)
     }

     const hashedPassword = await bcrypt.hash(password, 10)

     const user = await prisma.users.create({
        data : {
            name : name,
            email : email,
            password : hashedPassword,
            phone_number : phoneNumber,
            created_at : new Date()
        }
     })

     const otp = generateOTP()
     const currentTime = new Date();
     const expiredAt = new Date(currentTime.getTime() + 10 * 60000);

     const result = await prisma.otps.create({
        data : {
            otp_code : String(otp),
            created_at : new Date(),
            expired_at : expiredAt,
            user_id : user.id
        }
     })

     await prisma.notifications.create({
         data : {
            user_id : user.id,
            title : "Welcome",
            message : `Hello ${user.name}, thank you for joining ourair`,
            is_read : false,
            created_at : new Date()
         }
     })
   
     

     return result.otp_code

   } catch (err) {
      console.log(err)
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