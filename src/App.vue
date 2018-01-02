<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
	import Vue from 'vue'
  function initBodyHeight () {
    let html = document.querySelector('body')
    html.style.minHeight = Vue.prototype.$.windowHeight + 'px'
  }
  export default {
    beforeCreate () {
      initBodyHeight()
      /* eslint-disable */
      Date.prototype.format = function (format) {
        var o = {
          'M+': this.getMonth()+1, // month
          'd+': this.getDate(), // day
          'h+': this.getHours(), // hour
          'm+': this.getMinutes(), // minute
          's+': this.getSeconds(), // second
          'q+': Math.floor((this.getMonth()+3)/3), // quarter
          'S': this.getMilliseconds() // millisecond
        }
        if (/(y+)/.test(format)) format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length))
        for (var k in o) if(new RegExp('('+ k +')').test(format))
        format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00'+ o[k]).substr((''+ o[k]).length))
        return format
      }
    }
  }
</script>
<style>
 html,body{
		height:100%;
		padding:0;
		margin:0;
	}
#app {
  height:100%;
}
</style>

