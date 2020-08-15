const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // password 암호화
const saltRounds = 10; // salt가 몇 글자 인지 정하는 것
const jwt = require('jsonwebtoken'); // 토큰 생성을 위한 것
const moment = require('moment');

// DB Schema 생성

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minglength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    // admin = 0 / user = 1, etc..
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//pre => 'save'를 하기 전 처리하게 하는 함수
userSchema.pre('save', function (next) {
  let user = this; //=>userSchema를 가리킴

  // 새로 가입 or 암호를 변경했다면 password를 암호화 하고
  if (user.isModified('password')) {
    // console.log('password changed')
    //getSalt => salt를 생성, salt를 이용해서 password를 암호화 함 (salt는 10자리)
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); // =>save에 error를 보냄

      // user의 password를 salt를 이용해서 hash 함
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err); //=>save에 error를 보냄
        user.password = hash;
        next(); //=> routes/users.js의 save로 보냄
      });
    });
  } else {
    // password 이외의 것을 변경했다면 그냥 next()로 보냄
    next(); //=> routes/users.js의 save로 보냄
  }
});

// user가 입력한 pw와 db에 저장된 pw가 같은지 확인
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword를 암호화해서 pw와 비교
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// token을 생성하는 method
userSchema.methods.generateToken = function (cb) {
  let user = this;

  //user._id.toHedString() + 'secret'을 이용해 token을 생성하고
  // token과 'secret'을 이용해서 user._id를 구함
  // ** toHexString() => plain object로 만들어서 토큰 생성
  let token = jwt.sign(user._id.toHexString(), 'secret'); // token 생성
  let oneHour = moment().add(1, 'hour').valueOf(); // token 기한 => 1시간

  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

// token을 찾는 함수
userSchema.statics.findByToken = function (token, cb) {
  let user = this;

  //'secret'을 이용하여 decode해서 user의 _id를 복호화
  // 'secret' => token을 생성할 때 이용한 string
  jwt.verify(token, 'secret', function (err, decode) {
    //user에서 id와 token을 이용해 user를 찾고
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err); //user가 없으면 error
      cb(null, user); // user를 보내줌
    });
  });
};

// mongoose model -> schema를 감싸주는 역할
const User = mongoose.model('User', userSchema);

// User model export
module.exports = { User };

/*
   Mongoose => Do not use Arrow Function
   Arrow funcions explicitly prevent binding 'this', 
   so method will not have access to the document 
   and the above examples will not work
*/
