/*
* @Author: Administrator
* @Date:   2016-09-08 11:47:46
* @Last Modified by:   Administrator
* @Last Modified time: 2016-09-08 14:49:32
*/

'use strict';
//  ColoredPoints.js
//  顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' + // 设置坐标
    ' gl_PointSize = 10.0;\n' +   // 设置尺寸
    '}\n';

 // 片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n'+
    'uniform vec4 u_FragColor;\n'+
    'void main() {\n' +
    ' gl_FragColor = u_FragColor;\n' +
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
  // 获取u_FragColor变量的存储位置
  var u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
  if(!u_FragColor){
    console.log('Failed to get u_FragColor variable');
    return;
  }
  // var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
  }
  gl.vertexAttrib3f(a_Position,0.0,0.0,0.0);

  canvas.onmousedown = function(ev) {click(ev,gl,canvas,a_Position,u_FragColor) };
  // gl.vertexAttrib1f(a_PointSize,5.0);

  // 设置<canvas>背景色
  gl.clearColor(0.0,0.0,0.0,1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS,0 ,1);
}
var g_points = [];
var g_colors = [];
function click(ev, gl, canvas, a_Position,u_FragColor) {
   var x = ev.clientX;
   var y = ev.clientY;
   var rect = ev.target.getBoundingClientRect();

   x = ((x - rect.left) - canvas.height/2) / (canvas.height/2);
    y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);

  // 将坐标存储到g_points数组中
  g_points.push([x,y]);

  if(x >= 0.0 && y >= 0.0){
    g_colors.push([1.0,0.0,0.0,1.0]);
  }else if(x<0.0 && y<0.0){
    g_colors.push([0.0,1.0,0.0,1.0]);
  }else{
    g_colors.push([1.0,1.0,1.0,1.0]);
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for(var i =0;i < len; i ++){
    var xy = g_points[i];
    var rgba = g_colors[i];
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // 将点的颜色传输到u_FragColor
    gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3]);


    gl.drawArrays(gl.POINTS,0,1);
  }
}
