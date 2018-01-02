<template>
  <div class="cell" id="cell" layout="row" layout-align="space-between center">
    <span v-if="isRequire" class="require_star">*</span>
    <div flex="noshrink" class="cell_box sm_f" layout="row">
      <slot name="label">{{label}}</slot>
    </div>
    <div class="link">
      <span class="mini_f">{{value}}</span>
      <slot name="value"></slot>
      <mu-icon value="keyboard_arrow_right" v-if="link"></mu-icon>
    </div>
  </div>
</template>

<script>
  import right from 'assets/right-gray.png'

  export default {
    name: 'cell',
    props: {
      isRequire: {
        type: Boolean,
        default () {
          return false
        }
      },
      value: {
        type: String
      },
      label: {
        type: String
      },
      link: {
        type: Boolean,
        default () {
          return true
        }
      }
    },
    data () {
      return {
        right
      }
    }
  }
</script>

<style >
  #cell{
    line-height: 45px;
    min-height: 45px;
    height: 45px;
    position: relative;
    padding-right: 5px;
    padding-bottom: 3px;
  }

  #cell .cell_box{
    padding-left: 14px;
    color: #0C0C0C;
    font-size: 1.1rem;
    font-weight: normal;
  }

  #cell .link {
    margin-left: 10px;
    text-align: right;
    margin-right: 5px;
    color: #6C6C6C;
    line-height: 45px;
    min-height: 45px;
    height: 45px;
    overflow: hidden;
  }

  #cell .overflow {
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
    display: inline-flex;
    max-width: 120px;
  }

  #cell .link i {
    vertical-align: middle;
  }

  #cell:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  #cell .require_star{
    position: absolute;
    color: red
  }
</style>
