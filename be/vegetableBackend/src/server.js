const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require('cors');
const cookieParser = require("cookie-parser");
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'})); // Bạn có thể thêm extended:true nếu cần
app.use(cookieParser())

routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
.then(() => {
    console.log('Connect database success!')
})
.catch((err) =>{
    console.log(err)
})

app.listen(port, () =>{
    console.log('server is running in port: ', + port)
})
