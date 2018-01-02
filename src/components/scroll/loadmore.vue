<template>
  <div id="loadMore" @touchstart="" @touchmove="touchMove" @touchend="">
    <slot></slot>
    <div v-if="showMsg">
      	<div v-if="!loaded" class="loadmore">下拉查看更多活动~</div>
      	<div v-else class="loadover">我是有底线的~</div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'loadmore',
    props: {
      getMore: {
        type: Function
      },
      allLoaded: {
        type: Boolean,
        default () {
          return false
        }
      },
      showMsg: {
      	type: Boolean,
        default () {
          return false
        }
      }
    },
     watch: {
	   	allLoaded(newValue,oldValue){
	    this.loaded = newValue
	   }
	  },
    data () {
      return {
        
      }
    },
    methods: {//取可以滚动的元素
    	touchMove(e){
//  		console.log(1)
    	},
    	getScroll(e){
    		console.log(111)
    	}
    },
    mounted () {
    	window.addEventListener('scroll', this.getScroll);
    }
  }
</script>

<style>
 
</style>
