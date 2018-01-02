<template>
  <div class="grids">
    <slot></slot>
  </div>
  
</template>
<script>
  export default{
    name: 'grids',
    props: {
      dataList: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .grids{
    position: relative;
    overflow: hidden;
  }
</style>
