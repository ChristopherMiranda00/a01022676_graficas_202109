import * as shaderUtils from '../common/shaderUtils.js'

const mat4 = glMatrix.mat4;

// ModelView Matrix: defines where the square is positioned in the 3D coordinate system relative to the camera
// Projection Matrix: required by the shader to convert the 3D space into the 2D space of the viewport. 
let projectionMatrix, modelViewMatrix;

let shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

// in: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These are constant during a rendering cycle, such as lights position.
// NOTE: #version 300 es must be the first line of your shader, so that webgl2 knows that the shader language is GLSL ES 3.0 instead of GLSL 1.0

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These are constant during a rendering cycle, such as lights position.
// Varyings: Used for passing data from the vertex shader to the fragment shader.
const vertexShaderSource = `#version 300 es

        in vec3 vertexPos; // Vertex from the buffer
        uniform mat4 modelViewMatrix; // Object's position
        uniform mat4 projectionMatrix; // Camera's position

        void main(void) {
    		// Return the transformed and projected vertex value
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
        }`;

const fragmentShaderSource = `#version 300 es

        precision mediump float;
        out vec4 fragColor;

        void main(void) {
        // Return the pixel color: always output white
        fragColor = vec4(1.0, 0, 0, 1.0); //rojo 
    }`;

function main() 
{
    let canvas = document.getElementById("webglcanvasfiguras"); //canvas
    
    let gl = initWebGL(canvas);
    initGL(gl, canvas);
    initViewport(gl, canvas);

    const shaderProgram = shaderUtils.initShader(gl, vertexShaderSource, fragmentShaderSource);

    //Figuras
    let square = createSquare(gl);
    let triangle = createTriangle(gl);
    let diamond = createDiamond(gl);
    let pacman = createPacman(gl);

    //matrices de cuadrado 
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [-1.0, 0.7, -4]);//mueve la matriz al vector 
    bindShaderAttributes(gl, shaderProgram); //bindea el shader 
    draw(gl, shaderProgram, square); //dibujar el cuadrado

    //matrices rombo
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [-1.0, -0.9, -4]);
    bindShaderAttributes(gl, shaderProgram);
    draw(gl, shaderProgram, diamond);
    
    //matrices triangulo
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [1.0, 0.7, -4]);
    bindShaderAttributes(gl, shaderProgram);
    draw(gl, shaderProgram, triangle);

    //matrices del Pacman
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [1.0, -0.9, -4]);
    bindShaderAttributes(gl, shaderProgram);
    draw(gl, shaderProgram, pacman);
}

function initWebGL(canvas) 
{
    let gl = null;//gl = contexto usado antes 
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";
    //checar que tiene el contesto
    try 
    {
        gl = canvas.getContext("webgl2");//contexto 
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        throw new Error(msg);
    }

    return gl;        
}

// The viewport is the rectangular bounds of where to draw. 
// In this case, the viewport will take up the entire contents of the canvas' display area.
function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);//area donde se va a dibujar 0,0 del canvas
}

function initGL(gl, canvas)
{
    // clear the background (with black)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clears the color buffer; the area in GPU memory used to render the bits on screen.
    // There are several buffers, including the color, and depth buffers.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Create a model view matrix with object at 0, 0, -3.333
    modelViewMatrix = mat4.create();

    // translate(out, a, v) → {mat4}
    // out	mat4	the receiving matrix
    // a	mat4	the matrix to translate
    // v	vec3	vector to translate by
    mat4.identity(modelViewMatrix);

    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();

    // perspective(out, fovy, aspect, near, far) → {mat4}
    // out	    mat4	mat4 frustum matrix will be written into
    // fovy	    number	Vertical field of view in radians
    // aspect	number	Aspect ratio. typically viewport width/height
    // near	    number	Near bound of the frustum
    // far	    number	Far bound of the frustum
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
}

function bindShaderAttributes(gl, shaderProgram)
{
    // Obtain handles to each of the variables defined in the GLSL shader code so that they can be initialized
    // gl.getAttribLocation(program, name);
    // program  A webgl program containing the attribute variable
    // name     A domString specifying the name of the attribute variable whose location to get
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);
    
    // gl.getUniformLocation(program, name);
    // program  A webgl program containing the attribute variable
    // name     A domString specifying the name of the uniform variable whose location to get
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
}


// Create the vertex data for a square to be drawn.
// WebGL drawing is done with primitives — different types of objects to draw. WebGL primitive types include triangles, points, and lines. 
// Triangles, the most commonly used primitive, are actually accessible in two different forms: as triangle sets (arrays of triangles) and triangle strips (described shortly). 
// Primitives use arrays of data, called buffers, which define the positions of the vertices to be drawn.
function createSquare(gl) 
{
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    //vertSize 3 x nVerts 4
    let verts = [
        0.5,  0.5,  0.0, //vertice esquina derecha arriba
        -0.5, .5,  0.0, //vertice esquina izq1uierda arriba
        .5,  -.5,  0.0, //vertice esquina derecha abajo
        -.5, -.5,  0.0, //vertice esquina izq1uierda abajo
    ];

    // void gl.bufferData(target, ArrayBufferView srcData, usage, srcOffset, length);
    // target = gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
    // srcData = This is a new data type introduced into web browsers for use with WebGL. Float32Array is a type of ArrayBuffer, also known as a typed array. This is a JavaScript type that stores compact binary data. 
    // usage = A GLenum specifying the usage pattern of the data store. gl.STATIC_DRAW: Contents of the buffer are likely to be used often and not change often. Contents are written to the buffer, but not read.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW); //buffer que guarda los datos de los verts

    let square = {buffer:vertexBuffer, 
            vertSize:3, nVerts:4, 
            primtype:gl.TRIANGLE_STRIP}; //objeto con la informacion del cuadrado
    return square;
}

