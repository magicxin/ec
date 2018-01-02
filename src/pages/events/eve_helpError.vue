<template>
  <section id="eve_helpSuccess">
    <magic-header titleName="帮砍价"></magic-header>
    <!-- <my-header main-text="帮砍价" bg-color="#f7f7f7" text-color="#000">
      <img slot="" src="../../assets/left-gray.svg">
    </my-header> -->
    <h3 class="hgZ_f">助力失败</h3>
    <h3 class="lg_f">{{  errorMessage }}</h3>
    <!--<h4 class="lg_f">顺利帮好友砍下<span class="text_yellow">{{ bargainMoney }}</span>元</h4>-->
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
        errorCode: this.$route.params.errorCode,
        errorMessage: ''
      }
    },
    mounted () {
      switch (this.errorCode) {
        case '490':
          this.errorMessage = '用户已购买商品(*^__^*)'
          break
        case '487':
          this.errorMessage = '该商品已经到最低价咯(*^__^*)'
          break
        case '488':
          this.errorMessage = '帮砍价好友已达上限(*^__^*)'
          break
        case '489':
          this.errorMessage = '您已经砍过价(*^__^*)'
          break
        case '472':
          this.errorMessage = '活动未发布(*^__^*)'
          break
        case '433':
          this.errorMessage = '活动状态不是进行状态(*^__^*)'
          break
        case '454':
          this.errorMessage = '该会员的等级不在活动的会员等级列表中(*^__^*)'
          break
        default:
          this.errorMessage = ''
      }
    }
  }
</script>
<style>
  #eve_helpSuccess {
    background: url(../../assets/helpError.png) no-repeat center top;
    background-size: 100%;
    min-height: 667px;
    background-color: #f9f1ce;
  }
  #eve_helpSuccess h3 {
    color: #fff;
    padding-top: 10%;
    text-align: center;
    font-weight: 400;
  }
  #eve_helpSuccess h4 {
    color: #e0e0e0;
    margin-top: 10%;
    text-align: center;
  }
</style>
