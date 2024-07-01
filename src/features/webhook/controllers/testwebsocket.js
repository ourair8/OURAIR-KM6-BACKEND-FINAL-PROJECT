// let i = 0

// const testwebsocket = async function(req, res) {
//   try {
//     const io = req.app.get('io');
//     const token = req.token
//     

//     io.emit(`transaction-update-${token}`, `Hello, Transaksi Selesai`);
//     i++;
//     return res.json({
//         message: `Notification number ${i} sent!`
//     });
//   } catch (err) {
//     throw err;
//   }
// }

// module.exports = { testwebsocket };
