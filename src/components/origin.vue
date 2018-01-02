<template>
  <del class="original sm_f" id="original" >
    <span>原价: {{value}}</span>
    <slot name="desc"></slot>
  </del>
</template>

<script>
  export default {
    name: 'origin',
    props: {
      value: {
        type: String
      }
    }
  }
</script>

<style>
  #original {
    color:#989898;
    display: inline-block;
    position: relative;
    vertical-align: middle;
  }

  #original span{
    color:#989898;
  }

  #original img {
    width: 13px;
    height: 13px;
  }

</style>
