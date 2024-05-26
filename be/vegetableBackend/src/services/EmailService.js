const nodemailer = require("nodemailer")
const dotenv = require('dotenv');
const inlineBase64 = require('nodemailer-plugin-inline-base64');

dotenv.config()


const sendEmailInfoPayment = async (email, orderItems) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));

    let listItems = '';
    const attachImage = []
    orderItems.forEach((order) => {
        listItems += `<div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                            <div>
                                <img src="${order.image}" alt="Product Image" style="width: 100px; height: auto;" />
                            </div>
                            <div>
                                <p>Số lượng: <b>${order.amount}</b></p>
                                <p>Giá: <b>${order.price}</b></p>
                                
                            </div>
                      </div>`;
    });

    let htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Xin chào,</h2>
            <p>Cảm ơn bạn đã đặt hàng tại OASIS VEGETABLE. Đơn hàng của bạn đã được xác nhận.</p>
            <h3>Chi tiết đơn hàng:</h3>
            ${listItems}
            <p>Cảm ơn bạn đã tin tưởng và mua hàng của chúng tôi!</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ OASIS VEGETABLE</p>
        </div>`;

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to: "thienton3102@gmail.com",
        subject: "Xác nhận đặt hàng thành công - OASIS VEGETABLE",
        text: "Xác nhận đặt hàng thành công",
        html: htmlContent,
        attachments: attachImage,
    });

    console.log("Message sent: %s", info.messageId);
}

const sendResetPasswordEmail = async (email, resetLink) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    let htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Xin chào,</h2>
            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
            <p>Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu của bạn:</p>
            <a href="${resetLink}" style="color: #1a73e8;">Đặt lại mật khẩu</a>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ Hỗ trợ</p>
        </div>`;

    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject: "Đặt lại mật khẩu",
        text: `Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập vào liên kết sau để đặt lại mật khẩu: ${resetLink}`,
        html: htmlContent,
    });

    console.log("Reset password email sent: %s", info.messageId);
};
module.exports = {
    sendEmailInfoPayment, sendResetPasswordEmail
}

