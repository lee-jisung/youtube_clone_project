const mongoose = require('mongoose');
const Scheam = mongoose.Schema;
const moment = require('moment');

// DB Schema 생성

const videoSchema = mongoose.Schema(
  {
    writer: {
      // User model을 참조해서 모든 정보를 긁어오게 하는 부분
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },

    privacy: {
      type: Number,
    },
    filePath: {
      type: String,
    },
    category: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true } //=> 만든날과 update한 시간 저장
);

// mongoose model -> schema를 감싸주는 역할
const Video = mongoose.model('Video', videoSchema);

// Video model export
module.exports = { Video };

/*
   Mongoose => Do not use Arrow Function
   Arrow funcions explicitly prevent binding 'this', 
   so method will not have access to the document 
   and the above examples will not work
*/
