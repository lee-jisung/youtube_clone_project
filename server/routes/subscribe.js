const express = require('express');
const router = express.Router();

// auth 가져오기
const { auth } = require('../middleware/auth');
const { Subscriber } = require('../models/Subscriber');

//=================================
//             Subscribe
//=================================

router.post('/subscribeNumber', (req, res) => {
  //userTo로 subscriber의 정보를 찾으면
  // subscribe에 (userTo)를 구독하는 모든 case가 들어있음
  // length를 return하면 구독자가 몇명인지 알 수 있음
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res
      .status(200)
      .json({ success: true, subscribeNumber: subscribe.length });
  });
});

router.post('/subscribed', (req, res) => {
  // 특정 video에 대하여
  // userTo와 userFrom에 모두 해당하는 case가 1개 있다면 현재 로그인한 사용자가
  // 해당 video를 구독하고 있는 것
  Subscriber.find({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    let result = false;
    if (subscribe.length !== 0) result = true;
    res.status(200).json({ success: true, subscribed: result });
  });
});

router.post('/unSubscribe', (req, res) => {
  Subscriber.findOneAndDelete({
    //userTo, userFrom 삭제
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

router.post('/subscribe', (req, res) => {
  // 구독 정보 추가
  const subscribe = new Subscriber(req.body);
  subscribe.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

module.exports = router;
