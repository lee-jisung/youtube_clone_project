const express = require('express');
const router = express.Router();

//Database 저장 위한 User model 가져옴
const { User } = require('../models/User');

// auth 가져오기
const { auth } = require('../middleware/auth');

//=================================
//             User
//=================================

// auth middleware를 이용해서 user의 token을 이용해서 auth를 확인하고,
// auth middleware를 통과했다면 그 이후 res.status(200)을 client로 보내줌
router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // role:0 => 일반 유저 / role:1 =>admin
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// clinet에서 보내는 정보를 req.body로 받아옴
router.post('/register', (req, res) => {
  // user라는 db를  mongoDB에 생성하게 됨
  const user = new User(req.body);

  //user.save => mongoDB에 저장
  user.save((err, userInfo) => {
    // error 발생시 client에 전달 할 data
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      // 성공시 response 200과 json data를 보냄
      success: true,
    });
  });
});

router.post('/login', (req, res) => {
  // User database에서 req로 온 email에 해당하는 user를 찾아 두번째 function의 params로 전달
  //findOne => 첫번째로 해당되는 user가 return됨
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      // db에 user가 없다면
      return res.json({
        loginSuccess: false,
        message: '해당 email로 가입한 사용자가 없습니다.',
      });

    // request된 pw와 db의 pw가 같은지 확인
    //User model에서 정의한 함수임
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다',
        });

      // pw가 같다면 token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 토큰을 client의 cookie에 저장
        // cookie('이름', value)로 하면 cookie에 저장됨
        res.cookie('w_authExp', user.tokenExp);
        res.cookie('w_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

// logout을 하려는 user를 찾아서 token을 구하고
// DB에 있는 token을 지워줌 ==> token을 지워주게 되면 auth middleware를 통과하지못함
// => logout이 구현됨
router.get('/logout', auth, (req, res) => {
  // DB에서 user를 찾아 update시켜주는 함수
  User.findOneAndUpdate(
    // logout을 원하는 user를 찾아 token, tokenExp를 지움
    { _id: req.user._id },
    { token: '', tokenExp: '' },
    (err, doc) => {
      if (err) return res.json({ success: false, err }); // logout fail
      return res.status(200).send({
        //logout success
        success: true,
      });
    }
  );
});

module.exports = router;
