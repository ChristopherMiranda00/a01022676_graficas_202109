//Referencias para los rebotes
//https://developer.mozilla.org/es/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls

class ball
{
    constructor(x, y, radio, color,velx, vely, minY, minX, maxY, maxX)
    {
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.color = color;
        
        this.vely = vely;
        this.velx = velx; 

        this.minY = minY;
        this.minX = minX;
        this.maxY = maxY; //canvas.height
        this.maxX = maxX; //canvas.width
    }

    draw(contexto)
    {
        contexto.fillStyle = this.color;
        contexto.beginPath();
        contexto.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        contexto.fill();
    }

    update()
    {
        //Rebotes 
        if(this.y + this.vely > (this.maxY - this.radio) 
            || this.y + this.vely < this.radio){

            this.vely = - this.vely
        }

        if(this.x + this.velx > (this.maxX - this.radio) || this.x + this.velx < this.radio){
            this.velx = -this.velx
        }

        this.y += this.vely
        this.x += this.velx
    }
}

export { ball };