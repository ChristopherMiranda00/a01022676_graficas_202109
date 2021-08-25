//Referencias:
//https://xtrp.io/blog/2020/11/20/generating-the-sierpinski-triangle-in-vanilla-javascript-with-html5-canvas/

class triangle{
    // x,y = posicion del vertice inferior izquierdo del triangulo 
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    drawTriangle = (x,y, longLado,contexto) => {
    
        contexto.beginPath(); //crear path para dibujar
        contexto.moveTo(x,y); // moverse al vertice izquierdo del triangulo

        // Dibujar el Triangulo
        contexto.lineTo(x + longLado / 2, y - longLado * Math.sin(Math.PI / 3)); //dibujar linea del vertice izquierdo a la punta
        contexto.lineTo(x + longLado, y); //dibujar de la punta al vertice derecho de abajo
        contexto.lineTo(x, y); // terminar de dibujar triangulo, del lado derecho hacia el izquierdo de la base
        contexto.closePath();
        contexto.fill(); // llenar el triangulo\
    };

    sierTriangle = (x,y, longLado, repeticiones,contexto) => { //repeticiones = las veces recursivas de triangulos
        const longitudTrianguloAdentro = longLado / 2; //Longitud de los triangulso de adentro. Que es la mitad del largo del lado del triangulo de afuera
        //Posiciones usadas para dibujar el triangulo en drawTriangle
        const posicionTrianguloAdentro = [
            [x,y],
            [x + longitudTrianguloAdentro, y],
            [x + longitudTrianguloAdentro / 2, y - Math.sin(Math.PI / 3) * longitudTrianguloAdentro],
        ]; 

        if (repeticiones != 0) {  
            posicionTrianguloAdentro.forEach((posTriangulo) => {
            this.sierTriangle(posTriangulo[0],posTriangulo[1], longitudTrianguloAdentro, repeticiones - 1,contexto);
            });
        } else { //caso base
            this.drawTriangle(x,y, longLado,contexto);
        }
    };
}

export {triangle};