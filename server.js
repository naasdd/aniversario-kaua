const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const { Obj, Snake, Apple, SocketUser } = require('./public/classes')
const { setInterval } = require('timers/promises')

app.use(express.static(path.join(__dirname + '/public')))
app.use(cors())

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

let socketConnectedUsers = []

let apples = [
    new Apple(200, 200, 20, 20, 'red'),
    new Apple(100, 200, 20, 20, 'red'),
    new Apple(400, 200, 20, 20, 'red')
]

let imagens = [
    './img/morte.png',
    './img/maca2.png',
    './img/bg-canvas2.png',
    './img/regua.jpg',
    './img/porra.HEIC',
    './img/vini.HEIC',
    './img/cachorro.jpg',
]

io.on('connection', socket => {
    console.log(`\n Conexão recebida com o id: ${socket.id}`)

    socketConnectedUsers.push(new SocketUser(0, 0, 20, 20, 'blue', socket.id))
    socket.broadcast.emit('userJoined', socketConnectedUsers)
    
    socket.emit('connectedUsers', socketConnectedUsers)
    socket.emit('socketUpdateApples', apples)

    socket.on('updatePlayer', (data) => {
        const pesquisa = socketConnectedUsers.findIndex(element => element.id == data.id)
            if(pesquisa !== -1){
                data.color = 'gray'
                socketConnectedUsers[pesquisa] = data
            }else{
                socketConnectedUsers.push(data)
            }


        socket.broadcast.emit('socketUpdate', socketConnectedUsers)
    })

    socket.on('updateApples', () => {
        socket.broadcast.emit('socketUpdateApples', apples)
    })

    socket.on('eatApple', (index) => {
        apples[index].respawnApple()
        console.log('maça comida')
        socket.broadcast.emit('socketUpdateApples', apples)
    })

    setInterval(() => {
        io.broadcast.emit('socketUpdateApples', apples)
    }, 200)


    socket.on('assustar', () => {
        let aleatorio = Math.floor(Math.random() * (imagens.length) + 1 )
        socket.broadcast.emit('assustou', (imagens[aleatorio]))
    })


    socket.on('disconnect', () => {
        console.log(`\n Conexão finalizada: ${socket.id}`)
        
        const pesquisa = socketConnectedUsers.findIndex(element => element.id == socket.id)
        if (pesquisa !== -1) {
            socketConnectedUsers.splice(pesquisa, 1)
        } else {
            console.log('não achou')
        }
        socket.broadcast.emit('clientDisconnected', socket.id)
    })
    
})


http.listen(3000, () => {
    console.log(`\nServiço rodando na porta 3000\n\n`)
})
