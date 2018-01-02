<template>
  <div  class="result_empty">
    <img :src="defaultEmpty">
    <p>{{message}}</p>
  </div>
</template>

<script>
  import defaultEmpty from 'assets/default_empty_icon.png'
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
    width:50%;
  }
  .result_empty p {
    font-weight: bold;
  }
</style>
