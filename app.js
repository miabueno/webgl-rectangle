/*
    ------ GL PROCESS ------

    - matrixData = [...]
    - create buffer
    - load vertex data into buffer
    - create vertex shader
    - create fragment shader
    - create program
    - attach shaders to program
    - enable vertex attributes
    - draw

    ------ NOTES ------

    SHADER = mini program in GLSL that runs on GPU

    Javscript doesn't run on GPU so we need to use GLSL in a static string format and compile it 

    vec3 = vector of 3 components (x, y, z)

    attribute is GLSL variable has to be defined per vertex

    varying in both vector and fragment shader allows webgl to connect the two

    remember to set varying to equal attribute (eg. vColor = color)

    ------ RESOURCES ------

    how to autocomplete WebGl:
    - https://stackoverflow.com/questions/61387725/webgl-autocompletion-in-vs-code

*/

window.onload = () => {
    
    const canvas = document.getElementById('glCanvas');

    // initialise gl context    
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext('webgl');

    try {
        if (!gl) throw "Browser does not support webgl";
    } catch (error) {
        console.log(`error: ${error}`);
        alert('Unable to initialise Webgl');
    }

    const vertexData = [
        -1, 1, 0,   // V1.position
        1, 1, 0,    // V2.position
        -1, -1, 0,  // V3.position
        1, -1, 0,   // V4.position
    ];

    const colorData = [
        1, 0, 0,    // V1.color = red
        0, 1, 0,    // V2.color = green
        0, 0, 1,    // V3.color = blue
        1, 1, 1,    // V4.color = white
    ];

    // CREATE BUFFER
    const positionBuffer = gl.createBuffer();

    // LOAD VERTEX DATA INTO BUFFER
    // before loading data into it, we have to bind (specify use of) this particular buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // bufferData params:
    // [target](number): gl.ARRAY_BUFFER - using current buffer previously binded above
    // [size](number): new Float32Array(vertexData) - represents array as 32-bit floating point numbers
    // [usage](number): gl.STATIC_DRAW or gl.DYNAMIC_DRAW - how often we expect to rewrite contents of buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    // CREATE color BUFFER
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
    
    // CREATE VERTEX SHADER
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
        precision mediump float;
    
        attribute vec3 position;
        attribute vec3 color;
        varying vec3 vColor;

        void main() {
            vColor = color;
            gl_Position = vec4(position, 1);
        }
    `);
    gl.compileShader(vertexShader);

    // CREATE FRAGMENT SHADER
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1);
        }
    `);
    gl.compileShader(fragmentShader);

    // CREATE PROGRAM
    const program = gl.createProgram();

    // ATTACH SHADERS TO PROGRAM
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    /* 
        getAttribLocation:
        params:
            - webgl program
            - name of defined attribute in shader
        returns:
            - number that webgl has assigned to this attribute
    */
    const positionLocation = gl.getAttribLocation(program, `position`);

    // ENABLE VERTEX ATTRIBUTES - all the attributes are disabled by default
    gl.enableVertexAttribArray(positionLocation);

    /* 
        vertexAttribPointer:
        params:
            - index (number) - using location of attribute 'position'
            - size (number) - how many elements should I read at a time - using 3 (x,y,z)
            - type (number) - using floating point bc that's how vertexData represented in buffer
            - normalized (boolean) - not used
            - stride (number) - not used
            - offset (number) - not used

        functionality:
            - describes to webgl how it should retrieve attribute data from the bounded buffer
    */
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation); 
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    // creates executable program on graphics card
    gl.useProgram(program);

    // DRAW
    // starting vertex = 0
    // how many vertex should it draw = 3
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};