// Create the vertex data for a diamond to be drawn.
// WebGL drawing is done with primitives — different types of objects to draw. WebGL primitive types include triangles, points, and lines. 
// Triangles, the most commonly used primitive, are actually accessible in two different forms: as triangle sets (arrays of triangles) and triangle strips (described shortly). 
// Primitives use arrays of data, called buffers, which define the positions of the vertices to be drawn.
function createDiamond(gl) 
{
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //vertSize 3 x nVerts 4
    let verts = [
        0,   0.5,  0.0, //vertice punta arriba
       -0.5,  0,   0.0, //vertice punta izq1uierda
        0.5, -0,   0.0, //vertice punta derecha
        0,  -0.5,  0   //vertice punta de abajo   
    ];

    // void gl.bufferData(target, ArrayBufferView srcData, usage, srcOffset, length);
    // target = gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
    // srcData = This is a new data type introduced into web browsers for use with WebGL. Float32Array is a type of ArrayBuffer, also known as a typed array. This is a JavaScript type that stores compact binary data. 
    // usage = A GLenum specifying the usage pattern of the data store. gl.STATIC_DRAW: Contents of the buffer are likely to be used often and not change often. Contents are written to the buffer, but not read.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let diamond = {buffer:vertexBuffer, 
        vertSize:3, nVerts:4, 
        primtype:gl.TRIANGLE_STRIP}; //objeto con la informacion del rombo

    return diamond;
}

// Create the vertex data for a triangle to be drawn.
// WebGL drawing is done with primitives — different types of objects to draw. WebGL primitive types include triangles, points, and lines. 
// Triangles, the most commonly used primitive, are actually accessible in two different forms: as triangle sets (arrays of triangles) and triangle strips (described shortly). 
// Primitives use arrays of data, called buffers, which define the positions of the vertices to be drawn.
function createTriangle(gl)
{
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //vertSize 3 x nVerts 3
    let verts = [
        0.0,   0.5, 0.0, //vertice de la punta 
        -0.5, -0.5, 0.0, //vertice esquina derecha
        0.5,  -0.5, 0.0 // vertice esquina izq1uierda
    ];

    // void gl.bufferData(target, ArrayBufferView srcData, usage, srcOffset, length);
    // target = gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
    // srcData = This is a new data type introduced into web browsers for use with WebGL. Float32Array is a type of ArrayBuffer, also known as a typed array. This is a JavaScript type that stores compact binary data. 
    // usage = A GLenum specifying the usage pattern of the data store. gl.STATIC_DRAW: Contents of the buffer are likely to be used often and not change often. Contents are written to the buffer, but not read.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    
    let triangle = {buffer:vertexBuffer, 
        vertSize:3, nVerts:3, 
        primtype:gl.TRIANGLES};

    return triangle;
}  

// Create the vertex data for a pacman to be drawn.
// WebGL drawing is done with primitives — different types of objects to draw. WebGL primitive types include triangles, points, and lines. 
// Triangles, the most commonly used primitive, are actually accessible in two different forms: as triangle sets (arrays of triangles) and triangle strips (described shortly). 
// Primitives use arrays of data, called buffers, which define the positions of the vertices to be drawn.
// Referencias; https://www.youtube.com/watch?v=U22lDEYGg0w
// https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm
function createPacman(gl)
{
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [0,0,0]; //circulo

    let izq = 90; //parte de atras del pacman de lo de arriba
    let izq1 = 0;

    let boca = 0; //boca de arriba
    let boca1 = 0; //boca abajo
    
    let r = 0.5;
    let radian=  (Math.PI / 180)
    
    for(let i = 0; i < 300; i++){
        
        if(i<60){ 
            verts.push((Math.cos((boca + 40) *radian) * r), (Math.sin((boca + 40) *radian) * r), 0)
            boca++;
        }
        
        else if (i<150){ 
            verts.push((Math.cos((izq) *radian) * - r), (Math.sin((izq) *radian) * r), 0)
            izq--;
        }
        
        else if (i<240){ 
            verts.push((Math.cos((izq1) *radian) * - r), (Math.sin((izq1) *radian) * - r), 0)
            izq1++;
        }
        
        else{
            verts.push((Math.cos((90 - boca1) *radian) * r), (Math.sin((90 - boca1) *radian) * - r), 0)
            boca1++;
        }
    }
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let pacman = {buffer:vertexBuffer, 
        vertSize:3, nVerts:300, 
        primtype:gl.TRIANGLE_FAN};

    return pacman;
}  


function draw(gl, shaderProgram, obj) 
{
    // set the shader to use
    gl.useProgram(shaderProgram);

    // connect up the shader parameters: vertex position and projection/model matrices
    // set the vertex buffer to be drawn
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);

    // Specifies the memory layout of the vertex buffer object. It must be called once for each vertex attribute.
    // gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    // index: A GLuint specifying the index of the vertex attribute that is to be modified.
    // size: A GLint specifying the number of components per vertex attribute. Must be 1, 2, 3, or 4.
    // type: A GLenum specifying the data type of each component in the array.
    // normalized: A GLboolean specifying whether integer data values should be normalized into a certain range when being casted to a float.
    // stride: A GLsizei specifying the offset in bytes between the beginning of consecutive vertex attributes.
    // offset: A GLintptr specifying an offset in bytes of the first component in the vertex attribute array
    gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

    // WebGLRenderingContext.uniformMatrix4fv(location, transpose, value); 
    // location: A WebGLUniformLocation object containing the location of the uniform attribute to modify. The location is obtained using getAttribLocation().
    // transpose: A GLboolean specifying whether to transpose the matrix.
    // value: A Float32Array or sequence of GLfloat values.
    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

    // draw the object
    gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

main();