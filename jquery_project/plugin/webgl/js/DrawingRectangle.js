/*
* @Author: Administrator
* @Date:   2016-09-07 10:52:53
* @Last Modified by:   Administrator
* @Last Modified time: 2016-09-07 10:59:57
*/

'use strict';
// DrawRectangle.js
function main(){
  // Retrieve the <canvas> element
  var canvas = document.getElementById("example");
  if(!canvas){
    console.log('Failed to retrieve the <canvas> element ');
    return false;
  }

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext("2d");

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0,0,255,1.0)';
  ctx.fillRect(120,10,150,150); //Fill a rectangle with the color
}
