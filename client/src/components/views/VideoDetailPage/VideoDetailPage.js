import React, { useState, useEffect } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props) {
  //App.js => component prop url로 video Id 넘긴 걸 가져옴
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };
  const user = useSelector(state => state.user);
  const [VideoDetail, setVideoDetail] = useState([]);

  // Comments들을 관리하는 state
  // comment.js에서 입력한 comment들을 받아와서 Commnets에 저장하고 다시
  // comment.js로 내려주는 순환이 일어나게 됨
  const [Comments, setComments] = useState([]);

  //comment.js로부터 comment의 수정된 내용을 받아오는 함수
  // newComments라는 새롭게 입력된 comments를 받아와서 기존의 comments에다가 덧붙임
  const refreshFunction = newComments => {
    setComments(Comments.concat(newComments));
  };

  useEffect(() => {
    Axios.post('/api/video/getVideoDetail', variable).then(response => {
      if (response.data.success) {
        setVideoDetail(response.data.videoDetail);
      } else {
        alert('Fail to get video information');
      }
    });

    Axios.post('/api/comment/getComments', variable).then(response => {
      if (response.data.success) {
        setComments(response.data.comments);
      } else {
        alert('Fail to get Comment information');
      }
    });
  }, []);

  // writer의 image가 loading되기 전 render되어 undefined를 막기 위해 if문 사용
  if (VideoDetail.writer) {
    // 버튼이 video를 올린 사람과 로그인 한 사람의 아이디가 같으면 구독버튼 안보이게 한것
    const subscribeButton = VideoDetail.writer._id !==
      localStorage.getItem('userId') && (
      <Subscribe
        userTo={VideoDetail.writer._id}
        userFrom={localStorage.getItem('userId')}
      />
      // 구독버튼을 이미 눌렀을 경우 눌렀다는 표시로 해놔야 하는데
    );

    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col lg={18} xs={24}>
            <div style={{ width: '100%', padding: '3rem 4rem' }}>
              <video
                style={{ width: '100%' }}
                src={`http://localhost:5000/${VideoDetail.filePath}`}
                controls
              />

              <List.Item
                // 현재 video를 올린 사람의 id를 prop으로 넘김
                actions={[
                  <LikeDislikes videoId={videoId} userId={user.userData._id} />,
                  subscribeButton,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={VideoDetail.writer.image} />}
                  title={VideoDetail.writer.name}
                  description={VideoDetail.description}
                />
              </List.Item>

              {/* comments */}
              <Comment
                refreshFunction={refreshFunction}
                commentLists={Comments}
                videoId={videoId}
              />
            </div>
          </Col>
          <Col lg={6} xs={24}>
            <SideVideo />
          </Col>
        </Row>
      </div>
    );
  } else {
    return <div>Loading....</div>;
  }
}

export default VideoDetailPage;
