//Tarea PONG 19/08/2021

import { bar } from './bar.js';
import { ball } from './ball.js';

let canvas = null, contexto = null;

function update(barraIzq, barraDer, bola)
{
    requestAnimationFrame(()=>update(barraIzq, barraDer, bola));

    contexto.clearRect(0, 0, canvas.width, canvas.height);

    barraIzq.update();
    barraDer.update();
    bola.update();

    barraIzq.draw(contexto);
    barraDer.draw(contexto);
    bola.draw(contexto);

    //Collider BarraIzq
    if (barraIzq.x < bola.x + bola.radio &&
        barraIzq.y < bola.y + bola.radio &&
        barraIzq.x + barraIzq.w > bola.x &&
        barraIzq.y + barraIzq.h > bola.y){
            bola.velx = - bola.velx
    }

    //Collider BarraDer
    if (barraDer.x < bola.x + bola.radio &&
        barraDer.y < bola.y + bola.radio &&
        barraDer.x + barraDer.w > bola.x &&
        barraDer.y + barraDer.h > bola.y){
            bola.velx = - bola.velx
    }
             
}

function main()
{
    canvas = document.getElementById('pongCanvas');
    contexto = canvas.getContext('2d');

    if(!contexto)
    {
        console.log("Error al iniciar el contexto");
    }

    let barraIzq = new bar(20, 50, 20, 50, 'green', 'q', 'a', 0, canvas.height);
    let barraDer = new bar(460, 100, 20, 50, 'red', 'o', 'l', 0, canvas.height);
    let bola = new ball(canvas.width/2, canvas.height/2, 8, 'white', 2.5, -2.5, 0, 0, canvas.height, canvas.width)

    update(barraIzq, barraDer, bola);
}

main();