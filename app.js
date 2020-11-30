"use strict";
// taken from webglfundamentals.org
var m4 = {

  lookAt: function(cameraPosition, target, up) {
    var zAxis = normalize(
        subtractVectors(cameraPosition, target));
    var xAxis = normalize(cross(up, zAxis));
    var yAxis = normalize(cross(zAxis, xAxis));

    return [
       xAxis[0], xAxis[1], xAxis[2], 0,
       yAxis[0], yAxis[1], yAxis[2], 0,
       zAxis[0], zAxis[1], zAxis[2], 0,
       cameraPosition[0],
       cameraPosition[1],
       cameraPosition[2],
       1,
    ];
  },

  perspective: function(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  },

  // converts from pixels to clip space
  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  vectorMultiply: function(v, m) {
    var dst = [];
    for (var i = 0; i < 4; ++i) {
      dst[i] = 0.0;
      for (var j = 0; j < 4; ++j) {
        dst[i] += v[j] * m[j * 4 + i];
      }
    }
    return dst;
  },

  translation: function(tx,ty,tz){
    return [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      tx, ty, tz, 1
    ];
  },

  xRotation: function(rad){
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return [
      1, 0 ,  0, 0,
      0, c ,  s, 0, 
      0, -s,  c, 0,
      0, 0 ,  0, 1,
    ];
  },

  yRotation: function(rad){
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return [
      c, 0, -s, 0,
      0, 1,  0, 0,
      s, 0,  c, 0,
      0, 0,  0, 1,
    ];
  },

  zRotation: function(rad){
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return[
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx,sy,sz){
    return [
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0,  0, 1,
    ]
  },

  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

  inverse: function(m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0  = m22 * m33;
    var tmp_1  = m32 * m23;
    var tmp_2  = m12 * m33;
    var tmp_3  = m32 * m13;
    var tmp_4  = m12 * m23;
    var tmp_5  = m22 * m13;
    var tmp_6  = m02 * m33;
    var tmp_7  = m32 * m03;
    var tmp_8  = m02 * m23;
    var tmp_9  = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ];
  },

}
// taken from webglfundamentals.org
function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
// taken from webglfundamentals.org
function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}



var pink   = [1, 0.5, 0.5, 1];
var mp   = [0.5, 0.8, 0.8, 1];
var green  = [0.5, 1, 0.5, 1];
var mp2  = [0.7, 0.5, 0.7, 1];
var across = 20;
var down = 10;

function addPoint(x, y, color, arr, carr) {
  var u = x / across;
  var v = y / down;
  var radius = Math.sin(v * Math.PI);
  var angle = u * Math.PI * 2;
  var nx = Math.cos(angle);
  var ny = Math.cos(v * Math.PI);
  var nz = Math.sin(angle);
  arr.push(
    nx * radius,   // x
    ny,            // y
    nz * radius);  // z
  normals.push(nx, ny, nz);
  carr.push(color[0], color[1], color[2], color[3]);
}



var cvs = document.getElementById("gl-canvas");

// taken from webglfundamentals.org
function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
}


function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}



var a_pressed,s_pressed,d_pressed,w_pressed, shift_pressed;
var cvs_focused;
var x_mouse, y_mouse;
var clickX, clickY;


