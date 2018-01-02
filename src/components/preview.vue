<template>
  <div class="preview" id="preview">
    <div class="preview_bd" :class="{'preview-detail': left}">
      <slot></slot>
      <!-- <div class="preview_item" :class="{small: left}">
        <label for="" class="preview_label">产品总额</label>
        <span class="preview_value">
          <img :src="origin" alt="">
          2
        </span>
      </div> -->
      <!-- <div class="preview_item" :class="{small: left}">
        <label for="" class="preview_label">邮费</label>
        <span class="preview_value">2</span>
      </div>
      <div class="preview_item" :class="{small: left}">
        <label for="" class="preview_label">优惠券</label>
        <span class="preview_value">2</span>
      </div> -->
    </div>
  </div>
</template>

<script>
  import origin from 'assets/RMB-origin.svg'
  export default {
    name: 'preview',
    data () {
      return {
        origin
      }
    },
    props: {
      left: {
        type: Boolean,
        default () {
          return false
        }
      }
    }
  }
</script>

<style>

  #preview.preview{
    position: relative;
    background-color: #fff;
  }

  #preview .preview_bd {
    padding: 10px 15px;
    font-size: 14px;
    text-align: right;
    color: #797979;
    line-height: 1.5;
  }

</style>