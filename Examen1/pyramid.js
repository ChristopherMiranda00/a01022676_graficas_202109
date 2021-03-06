// Modelo 3d:https://www.geogebra.org/m/c2cxjdyc

let projectionMatrix = null, shaderProgram = null;

let shaderVertexPositionAttribute = null, shaderVertexColorAttribute = null, shaderProjectionMatrixUniform = null, shaderModelViewMatrixUniform = null;

let mat4 = glMatrix.mat4;

let duration = 10000;

let vertexShaderSource = `#version 300 es
in vec3 vertexPos;
in vec4 vertexColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec4 vColor;

void main(void) {
    // Return the transformed and projected vertex value
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
    // Output the vertexColor in vColor
    vColor = vertexColor;
}`;

let fragmentShaderSource = `#version 300 es
    precision lowp float;
    in vec4 vColor;
    out vec4 fragColor;

    void main(void) {
    // Return the pixel color: always output white
    fragColor = vColor;
}
`;

function createShader(glCtx, str, type)
{
    let shader = null;
    
    if (type == "fragment") 
        shader = glCtx.createShader(glCtx.FRAGMENT_SHADER);
    else if (type == "vertex")
        shader = glCtx.createShader(glCtx.VERTEX_SHADER);
    else
        return null;

    glCtx.shaderSource(shader, str);
    glCtx.compileShader(shader);

    if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        throw new Error(glCtx.getShaderInfoLog(shader));
    }

    return shader;
}

function initShader(glCtx, vertexShaderSource, fragmentShaderSource)
{
    const vertexShader = createShader(glCtx, vertexShaderSource, "vertex");
    const fragmentShader = createShader(glCtx, fragmentShaderSource, "fragment");

    let shaderProgram = glCtx.createProgram();

    glCtx.attachShader(shaderProgram, vertexShader);
    glCtx.attachShader(shaderProgram, fragmentShader);
    glCtx.linkProgram(shaderProgram);
    
    if (!glCtx.getProgramParameter(shaderProgram, glCtx.LINK_STATUS)) {
        throw new Error("Could not initialise shaders");
    }

    return shaderProgram;
}

function initWebGL(canvas) 
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";

    try 
    {
        gl = canvas.getContext("webgl2");
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

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(gl, canvas)
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
}

function draw(gl, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for(const obj of objs)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}


