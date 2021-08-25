import {triangle} from './triangle.js'

function main()
{
    const canvas= document.getElementById("canvasTriangle");
    const contexto= canvas.getContext("2d");
    const t1 = new triangle()
    t1.sierTriangle(0,1000,1000,3, contexto);
}

main();