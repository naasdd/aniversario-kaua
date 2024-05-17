class Obj{
    constructor(x, y, w, h, color){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color
    }
}

class Snake extends Obj{
    drawSnake(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }

    refreshSnake(){
        switch (direction){
            case('up'):
                this.y -= this.h

            break
            case('down'):
                this.y += this.h


            break
            case('left'):
                this.x -= this.w


            break
            case('right'):
                this.x += this.w


            break
        }


        if (this.x <= 0) {
            this.x = 0
        }
        else if (this.x >= 900 - this.w) {
            this.x = 900 - this.w
        }

        if (this.y <= 0) {
                this.y = 0
            }
        else if (this.y >= 600 - this.h) {
                this.y = 600 - this.h
            }
    }

    checkCollision(reference){
        if(this.x < reference.x + reference.w &&
            this.x + this.w > reference.x &&
            this.y < reference.y + reference.h &&
            this.y + this.h > reference.y
        ){
                return true
            }
        else{
            return false
        }
    }
}

class Apple extends Obj{
    drawApple(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }

    respawnApple(){
        let randomNumber = null
        do {
            randomNumber = Math.floor(Math.random() * (900 - this.w) +1);
        } 
        while (randomNumber % 20 !== 0)
        do {
            randomNumber = Math.floor(Math.random() * (600 - this.h)+ 1);
        } 
        while (randomNumber % 20 !== 0)
            
        this.y = randomNumber
        this.x = randomNumber
        this.checkAppleRespawnPosition()
    }

    checkAppleRespawnPosition(){
        return true
    }
}