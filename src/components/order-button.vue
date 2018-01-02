<template>
  <div class="order-button" :style="style">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'button',
    props: {
      color: {
        type: String,
        default () {
          return '#767676'
        }
      },
      border: {
        type: String,
        default () {
          return '#ccc'
        }
      },
      bgcolor: {
        type: String,
        default () {
          return '#fff'
        }
      },
      big: {}
    },
    computed: {
      style () {
        return {
          'border-color': this.border,
          'color': this.color,
          'background-color': this.bgcolor,
          'padding-right': this.big ? '20px' : null,
          'padding-left': this.big ? '20px' : null,
          'margin-top': this.big ? '0px' : null,
          'height': this.big ? '50px' : null
        }
      }
    }
  }
</script>

<style scoped>
  .order-button{
    padding: 5px 12px;
    border: 1px solid #ccc;
    height: 36px;
    line-height: 36px;
    border-radius: 5px;
    font-size: 1.1rem;
    display: inline;
  }
</style>
