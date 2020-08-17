import React, { useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux'; // redux state에 있는것을 가져오기 위한 것
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

// comment를 입력하면 이를 videoDetailPage(parent component)로 전달

function Comment(props) {
  const videoId = props.videoId;
  // redux state에 있는 user 정보를 가져오기 위한 것
  const user = useSelector(state => state.user);
  const [commentValue, setcommentValue] = useState('');

  const handleChange = event => {
    setcommentValue(event.currentTarget.value);
  };

  const onSubmit = event => {
    event.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      videoId: videoId,
    };

    Axios.post('/api/comment/saveComment', variables).then(response => {
      if (response.data.success) {
        console.log(response.data.result);
        setcommentValue('');
        props.refreshFunction(response.data.result);
      } else {
        alert('Fail to save comments');
      }
    });
  };

  return (
    <div>
      <br />
      <p> Replies</p>
      <hr />

      {/* Commnet Lines */}
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment>
                <SingleComment
                  refreshFunction={props.refreshFunction}
                  comment={comment}
                  videoId={videoId}
                />
                <ReplyComment
                  videoId={videoId}
                  parentCommentId={comment._id}
                  commentLists={props.commentLists}
                  refreshFunction={props.refreshFunction}
                />
              </React.Fragment>
            )
        )}

      {/* Root Commnet Form */}
      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleChange}
          value={commentValue}
          placeholder="write a comments..."
        />
        <br />
        <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
