<template>
  <div  class="result_empty">
    <img :src="defaultEmpty">
    <p>{{message}}</p>
  </div>
</template>

<script>
  /**
 * 惠众无内容组件
 * @author wanghaitao 2018-1-2
 * @description 无内容提示框 自行加入上方内容高度
 * @augments message 提示语
 */
  import defaultEmpty from 'assets/search_none.png'
  export default {
    name: 'empty',
    props: {
      message: {
        type: String
      }
    },
    data () {
      return {
        defaultEmpty
      }
    }
  }
</script>

<style>
	.result_empty{
		height:100%;
		display:flex;
		flex-flow:column;
		justify-content: center;
		align-items: center;
	}
  .result_empty img{
    display: block;
    width:50%;
    margin-bottom: 20px;
  }
  .result_empty p {
    width: 100%;
    text-align:center;
  }
</style>
