let ctx = document.getElementById('ctx').getContext('2d')
let user = new Snake(120, 120, 20, 20,'green')
let apple = new Apple(200, 200, 20, 20, 'red')
let points = 0
let snakeTail = []
let direction

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
    apple.drawApple()

    for(i = 0)
}

function att(){
    user.refreshSnake()
    if(user.checkCollision(apple)){
        points++
        console.log(points)
        apple.respawnApple(new Snake(120, 120, 20, 20,'green'))
        snakeTail.push()
    }
}

function main(){
    let lastX = user.x
    let lastY = user.y
    att()
    draw()
    // console.log(`x = ${user.x}  y = ${user.y}  w = ${user.w}  h = ${user.h}  `)
}

setInterval(() => {
    ctx.clearRect(0, 0, 900, 600)
    main()
}, 200);