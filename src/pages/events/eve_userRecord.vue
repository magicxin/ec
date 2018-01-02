
<template>
  <!-- 用户参与记录 -->
  <div>
    <!-- <my-header main-text="商品详情" bg-color="#fff" text-color="#000">
      <img src="../../assets/left-gray.svg">
    </my-header> -->
    <magic-header titleName="商品详情"></magic-header>
    <div class="title">
      <span class="sm_f">用户参与记录</span>
      <label class="title_time mini_f">本期于{{ recordData.beginDate }}开始</label>
    </div>
    <load-more :getMore="loadBottom" :allLoaded = "allLoaded">
      <ul>
        <li class="sm_f"
            v-for = "item in recordData.panicBuyingRecords">
          <p><label class="userid">{{ item.user | formatUser }}</label><label class="join">参与<span class="text_red">{{ item.personTimes }}</span>人次</label></p>
          <p class="time">{{ item.attendDate }}</p>
        </li>
      </ul>
    </load-more>
    <mu-raised-button label="前往最新一期" class="fixedBtn" backgroundColor="#f98700" :fullWidth="istrue" @click="goNewStage"/>
    <div style="height: 50px; width: 100%"></div>
  </div>
</template>
<script>
import Vue from 'vue'
import magicHeader from 'components/magicHeader'

import Loadmore from 'components/loadmore'


let query = {
  index: 10,
  count: 10
}

function getProduct (vm) {
  return Vue.prototype.$.get({
    methodName: 'QueryPanicBuyingRecord',
    index: query.index.toString(),
    count: query.count.toString(),
    id: vm.activityId
  }).then(res => {
    console.log(res)
    query.index += query.count
    res.data.panicBuyingRecords.forEach(val => {
      vm.recordData.panicBuyingRecords.push(val)
    })
    console.log(res.data)
    if (res.data.panicBuyingRecords.length < query.count) {
      vm.allLoaded = true
    } else {
      vm.allLoaded = false
    }
  })
}

export default {
  data () {
    return {
      recordData: {},
      allLoaded: false,
      istrue: true,
      activityId: this.$route.params.activityId
    }
  },
  components: {
    magicHeader,
    loadMore: Loadmore
  },
  filters: {
    formatUser: function (value) {
      return value
    }
  },
  methods: {
    // 下拉刷新
    loadBottom () {
      getProduct(this)
    },
    // 前往最新一期
    goNewStage () {
      this.$router.push({name: 'eve_robBuy', params: {id: this.activityId}})
    }
  },
  beforeRouteEnter (to, from, next) {
    let ProductCategory = {'methodName': 'QueryPanicBuyingRecord', 'index': '0', 'count': '10', 'id': to.params.activityId}

    // 获取商品分类
    Vue.prototype.$.get(ProductCategory).then(res => {
      next(vm => {
        vm.recordData = res.data
        console.log(vm.recordData)
      })
    })
  }
}
</script>
<style scoped>
.title {
  color: #000;
  padding: 20px 12px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}
.title_time {
  float: right;
  color: #929292;
}
ul li {
  padding: 12px 12px;
  color: #929292;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}
.join {
  float: right;
}
.time {
  text-align: right;
  margin-top: 15px;
}
.fixedBtn {
  position: fixed;
  bottom: 0px;
  height: 50px;
  font-size: 16px;
}
.fixedBtn .mu-raised-button-label {
  font-size: 16px;
}
</style>