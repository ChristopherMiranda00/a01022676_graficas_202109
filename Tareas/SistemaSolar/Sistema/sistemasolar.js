import * as THREE from "../libs/three.js/r131/three.module.js";
import { OrbitControls } from '../libs/three.js/r131/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three.js/r131/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/r131/loaders/MTLLoader.js';

//OBJ y MTL Asteroide 
let objMtlModelUrl = {obj:'../models/Asteroid_2_LOW_MODEL_.obj', 
mtl:'../models/Asteroid_2_LOW_MODEL_.mtl'};

let renderer = null, scene = null, camera = null,root = null, orbitControls = null,objectList = [];

//Grupos de Planetas 
let solGroup = null,mercurioGroup = null,venusGroup = null,
    tierraGroup = null,marteGroup = null,jupiterGroup = null,
    saturnogroup = null,uranogroup = null,neptunogroup = null,
    plutongroup = null;

//Planetas
let sol = null,mercurio = null,venus = null,
    tierra = null,marte = null,jupiter = null,
    saturno = null,anillo = null,urano = null,
    neptuno  = null,geometry = null,pluton = null,
    asteroid = null;

// Grupo de Lunas de Plantas
let lunastierraGroup = null,lunasmarteGroup = null, 
    lunasjupiterGroup = null,lunassaturnogroup = null,
    lunasuranogroup = null,lunasneptunogroup = null;

//Grupo de Asteroides
let asteroidesgroup = null;

//Lunas de Planeetas
let luna = null, //Nuestra luna xd
    lunaMarte1 = null,lunaMarte2 = null,
    lunaJupiter1 = null,lunaJupiter2 = null,lunaJupiter3 = null,lunaJupiter4 = null,
    lunaSaturno1 = null,lunaSaturno2 = null,lunaSaturno3 = null,lunaSaturno4 = null,
    lunaUrano1 = null,lunaUrano2 = null,lunaUrano3 = null,lunaUrano4 = null,
    lunaNeptuno1 = null,lunaNeptuno2 = null;

let duration = 10000; // ms
let currentTime = Date.now();

//Maps y Bump Maps
//Maps sol
let bumpMapSol = null, textureMap = null;
//Maps mercurio
let bumpMapMercurio = null, textureMap1 = null;
//Maps venus
let bumpMapVenus = null, textureMap2 = null;
//Maps tierra
let bumpMapTierra = null, textureMap3 = null;
//Maps nuestra luna
let lunabumpMap = null, lunatextureMap = null;
//Maps marte
let bumpMapMarte = null, textureMap4 = null;
//Maps jupiter
let bumpMapJupiter = null, textureMap5 = null;
//Maps saturno
let bumpMapSaturno = null, textureMap6 = null;
//Anillo Saturno
let textureMapAnillo = null;
//Maps urano
let bumpMapUrano = null, textureMap7 = null;
//Maps neptuno
let bumpMapNeptuno = null, textureMap8 = null;
//Maps ppluton
let bumpMapPluton = null, textureMap9 = null;

//Textures y Bump Maps URLs
let materials = {};
let mapSunUrl = "../images/sun_texture.jpg";
let bumpmapSunUrl = "../images/moon_bump.jpg";

let mapMercurioUrl = "../images/mercurymap.jpg";
let bumpmapMercurioUrl = "../images/mercurybump.jpg";

let mapVenusUrl = "../images/venusmap.jpg";
let bumpmapVenusUrl = "../images/venusbump.jpg";

let mapTierraUrl = "../images/earthmap1k.jpg";
let bumpmapTierraUrl = "../images/earthbump1k.jpg";

let mapLunaUrl = "../images/moon_1024.jpg";
let bumpmapLunaUrl = "../images/moon_bump.jpg";

let mapMarteUrl = "../images/marsmap1k.jpg";
let bumpmapMarteUrl = "../images/marsbump1k.jpg";

let mapJupiterUrl = "../images/jupitermap.jpg";
let bumpmapJupiterUrl = "../images/jupiterbump.jpg";

let mapSaturnoUrl = "../images/saturnmap.jpg";
let bumpmapSaturnoUrl = "../images/saturnbump.jpg";
let mapAnilloSaturnoUrl = "../images/saturnringcolor.jpg";

let mapUranoUrl = "../images/uranusmap.jpg";
let bumpmapUranoUrl = "../images/moon_bump.jpg";

let mapNeptunoUrl = "../images/neptunemap.jpg";
let bumpmapNeptunoUrl = "../images/neptunebump.jpg";

