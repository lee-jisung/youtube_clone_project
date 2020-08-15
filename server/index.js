const express = require('express');
const app = express(); // make express app
const path = require('path');
const cors = require('cors'); //proxy를 안쓰고 back에서 cors 해결하는 법

const port = process.env.PORT || 5000;

// client에서 보내는 body data를 parse(분석)하여 req.body로 출력해주는 것
const bodyParser = require('body-parser');
// cookie사용을 위함
const cookieParser = require('cookie-parser');

// get mongoDB key
const config = require('./config/key');

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const mongoose = require('mongoose');
const connect = mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected...')) //연결이 되면 출력
  .catch(err => console.log(err)); // 연결이 안되면 catch

//proxy를 안쓰고 back에서 cors 해결하는 법
// let cors_origin = [`http://localhost:3000`];
// app.use(
//   cors({
//     origin: cors_origin, // 허락하고자 하는 요청 주소
//     credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가해줌
//   })
// );

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
//application/x-ww-form-unlencoded로 된 data를 분석하게 해줌
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

// client에서온 요청에 대해서 앞 url에 맞는 routes쪽으로 보냄
app.use('/api/users', require('./routes/users'));
app.use('/api/video', require('./routes/video'));

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static('client/build'));

  // index.html for all page routes    html or routing and naviagtion
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
