<style scoped>
.load_more {
  padding-top:26px;
  padding-bottom: 20px;
  background-color: #efeff4;
  border-top: 1px solid #d0d0d0;
  border-bottom: 1px solid #d0d0d0;
  margin-top: 20px;
  margin-bottom: 20px;
}
hr {
  background-color: #666;
}
.load_more {
  position: relative;
  font-size: 12px;
}
.load_more span {
  position: absolute;
  top: 20px;
  left: calc((100% - 11em - 16px) / 2);
  z-index: 10;
  display: inline-block;
  background-color: #efeff4;
  padding-left: 8px;
  padding-right: 8px;
  color: #666;
}
</style>
<template>
<div class="load_more">
  <hr>
  <span>继续拖动，查看图文详情</span>
</div>
</template>