function main() {
  //================================
  //======== INITIALIZATION ========
  //================================
  // set WebGL Context
  var canvas = document.getElementById("gl-canvas");
  var gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    // user-friendly error message
    console.log("Failed to load WebGL");
  }
  var primitiveType = gl.LINES;
  // setup GLSL program
  var program = initShaders(gl, "vertex-shader-3d", "fragment-shader-3d");
  var program_3 = initShaders(gl, "vertex-shader-flat", "fragment-shader-flat");
  var program_2 = initShaders(gl, "vertex-shader-flat-color", "fragment-shader-flat-color");
  // lookup vertex attributes.
  var positionLoc = gl.getAttribLocation(program, "a_position");
  var texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
  var positionLoc_2 = gl.getAttribLocation(program_2, "a_position");

  // lookup uniforms
  var matrixLoc = gl.getUniformLocation(program, "u_matrix");
  var textureLoc = gl.getUniformLocation(program, "u_texture"); 
  var matrixLoc_2 = gl.getUniformLocation(program_2, "u_matrix");
  var colorLoc_2 = gl.getUniformLocation(program_2, "u_color");

  // Generate Vertex Buffer
  var positionBuffer = gl.createBuffer();
  var positionBuffer_2 = gl.createBuffer();

  var positionBuffer_3 = gl.createBuffer();
  var positionBuffer_4 = gl.createBuffer();
  var positionBuffer_5 = gl.createBuffer();
  var positionBuffer_6 = gl.createBuffer();
  var positionBuffer_7 = gl.createBuffer();

  // Bind Buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Create object and put it in the Buffer
  setGeometry(gl);
  // Bind Buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer_2);
  // Create object and put it in the Buffer
  setGeometry2(gl);


  // Generate Texture Buffer
  var texcoordBuffer = gl.createBuffer();
  // Bind Buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  // Create textures for object and put it in the Buffer
  setTexcoords(gl);

  // Create a texture.
  var texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([140, 140, 140, 255]));
  // Asynchronously load an image
  // taken from webglfundamentals.org
  var image = new Image();
   //image.crossOrigin = "anonymous"
   image.src = "./texture/right-wall.png";
   image.addEventListener('load', function() {
     // Now that the image has loaded make copy it to the texture.
     gl.bindTexture(gl.TEXTURE_2D, texture);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

     // Check if the image is a power of 2 in both dimensions.
     if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
         // Yes, it's a power of 2. Generate mips.
         gl.generateMipmap(gl.TEXTURE_2D);
     } else {
         // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     }
   });
  
  // Create a texture.
  var texture2 = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([140, 140, 140, 255]));
  // Asynchronously load an image
  var image2 = new Image();
   //image2.crossOrigin = "anonymous"
   image2.src = "./texture/concrete_wall1.png";
   image2.addEventListener('load', function() {
     // Now that the image has loaded make copy it to the texture.
     gl.bindTexture(gl.TEXTURE_2D, texture2);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image2);

     // Check if the image is a power of 2 in both dimensions.
     if (isPowerOf2(image2.width) && isPowerOf2(image2.height)) {
         // Yes, it's a power of 2. Generate mips.
         gl.generateMipmap(gl.TEXTURE_2D);
     } else {
         // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     }
   });

     // Create a texture.
  var texture23 = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture23);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([140, 140, 140, 255]));
  // Asynchronously load an image
  var image23 = new Image();
   //image23.crossOrigin = "anonymous"
   image23.src = "./texture/door-wall.png";
   image23.addEventListener('load', function() {
     // Now that the image has loaded make copy it to the texture.
     gl.bindTexture(gl.TEXTURE_2D, texture23);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image23);

     // Check if the image is a power of 2 in both dimensions.
     if (isPowerOf2(image23.width) && isPowerOf2(image23.height)) {
         // Yes, it's a power of 2. Generate mips.
         gl.generateMipmap(gl.TEXTURE_2D);
     } else {
         // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     }
   });


   var ceil = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, ceil);
   // Fill the texture with a 1x1 blue pixel.
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                 new Uint8Array([140, 140, 140, 255]));
   // Asynchronously load an image
   var image234 = new Image();
    //image2.crossOrigin = "anonymous"
    image234.src = "./texture/ceil.png";
    image234.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, ceil);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image234);
 
      // Check if the image is a power of 2 in both dimensions.
      if (isPowerOf2(image234.width) && isPowerOf2(image234.height)) {
          // Yes, it's a power of 2. Generate mips.
          gl.generateMipmap(gl.TEXTURE_2D);
      } else {
          // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      }
    });

  // Create a texture.
  var ground_texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, ground_texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([140, 140, 140, 255]));
  // Asynchronously load an image
  var image0 = new Image();
   //image2.crossOrigin = "anonymous"
   image0.src = "./texture/ground.png";
   image0.addEventListener('load', function() {
     // Now that the image has loaded make copy it to the texture.
     gl.bindTexture(gl.TEXTURE_2D, ground_texture);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image0);

     // Check if the image is a power of 2 in both dimensions.
     if (isPowerOf2(image0.width) && isPowerOf2(image0.height)) {
         // Yes, it's a power of 2. Generate mips.
         gl.generateMipmap(gl.TEXTURE_2D);
     } else {
         // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     }
   });

  // Create a texture.
  var sector_texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, sector_texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([140, 140, 140, 255]));
  // Asynchronously load an image
  var image01 = new Image();
   image01.crossOrigin = "anonymous"
   image01.src = "./texture/concrete_wall2.png";
   image01.addEventListener('load', function() {
     // Now that the image has loaded make copy it to the texture.
     gl.bindTexture(gl.TEXTURE_2D, sector_texture);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image01);

     // Check if the image is a power of 2 in both dimensions.
     if (isPowerOf2(image01.width) && isPowerOf2(image01.height)) {
         // Yes, it's a power of 2. Generate mips.
         gl.generateMipmap(gl.TEXTURE_2D);
     } else {
         // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     }
   });
  
  var term_textur = new Array();
  term_textur[0] = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, term_textur[0]);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([140, 140, 140, 255]));
  // Asynchronously load an image
  var image3 = new Image();
  //image3.crossOrigin = "anonymous";
  image3.src = "./texture/terminal0.png";
  image3.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, term_textur[0]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image3);

    // Check if the image is a power of 2 in both dimensions.
    if (isPowerOf2(image3.width) && isPowerOf2(image3.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }
  }); 
  term_textur[1] = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, term_textur[1]);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([140, 140, 140, 255]));
  // Asynchronously load an image
  var image4 = new Image();
  //image4.crossOrigin = "anonymous";
  image4.src = "./texture/terminal2.png";
  image4.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, term_textur[1]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image4);

    // Check if the image is a power of 2 in both dimensions.
    if (isPowerOf2(image4.width) && isPowerOf2(image4.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }
  }); 
  term_textur[2] = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, term_textur[2]);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([140, 140, 140, 255]));
  // Asynchronously load an image
  var image5 = new Image();
  //image5.crossOrigin = "anonymous";
  image5.src = "./texture/terminal3.png";
  image5.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, term_textur[2]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image5);

    // Check if the image is a power of 2 in both dimensions.
    if (isPowerOf2(image5.width) && isPowerOf2(image5.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }
  }); 
  term_textur[3] = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, term_textur[3]);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([140, 140, 140, 255]));
  // Asynchronously load an image
  var image6 = new Image();
  //image6.crossOrigin = "anonymous";
  image6.src = "./texture/terminal4.png";
  image6.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, term_textur[3]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image6);

    // Check if the image is a power of 2 in both dimensions.
    if (isPowerOf2(image6.width) && isPowerOf2(image6.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }
  }); 

  document.getElementById( "wiremode" ).onclick= function(){
    primitiveType = gl.LINES;
  }

  document.getElementById( "polymode" ).onclick= function(){
    primitiveType = gl.TRIANGLES;
  }

  function computeRotation(){
    var diffY = x_mouse - 400;
    var diffX = y_mouse - 300;
  
    var degY = diffY * 45/400;
    var degX = diffX * 45/300;
    rotation[0] = -degX/10;
    rotation[1] = -degY/10;
  }

  // change this to movementX,Y and lock the mouse. 
  // (prevents it to clapping edge of the browser)
  cvs.addEventListener('mousemove', e => { 
    if(cvs_focused){
      x_mouse = e.offsetX;
      y_mouse = e.offsetY;
      computeRotation();
      //console.log(x_mouse, y_mouse);
    }else{
      
    }
  });
  cvs.addEventListener('mousedown', e => { 
    if(!cvs_focused){
      document.body.style.cursor = "none";
      cvs_focused = true;
      clickX = e.offsetX;
      clickY = e.offsetY;
      //navigator.pointer.lock(document.body, function() {
        // Locked and ready to play.
      //}, onError);
    } else {
      document.body.style.cursor = "default";
      cvs_focused = false;
    }
    
    console.log(e.offsetX, e.offsetY);
  });
  cvs.addEventListener('mouseup', () => { console.log("release"); });
  cvs.addEventListener('mouseleave', () => { 
    cvs_focused = false; 
    document.body.style.cursor = "default";
  });
  
  document.addEventListener('keyup', function(event){
    if(event.code == "KeyA"){
      console.log(radToDeg(rotation[0]),radToDeg(rotation[1]),radToDeg(rotation[2]));
      a_pressed = false;
    }
    if(event.code == "KeyS"){
      s_pressed = false;
    }
    if(event.code == "KeyD"){
      d_pressed = false;
    }
    if(event.code == "KeyW"){
      w_pressed = false;
    }
  });

  var fov_degree = 70;
  var cameraAngleRadians = degToRad(0);
  var fieldOfViewRadians = degToRad(fov_degree);
  var translation = [0, 0, 0];
  var rotation = [degToRad(0), degToRad(100), degToRad(0)];
  var scale = [1, 1, 1];
  var counter = 0;

  var move_speed = 12;
  document.addEventListener('keydown', function(event){
    if(event.code == "KeyA"){
      var newPosX = move_speed *  Math.sin( rotation[1] ) * Math.cos( rotation[0] );
      var newPosY = move_speed * -Math.sin( rotation[0] );
      var newPosZ = move_speed *  Math.cos( rotation[1] ) * Math.cos( rotation[0] );
      translation[0] -= newPosZ;
      //translation[1] -= newPosY;
      translation[2] += newPosX;
      a_pressed = true;
    } 
    //console.log(event.code);
  });
  document.addEventListener('keydown', function(event){
    if(event.code == "KeyD"){
      var newPosX = move_speed *  Math.sin( rotation[1] ) * Math.cos( rotation[0] );
      var newPosY = move_speed * -Math.sin( rotation[0] );
      var newPosZ = move_speed *  Math.cos( rotation[1] ) * Math.cos( rotation[0] );
      translation[0] += newPosZ;
      //translation[1] -= newPosY;
      translation[2] -= newPosX;
      d_pressed = true;
    }
    console.log(event.code);
  });
  document.addEventListener('keydown', function(event){
    if(event.code == "KeyW"){
      var newPosX = move_speed *  Math.sin( rotation[1] ) * Math.cos( rotation[0] );
      var newPosY = move_speed * -Math.sin( rotation[0] );
      var newPosZ = move_speed *  Math.cos( rotation[1] ) * Math.cos( rotation[0] );
      //console.log(rotation[1]);
      translation[0] -= newPosX;
      translation[1] -= newPosY;
      translation[2] -= newPosZ;
      w_pressed = true;
    }
    //console.log(event.code);
  });
  document.addEventListener('keydown', function(event){
    if(event.code == "KeyS"){
      var newPosX = move_speed *  Math.sin( rotation[1] ) * Math.cos( rotation[0] );
      var newPosY = move_speed * -Math.sin( rotation[0] );
      var newPosZ = move_speed *  Math.cos( rotation[1] ) * Math.cos( rotation[0] );
      //console.log(rotation[1]);
      translation[0] += newPosX;
      translation[1] += newPosY;
      translation[2] += newPosZ;
      s_pressed = true;
      translation[0] += 5;
    }
    //console.log(event.code);
  });
  document.addEventListener('keydown', function(event){
    if(event.code == "KeyQ"){
      s_pressed = true;
      translation[1] += move_speed;
    }
    //console.log(event.code);
  });
  document.addEventListener('keydown', function(event){
    if(event.code == "KeyE"){
      s_pressed = true;
      translation[1] -= move_speed;
    }
    //console.log(event.code);
  });

  document.addEventListener('keydown', function(event){
    if(event.code == "ShiftLeft"){
      shift_pressed = true;
    }
  });
  document.addEventListener('keyup', function(event){
    if(event.code == "ShiftLeft"){
      shift_pressed = false;
    }
  });

  document.addEventListener("wheel", event => {
    if(cvs_focused){
      const delta = Math.sign(event.deltaY);
      console.info(delta);
      if(fov_degree <= 70 && fov_degree >= 50){
        fov_degree += delta * 2;
        fieldOfViewRadians = degToRad(fov_degree);
      } else{
        if(fov_degree > 70) {
          fov_degree = 70;
        } else if (fov_degree < 50) {
          fov_degree = 50;
        }
      }
      console.log(fov_degree);
    }
  });


  gl.clearColor(0.21, 0.21, 0.21, 1.0);
  requestAnimationFrame(render);
  
  function render() {
    counter++;
    var flag = Math.floor(counter / 26);
    if(flag >= 0 && flag < 4){
    } else {
      counter = 0;
      flag = 0;
    }

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    gl.enable(gl.CULL_FACE);
    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    //gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // enable the position attribute
    gl.enableVertexAttribArray(positionLoc);
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration1
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(positionLoc, size, type, normalize, stride, offset);
    
    // enable texcoord attribute
    gl.enableVertexAttribArray(texcoordLoc);
    // bind the texture buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 8bit unsigned values
    var normalize = false; // normalize the data (convert from 0-255 to 0-1)
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLoc, size, type, normalize, stride, offset);

    // ============
    // Compute Matrices

    // Compute projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 10;
    var zFar = 2000;
    var projection_matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    // Compute the position of object of interest
    var fPosition = [0, 0, 0];


    // Compute camera_matrix
    var camera_matrix = m4.scaling(1,1,1);
    camera_matrix = m4.translate(camera_matrix, translation[0], translation[1], translation[2])
    camera_matrix = m4.zRotate(camera_matrix, rotation[2]);
    camera_matrix = m4.yRotate(camera_matrix, rotation[1]);
    camera_matrix = m4.xRotate(camera_matrix, rotation[0]);
    //camera_matrix = m4.translate(camera_matrix, -translation[0], -translation[1], -translation[2]);
    //rotation = [0, 0 ,0];
    /*m4.xRotation(rotation[0]);
    camera_matrix = m4.yRotate(camera_matrix, rotation[1]);
    camera_matrix = m4.zRotate(camera_matrix, rotation[2]);
    camera_matrix = m4.translate(camera_matrix, translation[0], translation[1], translation[3]);
    */

    // Get the camera's position from the matrix we computed
    var cameraPosition = [
      camera_matrix[12],
      camera_matrix[13],
      camera_matrix[14],
    ];

    var up = [0, -1, 0];

    // Compute the camera's matrix using look at.
    //camera_matrix = m4.lookAt(cameraPosition, fPosition, up);


    // Compute view_matrix (inverse of camera_matrix)
    var view_matrix = m4.inverse(camera_matrix);

    // Compute view_projection matrix
    var viewprojection_matrix = m4.multiply(projection_matrix, view_matrix);

    var matrix = m4.translate(viewprojection_matrix, 0, 0, 0);
    //matrix = m4.scale(matrix, -1, 0 ,0);
    //var rot = [degToRad(90), degToRad(90), degToRad(90)];
    //matrix = m4.xRotate(matrix, rot[0]);
    //matrix = m4.yRotate(matrix, rot[1]);
    //matrix = m4.zRotate(matrix, rot[2]);
    //matrix = m4.translate(matrix, 0,400,0);

    // set the matrix
    gl.uniformMatrix4fv(matrixLoc, false, matrix);
    
    // Tell the shader to use texture unit 0 for u_texture
    gl.uniform1i(textureLoc, 0);

    
    var offset = 0;
    var count = 1 * 6;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(primitiveType, offset, count);
    

    // Draw the geometry.
    var offset = 6;
    var count = 1 * 6;
    gl.bindTexture(gl.TEXTURE_2D, term_textur[flag]);
    gl.drawArrays(primitiveType, offset, count);

    // wall
    var offset = 12;
    var count = 1 * 6;
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.drawArrays(primitiveType, offset, count);

    // ground
    var offset = 18;
    var count = 1 * 6;
    gl.bindTexture(gl.TEXTURE_2D, ground_texture);
    gl.drawArrays(primitiveType, offset, count);

    // inverse wall
    var offset = 24;
    var count = 1 * 6;
    gl.bindTexture(gl.TEXTURE_2D, sector_texture);
    gl.drawArrays(primitiveType, offset, count);

    // ceiling
    var offset = 30;
    var count = 1 * 6;
    gl.bindTexture(gl.TEXTURE_2D, ceil);
    gl.drawArrays(primitiveType, offset, count);

    // door
    var offset = 36;
    var count = 1 * 6;
    gl.bindTexture(gl.TEXTURE_2D, texture23);
    gl.drawArrays(primitiveType, offset, count);


