function main(){
    //Obtener referencias al API
    let canvas = document.getElementById("htmlCanvas");

    if(!canvas){
        console.log("Error al cargar el canvas...");
    }
    
    //Referencia al API, expone las funciones para poder dibujar
    let context = canvas.getContext("2d");

    let width = 500, height = 400;
    let x0 = width/2 -25, y0 = height/2 -25;
    let x1 = width/2 +25, y1 = height/2 +25;

    /* drawRect(context, "rgba(0,0,200,1.0)", x0,y0,x1,y1); */
    context.rect(x0,y0,50,50);
    context.fillStyle="rgba(0,0,200,1.0)"
    context.fill();

    // Mandar instrucciones al API para poder dibujar cosas 
}
main();