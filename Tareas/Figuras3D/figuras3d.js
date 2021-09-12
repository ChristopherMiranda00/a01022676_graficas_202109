import * as shaderUtils from '../common/shaderUtils.js'
const mat4 = glMatrix.mat4;

let projectionMatrix;

let shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

const duration = 10000; // ms

//Movimiento de Arriba a abajo en Y para el octa
let posY=0;
let mov=0;
let size=0;

// in: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.

const vertexShaderSource = `#version 300 es

        in vec3 vertexPos; // Vertex from the buffer
        in vec4 vertexColor;

        out vec4 color;

        uniform mat4 modelViewMatrix; // Object's position
        uniform mat4 projectionMatrix; // Camera's position

        void main(void) {
    		// Return the transformed and projected vertex value
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
            color = vertexColor * 0.8;
        }`;

const fragmentShaderSource = `#version 300 es

        precision mediump float;
        in vec4 color;
        out vec4 fragColor;

        void main(void) {
        fragColor = color;
    }`;

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    const gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initGL(canvas);
    
    //Figuras
    let scu = createScu(gl, [-2.7 , 0, -2], [1.0, 1.0, 0.2]);
    let dode = createDode(gl, [1, 0, -2], [-4, 1, 1]);
    let octa = createOcta(gl, [4, 0, -2], [0, 1, 0]);

    const shaderProgram = shaderUtils.initShader(gl, vertexShaderSource, fragmentShaderSource);
    bindShaderAttributes(gl, shaderProgram);

    update(gl, shaderProgram, [scu,dode,octa]);
}

function initWebGL(canvas)
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";
    try {
        gl = canvas.getContext("webgl2");
    } 
    catch (e) {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl) {
        throw new Error(msg);
    }

    return gl;        
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}