function createPyramid(gl, translation, rotationAxis) 
{
    let verts = [

    //Lado de base 1 
    0,10.39,0,
    0,8.66,2.45,
    -1.5,7.79,0,

    -1.5, 7.79,0,
    -1.5, 6.06, 2.45,
    -3,5.2,0,

    -3,5.2,0,
    -3,3.46,2.45,
    -4.5, 2.6, 0,

    -4.5, 2.6, 0,
    -4.5,0.87,2.45,
    -6,0,0,

    //Lado de base 2
    -6,0,0,
    -4.5,0.87,2.45,
    -3,0,0,

    -3,0,0,
    -1.5,0.87,2.45,
    0,0,0,

    0,0,0,
    1.5, 0.87,2.45,
    3,0,0,

    3,0,0,
    4.5, 0.87,2.45,
    6,0,0,

    //Lado de Base 3
    6,0,0,
    4.5, 0.87,2.45,
    4.5,2.6,0,

    4.5,2.6,0,
    3,3.46,2.45,
    3,5.2,0,

    3,5.2,0,
    1.5,6.06,2.45,
    1.5,7.79,0,

    1.5,7.79,0,
    0,8.66,2.45,
    0,10.39,0,

    //Lado Base medio 1
    4.5, 0.87,2.45,
    3,1.73,4.9,
    3,3.46,2.45,

    1.5, 6.06, 2.45,
    0,6.93,4.9, 
    0,8.66,2.45,

    //Lado Base medio 2
    0,8.66,2.45,
    0,6.93,4.9,
    -1.5, 6.06, 2.45,
    
    -3,3.46,2.45,
    -3,1.73,4.9,
    -4.5,0.87,2.45,

    //Lado Base medio 3
    -4.5, 0.87,2.45,
    -3,1.73,4.9,
    -1.5,0.87,2.45,

    1.5,0.87,2.45,
    3,1.73,4.9,
    4.5,0.87,2.45,

    //Lado Base Arriba medio 1
    3,1.73,4.9,
    1.5,2.6,7.35, 
    1.5,4.33,4.9,

    1.5,4.33,4.9,
    0,5.2,7.35, 
    0,6.93,4.9,
    
    //Lado Base Arriba medio 2
    0,6.93,4.9,
    0,5.2,7.35, 
    -1.5,4.33,4.9,

    -1.5,4.33,4.9,
    -1.5,2.6,7.35, 
    -3,1.73,4.9,

    //Lado Base Arriba medio 3
    -3,1.73,4.9,
    -1.5,2.6,7.35, 
    0,1.73,4.9,

    0,1.73,4.9,
    1.5,2.6,7.35,
    3,1.73,4.9,

    //Punta Arriba
    1.5,2.6,7.35, 
    0,3.46,9.8,
    0,5.2,7.35, 

    0,5.2,7.35,
    0,3.46,9.8, 
    -1.5,2.6,7.35,

    -1.5,2.6,7.35,
    0,3.46,9.8,
    1.5,2.6,7.35, 

    //Tapa de abajo 
    6,0,0,
    4.5,2.6,0,
    3,0,0,

    3,0,0,
    1.5,2.6,0,
    0,0,0,

    0,0,0,
    -1.5,2.6,0,
    -3,0,0,

    -3,0,0,
    -4.5,2.6,0,
    -6,0,0,

    4.5,2.6,0,
    3,5.2,0,
    1.5,2.6,0,

    -1.5,2.6,0,
    -3,5.2,0,
    -4.5,2.6,0,

    3,5.2,0,
    1.5,7.79,0,
    0,5.2,0,

    0,5.2,0,
    -1.5,7.79,0,
    -3,5.2,0,

    1.5,7.79,0,
    0,10.39,0,
    -1.5,7.79,0,

    ];
    
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let colors = [
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
        [Math.random(), Math.random(), Math.random(), 1.0], 
    ];

    // Color data
    let vertexColors = [];
    colors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let pyramidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBuffer);

    let pyramidIndices = [
        0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
        21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
        41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,
        61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,
        81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,
        101,102,103,104,105,106,107,108

    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);
    
    let pyramid = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:pyramidIndexBuffer,
            vertSize:3, nVerts:verts.length/3, colorSize:4, nColors: vertexColors.length / 4, nIndices: pyramidIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);
    mat4.rotate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, Math.PI/8, [1, 0, 0]);

    pyramid.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return pyramid;
}

function update(glCtx, objs)
{
    requestAnimationFrame(()=>update(glCtx, objs));

    draw(glCtx, objs);
    objs.forEach(obj => obj.update())
}

function bindShaderAttributes(glCtx, shaderProgram)
{
    shaderVertexPositionAttribute = glCtx.getAttribLocation(shaderProgram, "vertexPos");
    glCtx.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = glCtx.getAttribLocation(shaderProgram, "vertexColor");
    glCtx.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = glCtx.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = glCtx.getUniformLocation(shaderProgram, "modelViewMatrix");
}

function main()
{
    let canvas = document.getElementById("pyramidCanvas");
    let glCtx = initWebGL(canvas);

    initViewport(glCtx, canvas);
    initGL(glCtx, canvas);

    let pyramid = createPyramid(glCtx,  [-2, -2, -30], [0, 1,0]);

    shaderProgram = initShader(glCtx, vertexShaderSource, fragmentShaderSource);
    bindShaderAttributes(glCtx, shaderProgram);

    update(glCtx, [pyramid]);
}

main();