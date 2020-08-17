import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

  // video에 대한 like인지, comment에 대한 like인지 구분
  let variable = {};
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }
  useEffect(() => {
    Axios.post('/api/like/getLikes', variable).then(response => {
      if (response.data.success) {
        // 얼마나 많은 좋아요를 받았는지
        setLikes(response.data.likes.length);
        // 내가 이미 좋아요를 눌렀는지
        response.data.likes.map(like => {
          //props.userId => login한 userid
          // like.userId => like을 누른 user들 중 내 id가 있는지 확인
          if (like.userId === props.userId) {
            setLikeAction('liked');
          }
        });
      } else {
        alert('fail to get like information');
      }
    });

    Axios.post('/api/like/getDislikes', variable).then(response => {
      if (response.data.success) {
        // 얼마나 많은 싫어요를 받았는지
        setDislikes(response.data.dislikes.length);
        // 내가 이미 싫어요를 눌렀는지
        response.data.dislikes.map(dislike => {
          //props.userId => login한 userid
          // dislike.userId => dislike를 누른 user들 중 내 id가 있는지 확인
          if (dislike.userId === props.userId) {
            setDislikeAction('disliked');
          }
        });
      } else {
        alert('fail to get dislike information');
      }
    });
  }, []);

  const onLike = () => {
    // 좋아요가 눌리지 않은 상태 일 때,
    if (LikeAction === null) {
      Axios.post('/api/like/upLike', variable).then(response => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction('liked');

          if (DislikeAction !== null) {
            setDislikeAction(null);
            setDislikes(Dislikes - 1);
          }
        } else {
          alert('fail to up to like');
        }
      });
    } else {
      // 좋아요가 눌렸던 상태일 때, like 정보를 없앰
      Axios.post('/api/like/unLike', variable).then(response => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert('fail to down to like');
        }
      });
    }
  };

  const onDislike = () => {
    // 싫어요가 눌리지 않은 상태 일 때,
    if (DislikeAction === null) {
      Axios.post('/api/like/upDislike', variable).then(response => {
        if (response.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction('disliked');

          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert('fail to up to dislike');
        }
      });
    } else {
      // 좋아요가 눌렸던 상태일 때, like 정보를 없앰
      Axios.post('/api/like/unDislike', variable).then(response => {
        if (response.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null);
        } else {
          alert('fail to down to dislike');
        }
      });
    }
  };

  return (
    <div>
      <span key="comment-basic=like">
        <Tooltip tilte="Like">
          <Icon
            type="like"
            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8x', cursor: 'auto' }}> {Likes} </span>
      </span>
      &nbsp;&nbsp;
      <span key="comment-basic=dislike">
        <Tooltip tilte="Dislike">
          <Icon
            type="dislike"
            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8x', cursor: 'auto' }}> {Dislikes} </span>
      </span>
      &nbsp;&nbsp;
    </div>
  );
}

export default LikeDislikes;
