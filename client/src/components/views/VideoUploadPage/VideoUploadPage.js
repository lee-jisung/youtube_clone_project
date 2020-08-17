import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';
const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const CategoryOptions = [
  { value: 0, label: 'Film & Animation' },
  { value: 1, label: 'Auto & Vehicles' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Pets & Animals' },
  { value: 4, label: 'Landscape' },
];

function VideoUploadPage(props) {
  const user = useSelector(state => state.user); // redux에 있는 state store에서 user정보를 가져오는 것
  const [VideoTitle, setVideoTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Private, setPrivate] = useState(0); // 0:private, 1:public
  const [Category, setCategory] = useState('Film & Animation');

  //for thumbnail
  const [FilePath, setFilePath] = useState('');
  const [Duration, setDuration] = useState('');
  const [ThumbnailPath, setThumbnailPath] = useState('');

  const onTitleChange = event => {
    setVideoTitle(event.currentTarget.value);
  };

  const onDescriptionChange = event => {
    setDescription(event.currentTarget.value);
  };

  const onPrivateChange = event => {
    setPrivate(event.currentTarget.value);
  };

  const onCategoryChange = event => {
    setCategory(event.currentTarget.value);
  };

  const onDrop = files => {
    let formData = new FormData();
    const config = {
      heaher: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);

    console.log(files);
    // dropzone을 통해 올린 file을 server로 전송 후 response를 받아옴
    Axios.post('/api/video/uploadfiles', formData, config).then(response => {
      if (response.data.success) {
        console.log(response.data);

        // server에서 받아온 response를 이용해서 variable 생성
        let variable = {
          url: response.data.url,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.url);

        Axios.post('/api/video/thumbnail', variable).then(response => {
          if (response.data.success) {
            console.log('thumbnail data');
            console.log(response.data);

            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
          } else {
            alert('fail to generate thumbnail');
          }
        });
      } else {
        alert('fail to upload');
      }
    });
  };

  const onSubmit = event => {
    event.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    Axios.post('/api/video/uploadVideo', variables).then(response => {
      if (response.data.success) {
        message.success('success to upload');
        setTimeout(() => {
          props.history.push('/'); // go to landing page
        }, 1000);
      } else {
        alert('Fail to Video upload on the server');
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBoton: '2rem' }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Drop zone */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: '300px',
                  height: '240px',
                  border: '1px solid lightgray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem' }} />
              </div>
            )}
          </Dropzone>

          {/* Thumbnail */}
          {ThumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>

        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle} />

        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description} />
        <br />
        <br />

        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
