<template>
  <section id="eve_helpSuccess">
    <!-- <my-header main-text="帮砍价" bg-color="#f7f7f7" text-color="#000">
      <img slot="" src="../../assets/left-gray.svg">
    </my-header> -->
    <magic-header titleName="帮砍价"></magic-header>
    <h3 class="hgZ_f">助力成功</h3>
    <h4 class="lg_f">顺利帮好友砍下<span class="text_yellow">{{ bargainMoney }}</span>元</h4>
    <!--<mu-flat-button slot="actions" backgroundColor="#fff965" @click="closeDialog" label="分享" style="color:#f02b2b"/>-->
  </section>
</template>
<script>
  import magicHeader from 'components/magicHeader'

  export default {
    components: {
      magicHeader
    },
    data () {
      return {
        bargainRecord: {},
        bargainMoney: this.$route.params.money
      }
    }
  }
</script>
<style>
  #eve_helpSuccess {
    background: url(../../assets/helpSuccess.png) no-repeat center top;
    background-size: 100%;
    min-height: 667px;
    background-color: #f9f1ce;
  }
  #eve_helpSuccess h3 {
    color: #fff;
    padding-top: 10%;
    text-align: center;
  }
  #eve_helpSuccess h4 {
    color: #e0e0e0;
    padding-top: 10%;
    text-align: center;
  }
</style>
