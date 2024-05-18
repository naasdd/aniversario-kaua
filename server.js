const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')

app.use(express.static(path.join(__dirname + '/public')))
app.use(cors())

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

let socketConnectedUsers = []

io.on('connection', socket => {
    console.log(`\n Conexão recebida com o id: ${socket.id}`)
    
    // Envia a lista de usuários conectados para o novo usuário
    socket.emit('connectedUsers', socketConnectedUsers)

    socket.broadcast.emit('userJoined', socket.id)

    socket.on('updatePlayer', (data) => {
        // Atualiza ou adiciona o usuário na lista
        const userIndex = socketConnectedUsers.findIndex(user => user.id === data.id)
        if (userIndex !== -1) {
            socketConnectedUsers[userIndex] = data
        } else {
            socketConnectedUsers.push(data)
        }
        socket.broadcast.emit('socketUpdate', data)
    })

    socket.on('disconnect', () => {
        console.log(`\n Conexão finalizada: ${socket.id}`)
        
        // Remove o usuário da lista quando ele se desconecta
        socketConnectedUsers = socketConnectedUsers.filter(user => user.id !== socket.id)
    })
})

http.listen(3000, () => {
    console.log(`\nServiço rodando na porta 3000\n\n`)
})
