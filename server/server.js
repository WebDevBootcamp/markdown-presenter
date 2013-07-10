var express = require('express')

var app = express()

app.use('/', express.static(__dirname + '/../www'))

app.listen(3000)
console.log('server listening on http://localhost:3000/')

