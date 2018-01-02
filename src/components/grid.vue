<template>
  <a class="grid" id="grid" @click="go" v-bind:style="{width: width, 'text-align': align, height: height}">
    <slot></slot>
  </a>
</template>
<script>
  export default {
    name: 'grid',
    methods: {
      go () {
        if (this.link) {
          this.$router.push(this.link)
        } else {
          this.$emit('selfClick')
        }
      }
    },
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      },
      height: {
        type: String
      },
      width: {
        type: String,
        default () {
          return '25%'
        }
      },
      align: {
        type: String,
        default () {
          return 'center'
        }
      },
      link: {
        type: String
      }
    }
  }
</script>

<style>
  #grid{
    position: relative;
    float: left;
    box-sizing: border-box;
    padding: 7px;
  }

  #grid:before{
    content: " ";
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-right: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
  }

  #grid:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  #grid .grid-label{
    color: #000000;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  #grid .grid-icon{
    width: 100%;
  }

  #grid img{
    width: 80%;
  }
</style>
