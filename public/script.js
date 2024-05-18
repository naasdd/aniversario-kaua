let ctx = document.getElementById('ctx').getContext('2d')

var socket = io('http://192.168.0.181:3000') //conectar com socket.io (multiplayer)
let user;

socket.on('connect', () => {
    console.log(`Conectado, seu id é ${socket.id}`);
    user = new Snake(120, 120, 20, 20, 'green', socket.id);

    setInterval(() => {
        ctx.clearRect(0, 0, 900, 600);
        main();
        socket.emit('updatePlayer', user);
    }, 200);
});




let apples = [
    new Apple(200, 200, 20, 20, 'red'),
    new Apple(100, 200, 20, 20, 'red'),
    new Apple(400, 200, 20, 20, 'red')
]

let points = 0
let snakeTail = []
let direction, lastX, lastY

addEventListener('keydown', (event) => {
    switch(event.key){
        case('w'):
            direction = 'up'
        break

        case('s'):
            direction = 'down'
            break

        case('a'):
            direction = 'left'
            break

        case('d'):
            direction = 'right'
            break
    }
})


function draw(){
    user.drawSnake()
    
    // Desenha maçãs ------
    for(i = apples.length - 1; i >= 0; i--){
        apples[i].drawApple()
    }

    // Desenha cauda ------
    for(i = snakeTail.length - 1; i >= 0; i--){
        // console.log(i)

        if(i == 0){
            snakeTail[i].x = lastX
            snakeTail[i].y = lastY
        }
        else{
            snakeTail[i].x = snakeTail[i-1].x
            snakeTail[i].y = snakeTail[i-1].y
        }
        snakeTail[i].drawSnake()
    }

    for(const atual of connectedUsers){
        atual.socketDrawSnake()
    }
    
}

function att(){
    user.refreshSnake()
    for(i = apples.length - 1; i >= 0; i--){
        if(user.checkCollision(apples[i])){
            points++
            snakeTail.push(new Snake(120, 120, 20, 20,'green'))
            apples[i].respawnApple()
        }
    }
    
}



function main(){
    lastX = user.x
    lastY = user.y
    att()
    draw()

    // console.log(`x = ${user.x}  y = ${user.y}  w = ${user.w}  h = ${user.h}  `)
}

for(i = apples.length - 1; i >= 0; i--){
    apples[i].respawnApple()
}




let connectedUsers = []

socket.on('connectedUsers', (users) => {
    console.log('Usuários conectados:', users);
    connectedUsers = users.map(user => new SocketUser(user.x, user.y, user.w, user.h, user.color, user.id));
});

socket.on('userJoined', (socketUser) => {
    const userCon = new SocketUser(0,0, 20, 20, 'blue', socketUser)
    connectedUsers.push(userCon)
})

socket.on('socketUpdate', (data) => {
    for(i = connectedUsers.length -1; i >= 0; i--){
        if(connectedUsers[i].id == data.id){
            connectedUsers[i].x = data.x
            connectedUsers[i].y = data.y
            connectedUsers[i].socketDrawSnake()
        }
    }
})




