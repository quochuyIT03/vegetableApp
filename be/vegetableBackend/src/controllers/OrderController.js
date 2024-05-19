const OrderService = require('../services/OrderService')



const createOrder = async (req, res) => {
    try{
        const {fullName, address, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice} = req.body
        if(!fullName || !address  || !phone  || !itemsPrice || !shippingPrice || !totalPrice  || !paymentMethod  ){
        // if(!fullName || !address || !city || !phone || !paymentMethod || !itemsPrice || !shippingPrice || !totalPrice ){
            return res.status(200).json({
                status: 'ERR',
                message: 'Chịu á '
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder
}

// const OrderService = require('../services/OrderService');

// const createOrder = async (req, res) => {
//   try {
//     const { fullName, address, phone, itemsPrice, shippingPrice, totalPrice } = req.body;
    
//     // Kiểm tra đầy đủ thông tin
//     if (!fullName || !address || !phone || !itemsPrice || !shippingPrice || !totalPrice ) {
//       return res.status(400).json({
//         status: 'ERR',
//         message: 'The input is required'
//       });
//     }

//     // Tạo đơn hàng
//     const response = await OrderService.createOrder(req.body);
//     return res.status(200).json(response);
//   } catch (e) {
//     return res.status(500).json({
//       status: 'ERR',
//       message: e.message || 'Internal Server Error'
//     });
//   }
// };

// module.exports = {
//   createOrder
// };
