
<template>
  <!-- 用户参与记录 -->
  <div id="eve_toAnnounce">
    <!-- <my-header main-text="往期揭晓" bg-color="#fff" text-color="#000">
      <img src="../../assets/left-gray.svg">
    </my-header> -->
    <magic-header titleName="往期揭晓"></magic-header>
    <div class="body clear" v-if="panicBuyingResults.length > 0">
      <ul>
        <li class="sm_f clear" v-for="item in panicBuyingResults" @click="goAnnounceDetail(item)">
          <p class="title"><label class="stage">第{{ item.index }}期</label><label class="revealedTime">揭晓时间：{{ item.openDate }}</label></p>
          <p class="time">
            <ul>
              <li>幸运用户：{{ item.user }}</li>
              <li>幸运号码：{{ item.luckyCode }}</li>
              <li>参与人次：{{ item.personTimes }}次</li>
            </ul>
          </p>
           <i class="mu-icon material-icons _icon">keyboard_arrow_right</i>
        </li>
      </ul>
    </div>
    <emptyPage message="暂无记录" v-if="panicBuyingResults.length == 0" class="emptyPage">

    </emptyPage>
  </div>
</template>
<script>
import Vue from 'vue'
import magicHeader from 'components/magicHeader'

import emptyPage from 'components/empty-page'

export default {
  data () {
    return {
      activityId: this.$route.params.activityId,
      latestActivityId: '',
      id: this.$route.params.id,
      panicBuyingResults: []
    }
  },
  components: {
    magicHeader,
    emptyPage
  },
  methods: {
    goAnnounceDetail (item) {
      this.$router.push({name: 'eve_announceDetail',
      params: {
        activityId: item.id,
        id: this.id,
        item: JSON.stringify(item)
      }, query: {
        latestActivityId: this.latestActivityId
      }})
    }
  },
  filters: {
    formatUser: function (value) {
      return value
    }
  },
  beforeRouteEnter (to, from, next) {
    let ProductCategory = {'methodName': 'ListPanicBuyingResult', 'index': '0', 'count': '100', 'activityId': to.params.activityId}

    // 获取商品分类
    Vue.prototype.$.get(ProductCategory).then(res => {
      next(vm => {
        vm.panicBuyingResults = res.data.panicBuyingResults
        vm.latestActivityId = res.data.latestActivityId
        console.log(vm.latestActivityId)
      })
    })
  }
}
</script>
<style scoped>
.body > ul > li {
  padding: 12px 12px;
  color: #929292;
  background-color: #fff;
  margin-top: 12px;
}
.revealedTime {
  float: right;
  color: #f98700;
}
.time {
  margin-top: 15px;
  width: 80%;
  float: left;
}
.title {
  border-bottom: 1px solid #ccc;
  padding-bottom: 12px;
}
.stage {
  color: #6a6a6a;
}
.time ul li {
  padding: 6px 0px;
  color: #151515;
}
#eve_toAnnounce .emptyPage p {
  font-size: 16px;
}
#eve_toAnnounce ._icon {
    margin-top: 11%;
    float: right;
    font-size: 30px;
}
</style>