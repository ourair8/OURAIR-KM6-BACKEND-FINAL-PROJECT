const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const test = async ()=> {
    try { 
        const now = new Date()

        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() - 1);

        
        const transaction = await prisma.transactions.updateMany({
            where : 
            {
                created_at : {
                    lt : tomorrow
                },

                status : false
            },
        })

        //cron , edit

        
    } catch (err) {
        throw err
    }
}

test()