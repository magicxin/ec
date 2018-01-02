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
<template>
  <div>
    <my-header main-text="下单成功" bg-color="#f7f7f7" text-color="#000">
      <img slot="" src="../assets/left-gray.svg">
    </my-header>
    <div class="ul_style">
      <ul>
        <li><p class="logo"><img src="../assets/chosed.svg" alt=""></p></li>
        <li>支付成功</li>
        <li>{{ pageMessage }}</li>
        <li><span class="goOn" @click="go">继续抢购</span></li>
      </ul>
    </div>
  </div>
</template>
<script>
  import myHeader from 'components/my-header'

  export default {
    data () {
      return {
        activityId: this.$route.query.activityId,
        type: this.$route.query.type,
        message: '',
        pageMessage: ''
      }
    },
    components: {
      myHeader
    },
    methods: {
      go () {
        if (this.type === '3') { // 团拼购
          this.$router.push({name: 'eve_groupShopping', params: {activityId: this.activityId}})
        } else if (this.type === '4') { // N元抢购
          this.$router.push({name: 'eve_robBuy', params: {activityId: this.activityId}})
        } else if (this.type === '5') { // 秒杀
          this.$router.push({name: 'eve_timeSpike', params: {activityId: this.activityId}})
        }
      }
    },
      /* eslint-disable */
    mounted () {
      let methodName = ''
      if (this.type == '3') { // 团拼购
        methodName = 'AttendGroupBuying'
        this.message = '恭喜您，成功获得团购资格'
      } else if (this.type == '4') { // N元抢购
        methodName = 'AttendPanicBuying'
        this.message = '恭喜您，成功获得抢购资格'
      } else if (this.type == '5') { // 秒杀
        methodName = 'AttendSeckill'
        this.message = '恭喜您，成功获得秒杀资格'
      }
      // if (methodName) {
      //   this.$.get({
      //     methodName: methodName,
      //     id: this.activityId
      //   }).then(res => {
      //     if (res.data.resultCode !== '100') {
      //       this.pageMessage = '服务器异常，获取资格失败'
      //     } else {
      //       this.pageMessage = this.message
      //     }
      //   }, error => {
      //     this.pageMessage = '服务器异常，获取资格失败'
      //   })
      // }
    }
  }
</script>
