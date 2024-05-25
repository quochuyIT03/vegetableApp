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

module.exports = {
    sendEmailInfoPayment
}