//Modelo usado: https://www.geogebra.org/m/wMCYtgcY
function createDode(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //60 vertices
    let verts = [
        /* Puntos:
        A(0.80, 0.80, 0.80)
        B(0.80, 0.80, -0.80)
        C(0.80, -0.80, 0.80)
        D(0.80, -0.80,-0.80)
        E(-0.80, 0.80, 0.80)
        F(-0.80, 0.80, -0.80)
        G(-0.80, -0.80, 0.80)
        H(-0.80, -0.80, -0.80)
        I(0, 0.5, 1.3)
        J(0, 0.5, -1.3)
        K(0,-0.5, -1.3)
        L(0, 0.5, 1.3)
        M(0.5, 1.3, 0)
        N(-0.5,1.3, 0)
        O(0.5,-1.3, 0)
        P(-0.5,-1.3, 0)
        Q(1.3, 0, 0.5)
        R(-1.3, 0, 0.5)
        S(1.3, 0, -0.5)
        T(-1.3, 0, -0.5) */

        //Cara ABMQS
        0.80, 0.80,0.80, //Indx:0
        0.80,0.80,-0.80, //Indx:1
        0.5,1.30,0, //Indx:2
        1.30,0,0.5, //Indx:3
        1.30,0,-0.5, //Indx:4

        //Cara ACILQ
        0.80,0.80,0.80, //Indx:5
        .80,-.80,0.80, //Indx:6
        0,0.5,1.30, //Indx:7
        0,-0.5,1.3, //Indx:8
        1.3,0,0.5, //Indx:9

        //Cara CDQSO   
         0.8,-0.8,0.8, //Indx:10
        0.8,-0.8,-0.8, //Indx:11
        0.5,-1.3,0,  //Indx:12
        1.3,0,0.5, //Indx:13
        1.3,0,-0.5, //Indx:14

        //Cara BDJKS     
        0.8,0.8,-0.8, //Indx:15
        0.8,-0.8,-0.8, //Indx:16
        0,0.5,-1.3, //Indx:17
        0,-0.5,-1.3, //Indx:18
        1.3,0,-0.5, //Indx:19

        //Cara BJFMN
        0.8,0.8,-0.8, //Indx:20
        -0.8,0.8,-0.8, //Indx:21
        0,0.5,-1.3, //Indx:22
        0.5,1.3,0, //Indx:23
        -0.5,1.3,0, //Indx:24

        //Cara AEIMN
        0.8,0.8,0.8, //Indx:25
        -0.8,0.8,0.8, //Indx:26
        0,0.5,1.3, //Indx:27
        0.5,1.3,0, //Indx:28
        -0.5,1.3,0, //Indx:29

        //Cara GHIPR
        -0.8,-0.8,0.8, //Indx:30
        -0.8,-0.8,-0.8, //Indx:31
        -0.5,-1.3,0, //Indx:32
        -1.3,0,0.5, //Indx:33
        -1.3,0,-0.5, //Indx:34

        //Cara CGLOP
        0.8,-0.8,0.8, //Indx:35
        -0.8,-0.8,0.8, //Indx:36
        0,-0.5,1.3, //Indx:37
        0.5,-1.3,0, //Indx:38
        -0.5,-1.3,0, //Indx:39

        //Cara DHKOP
        0.8,-0.8,-0.8, //Indx:40
        -0.8,-0.8,-.8, //Indx:41
        0,-0.5,-1.3, //Indx:42
        0.5,-1.3,0, //Indx:43
        -0.5,-1.3,-0, //Indx:44

        //Cara HTJKF
        -0.8,0.8,-0.8, //Indx:45
        -0.8,-0.8,-0.8, //Indx:46
        0,0.5,-1.3, //Indx:47
        0,-0.5,-1.3, //Indx:48
        -1.3,0,-0.5, //Indx:49

        //Cara EFTNR   
        -0.8,0.8,0.8, //Indx:50
        -0.8,0.8,-0.8, //Indx:51
        -0.5,1.3,0, //Indx:52
        -1.3,0,0.5, //Indx:53
        -1.3,0,-0.5, //Indx:54

        //Cara EIGLR
        -0.8,0.8,0.8, //Indx:55
        -0.8,-0.8,0.8, //Indx:56
        0,0.5,1.3, //Indx:57
        0,-0.5,1.3, //Indx:58
        -1.3,0,0.5 //Indx:59

       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    //color por vertice no por cara 
       //matriz por caras de color
       let faceColors = [
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0], 
        [0.0, 0.0, 1.0, 1.0], 
        [1.0, 1.0, 0.0, 1.0], 
        [1.0, 0.0, 1.0, 1.0], 
        [0.0, 1.0, 1.0, 1.0], 
        [0.3, 0.0, 0.0, 1.0], 
        [1.0, 0.3, 0.0, 1.0],
        [1.0, 0.0, 0.0, 1.0], 
        [0.0, 1.0, 0.0, 1.0], 
        [0.0, 0.0, 0.5, 1.0], 
        [1.0, 1.0, 1.0, 1.0], 
      
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 5; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    //108 indices
    let DodeIndices = [
        3, 4,1,    3,1,2,       3,2,0,     //Cara ABMQS
        9,6,8,     9,5,7,       9,7,8,    //Cara ACILQ
        10,12,11,  10,11,14,    10,13,14,     //Cara CDQSO
        16,18,17,  16,15,17,    16,19,15,     //Cara BDJKS
        20,22,21,  20,21,24,    20,24,23,     //Cara BJFMN
        25,28,29,  25,29,26     ,25,26,27,     //Cara AEIMN
        32,31,34,  32,34,33,    32,33,30,   //Cara GHIPR
        38,39,36,  38,36,37,    38,37,35,     //Cara CGLOP
        40,42,41,  40,41,44,    40,44,43,     //Cara DHKOP
        47,45,49   ,47,49,46    ,47,46,48,     //Cara HTJKF
        53,54,51   ,53,51,52    ,53,52,50,     //Cara EFTNR
        56,59,55,  56,55,57,    56,57,58     //Cara EIGLR
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(DodeIndices), gl.STATIC_DRAW);
    
    let dode = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:60, colorSize:4, nColors: 108, nIndices:108,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(dode.modelViewMatrix, dode.modelViewMatrix, translation);

    dode.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return dode;
}

function createOcta(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        //Caras de Arriba
        //Cara 1
        1,0,0,
        0,0,1,
        0,1,0,

        //Cara 2
        -1,0,0,
        0,1,0,
        0,0,1,

        //Cara 3
        -1,0,0,
        0,1,0,
        0,0,-1,

        //Cara 4
        1,0,0,
        0,1,0,
        0,0,-1,

        //Caras de abajo 
        //Cara 5
        1,0,0,
        0,0,1,
        0,-1,0,

        //Cara 6
        -1,0,0,
        0,-1,0,
        0,0,1,

        //Cara 7
        -1,0,0,
        0,-1,0,
        0,0,-1,

        //Cara 8
        1,0,0,
        0,-1,0,
        0,0,-1
       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [1.0, 0.0, 0.0, 1.0],// Caras de arriba
        [0.0, 1.0, 0.0, 1.0], 
        [0.0, 0.0, 1.0, 1.0], 
        [1.0, 1.0, 0.0, 1.0], 
        [1.0, 0.0, 1.0, 1.0],// Caras de abajo
        [0.0, 1.0, 1.0, 1.0], 
        [0.3, 0.0, 0.0, 1.0], 
        [1.0, 0.3, 0.0, 1.0],

    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++) //3 vertices
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let octaIndices = [
        0, 1, 2,      3, 4, 5,    
        6, 7, 8,      9,10,11,
        12,13,14,     15,16,17,
        18,19,20,     21,22,23
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octaIndices), gl.STATIC_DRAW);
    
    let octa = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:24,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(octa.modelViewMatrix, octa.modelViewMatrix, translation);

    octa.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        if(mov == 0){
            if(size<250){
                posY = 0.003;
                size+= 1;
            }
            else{
                mov = 1;
            }
        }
        else{
            if(size > -250){
                posY = -0.003;
                size-= 1;
            }
            else{
                mov = 0;
            }
        }

        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0,posY,0])

        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return octa;
}

