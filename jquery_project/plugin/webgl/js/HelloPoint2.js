/*
* @Author: Administrator
* @Date:   2016-09-07 14:22:01
* @Last Modified by:   Administrator
* @Last Modified time: 2016-09-07 15:07:02
*/

'use strict';
//  HelloPoint2.js
//  顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' + // 设置坐标
    ' gl_PointSize = a_PointSize;\n' +   // 设置尺寸
    '}\n';

 // 片元着色器程序
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
    '}\n';

function main(){
  var canvas = document.getElementById('webgl');

  var gl = getWebGLContext(canvas);
  if(!gl){
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  //初始化着色器
  if(!initShaders(gl, VSHADER_SOURCE,FSHADER_SOURCE)) {
     console.log('Failed to initialize shaders.');
     return;
  }
  // 获取attribute变量的存储位置
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
  }
  gl.vertexAttrib3f(a_Position,0.0,0.0,0.0);
  gl.vertexAttrib1f(a_PointSize,5.0);

  // 设置<canvas>背景色
  gl.clearColor(0.0,0.0,0.0,1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS,0 ,1);
}
