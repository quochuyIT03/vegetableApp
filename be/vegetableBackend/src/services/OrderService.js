
const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, fullName, address, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice, city, user, isPaid, paidAt, email } = newOrder;
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            sale: +order.amount
                        }
                    },
                    { new: true }
                );
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS',
                        // data: newOrder,
                    };
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product,
                    };
                }
            });

            const results = await Promise.all(promises);
            const newData = results && results.filter((item) => item.id);
            if (newData.length) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${newData.join(',')} khong du hang `,
                });
            } else {
                const newOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        address,
                        fullName,
                        city,
                        phone
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid: Boolean(isPaid),
                    paidAt,
                });
                if (newOrder) {
                    await EmailService.sendEmailInfoPayment(email, orderItems);
                    resolve({
                        status: 'OK',
                        message: 'Success',
                    });
                }
            }
        } catch (e) {
            console.log('e', e);
            reject(e);
        }
    });
};


const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const order = await Order.find({
                user: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order
            })

        } catch (e) {
            reject(e)
        }
    })
}

const cancelDetailsOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate({
                    _id: order.product,
                    sale: { $gte: order.amount }
                },
                    {
                        $inc: {
                            countInStock: +order.amount,
                            sale: -order.amount
                        }
                    },

                    { new: true }
                )
                console.log('productData', productData)
                if (productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product,
                    }
                }
            })
            const results = await Promise.all(promises)
            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })


        } catch (e) {
            reject(e)
        }
    })
}
const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {

        try {

            const allOrder = await Order.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allOrder
            })

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder, getAllOrderDetails, getDetailsOrder, cancelDetailsOrder, getAllOrder

}