function createScu(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
      
        -1.0,  0.0,  1.5,
        -0.5,-0.87,  1.5,
        0.5,-0.87,  1.5,
        1.0,  0.0,  1.5,
        0.5, 0.87,  1.5,
        -0.5, 0.87,  1.5,

        -1.0,  0.0, -1.5,
        -0.31,-0.95, -1.5,
        0.81,-0.59, -1.5,
        0.81, 0.59, -1.5,
        -0.31, 0.95, -1.5,

        // Cara 1
        -1.0,  0.0,  1.5,
        -0.5,-0.87,  1.5,
        -1.0,  0.0, -1.5,
        -0.31,-0.95, -1.5,

        // Cara 2
        -0.5,-0.87,  1.5,
        0.5,-0.87,  1.5,
        -0.31,-0.95, -1.5,
        0.81,-0.59, -1.5,

        // Cara 3
        0.5,-0.87,  1.5,
        1.0,  0.0,  1.5,
        0.81,-0.59, -1.5,
        0.81, 0.59, -1.5,
        0.81, 0.59,  0.0,

        1.0,  0.0,  1.5,
        0.5, 0.87,  1.5,
        0.81, 0.59,  0.0,

        // Cara 4
        0.5, 0.87,  1.5,
        -0.5, 0.87,  1.5,
        0.81, 0.59, -1.5,
        -0.31, 0.95, -1.5,
        0.81, 0.59,  0.0,

        // Cara 5
        -0.5, 0.87,  1.5,
        -1.0,  0.0,  1.5,
        -0.31, 0.95, -1.5,
        -1.0,  0.0, -1.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0], 
        [0.0, 0.0, 1.0, 1.0], 
        [1.0, 1.0, 0.0, 1.0], 
        [1.0, 0.0, 1.0, 1.0], 
        [0.0, 1.0, 1.0, 1.0], 
        [0.3, 0.0, 0.0, 1.0], 
        [1.0, 0.3, 0.0, 1.0], 
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    faceColors.forEach((color, i) =>{
        let nVertex = 0;
        if (i == 0) {
            nVertex = 6;
        } else if (i == 1 || i == 4 || i == 6) {
            nVertex = 5;
        } else if  (i == 5) {
            nVertex = 3;
        } else {
            nVertex = 4;
        }

        for (let j=0; j < nVertex; j++) {
            vertexColors.push(...color);
        }
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let scuIndices = [
        0, 1, 2,      0, 5, 2,        5, 2, 3,  
        3, 4, 5,      6, 7, 8,        6, 8, 10,  
        8, 9, 10,     11, 12, 13,     14, 13, 12,                                 
        15, 16, 17,   18, 17, 16,     19, 20, 21,  
        22, 21, 20,   20, 22, 23,     24, 25, 26,                                                 
        27, 29, 31,   27, 28, 29,     30, 29, 28,                 
        32, 33, 34,   35, 34, 33,                                 
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(scuIndices), gl.STATIC_DRAW);
    
    let scutoid = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:verts.length, colorSize:4, nColors: vertexColors.length, nIndices:scuIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(scutoid.modelViewMatrix, scutoid.modelViewMatrix, translation);

    scutoid.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return scutoid;
}


function bindShaderAttributes(gl, shaderProgram)
{
    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
}

function draw(gl, shaderProgram, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // set the shader to use
    gl.useProgram(shaderProgram);

    for(let i = 0; i< objs.length; i++)
    {
        let obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function update(gl, shaderProgram, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(()=> update(gl, shaderProgram, objs));

    draw(gl,shaderProgram, objs);

    objs.forEach(obj =>{
        obj.update();
    })
    // for(const obj of objs)
    //     obj.update();
    // for(let i = 0; i<objs.length; i++)
    //     objs[i].update();
}

main();