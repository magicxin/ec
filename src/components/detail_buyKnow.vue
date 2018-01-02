<style scoped>
.buyKnow {
  padding-top: 8px;
  min-height: 50px;
}
.buyKnow ul li {
  padding-left: 14px;
  padding-top: 5px;
}
.info {
  margin-top: 14px;
  padding-left: 14px;
  color: #929292;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 10px;
}
.line {
  line-height: 26px;
}
h2 {
  font-weight: 500
}
</style>
<template>
<div>
  <h2 class="info mid_f">购买须知</h2>
  <div class="buyKnow">
    <!-- <ul>
      <li class="sm_f">预约提示：<span class="col_gay mini_f">无需预约，高峰时期可能需要等位</span></li>
      <li class="sm_f">有效日期：<span class="col_gay mini_f">不限</span></li>
      <li class="sm_f">适用品牌：<span class="col_gay mini_f">大众系列</span></li>
      <li class="sm_f">适用车型：<span class="col_gay mini_f">不限</span></li>
    </ul> -->
    <div v-html="value" :style="{width: width}"></div>
  </div>
</div>
</template>
<script>
  export default {
    name: 'panel',
    data () {
      return {
        width: window.screen.width + 'px'
      }
    },
    props: {
      value: {
        type: String,
        default () {
          return '&nbsp;&nbsp;&nbsp;暂无'
        }
      }
    }
  }
</script>
<style>
  .buyKnow div{
    overflow: scroll; 
  }
</style>
