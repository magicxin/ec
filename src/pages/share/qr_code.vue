<template>
  <!--二维码-->
  <div id="qr_code">
    <my-header main-text="二维码邀请" bg-color="#fff" text-color="#000">
      <img src="../../assets/left-gray.svg">
    </my-header>
    <section class="qr_body">
      <h2>请您的好友扫描以下二维码</h2>
      <img :src="defaultImg" alt="" width="200px" height="200px">
    </section>
    <section class="qr_bottom mid_f">
      <span>说明：</span>
      <div v-html="initInfo"></div>
    </section>
  </div>
</template>
<script>
  import myHeader from 'components/my-header'
  import defaultImg from 'assets/default_user_icon.png'

  export default {
    data () {
      return {
        defaultImg
      }
    },
    components: {
      myHeader
    },
    mounted () {

    }
  }
</script>
<style>
  #qr_code .qr_body {
    text-align: center
  }
  #qr_code .qr_body h2 {
    margin: 25px;
    color: rgba(0, 0, 0, 1);
    font-weight: 400;
  }
  #qr_code .qr_bottom {
    margin: 20px;
  }
</style>
