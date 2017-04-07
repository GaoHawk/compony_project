/*
* @Author: Administrator
* @Date:   2016-09-07 11:08:13
* @Last Modified by:   Administrator
* @Last Modified time: 2016-09-07 11:47:03
*/

'use strict';
// HelloCanvas.js
function main(){
  var canvas = document.getElementById('webgl');
  console.log(canvas);
  var gl = getWebGLContext(canvas);
  console.log(gl);
  if(!gl){
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.clearColor(0.0,1.0,0.7,1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);
}
