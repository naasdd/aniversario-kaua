const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static(path.join(__dirname + '/public')))

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

io.on('connect', socket => {
    socket.emit('')

})




app.listen(3000, () => {
    console.log(`\nServiço rodando na porta 3000\n\n`)
})