<template>
  <div class="preview_money" id="preview-item">
    <label for="" :class="['preview_label', {'active':state}]">{{label}}{{money}}</label>
    <span :class="['preview_value',{'active':state}]" :style="style">
      <img :src="minusIcon" v-if="minus" class="small">
      <img :src="addIcon" v-if="add" class="small">
      <img :src="origin" alt="" v-if="icon">
      {{value}}
    </span>
  </div>
</template>

<script>
  import origin from 'assets/RMB-origin.svg'
  import addIcon from 'assets/add.svg'
  import minusIcon from 'assets/minus.svg'
  export default {
    name: 'preview-item',
    props: {
      label: {
        type: String
      },
      money: {
        type: [String, Number]
      },
      state: {
        type: Boolean,
        default(){
          return false
        }
      },
      value: {
        type: [String, Number]
      },
      icon: {
        type: Boolean,
        default () {
          return false
        }
      },
      color: {
        type: String
      },
      add: {
        type: Boolean,
        dafault () {
          return false
        }
      },
      minus: {
        type: Boolean,
        dafault () {
          return false
        }
      },
      isEnd: {
        type: Boolean,
        dafault(){
          return false
        }
      }
    },
    computed: {
      style () {
        return {
          color: this.color
        }
      }
    },
    data () {
      return {
        origin,
        addIcon,
        minusIcon
      }
    }
  }
</script>

<style>
  #preview-item.preview_money {
    overflow: hidden;
  }

  #preview-item .preview_label {
    float: left;
    margin-right: 1em;
    min-width: 4em;
    color: #797979;
    text-align: justify;
    text-align-last: justify;
  }

  #preview-item .preview_label.active {
    color: #E13D13;
  }

  #preview-item .preview_value {
    display: block;
    overflow: hidden;
    word-break: normal;
    word-wrap: break-word;
  }

  #preview-item .preview_value.active {
    color: #E13D13;
  }

  .preview-detail #preview-item.preview_item .preview_value,
  .preview-detail #preview-item.preview_item .preview_label {
    font-size: 12px;
    float: left;
  }
</style>
