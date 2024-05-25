const nodemailer = require("nodemailer")
const dotenv = require('dotenv');

dotenv.config()


const sendEmailInfoPayment = async (email, orderItems) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const listItems = ''
    orderItems.forEach((order) => {
        listItems += `<div> 
                            <div>
                                <img src=${order.image} alt="imagePRODUCT" />
                            </div>
                            <div>
                            Số lượng: <b> ${order.amount} </b>
                            Giá: <b> ${order.price} </b>
                            </div>
                      </div>`
    })


    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT, // sender address
        to: "anhanh01472@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<b>Hello world?</b> ${orderItems}`, // html body
    });
}

module.exports = {
    sendEmailInfoPayment
}

