var path = require('path');
var push = require('./index.js');

var remote = {
  name: 'test',
  url: 'https://github.com/koistya/test.git',
  branch: 'master'
};

push('./test', remote, function() {
  console.log('Done!');
});
