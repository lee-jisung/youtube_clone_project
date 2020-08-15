if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}

//process.env.NODE_ENV => 환경변수 => deploy할 때 production이되고
// local에서 실행하면 development가 됨
