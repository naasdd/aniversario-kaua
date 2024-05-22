let ctx = document.getElementById('ctx').getContext('2d')

let sts = document.getElementById('susto')

var socket = io('/') // Conectar com socket.io (multiplayer)
let user
let connectedUsers = []

socket.on('connect', () => {
    const playerId = socket.id
    console.log(`Conectado, seu id é ${playerId}`)
    user = new Snake(120, 120, 20, 20, 'green', playerId)

    setInterval(() => {
        
        ctx.clearRect(0, 0, 900, 600)
        main()
        socket.emit('updatePlayer', user)
        socket.emit('updateApples')
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
        case 'k':
            assustar()
            break
    }
})

function draw() {
    user.drawSnake(ctx)

    for(i = connectedUsers.length -1; i >= 0; i--){
        if(connectedUsers[i].id != user.id){

            sktDrawSnake(connectedUsers[i])
        }
    }
    
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

    
}

function att() {
    user.refreshSnake(direction)

    for (let i = apples.length - 1; i >= 0; i--) {
        if (user.checkCollision(apples[i])) {
            points++
            snakeTail.push(new Snake(120, 120, 20, 20, 'green'))
            socket.emit('eatApple', i)
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
    connectedUsers = users
})

socket.on('userJoined', (data) => {
    // sktDrawSnake(data)
})

socket.on('socketUpdate', (data) => {
    for(i = data.length -1; i >= 0; i--){
        connectedUsers = data
    }
})

socket.on('clientDisconnected', (data) => {
    connectedUsers = connectedUsers.filter(user => user.id !== data)
})

socket.on('socketUpdateApples', (data) => {
    apples = data.map(apple => new Apple(apple.x, apple.y, apple.w, apple.h, apple.color))
})


function sktDrawSnake(data){
    ctx.fillStyle = data.color
    ctx.fillRect(data.x, data.y, data.w, data.h)
}

function assustar(){
    socket.emit('assustar')
}

socket.on('assustou', info => {
    sts.src = info
    sts.style.display = 'block'
    setTimeout(() => {
        sts.style.display = 'none'
    }, 2000);
})