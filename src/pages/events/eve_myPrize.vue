
<template>
  <div>
    <!-- <my-header main-text="我的奖品" bg-color="#fff" text-color="#000">
        <img slot="" src="../../assets/left-gray.svg">
    </my-header> -->
    <magic-header titleName="我的奖品"></magic-header>
    <div class="body" id="body">
      <div class="content_top">
        <div class="content_body">
          <span class="title">我的奖品</span>
          <ul class="prizeList">
            <li v-for="(item, index) in awardList.awards" :key="index">
              <div class="prLi_left">
                  <p class="pr_con">{{ item.name || '奖品'}}</p>
                  <p class="pr_time">中奖时间：{{ item.happenDate | formatTime }}</p>
              </div>
            </li>
            <li>
              <div class="btn_group">
                <button class="go_on" v-tap="{methods: comeBack}" >继续抽奖</button>
                <button  class="use" v-tap="{methods: goProduct}">立即使用</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom_foot">
        <h5 class="bottom_foot_title">活动规则</h5>
        <div v-for="(item,index) in LotteryInitInfo.rule" :key="index">{{item}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import magicHeader from 'components/magicHeader'



let isred = true
export default {
  components: {
    magicHeader
  },
  data () {
    return {
      awardList: {},
      LotteryInitInfo: {},
      isRed: isred,
      isWxPublic:false
    }
  },
  created(){
    if(this.$.env==="wxPublic"){
      this.isWxPublic = true
    }
  },
  methods: {
    comeBack () {
      window.history.go(-1)
    },
    goProduct () {
    	if(this.isWxPublic){
					location.href = this.$.host+'/index.html'
    	}else{
    		 this.$.toast('请到我的卡券查看')
    	}
    }
  },
  filters: {
    formatTime: function (value) {
      return value.split(' ')[0]
    }
  },
  beforeRouteEnter (to, from, next) {
    Promise.all([
      Vue.prototype.$.get({
        methodName: 'LotteryInitInfo',
        type: '0',
        id: to.params.activityId
      }),
      Vue.prototype.$.get({
        methodName: 'QueryAward',
        index: '0',
        count: '100',
        id: to.params.activityId
      })
    ])
    .then(result => next(vm => {
      vm.LotteryInitInfo = result[0].data
      vm.LotteryInitInfo.rule = vm.LotteryInitInfo.rule.split('；')
      vm.awardList = result[1].data
      console.log(vm.awardList)
    }))
  },
  mounted () {
  	var that = this
    window.scrollTo(0, 0)
    document.getElementById('body').style.minHeight = document.documentElement.clientHeight + 'px'
    
  }
}
</script>
<style scoped>
body {
  background-color: #102135;
}
.body {
  background: url(../../assets/border.png) no-repeat;
  background-size: 100%;
  background-color: #102135;
  height: 100%;
}
.content_top {
  width: 90%;
  margin: auto;
  padding-top: 8%;
}
.content_body {
  width: 88%;
  margin: auto;
  background-color: #fff;
  padding-top: 5px
}
.content_body .title {
  text-align: center;
  display: block;
  background-color: #ff5d5a;
  width: 60%;
  padding: 6px 20px;
  border-radius: 50px;
  color: #fff;
  margin: auto;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 20px;
}
.prizeList li {
  height: 50px;
  border-bottom: 2px solid #ebe8bb;
  margin-left: 6%;
  margin-top: 15px;
}
.prLi_left {
  /*width: 70%;*/
  float: left;
  padding-left: 18%;
  height: 40px;
  line-height: 20px;
  background: url(../../assets/hongbaoBG.png) no-repeat left 8% center;
  background-size: 10%;
}
.prLi_right {
  width: 30%;
  float: right;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  color: #000;
  text-align: right;
  padding-right: 8%;
}
.pr_con {
  font-size: 15px;
  font-weight: 600;
}
.pr_time {
  font-size: 13px;
}
.btn_group button {
  background-color: #f12b2c;
  color: #fff;
  border-radius: 6px;
  padding: 8px 20px;
  border-style: none;
  margin-left: 3%;
  font-size: 15px;
  margin-bottom: 10px;
}
.go_on {
  float: left;
}
.go_on_wx{
  width:90%;
}
.use {
  float: right;
  margin-right: 5%;
}
.bottom_foot {
  margin-top: 30px;
  width: 100%;
  padding: 0px 10%;
  font-size: 12px;
  color: #fff;
  text-align: left;
}
.bottom_foot_title {
  color: #ffe461;
  font-size: 14px;
  margin-bottom: 15px;
}
.bottom_foot p {
  line-height: 25px;
  padding-bottom: 20px;
}
@media screen and (max-width: 320px){
  .pr_time {
    font-size: 12px;
  }
  .prLi_right {
    font-size: 13px;
  }
  .pr_con {
    font-size: 14px;
  }
}
.redColor {
  color: rgb(253, 94, 88);
}
</style>