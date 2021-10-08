import * as THREE from "../libs/three.js/r131/three.module.js"

let renderer = null, scene = null, camera = null, HombroParte = null, brazoParte=null;

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update()
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );
}

/**
 * Creates a basic scene with lights, a camera, and 3 objects
 * @param {canvas} canvas The canvas element to render on
 */
function createScene(canvas)
{   
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);

    // Create a group to hold all the objects
   
    
    // Add a directional light to show off the objects
    const light = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);


    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    const ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    const textureUrl = "../images/checker_large.gif";
    const texture = new THREE.TextureLoader().load(textureUrl);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    
    // dat.GUI sliders
    const gui = new dat.GUI()

    //Grupos, el padre sera el brazo, el cual es el Hombro, despues el codo, antebrazo, muñeca y mano
    //Si se mueven el Hombro, todo lo demás se mueve
    const brazo = new THREE.Object3D;
    const codo = new THREE.Object3D;
    const antebrazo= new THREE.Object3D;
    const muñeca = new THREE.Object3D;
    const hand = new THREE.Object3D;

    // Geometrias de las partes del brazo
    // BoxGeometry(width : Float, height : Float, depth : Float)
    let geometry = new THREE.BoxGeometry(0.3,0.3 ,0.3);
    let brazogeomtry = new THREE.BoxGeometry(0.5,1 ,0.5);
    let muñecageomtry = new THREE.BoxGeometry(0.4,0.4,0.4);


    // partes de brazo y las articulaciones que son lo que une al brazo
    let HombroParte = new THREE.Mesh(geometry, material);

    let brazoParte =  new THREE.Mesh(brazogeomtry, material);
    
    let codoParte= new THREE.Mesh(geometry, material);
 
    let antebrazoParte= new THREE.Mesh(brazogeomtry, material);
 
    let muñecaParte= new THREE.Mesh(geometry, material);

    let manoParte= new THREE.Mesh(muñecageomtry, material);

    //Grafo del brazo
    //1. Se añade el joint del Hombro y el brazo al grupo
    brazo.add(HombroParte);
    brazo.add(brazoParte);
    brazo.position.set(0, 1, 2);
    brazoParte.position.set(0,-0.7,0)

    //2. Se añade el codo con el brazo
    brazo.add(codo)
    codo.add(codoParte)
    codo.position.set(0,-1.3,0)

    // 3. Se añade el codo con el antebrazo 
    codo.add(antebrazo)
    antebrazo.add(antebrazoParte)
    antebrazo.position.set(0,-0.65,0)

    // 4. Se añade al antebrazo la muñeca
    antebrazo.add(muñeca)
    muñeca.add(muñecaParte)
    muñeca.position.set(0,-0.65,0)
    
    //5. Se añade el la mano a la muñeca 
    muñeca.add(hand)
    hand.position.set(0,-.35,0)
    hand.add(manoParte)

    // Se agrega a la escena ya todo el brazo completo 
    scene.add(brazo);

    // La GUI con los sliders para mover brazo
    const brazoGUI = gui.addFolder('Robocop Region 4')
    brazoGUI.add(brazo.rotation, 'x', -Math.PI * 2, Math.PI * 2).name("Hombro X")// Rotacion Hombro en X

    brazoGUI.add(brazo.rotation, 'z', -Math.PI * 2, Math.PI * 2).name("Hombro z")// Rotacion Hombro en Z

    brazoGUI.add(codo.rotation, 'x', 0, 1.8).name("Codo Z") // Rotacion codo Z

    brazoGUI.add(antebrazo.rotation, 'y', 0, 1).name("Antebrazo Y")// Rotacion antebrazo

    brazoGUI.add(muñeca.rotation, 'x', 0,1.5).name("Muñeca X") // Rotacion muñeca

    brazoGUI.add(hand.rotation, 'x', -1,1).name("Mano X") // Rotacion mano X

    brazoGUI.add(hand.rotation, 'z', -1, 1).name("Mano Z") // Rotacion mano Z

    brazoGUI.open()
   
    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, brazo);

    brazo.updateMatrixWorld();
   
}

main()