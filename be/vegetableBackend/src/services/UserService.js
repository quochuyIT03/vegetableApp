const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                _email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser,
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password or user incorrect!'
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            console.log('access_token', access_token)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            console.log('updateUser', updatedUser)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })

        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'DELETE USER SUCCESS'
            })

        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {

        try {
            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'DELETE USER SUCCESS'
            })

        } catch (e) {
            reject(e)
        }
    })
}


const getAllUser = () => {
    return new Promise(async (resolve, reject) => {

        try {

            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            })

        } catch (e) {
            reject(e)
        }
    })
}

const resetPassword = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return {
                status: 'ERR',
                message: 'Email không tồn tại'
            };
        }

        // Tạo và lưu token vào user
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
        await user.save();

        // Trả về token để sử dụng trong gửi email hoặc gửi liên kết đặt lại mật khẩu
        return {
            status: 'OK',
            message: 'SUCCESS',
            resetToken: token
        };
    } catch (error) {
        throw error;
    }
}

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw error;
    }
}

const changePassword = async (email, newPassword) => {
    try {
        console.log(`Received request to change password for email: ${email}`);

        // Tìm người dùng dựa trên email
        const user = await User.findOne({ email });

        // Nếu không tìm thấy người dùng
        if (!user) {
            console.log(`User with email ${email} not found`);
            return {
                status: 'ERR',
                message: 'Email không tồn tại'
            };
        }

        // Hash mật khẩu mới
        const hash = bcrypt.hashSync(newPassword, 10);

        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        user.password = hash;
        await user.save();

        console.log(`Password for email ${email} changed successfully`);

        return {
            status: 'OK',
            message: 'Đổi mật khẩu thành công'
        };
    } catch (error) {
        console.error(`Error changing password for email ${email}:`, error);
        throw error;
    }
}



module.exports = {
    createUser, loginUser, updateUser, deleteUser, getAllUser, getDetailsUser, deleteManyUser, resetPassword, getUserByEmail, changePassword
}

