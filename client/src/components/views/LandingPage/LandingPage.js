import React, { useEffect, useState } from 'react';
import { FaCode } from 'react-icons/fa';
import Axios from 'axios';
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [Video, setVideo] = useState([]);
  // get video data from mongoDB
  useEffect(() => {
    Axios.get('/api/video/getVideos').then(response => {
      if (response.data.success) {
        console.log(response.data);
        setVideo(response.data.videos);
      } else {
        alert('fail to get video from DB');
      }
    });
  }, []);

  const renderCards = Video.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col key={index} lg={6} md={8} xs={24}>
        {/* video detail로 가기 위한 link */}
        <div style={{ position: 'relative' }}>
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
            <div className="duration">
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          avater={<Avatar src={video.writer.image} />}
          title={video.title}
          description=""
        />
        <span>{video.writer.name}</span>
        <span style={{ marginLeft: '3rem' }}>{video.views} views</span> -{' '}
        <span>{moment(video.createAt).format('MMM Do YY')}</span>
      </Col>
    );
  });

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}> Recommended</Title>
      <hr />

      {/* row => page row 1개당 4개의 col이 나오게 하는 것 */}
      <Row gutter={[32, 16]}>
        {/* row 1줄의 전체 사이즈가 24 => col size가 6이라면 col이 4개나오는 것 
      col size가 8이면 3개, 24면 1개의 col이 생성. 즉, page의 크기에 따라 반응하여 화면에 보이는 video col이 줄어듦  */}

        {renderCards}
      </Row>
    </div>
  );
}

export default LandingPage;
