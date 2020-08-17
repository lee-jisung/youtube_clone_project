const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// DB Schema 생성

// userFrom -> userTo를 구독하고 있는 DB
const subscriberSchema = mongoose.Schema(
  {
    userTo: {
      // 비디오를 업로드한 사람의 정보
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userFrom: {
      // 해당 video를 follow하는 사람들의 정보
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true } //=> 만든날과 update한 시간 저장
);

// mongoose model -> schema를 감싸주는 역할
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Video model export
module.exports = { Subscriber };

/*
   Mongoose => Do not use Arrow Function
   Arrow funcions explicitly prevent binding 'this', 
   so method will not have access to the document 
   and the above examples will not work
*/