let mapPlutonUrl = "../images/plutomap1k.jpg";
let bumpmapPlutonUrl = "../images/plutobump1k.jpg";      

function main()
{
    var canvas = document.getElementById("webglcanvas");

    // create the scene
    createScene(canvas);

    // Run the run loop
    run();
}

function animate() 
{

    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    for(const object of objectList)
        if(object){
            object.rotation.y += angle / 30;
        }

    //Rotaciones de Planetas
    sol.rotation.y += angle;
    mercurio.rotation.y += angle;
    venus.rotation.y += angle;
    tierra.rotation.y += angle;
    marte.rotation.y += angle;
    jupiter.rotation.y += angle;
    saturno.rotation.y += angle;
    anillo.rotation.z += angle;
    urano.rotation.y += angle;
    neptuno.rotation.y += angle;
    pluton.rotation.y += angle;

    //Rotación en Orbita
    mercurioGroup.rotation.y +=angle/6;
    venusGroup.rotation.y +=angle/6.5;
    tierraGroup.rotation.y +=angle/7;
    marteGroup.rotation.y +=angle/7.5;
    jupiterGroup.rotation.y +=angle/8;
    saturnogroup.rotation.y +=angle/5.5;
    uranogroup.rotation.y +=angle/14.8;
    neptunogroup.rotation.y +=angle/11.3;
    plutongroup.rotation.y +=angle/10.3;
    lunastierraGroup.rotation.y +=angle/2;
    luna.rotation.y +=angle/4;
    lunasmarteGroup.rotation.y += angle/2;
    lunaMarte1.rotation.y += angle/4
    lunaMarte2.rotation.y += angle/4
    lunasjupiterGroup.rotation.y += angle/2;
    lunaJupiter1.rotation.y += angle;
    lunaJupiter2.rotation.y += angle;
    lunaJupiter3.rotation.y += angle;
    lunaJupiter4.rotation.y += angle;
    lunassaturnogroup.rotation.y += angle/2;
    lunaSaturno1.rotation.y += angle;
    lunaSaturno2.rotation.y += angle;
    lunaSaturno3.rotation.y += angle;
    lunaSaturno4.rotation.y += angle;
    lunasuranogroup.rotation.y += angle/2;
    lunaUrano1.rotation.y += angle;
    lunaUrano2.rotation.y += angle;
    lunaUrano3.rotation.y += angle;
    lunaUrano4.rotation.y += angle;
    lunasneptunogroup.rotation.y += angle/2;
    lunaNeptuno2.rotation.y += angle;
    lunaNeptuno1.rotation.y += angle;

}

