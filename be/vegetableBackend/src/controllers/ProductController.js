const ProductService = require('../services/ProductService')



const createProduct = async (req, res) => {
    try{
        const {name, image, type, countInStock, price, rating, description} = req.body
        if(!name || !image || !type || !countInStock || !price || !rating ){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateProduct = async (req, res) => {
    try{
        const productId = req.params.id
        const data = req.body
        if(!productId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.updateProduct(productId, data)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {
    try{
        const productId = req.params.id
        if(!productId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {
    try{
        const productId = req.params.id
        if(!productId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try{
        const ids = req.body.ids
        if(!ids){
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    console.log('req.query', req.query)
    try{
        
        const { limit, page, sort, filter} = req.query
        const response = await ProductService.getAllProduct(Number(limit) || 8, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

// const loginUser = async (req, res) => {
//     try{
//         const {name, email, password, confirmPassword, phone} = req.body
//         const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
//         const isCheckEmail = reg.test(email)
//         if(!name || !email || !password || !confirmPassword || !phone){
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The input is required'
//             })
//         }else if(!isCheckEmail){
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The input is email'
//             })
//         }else if (password !== confirmPassword) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The input is equal confirmPassword'
//             })
//         }
//         const response = await UserService.loginUser(req.body)
//         // await UserService.createUser()
//         return res.status(200).json(response)
//     } catch(e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

// const updateUser = async (req, res) => {
//     try{
//         const userId = req.params.id
//         const data = req.body
//         if(!userId){
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The userId is required'
//             })
//         }
//         console.log('userId', userId)
//         const response = await UserService.updateUser(userId, data)
//         return res.status(200).json(response)
//     } catch(e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }







// const refreshToken = async (req, res) => {
//     try{
//         const token = req.headers.token.split(' ')[1]
//         if(!token) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The token is required'
//             })
//         }
//         const response = await JwtService.refreshTokenJwtService(token)
//         return res.status(200).json(response)
//     } catch(e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

module.exports = {
    createProduct, updateProduct, getDetailsProduct, deleteProduct, getAllProduct, deleteMany
}
