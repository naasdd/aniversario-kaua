let ctx = document.getElementById('ctx').getContext('2d')

var socket = io('http://192.168.0.181:3000') // Conectar com socket.io (multiplayer)
let user
let connectedUsers = []

socket.on('connect', () => {
    const playerId = socket.id
    console.log(`Conectado, seu id é ${playerId}`)
    user = new Snake(120, 120, 20, 20, 'green', playerId)

    setInterval(() => {
        socket.emit('updatePlayer', user)
        socket.emit('updateApples')
        
        ctx.clearRect(0, 0, 900, 600)
        main()
    }, 200)
})

let apples = []
let points = 0
let snakeTail = []
let direction, lastX, lastY

addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            direction = 'up'
            break
        case 's':
            direction = 'down'
            break
        case 'a':
            direction = 'left'
            break
        case 'd':
            direction = 'right'
            break
    }
})

function draw() {
    user.drawSnake(ctx)
    
    // Desenha maçãs ------
    for (let i = apples.length - 1; i >= 0; i--) {
        apples[i].drawApple()
    }

    // Desenha cauda ------
    for (let i = snakeTail.length - 1; i >= 0; i--) {
        if (i == 0) {
            snakeTail[i].x = lastX
            snakeTail[i].y = lastY
        } else {
            snakeTail[i].x = snakeTail[i - 1].x
            snakeTail[i].y = snakeTail[i - 1].y
        }
        snakeTail[i].drawSnake(ctx)
    }

    // for(i = connectedUsers.length -1; i >= 0; i--){
    //     console.log(connectedUsers[i])
    //     console.log('cacete')
    //     connectedUsers[i].drawSnake()
    // }
}

function att() {
    user.refreshSnake(direction)

    for (let i = apples.length - 1; i >= 0; i--) {
        if (user.checkCollision(apples[i])) {
            points++
            snakeTail.push(new Snake(120, 120, 20, 20, 'green'))
            socket.emit('eatApple', i)
            
            // apples[i].respawnApple()
        }
    }
}

function main() {
    lastX = user.x
    lastY = user.y
    att()
    draw()
}


// ~~~~~~~~~~~~~~~~~~~~~~~   PARTE SOCKET.IO   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

socket.on('connectedUsers', (users) => {
    console.log('Usuários conectados:', users)
    connectedUsers.push(users)
    // connectedUsers = users.map(user => new SocketUser(user.x, user.y, user.w, user.h, user.color, user.id))
})

socket.on('userJoined', (socketUser) => {
    const userCon = new SocketUser(0, 0, 20, 20, 'blue', socketUser)
    connectedUsers.push(userCon)
    console.log(`Entrou um perna de pau, ${JSON.stringify({connectedUsers },{raw: true})}`)
})

socket.on('socketUpdate', (data) => {
    for (let i = connectedUsers.length - 1; i >= 0; i--) {
        const localArray = connectedUsers[i]
        for(i = data.length -1; i >= 0; i--){
            const socketArray = data[i]
            if(localArray.id != user.id){
                localArray = socketArray
                // localArray.drawSnake()
                
            }
        };


        // if (connectedUsers[i].id == data.id) {
        //     connectedUsers[i].x = data.x
        //     connectedUsers[i].y = data.y
        // }
    }
})

socket.on('clientDisconnected', (data) => {
    connectedUsers = connectedUsers.filter(user => user.id !== data)
})

socket.on('socketUpdateApples', (data) => {
    apples = data.map(apple => new Apple(apple.x, apple.y, apple.w, apple.h, apple.color))
    // console.log(`data é ${data} \napples é ${apples}`)
})
