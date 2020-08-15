const { User } = require('../models/User');

// auth => page마다 로그인이 되어있는지 여부를 체크
//      => 관리자 인지체크
// 접근을 제한 할 수 있음

// client cookie에 저장한 token을 server에 전달하여
// 해당 token과 로그인한 user가 동일한지 확인

let auth = (req, res, next) => {
  //client cookie에 있는 token을 가져옴
  let token = req.cookies.w_auth;

  // User model에 정의한 findByToken을
  // 이용하여 token을 복호화 하여 user를 찾음
  // findByToken에서 찾은 user를 이용해서
  // client가 보낸 req에 token과 user를 넣어주는데
  // 넣어줌으로써 login한 user가 page를 이동하는데 auth가 계속 true
  // 인지 확인하게 할 수 있음
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });

    req.token = token;
    req.user = user;
    next(); // 다 성공했다면 다시 user.js의 auth로 보냄
  });
};

module.exports = { auth };
