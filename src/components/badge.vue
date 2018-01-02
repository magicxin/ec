<template>
  <a class="badge_box">
    <slot></slot>
    <span class="badge" v-if=" value !== 0">{{value}}</span>
  </a>
</template>

<script>
  export default {
    name: 'badge',
    props: {
      value: {
        type: Number
      }
    }
  }
</script>

<style>

  /*.badge_box{
    position: relative;
  }*/

  .badge_box .badge {
    position: absolute;
    right:12px;
    top: -10px;
    display: inline-block;
    padding: .15em .4em;
    min-width: 8px;
    border-radius: 18px;
    background-color: #E64340;
    color: #FFFFFF;
    line-height: 1.2;
    text-align: center;
    font-size: 12px;
    vertical-align: middle;
  }
</style>
