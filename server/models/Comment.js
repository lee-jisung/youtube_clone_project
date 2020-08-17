const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// DB Schema 생성

// userFrom -> userTo를 구독하고 있는 DB
const commentSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    responseTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
    },
  },
  { timestamps: true } //=> 만든날과 update한 시간 저장
);

// mongoose model -> schema를 감싸주는 역할
const Comment = mongoose.model('Comment', commentSchema);

// Video model export
module.exports = { Comment };

/*
   Mongoose => Do not use Arrow Function
   Arrow funcions explicitly prevent binding 'this', 
   so method will not have access to the document 
   and the above examples will not work
*/
