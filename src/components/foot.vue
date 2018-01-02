<template>
  <div id="foot" class="foot">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'footer'
  }
</script>

<style>
  #foot {
    position: absolute;
    bottom: 0px;
    width: 100%;
    background-color: #fff;
    z-index: 999;
    padding-bottom: 10px;
    border-top: 1px solid #ccc;
  }
</style>
