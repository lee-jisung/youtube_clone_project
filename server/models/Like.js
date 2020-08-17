const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// DB Schema 생성

// userFrom -> userTo를 구독하고 있는 DB
const likeSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
  },
  { timestamps: true } //=> 만든날과 update한 시간 저장
);

// mongoose model -> schema를 감싸주는 역할
const Like = mongoose.model('Like', likeSchema);

// Video model export
module.exports = { Like };

/*
   Mongoose => Do not use Arrow Function
   Arrow funcions explicitly prevent binding 'this', 
   so method will not have access to the document 
   and the above examples will not work
*/
