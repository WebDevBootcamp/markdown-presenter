var express = require('express');
var program = require('commander');
var path = require('path')

program
  .version('0.0.1')
  .option('-m, --mount [path]', 'Mount resource')
  .parse(process.argv);

var app = express();

app.use('/', express.static(__dirname));

// mount additional path if needed
if(program.mount) {
  var mount = program.mount;
  var fragment;
  var pos = mount.lastIndexOf('/');
  if(pos > 0)
    fragment = mount.substring(pos);
  else
    fragment = '/' + mount;

  console.log('mounting ' + mount + ' at '  + fragment);
  if(mount[0] !== '/') {
    mount = path.join(__dirname, mount);
  }
  app.use(fragment, express.static(mount));
}

app.listen(3000);
console.log('server listening on http://localhost:3000/');