function run() 
{
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total *100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

async function loadObjMtl(objModelUrl, objectList)
{
    try
    {
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        const mat = await mtlLoader.loadAsync(objModelUrl.mtl, onProgress, onError);
        objLoader.setMaterials(mat);
        mat.preload();
        const asteroide = await objLoader.loadAsync(objModelUrl.obj, onProgress, onError);
        
        //Creacione de Asteroides
        for (var i = 0; i<100; i++){
            asteroid = asteroide.clone()

            var asteroidOrbit = getRandomArbitrary( 8.8, 9.2);
            var asteroidPositionY = getRandomArbitrary(-.2, .2);

            asteroid.position.y = asteroidPositionY;
            asteroid.scale.set(getRandomArbitrary(0.02, 0.06), getRandomArbitrary(0.03, 0.05), getRandomArbitrary(0.01,0.04));

            var radians = getRandomArbitrary(0, 360) * Math.PI / 180;

            asteroid.position.x = Math.cos(radians) * asteroidOrbit;
            asteroid.position.z = Math.sin(radians) * asteroidOrbit;

            asteroidesgroup = new THREE.Object3D;
            asteroidesgroup.position.set(0, 0, 0);
            asteroidesgroup.add( asteroid )

            solGroup.add(asteroidesgroup)
            objectList.push(asteroidesgroup);
        }
        
    }
    catch (err)
    {
        onError(err);
    }
}

function createMaterials()
{
    //Materiales de Planetas
    //Sol 
    textureMap = new THREE.TextureLoader().load(mapSunUrl);
    bumpMapSol = new THREE.TextureLoader().load(bumpmapSunUrl);
    materials["sol"] = new THREE.MeshPhongMaterial({map: textureMap,lightMap: textureMap, //Para que emita Luz
        bumpMapSol: bumpMapSol, bumpScale: 0.02});

    //Mercurio
    textureMap1 = new THREE.TextureLoader().load(mapMercurioUrl);
    bumpMapMercurio = new THREE.TextureLoader().load(bumpmapMercurioUrl);
    materials["mercurio"] = new THREE.MeshPhongMaterial({map: textureMap1, bumpMapSol: bumpMapMercurio, bumpScale: 0.06});

    //Venus
    textureMap2 = new THREE.TextureLoader().load(mapVenusUrl);
    bumpMapVenus = new THREE.TextureLoader().load(bumpmapVenusUrl);
    materials["venus"] = new THREE.MeshPhongMaterial({map: textureMap2, bumpMapSol: bumpMapVenus, bumpScale: 0.06});

    //Tierra
    textureMap3 = new THREE.TextureLoader().load(mapTierraUrl);
    bumpMapTierra = new THREE.TextureLoader().load(bumpmapTierraUrl);
    materials["tierra"] = new THREE.MeshPhongMaterial({map: textureMap3, bumpMapSol: bumpMapTierra, bumpScale: 0.06});

    //Luna Tierra
    lunatextureMap = new THREE.TextureLoader().load(mapLunaUrl);
    lunabumpMap = new THREE.TextureLoader().load(bumpmapLunaUrl);
    materials["luna"] = new THREE.MeshPhongMaterial({map: lunatextureMap, bumpMapSol: lunabumpMap, bumpScale: 0.06});

    //Marte
    textureMap4 = new THREE.TextureLoader().load(mapMarteUrl);
    bumpMapMarte = new THREE.TextureLoader().load(bumpmapMarteUrl);
    materials["marte"] = new THREE.MeshPhongMaterial({map: textureMap4, bumpMapSol: bumpMapMarte, bumpScale: 0.3});

    //Jupiter
    textureMap5 = new THREE.TextureLoader().load(mapJupiterUrl);
    bumpMapJupiter = new THREE.TextureLoader().load(bumpmapJupiterUrl);
    materials["jupiter"] = new THREE.MeshPhongMaterial({map: textureMap5, bumpMapSol: bumpMapJupiter, bumpScale: 0.03});

    //Saturno
    textureMap6 = new THREE.TextureLoader().load(mapSaturnoUrl);
    bumpMapSaturno = new THREE.TextureLoader().load(bumpmapSaturnoUrl);
    materials["saturno"] = new THREE.MeshPhongMaterial({map: textureMap6,  bumpMapSol: bumpMapSaturno, bumpScale: 0.2});

    //Saturno Anillo
    textureMapAnillo = new THREE.TextureLoader().load(mapAnilloSaturnoUrl);
    materials["saturno-anillo"] = new THREE.MeshPhongMaterial({map: textureMapAnillo});

    //Urano
    textureMap7 = new THREE.TextureLoader().load(mapUranoUrl);
    bumpMapUrano = new THREE.TextureLoader().load(bumpmapUranoUrl);
    materials["urano"] = new THREE.MeshPhongMaterial({map: textureMap7, bumpMapSol: bumpMapUrano, bumpScale: 0.1});

    //Neptuno
    textureMap8 = new THREE.TextureLoader().load(mapNeptunoUrl);
    bumpMapNeptuno = new THREE.TextureLoader().load(bumpmapNeptunoUrl);
    materials["neptuno"] = new THREE.MeshPhongMaterial({map: textureMap8, bumpMapSol: bumpMapNeptuno, bumpScale: 0.1});

    //Pluton
    textureMap9 = new THREE.TextureLoader().load(mapPlutonUrl);
    bumpMapPluton = new THREE.TextureLoader().load(bumpmapPlutonUrl);
    materials["pluton"] = new THREE.MeshPhongMaterial({map: textureMap9, bumpMapSol: bumpMapPluton, bumpScale: 0.06});
}

function createScene(canvas) 
{    
    loadObjMtl(objMtlModelUrl, objectList);

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color (0.0, 0.0, 0.0 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 400 );
    camera.position.z =10;
    camera.position.y = 5;
    camera.position.x = 10;
    scene.add(camera);

    //Orbit Controller
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0,0,0);

    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    const pointLight = new THREE.PointLight( 0xffccaa, 2 , 1000 ); //Luz que sale a todos lados (el sol)
    pointLight.position.set( 0, 0, 0 );
    scene.add( pointLight );

    // Create all the materials
    createMaterials();
    
    // Create the sphere geometry
    //Sol 
    geometry = new THREE.SphereGeometry(1, 20, 20);
    sol = new THREE.Mesh(geometry, materials["sol"]);
    sol.position.set(0, 0, 0);
    solGroup = new THREE.Object3D;
    solGroup.position.set(0, 0, 0);
    solGroup.add( sol );
    scene.add (solGroup)

    //Orbita de Mercurio
    geometry = new THREE.TorusGeometry( 2, .005, 2, 100 );
    const material = new THREE.MeshBasicMaterial( { color: "yellow" } ); //le cambie el color y me gusto en amarillo :)
    const orbitamercurio = new THREE.Mesh( geometry, material );
    orbitamercurio.rotation.x = Math.PI / 2;
    scene.add( orbitamercurio );
    
    //Mercurio
    geometry = new THREE.SphereGeometry( .2, 20, 20 );
    mercurio = new THREE.Mesh( geometry, materials["mercurio"] );
    mercurio.position.set(2, 0, 0);
    mercurioGroup = new THREE.Object3D;
    mercurioGroup.position.set(0, 0, 0);
    mercurioGroup.add( mercurio)
    solGroup.add(mercurioGroup)

    //Orbita de Venus
    geometry = new THREE.TorusGeometry( 4, .005, 2, 100 );
    const orbitavenus= new THREE.Mesh( geometry, material );
    orbitavenus.rotation.x = Math.PI / 2;
    scene.add( orbitavenus );

    //Venus
    geometry = new THREE.SphereGeometry( .25, 20, 20 );
    venus = new THREE.Mesh( geometry, materials["venus"] );
    venus.position.set(4, 0, 0);
    venusGroup = new THREE.Object3D;
    venusGroup.position.set(0, 0, 0);
    venusGroup.add( venus)
    solGroup.add(venusGroup)

    //Orbita Tierra
    geometry = new THREE.TorusGeometry( 6, .005, 2, 100 );
    const orbitatierra= new THREE.Mesh( geometry, material );
    orbitatierra.rotation.x = Math.PI / 2;
    scene.add( orbitatierra );

    //Tierra
    geometry = new THREE.SphereGeometry( .3, 20, 20 );
    tierra = new THREE.Mesh( geometry, materials["tierra"] );
    tierra.position.set(6, 0, 0);
    tierraGroup = new THREE.Object3D;
    tierraGroup.position.set(0, 0, 0);
    tierraGroup.add(tierra )
    solGroup.add(tierraGroup)

    //Nuesta Luna
    geometry = new THREE.SphereGeometry( .1, 10, 10 );
    luna = new THREE.Mesh( geometry, materials["luna"] );
    luna.position.set(.5, .3, 0);
    lunastierraGroup = new THREE.Object3D;
    lunastierraGroup.position.set(6, 0, 0);
    lunastierraGroup.add( luna )
    tierraGroup.add( lunastierraGroup)
    
    //Orbita de Marte
    geometry = new THREE.TorusGeometry( 8, .005, 2, 100 );
    const orbitamarte= new THREE.Mesh( geometry, material );
    orbitamarte.rotation.x = Math.PI / 2;
    scene.add( orbitamarte );

    //Marte
    geometry = new THREE.SphereGeometry( .15, 20, 20 );
    marte = new THREE.Mesh( geometry, materials["marte"] );
    marte.position.set(8, 0, 0);
    marteGroup = new THREE.Object3D;
    marteGroup.position.set(0, 0, 0);
    marteGroup.add( marte )
    solGroup.add(marteGroup)
        //--Lunas de Marte
        //lunaMarte1
        geometry = new THREE.SphereGeometry( .06, 10, 10 );
        lunaMarte1 = new THREE.Mesh( geometry, materials["luna"] );
        lunaMarte1.position.set(.3, .3, 0);
        lunasmarteGroup = new THREE.Object3D;
        lunasmarteGroup.position.set(8, 0, 0);
        lunasmarteGroup.add( lunaMarte1 )
        marteGroup.add( lunasmarteGroup)
        //lunaMarte2
        geometry = new THREE.SphereGeometry( .06, 10, 10 );
        lunaMarte2 = new THREE.Mesh( geometry, materials["luna"] );
        lunaMarte2.position.set(-.2, .4, .1);
        lunasmarteGroup.add( lunaMarte2 )

    //Orbita de Jupiter
    geometry = new THREE.TorusGeometry(10 , .005, 2, 100 );
    const orbitajupiter= new THREE.Mesh( geometry, material );
    orbitajupiter.rotation.x = Math.PI / 2;
    scene.add( orbitajupiter );
    //Jupiter
    geometry = new THREE.SphereGeometry( .5, 20, 20 );
    jupiter = new THREE.Mesh( geometry, materials["jupiter"] );
    jupiter.position.set(10, 0, 0);
    jupiterGroup = new THREE.Object3D;
    jupiterGroup.position.set(0, 0, 0);
    jupiterGroup.add( jupiter )
    solGroup.add(jupiterGroup)
    //Lunas de Jupiter
        //lunaJupiter1
        geometry = new THREE.SphereGeometry( .1, 10, 10 );
        lunaJupiter1 = new THREE.Mesh( geometry, materials["luna"] );
        lunaJupiter1.position.set(-.5, .4, .3);
        lunasjupiterGroup = new THREE.Object3D;
        lunasjupiterGroup.position.set(10, 0, 0);
        lunasjupiterGroup.add( lunaJupiter1 )
        jupiterGroup.add( lunasjupiterGroup)
        //lunaJupiter2
        geometry = new THREE.SphereGeometry( .1, 10, 10 );
        lunaJupiter2 = new THREE.Mesh( geometry, materials["luna"] );
        lunaJupiter2.position.set(.2, -.3, -.5);
        lunasjupiterGroup.add( lunaJupiter2 )
        //lunaJupiter3
        geometry = new THREE.SphereGeometry( .1, 10, 10 );
        lunaJupiter3 = new THREE.Mesh( geometry, materials["luna"] );
        lunaJupiter3.position.set(-.4, .4, -.3);
        lunasjupiterGroup.add( lunaJupiter3 )
        //lunaJupiter4
        geometry = new THREE.SphereGeometry( .1, 10, 10 );
        lunaJupiter4 = new THREE.Mesh( geometry, materials["luna"] );
        lunaJupiter4.position.set(.4, .2, .5);
        lunasjupiterGroup.add( lunaJupiter4 )

    //Orbita de Saturno
    geometry = new THREE.TorusGeometry(12 , .005, 2, 100 );
    const orbitasaturno= new THREE.Mesh( geometry, material );
    orbitasaturno.rotation.x = Math.PI / 2;
    scene.add( orbitasaturno );
    //Saturno
    geometry = new THREE.SphereGeometry( .5, 20, 20 );
    saturno = new THREE.Mesh( geometry, materials["saturno"] );
    saturno.position.set(12, 0, 0);
    saturnogroup = new THREE.Object3D;
    saturnogroup.position.set(0, 0, 0);
    saturnogroup.add( saturno )
    solGroup.add(saturnogroup)
    //Anillo de Saturno
    geometry = new THREE.TorusGeometry( .7, .15, 2, 100 );
    anillo = new THREE.Mesh( geometry, materials["saturno-anillo"] );
    anillo.rotation.x = 2;
    anillo.position.set(12, 0, 0);
    saturnogroup.add( anillo );
    //Lunas de Saturno
        //lunaSaturno1
        geometry = new THREE.SphereGeometry( .1, 10, 10 );
        lunaSaturno1 = new THREE.Mesh( geometry, materials["luna"] );
        lunaSaturno1.position.set(.6, -.3, .5);
        lunassaturnogroup = new THREE.Object3D;
        lunassaturnogroup.position.set(12, 0, 0);
        lunassaturnogroup.add( lunaSaturno1 )
        saturnogroup.add( lunassaturnogroup)
        //lunaSaturno2
        geometry = new THREE.SphereGeometry( .1, 10, 10 );
        lunaSaturno2 = new THREE.Mesh( geometry, materials["luna"] );
        lunaSaturno2.position.set(.7, .3, .9);
        lunassaturnogroup.add( lunaSaturno2 )
        //lunaSaturno3
        geometry = new THREE.SphereGeometry( .1, 10, 10 );
        lunaSaturno3 = new THREE.Mesh( geometry, materials["luna"] );
        lunaSaturno3.position.set(-.7, .2, -.8);
        lunassaturnogroup.add( lunaSaturno3 )
        //lunaSaturno4
        geometry = new THREE.SphereGeometry( .1, 10, 10 );
        lunaSaturno4 = new THREE.Mesh( geometry, materials["luna"] );
        lunaSaturno4.position.set(-.5, .2, .9);
        lunassaturnogroup.add( lunaSaturno4 )

    //Orbita de Urano
    geometry = new THREE.TorusGeometry( 14, .005, 2, 100 );
    const orbitaurano= new THREE.Mesh( geometry, material );
    orbitaurano.rotation.x = Math.PI / 2;
    scene.add( orbitaurano );
    //Urano
    geometry = new THREE.SphereGeometry( .35, 20, 20 );
    urano = new THREE.Mesh( geometry, materials["urano"] );
    urano.position.set(14, 0, 0);
    uranogroup = new THREE.Object3D;
    uranogroup.position.set(0, 0, 0);
    uranogroup.add( urano )
    solGroup.add(uranogroup)
    //Lunas de Urano
        //lunaUrano1
        geometry = new THREE.SphereGeometry( .07, 10, 10 );
        lunaUrano1 = new THREE.Mesh( geometry, materials["luna"] );
        lunaUrano1.position.set(.5, -.1, .3);
        lunasuranogroup = new THREE.Object3D;
        lunasuranogroup.position.set(14, 0, 0);
        lunasuranogroup.add( lunaUrano1 )
        uranogroup.add( lunasuranogroup)
        //lunaUrano2
        geometry = new THREE.SphereGeometry( .07, 10, 10 );
        lunaUrano2 = new THREE.Mesh( geometry, materials["luna"] );
        lunaUrano2.position.set(.3, -.1, .3);
        lunasuranogroup.add( lunaUrano2 )
        //lunaUrano3
        geometry = new THREE.SphereGeometry( .07, 10, 10 );
        lunaUrano3 = new THREE.Mesh( geometry, materials["luna"] );
        lunaUrano3.position.set(-.4, .5, .5);
        lunasuranogroup.add( lunaUrano3 )
        //lunaUrano4
        geometry = new THREE.SphereGeometry( .07, 10, 10 );
        lunaUrano4 = new THREE.Mesh( geometry, materials["luna"] );
        lunaUrano4.position.set(.4, .6, -.3);
        lunasuranogroup.add( lunaUrano4 )

    //Orbita de Neptuno
    geometry = new THREE.TorusGeometry(16 ,.005, 2, 100 );
    const orbitaneptuno= new THREE.Mesh( geometry, material );
    orbitaneptuno.rotation.x = Math.PI / 2;
    scene.add( orbitaneptuno );
    //Neptuno
    geometry = new THREE.SphereGeometry( .35, 20, 20 );
    neptuno= new THREE.Mesh( geometry, materials["neptuno"] );
    neptuno.position.set(16, 0, 0);
    neptunogroup = new THREE.Object3D;
    neptunogroup.position.set(0, 0, 0);
    neptunogroup.add( neptuno )
    solGroup.add(neptunogroup)
        //Lunas de Neptuno
        //lunaNeptuno1
        geometry = new THREE.SphereGeometry( .1, 10, 10 );
        lunaNeptuno1 = new THREE.Mesh( geometry, materials["luna"] );
        lunaNeptuno1.position.set(.3, .3, .3);
        lunasneptunogroup = new THREE.Object3D;
        lunasneptunogroup.position.set(16, 0, 0);
        lunasneptunogroup.add( lunaNeptuno1 )
        neptunogroup.add( lunasneptunogroup)
        //lunaNeptuno2
        geometry = new THREE.SphereGeometry( .1, 10, 10 );
        lunaNeptuno2 = new THREE.Mesh( geometry, materials["luna"] );
        lunaNeptuno2.position.set(.3, .3, -.3);
        lunasneptunogroup.add( lunaNeptuno2 )

    //Orbita de Pluton
    geometry = new THREE.TorusGeometry( 18, .003, 2, 100 );
    const orbitapluton= new THREE.Mesh( geometry, material );
    orbitapluton.rotation.x = Math.PI / 2;
    scene.add( orbitapluton );
    //Pluton
    geometry = new THREE.SphereGeometry( .2, 20, 20 );
    pluton = new THREE.Mesh( geometry, materials["pluton"] );
    pluton.position.set(18, 0, 0);
    plutongroup = new THREE.Object3D;
    plutongroup.position.set(0, 0, 0);
    plutongroup.add( pluton )
    solGroup.add(plutongroup)

    scene.add( root );

}

main();

/* References
https://jsfiddle.net/prisoner849/a2ogz9vx/
https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.lightMap
https://threejs.org/docs/#api/en/lights/PointLight
https://threejs.org/docs/#api/en/geometries/TorusGeometry
*/