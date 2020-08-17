import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector(state => state.user);
  const videoId = props.videoId;
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState('');

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const onHandleChange = event => {
    setCommentValue(event.currentTarget.value);
  };
  const onSubmit = event => {
    event.preventDefault();
    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      videoId: videoId,
      responseTo: props.comment._id, //누구에게 답글을 다는지
    };

    Axios.post('/api/comment/saveComment', variables).then(response => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue('');
        setOpenReply(false);
        props.refreshFunction(response.data.result);
      } else {
        alert('Fail to save comments');
      }
    });
  };

  const actions = [
    <LikeDislikes commentId={props.comment._id} userId={user.userData._id} />,
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      Reply to
    </span>,
  ];
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt />}
        content={<p>{props.comment.content}</p>}
      />
      {OpenReply && (
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          <textarea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="write a comments..."
          />
          <br />
          <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
