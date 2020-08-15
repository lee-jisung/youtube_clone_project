# Youtube Clone Project

Learning and Using React.js & Node.js

React js => Node js로 request를 보낼 때 Axios를 사용

- axios.get('').then(response => {})
- axios.post('') ~~
  의 형태로 request를 보내고, then에서 response를 받은 것을 client에서 처리

단, client는 3000port, server는 5000port이기 때문에 port가 달라
axios.get('http://localhost:5000/api/users~~')의 식으로 request를 날려도
CORS policy에 의해 막힘(Cross-Origin Resource sharing) => 보안 issue

=> Proxy를 사용해서 해결

## Redux

redux store => object 형태의 data만 저장할 수 있음

Redux store에 promise / function의 형태를 저장하기 위해서

redux-promise와 redux-thunk를 사용 (redux를 위한 middleware)

## ffmpeg

for generate thumbnail by video which user upload

https://ai-creator.tistory.com/78
