/*
* @Author: Administrator
* @Date:   2017-02-23 17:09:40
* @Last Modified by:   Administrator
* @Last Modified time: 2017-03-04 14:22:38
*/

import Vue from 'vue'
import Head from '../component/header.vue'
var bus = new Vue()
// console.log(Head);
bus.$on('getTarget', target => {
  console.log(target);
  console.log(Head);
  // bus.$set(this.$data,'title',target);
  console.log(bus)
    // this.name = target;
});
export  default bus
