const express = require('express');
const router = express.Router();

//Database 저장 위한 Video model 가져옴
// const { Video } = require('../models/Video');

// auth 가져오기
const { auth } = require('../middleware/auth');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const Video = require('../models/Video');

// multer => video를 저장하기 위한 것

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // file을 저장하기 위한 목적지 => uploads folder에 저장
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // filename을 날짜와 함께 생성
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    // mp4만 받게 하기 위한 것
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only mp4 is allowed'), false);
    }
    cb(null, true);
  },
});

// single => file 1개만 uplaod하게 하는 것
const upload = multer({ storage: storage }).single('file');

//=================================
//             Video
//=================================

// req =>client에서 보낸 video files가 들어있음
router.post('/uploadfiles', (req, res) => {
  //store video on the server
  upload(req, res, err => {
    if (err) {
      // upload 실패  => client에게 false 보냄
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path, //=>server에 있는 uploads folder 경로를 보내줌
      fileName: res.req.file.filename, // file name 보내줌
    });
  });
});

// client에 onsubmit function을 통해 전달된 variables를 받아옴 =>req.body
router.post('/uploadVideo', (req, res) => {
  //store video on the mongo DB
  const video = new Video(req.body);
  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.json({ success: true });
  });
});

// populate을 해주면 writer를 통해 user의 모든 정보도 가져옴 =>
// video model에 writer을 user의 모든 정보를 가져와서 저장했기 때문에 가능
// populate을 안해주면 그냥 writer의 id만 가져오게 됨
router.get('/getVideos', (req, res) => {
  // get video from DB, and send client
  Video.find() // => get all video information from DB
    .populate('writer')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post('/thumbnail', (req, res) => {
  let filePath = '';
  let fileDuration = '';

  //video 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata); //all metadata
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  //thumbnail 생성,
  ffmpeg(req.body.url) // client에서 온 video 저장 경로
    .on('filenames', function (filenames) {
      console.log('Will generate ' + filenames.join(', '));
      console.log(filenames);

      filePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function () {
      console.log('Screenshots taken');
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on('error', function (err) {
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      //Will take screenshots at 20%, 40%, 60% and 80% of the video
      count: 3, // 3개의 screenshot 찍음
      folder: 'uploads/thumbnails',
      size: '320x240',
      //'%b': input basename (filename w/o extension) ->extension을 제외한 filename
      filename: 'thumbnail-%b.png',
    });
});

module.exports = router;
