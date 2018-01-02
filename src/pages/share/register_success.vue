<template>
  <div id="registerSuccess">
    <div class="ul_style">
      <ul>
        <li><p class="logo"><img src="../../assets/chosed.svg" alt=""></p></li>
        <li class="lg_f">注册成功</li>
        <li>让汽车更智慧，让服务更贴心</li>
        <li><a class="goOn mid_f" href="http://a.app.qq.com/o/simple.jsp?pkgname=cn.carowl.icfw">下载app</a></li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {

      }
    },
    mounted () {
      document.title = '注册V服爱车'
    }
  }
</script>
<style>
  #registerSuccess {
    background: url(../../assets/successBg.png) no-repeat;
    background-size: 100%;
    min-height: 667px;
  }
  #registerSuccess .ul_style  {
    padding-top: 10%;
  }
  #registerSuccess .ul_style ul li {
    text-align: center;
  }
  #registerSuccess .ul_style ul li:nth-child(1) {
      padding-top: 30px;
  }
  #registerSuccess .ul_style ul li:nth-child(2) {
    padding-top: 35px;
    color: #f98700;
  }
  #registerSuccess .ul_style ul li:nth-child(3) {
      font-size: 14px;
      padding-top: 20px;
  }
  #registerSuccess .ul_style ul li:nth-child(4) {
      padding-top: 30px;
  }
  #registerSuccess .logo {
    width: 50px;
    height: 50px;
    display: inline-block;
    border-radius: 50%;
    background-color: #77ce62;
    padding-top: 6px;
  }
  #registerSuccess .goOn {
    display: inline-block;
    width: calc(100% - 28px);
    margin: 0px 14px;
    border-radius: 4px;
    background-color: #f98700;
    color: #fff;
    padding: 12px;
  }
</style>
