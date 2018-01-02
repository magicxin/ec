
<template>
<div>
  <!-- <my-header main-text="下单成功" bg-color="#f7f7f7" text-color="#000">
    <img slot="" src="../../assets/left-gray.svg">
  </my-header> -->
  <magic-header :isEve="true" titleName="下单成功"></magic-header>
  <div class="ul_style">
    <ul>
      <li><p class="logo"><img src="../../assets/chosed.svg" alt=""></p></li>
      <li>支付成功</li>
      <li>恭喜您，成功获得抢购资格</li>
      <li><a href="#" class="goOn">继续抢购</a></li>
    </ul>
  </div>
</div>
</template>
<script>
import magicHeader from 'components/magicHeader'
export default {
  data () {
    return {

    }
  },
  components: {
    magicHeader
  }
}
</script>
<style scoped>
 .ul_style ul li {
  text-align: center;
 }
 .ul_style ul li:nth-child(1) {
    padding-top: 30px;
 }
 .ul_style ul li:nth-child(2) {
    font-size: 18px;
    padding-top: 20px;
 }
 .ul_style ul li:nth-child(3) {
    font-size: 14px;
    padding-top: 20px;
 }
 .ul_style ul li:nth-child(4) {
    padding-top: 30px;
 }
 .logo {
  width: 50px;
  height: 50px;
  display: inline-block;
  border-radius: 50%;
  background-color: #f12b2c;
  padding-top: 6px;
 }
 .goOn {
  display: inline-block;
  width: calc(100% - 28px);
  margin: 0px 14px;
  border-radius: 4px;
  background-color: #f12b2c;
  font-size: 18px;
  color: #fff;
  padding: 12px;
 }
</style>
