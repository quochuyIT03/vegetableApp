const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        const { fullName, address, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice, city } = req.body;
        if (!fullName || !address || !phone || !paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !city) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await OrderService.createOrder(req.body);
        // Trả về kết quả thành công
        return res.status(200).json(response);
    } catch (e) {
        // Trả về status code 500 và thông báo lỗi nếu có lỗi xảy ra
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi tạo order: ' + e.message
        });
    }
};

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
//Cai nay la get all 

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.getDetailsOrder(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        const data = req.body
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelDetailsOrder(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder, getAllOrderDetails, getDetailsOrder, cancelDetailsOrder, getAllOrder
};
