'use strict'

const prisma = require('../../../config/prisma.config');

// const updateTransactionHistory = async(data) => {
//     return await prisma.transactions.update({
//         where : {
//             id : data.transactionId
//         },
//         data : {
//             status : 
//         }
//     });
// };

module.exports = {
    updateTransactionHistory
};