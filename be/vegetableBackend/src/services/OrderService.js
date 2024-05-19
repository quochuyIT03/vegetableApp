const Order = require("../models/OrderProduct")


const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const {fullName, address, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice, orderItems} = newOrder
//        const {fullName, address, city, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice, orderItems} = newOrder
        try{
            
            const newOrder = await Order.create({
                orderItems, 
                shippingAddress: {
                    fullName,
                    address, 
                    phone
                },
                paymentMethod, 
                itemsPrice, 
                shippingPrice, 
                totalPrice, 
                user: user, 
    
            })
            if(newOrder){
                resolve({
                    status: 'OK', 
                    message: 'SUCCESS',
                    data: newOrder,
                })
            }
            
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createOrder
}

// const Order = require("../models/OrderProduct");

// const createOrder = (newOrder, user) => {
//   return new Promise(async (resolve, reject) => {
//     const { fullName, address, phone, itemsPrice, shippingPrice, totalPrice, orderItems } = newOrder;
    
//     try {
//       const createdOrder = await Order.create({
//         orderItems,
//         shippingAddress: {
//         address,
//         fullName,
//         phone,
//         },
//         itemsPrice,
//         shippingPrice,
//         totalPrice,
//         user: user,
//       });

//       if (createdOrder) {
//         resolve({
//           status: 'OK',
//           message: 'SUCCESS',
//           data: createdOrder,
//         });
//       }
//     } catch (e) {
//       reject({
//         status: 'ERR',
//         message: e.message || 'Internal Server Error',
//       });
//     }
//   });
// };

// module.exports = {
//   createOrder
// };

