var express = require('express')
var program = require('commander')
var path = require('path')

program
  .version('0.0.1')
  .option('-m, --mount [path]', 'Mount resource')
  .parse(process.argv);

var app = express()

app.use('/', express.static(__dirname))

// mount additional path if needed
if(program.mount) {
  var fragment
  var pos = program.mount.lastIndexOf('/')
  if(pos > 0)
    fragment = program.mount.substring(pos)
  else
    fragment = '/' + program.mount

  console.log('mounting ' + program.mount + ' at '  + fragment)
  app.use(fragment, express.static(path.join(__dirname, program.mount)))
}

app.listen(3000)
console.log('server listening on http://localhost:3000/')