/*
    var offset = 12;
    var count = 2 * 6;
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.drawArrays(primitiveType, offset, count);*/

    // ==========================
    // DRAW FLAT WALLS
    
    gl.useProgram(program_2);

    
    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLoc_2);
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer_2);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration1
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(positionLoc_2, size, type, normalize, stride, offset);

    // set the color .568
    gl.uniform4fv(colorLoc_2, [0,0,0,1.0]);

    // set the matrix
    gl.uniformMatrix4fv(matrixLoc_2, false, matrix);

    // Draw the geometry.
    var offset = 0;
    var count = 17* 6;
    gl.drawArrays(primitiveType, offset, count);

    



    requestAnimationFrame(render);
  }
}

// Fill the buffer with the values that define the walls etc.
function setGeometry(gl) {
 var positions = new Float32Array([
        // front
        /*
        0,   0,  0,
        0, 150,  0,
        30,   0,  0,
        0, 150,  0,
        30, 150,  0,
        30,   0,  0,

        // top
        0,  0,  0,
        30,  0,  0,
        30,  0,  200,
        0,  0,  0,
        30,  0,  200,
        0,  0,  200,
        */
      
        // right-side
        30,    0,   0,
        30,  150,   0,
        30,  150, 200,
        30,    0,   0,
        30,  150, 200,
        30,    0, 200,

        // ========
        // Terminal
        // ========
        45,  24, 36,
        30, 83, 36,
        30, 83, 164,
        45, 24, 36,
        30, 83, 164,
        45, 24, 164,
        
/*
        // left-side
        0,  150, 200,
        0,  150,   0,
        0,    0,   0,
        0,  150, 200,
        0,    0,   0,
        0,    0, 200,   
        */



        // BACK WALL

        // front
        30, 0, 200,
        30, 150, 200,
        450, 150, 200,
        30, 0, 200,
        450, 150, 200,
        450, 0, 200,
        
        
/*
        // top
        0, 0, 200,
        450, 0, 200,
        450, 0, 230,
        0, 0, 200,
        450, 0, 230,
        0, 0, 230,
        */

      // ==========
        // BOTTOM
        // ==========

        // top
        30,  150,  200,
        30,  150,  0,
        450,  150,  0,
        30,  150,  200,
        450,  150,  0,
        450,  150,  200,


        /*
       // front
        0,  150,  0,
        0,  170,  0,
        450,  170,  0,
        0,  150,  0,
        450,  170,  0,
        450,  150,  0,

        // right-side
        450,  150,  0,
        450,  170,  0,
        450,  170,  200,
        450,  150,  0,
        450,  170,  200,
        450,  150,  200,

        // left-side
        0,    150,   0,
        0,  150,   200,
        0,  170,   200,
        0,    150,   0,
        0, 170,   200,
        0, 170, 0,
        */

        // Inverse Wall
        450, 0, 0,
        450, 150, 0,
        30, 0, 0,
        30, 0, 0,
        450, 150, 0,
        30, 150, 0,


        // Ceiling
        450,  0,  0,
        30,  0,  0,
        30,  0,  200,
        450,  0,  0,
        30,  0,  200,
        450,  0,  200,
        // lacking proper texture.


        // Door
        // right-side
        450,    0,   0,
        450,  150,  200,
        450,  150, 0,
        450,    0,   0,
        450,    0, 200,
        450,  150, 200,

      ]);

      // do this stuff at init time not render time.
  var matrix = m4.xRotation(Math.PI);
  matrix = m4.translate(matrix, -50, -75, -15);

  for (var ii = 0; ii < positions.length; ii += 3) {
    var vector = m4.vectorMultiply([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], matrix);
    positions[ii + 0] = vector[0];
    positions[ii + 1] = vector[1];
    positions[ii + 2] = vector[2];
  }

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

function setGeometry2(gl) {
  var positions = new Float32Array([
        // top
        0,  0,  0,
        30,  0,  0,
        30,  0,  200,
        0,  0,  0,
        30,  0,  200,
        0,  0,  200,

        // left-side
        0,  150, 200,
        0,  150,   0,
        0,    0,   0,
        0,  150, 200,
        0,    0,   0,
        0,    0, 200,  
        
        // ==========
        // TERMINAL
        // ==========

        // face 1
        30,  24,  36,
        30,  83,   36,
        45,  24, 36,
        
        // face 2
        30,  24,  164,
        45,   24,  164,
        30,  83,   164,

        // face 3
        30,  24,  36,
        45,  24, 36,
        45,   24,  164,
        30,  24,  36,
        45,   24,  164,
        30,  24,  164,

        // ==========
        // BOTTOM
        // ==========

        // right-side
        450,  150,  0,
        450,  170,  0,
        450,  170,  200,
        450,  150,  0,
        450,  170,  200,
        450,  150,  200,

        // left-side
        0,    150,   0,
        0,  150,   200,
        0,  170,   200,
        0,    150,   0,
        0, 170,   200,
        0, 170, 0,

        // BACK WALL

        // top
        0, 0, 200,
        450, 0, 200,
        450, 0, 230,
        0, 0, 200,
        450, 0, 230,
        0, 0, 230,

        // back
        0,0,230,
        450, 0, 230,
        450, 170, 230,
        0, 0, 230,
        450, 170, 230,
        0, 170, 230,

        // left col
        0,0,230,
        0, 170, 230, 
        0, 170, 200,
        0,0,230,
        0,170,200,
        0, 0, 200,


        // INVERSE WALL

        // face1
        0, 0, -30,
        0, 150, -30,
        450, 150, -30,
        0, 0, -30,
        450, 150, -30,
        450, 0, -30, 

        // face2 top
        0, 0, 0,
        0, 0 , -30,
        450, 0, -30,
        0, 0, 0,
        450, 0, -30,
        450, 0, 0,

        // face3 lower front
        0,  150,  -30,
        0,  170,  -30,
        450,  170,  -30,
        0,  150,  -30,
        450,  170,  -30,
        450,  150,  -30,

        // face 4 left
        0,   0,  0,
        0, 170,  0,
        0,  170,  -30,
        0, 0,  0,
        0, 170,  -30,
        0,   0,  -30,

        // LAST WALL

        480, 0, -30,
        480, 170, -30,
        480, 170, 230,
        480, 0, -30,
        480, 170, 230,
        480, 0, 230,

        // top
        450, 0, -30,
        480, 0, -30,
        480, 0, 230,
        450, 0, -30,
        480, 0, 230,
        450, 0, 230,

        // last col
        450, 0, 230,
        480, 0, 230,
        480, 170, 230,
        450, 0, 230,
        480, 170, 230,
        450, 170, 230,

        // last col 2
        450, 0, -30,
        480, 170, -30,
        480, 0, -30,
        450, 0, -30,
        450, 170, -30,
        480, 170, -30,

      ]);

  // do this stuff at init time not render time.
  var matrix = m4.xRotation(Math.PI);
  matrix = m4.translate(matrix, -50, -75, -15);

  for (var ii = 0; ii < positions.length; ii += 3) {
    var vector = m4.vectorMultiply([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], matrix);
    positions[ii + 0] = vector[0];
    positions[ii + 1] = vector[1];
    positions[ii + 2] = vector[2];
  }

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// Fill the buffer with texture coordinates for the object
function setTexcoords(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
      // right-side
      0, 0,
      0, 1,
      1, 1,
      0, 0,
      1, 1,
      1, 0, 
      
            
      // BOTTOM
      // top
      0, 0,
      0, 1,
      1, 1,
      0, 0,
      1, 1,
      1, 0, 


      // BACK wall

      // front
      0, 0,
      0, 1,
      1, 1,
      0, 0,
      1, 1,
      1, 0, 

      // Terminal
      0, 0,
      0, 1,
      1, 1,
      0, 0,
      1, 1,
      1, 0, 

      // Inverse wall
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1, 

      // Ceiling
      0, 0,
      0, 1,
      1, 1,
      0, 0,
      1, 1,
      1, 0, 

      // Door
      1, 0,
      0, 1,
      1, 1,
      1, 0, 
      0, 0,
      0, 1,
      


    ]),
    gl.STATIC_DRAW);
}

// Fill the buffer with colors for the 'F'.
function setTexcoords2(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
      // column front
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0,

      // column top
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0,
    
      // right-side
      0, 0,
      0, 1,
      1, 1,
      0, 0,
      1, 1,
      1, 0, 
      
      // left-side
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0, 
            
      // BOTTOM
      // top
      0, 0,
      0, 1,
      1, 1,
      0, 0,
      1, 1,
      1, 0, 

      // front
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0,

      // right
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0,
    ]),
    gl.STATIC_DRAW);
}




window.onload = main;
