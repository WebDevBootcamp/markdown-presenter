var express = require('express')

var app = express()

app.use('/', express.static(__dirname))
app.use('/course-content', express.static(__dirname + '/../course-content'))

app.listen(3000)
console.log('server listening on http://localhost:3000/')

