const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

//=================================
//             Like
//=================================

router.post('/getLikes', (req, res) => {
  //video에대한 like인지, comment에 대한 like인지 구분
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else {
    variable = { commentId: req.body.commentId };
  }
  Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, likes });
  });
});

router.post('/getDislikes', (req, res) => {
  //video에대한 like인지, comment에 대한 like인지 구분
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else {
    variable = { commentId: req.body.commentId };
  }
  Dislike.find(variable).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, dislikes });
  });
});

//--------
//좋아요 클릭했을 때 처리
router.post('/upLike', (req, res) => {
  //video에대한 like인지, comment에 대한 like인지 구분
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  // Like collection에다가 클릭 정보를 넣어 줌
  const like = new Like(variable);
  like.save((err, likeResult) => {
    if (err) return res.json({ success: false, err });
    // 만약 싫어요가 눌린 상태에서 다시 좋아요를 눌렀을 경우
    // 싫어요를 눌렀던 정보를 없앰
    Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true });
    });
  });
});

router.post('/unLike', (req, res) => {
  //video에대한 like인지, comment에 대한 like인지 구분
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Like.findOneAndDelete(variable).exec(err => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

//------------
// 싫어요 클릭했을 때 처리
router.post('/upDislike', (req, res) => {
  //video에대한 like인지, comment에 대한 like인지 구분
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  // Dislike collection에다가 클릭 정보를 넣어 줌
  const dislike = new Dislike(variable);
  dislike.save((err, dislikeResult) => {
    if (err) return res.json({ success: false, err });
    // 만약 싫어요가 눌린 상태에서 다시 좋아요를 눌렀을 경우
    // 싫어요를 눌렀던 정보를 없앰
    Like.findOneAndDelete(variable).exec((err, likeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true });
    });
  });
});

router.post('/unDislike', (req, res) => {
  //video에대한 like인지, comment에 대한 like인지 구분
  let variable = {};
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Dislike.findOneAndDelete(variable).exec(err => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

module.exports = router;
